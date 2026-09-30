"""
train_model.py
Trains an XGBoost regression model on the Pune_Heat_Guardian.json dataset
and saves the model artifact + metadata to ml-model/models/.

Target variable : Avg_Temperature_C (ward-level mean surface temperature)
Features        : see app/features.py  (FEATURE_NAMES)

Usage:
    cd heatguard-ai/ml-model
    python scripts/train_model.py

Output:
    models/heatguard_xgb.json        -- XGBoost model (native JSON format)
    models/model_metadata.json       -- version, metrics, feature list
"""

from __future__ import annotations

import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
import statistics

# Allow running from ml-model/ directory
sys.path.insert(0, str(Path(__file__).parent.parent))

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb

from app.features import (
    FEATURE_NAMES,
    IMPUTATION_DEFAULTS,
    engineer_ward_features,
)

# ---------------------------------------------------------------------------
# 1. Load & aggregate dataset into one row per ward
# ---------------------------------------------------------------------------
DATASET_PATH = Path(__file__).parent.parent / "../lib/data/dataset.json"

print(f"Loading dataset from {DATASET_PATH.resolve()}...")
with open(DATASET_PATH) as f:
    raw = json.load(f)

trees_raw: list[dict] = raw.get("trees", raw) if isinstance(raw, dict) else raw
print(f"  Loaded {len(trees_raw)} tree records.")

from collections import defaultdict

by_region: dict[str, list[dict]] = defaultdict(list)
for tree in trees_raw:
    by_region[tree["Region"]].append(tree)


def ward_mean(trees: list[dict], field: str) -> float:
    vals = [t.get(field) for t in trees if t.get(field) is not None]
    return statistics.mean(vals) if vals else IMPUTATION_DEFAULTS.get(field, 0.0)


rows: list[dict] = []
targets: list[float] = []

for region_name, trees in by_region.items():
    ward_id = region_name.lower().replace(" ", "-").replace("/", "-")

    ward_dict = {
        "height_m": ward_mean(trees, "Height_m"),
        "canopy_diameter_m": ward_mean(trees, "Canopy_Diameter_m"),
        "dbh_cm": ward_mean(trees, "DBH_cm"),
        "shade_area_sqm": ward_mean(trees, "Shade_Area_sqm"),
        "crown_volume_m3": ward_mean(trees, "Crown_Volume_m3"),
        "leaf_area_index": ward_mean(trees, "Leaf_Area_Index"),
        "transpiration_rate_l_day": ward_mean(trees, "Transpiration_Rate_L_day"),
        "cooling_score_35": ward_mean(trees, "Cooling_Score_35"),
        "co2_score_25": ward_mean(trees, "CO2_Score_25"),
        "growth_score_15": ward_mean(trees, "Growth_Score_15"),
        "urban_suit_score_10": ward_mean(trees, "Urban_Suit_Score_10"),
        "pollution_score_5": ward_mean(trees, "Pollution_Score_5"),
        "drought_score_5": ward_mean(trees, "Drought_Score_5"),
        "maintenance_score_5": ward_mean(trees, "Maintenance_Score_5"),
        "total_score": ward_mean(trees, "Total_Score"),
        "co2_sequestration_kg_yr": ward_mean(trees, "CO2_Sequestration_kg_yr"),
        "o2_production_kg_yr": ward_mean(trees, "O2_Production_kg_yr"),
        "carbon_stored_kg": ward_mean(trees, "Carbon_Stored_kg"),
        "total_biomass_kg": ward_mean(trees, "Total_Biomass_kg"),
        "air_pollution_tolerance_index": ward_mean(trees, "Air_Pollution_Tolerance_Index"),
        "pm25_reduction_ug_m3": ward_mean(trees, "PM2.5_Reduction_ug_m3"),
        "pm10_reduction_ug_m3": ward_mean(trees, "PM10_Reduction_ug_m3"),
        "so2_absorption": ward_mean(trees, "SO2_Absorption"),
        "no2_absorption": ward_mean(trees, "NO2_Absorption"),
        "elevation_m": ward_mean(trees, "Elevation_m"),
        "latitude": ward_mean(trees, "Latitude"),
        "longitude": ward_mean(trees, "Longitude"),
        "tree_count": float(len(trees)),
        # Categorical from first tree in ward (consistent across a ward)
        "region_heat_island_severity": trees[0].get("Region_Heat_Island_Severity"),
        "region_traffic_density": trees[0].get("Region_Traffic_Density"),
        "uhi_reduction_potential": trees[0].get("UHI_Reduction_Potential"),
        "drought_tolerance": trees[0].get("Drought_Tolerance"),
        "water_requirement": trees[0].get("Water_Requirement"),
    }

    features = engineer_ward_features(ward_dict)
    rows.append(features)
    targets.append(ward_mean(trees, "Avg_Temperature_C"))

X = pd.DataFrame(rows, columns=FEATURE_NAMES)
y = np.array(targets)

print(f"  Aggregated to {len(X)} ward rows. Target range: {y.min():.2f}–{y.max():.2f}°C")

# ---------------------------------------------------------------------------
# 2. Train XGBoost (on full data since only 10 wards — use CV for metrics)
# ---------------------------------------------------------------------------
print("\nTraining XGBoost regressor...")

# NOTE: With only 10 ward-level rows the model memorises (intended for demo).
# In production, use tree-level rows or synthetic augmentation.
model = xgb.XGBRegressor(
    n_estimators=200,
    max_depth=3,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    random_state=42,
    verbosity=0,
)

# 3-fold CV for honest metrics (with 10 samples this is small but informative)
kf = KFold(n_splits=3, shuffle=True, random_state=42)
cv_rmse = []
cv_mae  = []
cv_r2   = []
for train_idx, val_idx in kf.split(X):
    X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
    y_tr, y_val = y[train_idx], y[val_idx]
    model.fit(X_tr, y_tr, eval_set=[(X_val, y_val)], verbose=False)
    preds = model.predict(X_val)
    cv_rmse.append(np.sqrt(mean_squared_error(y_val, preds)))
    cv_mae.append(mean_absolute_error(y_val, preds))
    cv_r2.append(r2_score(y_val, preds))

# Final fit on all data
model.fit(X, y, verbose=False)

rmse = float(np.mean(cv_rmse))
mae  = float(np.mean(cv_mae))
r2   = float(np.mean(cv_r2))
print(f"  CV RMSE={rmse:.4f}°C  MAE={mae:.4f}°C  R²={r2:.4f}")

# Verify feature names are stored in booster
model.get_booster().feature_names = FEATURE_NAMES

# ---------------------------------------------------------------------------
# 3. Save model
# ---------------------------------------------------------------------------
output_dir = Path(__file__).parent.parent / "models"
output_dir.mkdir(parents=True, exist_ok=True)

model_path = output_dir / "heatguard_xgb.json"
model.save_model(str(model_path))
print(f"\nModel saved -> {model_path}")

# ---------------------------------------------------------------------------
# 4. Save metadata
# ---------------------------------------------------------------------------
metadata = {
    "version": "1.0.0",
    "task": "regression",
    "target": "Avg_Temperature_C",
    "feature_names": FEATURE_NAMES,
    "n_features": len(FEATURE_NAMES),
    "n_estimators": model.n_estimators,
    "metrics": {
        "rmse": round(rmse, 4),
        "mae": round(mae, 4),
        "r2": round(r2, 4),
    },
    "training_data_source": "Pune_Heat_Guardian.json",
    "training_rows": len(X),
    "trained_at": datetime.now(timezone.utc).isoformat(),
    "notes": (
        "Trained on 10 ward-level aggregated rows from the Pune Heat Guardian dataset. "
        "With only 10 samples, CV metrics reflect small-sample variance. "
        "For production, use tree-level or augmented ward-level data."
    ),
}

meta_path = output_dir / "model_metadata.json"
with open(meta_path, "w") as f:
    json.dump(metadata, f, indent=2)
print(f"Metadata saved -> {meta_path}")
print("\nDone. Run the API with: uvicorn app.main:app --reload --port 8000")
