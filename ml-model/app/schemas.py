"""
schemas.py
Pydantic v2 request / response models with strict validation and value ranges.
"""

from __future__ import annotations

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field, field_validator


# -----------------------------------------------------------------------
# Shared / reusable types
# -----------------------------------------------------------------------

RiskLevel = Literal["LOW", "MODERATE", "HIGH", "EXTREME"]
DataSource = Literal["model", "dataset"]


class FactorContribution(BaseModel):
    """A single SHAP feature contribution."""
    feature: str = Field(description="Feature name")
    display_name: str = Field(description="Human-readable feature label")
    shap_value: float = Field(description="SHAP value (positive = heats, negative = cools)")
    feature_value: float = Field(description="Actual input value for this feature")
    direction: Literal["increases_heat", "reduces_heat"] = Field(
        description="Whether this feature contributes to higher or lower temperature"
    )


class HeatPredictionResult(BaseModel):
    """Core prediction result returned from a single-ward inference."""
    ward_id: str
    ward_name: str
    predicted_temp_c: float = Field(description="Predicted avg surface temperature (°C)")
    confidence_lower: float = Field(description="Lower bound of estimated prediction interval (°C)")
    confidence_upper: float = Field(description="Upper bound of estimated prediction interval (°C)")
    confidence_label: str = Field(
        default="estimated",
        description="'estimated' when a true prediction interval is unavailable"
    )
    risk_level: RiskLevel
    top_factors: List[FactorContribution] = Field(default_factory=list)
    source: DataSource = "model"
    model_version: str = Field(default="")
    latency_ms: Optional[float] = None


# -----------------------------------------------------------------------
# /predict/heat  — single ward
# -----------------------------------------------------------------------

