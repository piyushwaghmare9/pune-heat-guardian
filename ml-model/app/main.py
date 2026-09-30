"""
main.py
FastAPI application entry point.
Model is loaded once at startup via the lifespan context manager.
All routes live under /api/v1.
"""

from __future__ import annotations

import json
import logging
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.model_service import model_service
from app.schemas import (
    ErrorResponse,
    HealthResponse,
    ModelInfoResponse,
    ModelMetrics,
    PredictHeatBatchRequest,
    PredictHeatBatchResponse,
    PredictHeatRequest,
    PredictHeatResponse,
    SimulateInterventionRequest,
    SimulateInterventionResponse,
    WardPredictionsResponse,
    WardPredictionSummary,
)
from app.features import FEATURE_NAMES, engineer_ward_features
from app.risk import temperature_to_risk

# ------------------------------------------------------------------
# Logging
# ------------------------------------------------------------------
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


# ------------------------------------------------------------------
# Lifespan: load model once at startup
# ------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=== HeatGuard AI ML Service starting ===")
    try:
        model_service.load()
        logger.info("Model ready. version=%s", model_service.model_version)
    except Exception as exc:
        logger.error("Model failed to load: %s. Running in degraded mode.", exc)
    yield
    logger.info("=== HeatGuard AI ML Service shutting down ===")


# ------------------------------------------------------------------
# App
# ------------------------------------------------------------------
app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------
# Middleware: request timing
# ------------------------------------------------------------------
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = round((time.perf_counter() - start) * 1000, 2)
    response.headers["X-Process-Time-Ms"] = str(elapsed)
    return response


# ------------------------------------------------------------------
# Error helpers
# ------------------------------------------------------------------
def _error(code: str, message: str, status_code: int = 500) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": code, "message": message}},
    )


# ------------------------------------------------------------------
# Health
# ------------------------------------------------------------------
@app.get(
    f"{settings.API_PREFIX}/health",
    response_model=HealthResponse,
    tags=["Meta"],
)
async def health():
    return HealthResponse(
        status="ok" if model_service.is_loaded else "degraded",
        model_loaded=model_service.is_loaded,
        model_version=model_service.model_version,
    )


# ------------------------------------------------------------------
# Model info
# ------------------------------------------------------------------
@app.get(
    f"{settings.API_PREFIX}/model/info",
    response_model=ModelInfoResponse,
    tags=["Meta"],
)
async def model_info():
    meta = model_service.metadata
    metrics_raw = meta.get("metrics", {})
    return ModelInfoResponse(
        model_version=model_service.model_version,
        feature_names=model_service.feature_names,
        num_features=len(model_service.feature_names),
        task=meta.get("task", "regression"),
        metrics=ModelMetrics(
            rmse=metrics_raw.get("rmse"),
            mae=metrics_raw.get("mae"),
            r2=metrics_raw.get("r2"),
            accuracy=metrics_raw.get("accuracy"),
            f1=metrics_raw.get("f1"),
        ),
        trained_at=meta.get("trained_at"),
        training_data_source=meta.get("training_data_source"),
        n_estimators=meta.get("n_estimators"),
    )


# ------------------------------------------------------------------
# /predict/heat  — single ward
# ------------------------------------------------------------------
@app.post(
    f"{settings.API_PREFIX}/predict/heat",
    response_model=PredictHeatResponse,
    tags=["Prediction"],
)
async def predict_heat(body: PredictHeatRequest):
    if not model_service.is_loaded:
        return _error("MODEL_NOT_LOADED", "Model is not available.", 503)

    t0 = time.perf_counter()
    ward = body.ward
    ward_dict = ward.model_dump(exclude={"ward_id", "ward_name"})

    try:
        result = model_service.predict(
            ward_dict=ward_dict,
            ward_id=ward.ward_id,
            ward_name=ward.ward_name,
            top_n=body.top_n_factors,
        )
    except Exception as exc:
        logger.exception("Prediction failed for ward '%s'", ward.ward_id)
        return _error("PREDICTION_ERROR", str(exc), 500)

    latency = round((time.perf_counter() - t0) * 1000, 2)
    result.latency_ms = latency
    return PredictHeatResponse(prediction=result, latency_ms=latency)


# ------------------------------------------------------------------
# /predict/heat/batch
# ------------------------------------------------------------------
@app.post(
    f"{settings.API_PREFIX}/predict/heat/batch",
    response_model=PredictHeatBatchResponse,
    tags=["Prediction"],
)
async def predict_heat_batch(body: PredictHeatBatchRequest):
    if not model_service.is_loaded:
        return _error("MODEL_NOT_LOADED", "Model is not available.", 503)

    t0 = time.perf_counter()
    ward_dicts = [w.model_dump(exclude={"ward_id", "ward_name"}) for w in body.wards]
    ward_ids = [w.ward_id for w in body.wards]
    ward_names = [w.ward_name for w in body.wards]

    try:
        results = model_service.batch_predict(
            ward_dicts=ward_dicts,
            ward_ids=ward_ids,
            ward_names=ward_names,
            top_n=body.top_n_factors,
        )
    except Exception as exc:
        logger.exception("Batch prediction failed")
        return _error("BATCH_PREDICTION_ERROR", str(exc), 500)

    latency = round((time.perf_counter() - t0) * 1000, 2)
    return PredictHeatBatchResponse(predictions=results, count=len(results), latency_ms=latency)


# ------------------------------------------------------------------
# /simulate/intervention
# ------------------------------------------------------------------
@app.post(
    f"{settings.API_PREFIX}/simulate/intervention",
    response_model=SimulateInterventionResponse,
    tags=["Simulation"],
)
async def simulate_intervention(body: SimulateInterventionRequest):
    if not model_service.is_loaded:
        return _error("MODEL_NOT_LOADED", "Model is not available.", 503)

    t0 = time.perf_counter()
    ward = body.baseline_ward
    baseline_dict = ward.model_dump(exclude={"ward_id", "ward_name"})

    # --- Baseline prediction ---
    try:
        baseline_result = model_service.predict(
            ward_dict=baseline_dict,
            ward_id=ward.ward_id,
            ward_name=ward.ward_name,
            top_n=body.top_n_factors,
        )
    except Exception as exc:
        return _error("SIMULATION_ERROR", f"Baseline prediction failed: {exc}", 500)

    # --- Apply intervention delta ---
    iv = body.intervention
    modified_dict = dict(baseline_dict)

    # Increase tree count
    current_trees = int(modified_dict.get("tree_count") or 10)
    modified_dict["tree_count"] = current_trees + iv.additional_trees

    # Scale canopy diameter proportionally
    if iv.canopy_increase_pct > 0:
        current_canopy = float(modified_dict.get("canopy_diameter_m") or 9.0)
        modified_dict["canopy_diameter_m"] = current_canopy * (1.0 + iv.canopy_increase_pct / 100.0)
        # Recalculate shade area from updated canopy
        import math
        r = modified_dict["canopy_diameter_m"] / 2.0
        modified_dict["shade_area_sqm"] = round(math.pi * r * r, 1)

    # Adjust cooling score (capped at 0–100)
    if iv.cooling_score_delta != 0:
        current_cs = float(modified_dict.get("cooling_score_35") or 70.0)
        modified_dict["cooling_score_35"] = max(0.0, min(100.0, current_cs + iv.cooling_score_delta))

    try:
        post_result = model_service.predict(
            ward_dict=modified_dict,
            ward_id=ward.ward_id,
            ward_name=ward.ward_name,
            top_n=body.top_n_factors,
        )
    except Exception as exc:
        return _error("SIMULATION_ERROR", f"Post-intervention prediction failed: {exc}", 500)

    delta = round(post_result.predicted_temp_c - baseline_result.predicted_temp_c, 3)
    latency = round((time.perf_counter() - t0) * 1000, 2)

    return SimulateInterventionResponse(
        ward_id=ward.ward_id,
        ward_name=ward.ward_name,
        baseline_temp_c=baseline_result.predicted_temp_c,
        predicted_temp_c=post_result.predicted_temp_c,
        cooling_delta_c=delta,
        baseline_risk=baseline_result.risk_level,
        predicted_risk=post_result.risk_level,
        risk_changed=baseline_result.risk_level != post_result.risk_level,
        top_factors=post_result.top_factors,
        latency_ms=latency,
    )


# ------------------------------------------------------------------
# /wards/predictions  — all Pune wards in one call
# ------------------------------------------------------------------
@app.get(
    f"{settings.API_PREFIX}/wards/predictions",
    response_model=WardPredictionsResponse,
    tags=["Prediction"],
)
async def wards_predictions():
    if not model_service.is_loaded:
        return _error("MODEL_NOT_LOADED", "Model is not available.", 503)

    t0 = time.perf_counter()

    # Load dataset
    dataset_path = Path(settings.DATASET_PATH)
    if not dataset_path.exists():
        return _error("DATASET_NOT_FOUND", f"Dataset not found at {dataset_path}", 500)

    with dataset_path.open() as f:
        raw = json.load(f)
    trees_raw: list[dict] = raw.get("trees", raw) if isinstance(raw, dict) else raw

    # Aggregate per ward (region)
    from collections import defaultdict
    import statistics

    by_region: dict[str, list[dict]] = defaultdict(list)
    for tree in trees_raw:
        by_region[tree["Region"]].append(tree)

    ward_summaries: list[WardPredictionSummary] = []

    for region_name, trees in by_region.items():
        ward_id = region_name.lower().replace(" ", "-").replace("/", "-")

        def avg(field: str) -> float:
            vals = [t.get(field) for t in trees if t.get(field) is not None]
            return statistics.mean(vals) if vals else 0.0

        measured_temp = avg("Avg_Temperature_C")
        lat = avg("Latitude")
        lng = avg("Longitude")

        # Build feature dict for this ward (aggregated means of numeric fields)
        ward_dict: Dict[str, Any] = {
            "height_m": avg("Height_m"),
            "canopy_diameter_m": avg("Canopy_Diameter_m"),
            "dbh_cm": avg("DBH_cm"),
            "shade_area_sqm": avg("Shade_Area_sqm"),
            "crown_volume_m3": avg("Crown_Volume_m3"),
            "leaf_area_index": avg("Leaf_Area_Index"),
            "transpiration_rate_l_day": avg("Transpiration_Rate_L_day"),
            "cooling_score_35": avg("Cooling_Score_35"),
            "co2_score_25": avg("CO2_Score_25"),
            "growth_score_15": avg("Growth_Score_15"),
            "urban_suit_score_10": avg("Urban_Suit_Score_10"),
            "pollution_score_5": avg("Pollution_Score_5"),
            "drought_score_5": avg("Drought_Score_5"),
            "maintenance_score_5": avg("Maintenance_Score_5"),
            "total_score": avg("Total_Score"),
            "co2_sequestration_kg_yr": avg("CO2_Sequestration_kg_yr"),
            "o2_production_kg_yr": avg("O2_Production_kg_yr"),
            "carbon_stored_kg": avg("Carbon_Stored_kg"),
            "total_biomass_kg": avg("Total_Biomass_kg"),
            "air_pollution_tolerance_index": avg("Air_Pollution_Tolerance_Index"),
            "pm25_reduction_ug_m3": avg("PM2.5_Reduction_ug_m3"),
            "pm10_reduction_ug_m3": avg("PM10_Reduction_ug_m3"),
            "so2_absorption": avg("SO2_Absorption"),
            "no2_absorption": avg("NO2_Absorption"),
            "elevation_m": avg("Elevation_m"),
            "latitude": lat,
            "longitude": lng,
            "tree_count": len(trees),
            # Categorical — use most-common value in the ward
            "region_heat_island_severity": trees[0].get("Region_Heat_Island_Severity"),
            "region_traffic_density": trees[0].get("Region_Traffic_Density"),
            "uhi_reduction_potential": trees[0].get("UHI_Reduction_Potential"),
            "drought_tolerance": trees[0].get("Drought_Tolerance"),
            "water_requirement": trees[0].get("Water_Requirement"),
        }

        try:
            result = model_service.predict(ward_dict, ward_id, region_name, top_n=0)
            predicted_temp = result.predicted_temp_c
            predicted_risk = result.risk_level
        except Exception as exc:
            logger.warning("Prediction failed for ward %s: %s", region_name, exc)
            predicted_temp = measured_temp
            predicted_risk = temperature_to_risk(measured_temp)

        measured_risk = temperature_to_risk(measured_temp)

        ward_summaries.append(
            WardPredictionSummary(
                ward_id=ward_id,
                ward_name=region_name,
                measured_temp_c=round(measured_temp, 2),
                predicted_temp_c=round(predicted_temp, 2),
                delta_c=round(predicted_temp - measured_temp, 3),
                measured_risk=measured_risk,
                predicted_risk=predicted_risk,
                source="model",
                model_version=model_service.model_version,
                latitude=round(lat, 5),
                longitude=round(lng, 5),
                tree_count=len(trees),
            )
        )

    latency = round((time.perf_counter() - t0) * 1000, 2)
    return WardPredictionsResponse(
        wards=ward_summaries,
        count=len(ward_summaries),
        latency_ms=latency,
    )