class WardFeatureInput(BaseModel):
    """
    Raw ward-level features sent by the client.
    All fields are optional; missing ones are imputed server-side.
    """
    ward_id: str = Field(..., description="Unique ward/region slug")
    ward_name: str = Field(..., description="Human-readable ward name")
    latitude: Optional[float] = Field(None, ge=17.0, le=20.0, description="Ward centroid lat")
    longitude: Optional[float] = Field(None, ge=72.0, le=75.5, description="Ward centroid lng")
    elevation_m: Optional[float] = Field(None, ge=400.0, le=900.0)
    tree_count: Optional[int] = Field(None, ge=0, le=50_000)
    height_m: Optional[float] = Field(None, ge=0.5, le=60.0)
    canopy_diameter_m: Optional[float] = Field(None, ge=0.5, le=40.0)
    dbh_cm: Optional[float] = Field(None, ge=1.0, le=300.0)
    shade_area_sqm: Optional[float] = Field(None, ge=0.0, le=5000.0)
    crown_volume_m3: Optional[float] = Field(None, ge=0.0, le=20_000.0)
    leaf_area_index: Optional[float] = Field(None, ge=0.0, le=15.0)
    transpiration_rate_l_day: Optional[float] = Field(None, ge=0.0, le=500.0)
    cooling_score_35: Optional[float] = Field(None, ge=0.0, le=100.0)
    co2_score_25: Optional[float] = Field(None, ge=0.0, le=100.0)
    growth_score_15: Optional[float] = Field(None, ge=0.0, le=100.0)
    urban_suit_score_10: Optional[float] = Field(None, ge=0.0, le=100.0)
    pollution_score_5: Optional[float] = Field(None, ge=0.0, le=100.0)
    drought_score_5: Optional[float] = Field(None, ge=0.0, le=100.0)
    maintenance_score_5: Optional[float] = Field(None, ge=0.0, le=100.0)
    total_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    co2_sequestration_kg_yr: Optional[float] = Field(None, ge=0.0)
    o2_production_kg_yr: Optional[float] = Field(None, ge=0.0)
    carbon_stored_kg: Optional[float] = Field(None, ge=0.0)
    total_biomass_kg: Optional[float] = Field(None, ge=0.0)
    air_pollution_tolerance_index: Optional[float] = Field(None, ge=0.0, le=50.0)
    pm25_reduction_ug_m3: Optional[float] = Field(None, ge=0.0)
    pm10_reduction_ug_m3: Optional[float] = Field(None, ge=0.0)
    so2_absorption: Optional[float] = Field(None, ge=0.0)
    no2_absorption: Optional[float] = Field(None, ge=0.0)
    region_heat_island_severity: Optional[str] = None
    region_traffic_density: Optional[str] = None
    uhi_reduction_potential: Optional[str] = None
    drought_tolerance: Optional[str] = None
    water_requirement: Optional[str] = None

    @field_validator("ward_id", "ward_name")
    @classmethod
    def non_empty_string(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("must be a non-empty string")
        return v.strip()


class PredictHeatRequest(BaseModel):
    ward: WardFeatureInput
    top_n_factors: int = Field(default=5, ge=1, le=20)


class PredictHeatResponse(BaseModel):
    prediction: HeatPredictionResult
    latency_ms: float


# -----------------------------------------------------------------------
# /predict/heat/batch
# -----------------------------------------------------------------------

class PredictHeatBatchRequest(BaseModel):
    wards: List[WardFeatureInput] = Field(..., min_length=1, max_length=200)
    top_n_factors: int = Field(default=3, ge=1, le=20)


class PredictHeatBatchResponse(BaseModel):
    predictions: List[HeatPredictionResult]
    count: int
    latency_ms: float


# -----------------------------------------------------------------------
# /simulate/intervention
# -----------------------------------------------------------------------

class InterventionParams(BaseModel):
    """Changes applied on top of a baseline ward for what-if analysis."""
    additional_trees: int = Field(default=0, ge=0, le=10_000,
                                   description="Extra trees added to the ward")
    canopy_increase_pct: float = Field(default=0.0, ge=0.0, le=100.0,
                                        description="% increase in canopy_diameter_m")
    cooling_score_delta: float = Field(default=0.0, ge=-100.0, le=100.0,
                                        description="Absolute change in weighted cooling score")


class SimulateInterventionRequest(BaseModel):
    baseline_ward: WardFeatureInput
    intervention: InterventionParams
    top_n_factors: int = Field(default=5, ge=1, le=20)


class SimulateInterventionResponse(BaseModel):
    ward_id: str
    ward_name: str
    baseline_temp_c: float
    predicted_temp_c: float
    cooling_delta_c: float = Field(description="Negative = cooling achieved")
    baseline_risk: RiskLevel
    predicted_risk: RiskLevel
    risk_changed: bool
    top_factors: List[FactorContribution]
    latency_ms: float


# -----------------------------------------------------------------------
# /wards/predictions  (all wards from dataset)
# -----------------------------------------------------------------------

class WardPredictionSummary(BaseModel):
    ward_id: str
    ward_name: str
    measured_temp_c: float
    predicted_temp_c: float
    delta_c: float = Field(description="predicted − measured; positive = model predicts hotter")
    measured_risk: RiskLevel
    predicted_risk: RiskLevel
    source: DataSource = "model"
    model_version: str = ""
    latitude: float
    longitude: float
    tree_count: int


class WardPredictionsResponse(BaseModel):
    wards: List[WardPredictionSummary]
    count: int
    latency_ms: float


# -----------------------------------------------------------------------
# /health  /model/info
# -----------------------------------------------------------------------

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_version: str


class ModelMetrics(BaseModel):
    rmse: Optional[float] = None
    mae: Optional[float] = None
    r2: Optional[float] = None
    accuracy: Optional[float] = None
    f1: Optional[float] = None


class ModelInfoResponse(BaseModel):
    model_version: str
    feature_names: List[str]
    num_features: int
    task: str
    metrics: ModelMetrics
    trained_at: Optional[str] = None
    training_data_source: Optional[str] = None
    n_estimators: Optional[int] = None


# -----------------------------------------------------------------------
# Error shape
# -----------------------------------------------------------------------

class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail
