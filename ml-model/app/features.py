"""
features.py
Single source of truth for feature engineering.
Used both at training time (training notebook/script) and serving time (this API).
Any change here MUST be reflected in the training script to avoid skew.

Feature list and preprocessing strategy:
  - All features derived from Pune_Heat_Guardian.json (tree-level records aggregated per ward)
  - Numeric features: median-imputed, no scaling (XGBoost is scale-invariant)
  - Categorical features: ordinal-encoded using the CATEGORY_ORDINALS map below
  - Target: Avg_Temperature_C (regression, ward-level mean)
"""

from __future__ import annotations

import pandas as pd
import numpy as np
from typing import Dict, Any

# -----------------------------------------------------------------------
# 1.  Canonical feature order  (MUST match training feature_names_in_)
# -----------------------------------------------------------------------
FEATURE_NAMES: list[str] = [
    # --- Tree morphology ---
    "height_m",                 # mean tree height in ward (m)
    "canopy_diameter_m",        # mean canopy diameter (m)
    "dbh_cm",                   # mean diameter at breast height (cm)
    "shade_area_sqm",           # mean individual shade area (m²)
    "crown_volume_m3",          # mean crown volume (m³)
    "leaf_area_index",          # mean LAI
    "transpiration_rate_l_day", # mean transpiration (L/day)
    # --- Ecological scores (0-100, already normalised) ---
    "cooling_score_35",
    "co2_score_25",
    "growth_score_15",
    "urban_suit_score_10",
    "pollution_score_5",
    "drought_score_5",
    "maintenance_score_5",
    "total_score",
    # --- Carbon / gas exchange ---
    "co2_sequestration_kg_yr",
    "o2_production_kg_yr",
    "carbon_stored_kg",
    "total_biomass_kg",
    "air_pollution_tolerance_index",
    "pm25_reduction_ug_m3",
    "pm10_reduction_ug_m3",
    "so2_absorption",
    "no2_absorption",
    # --- Geography ---
    "elevation_m",
    "latitude",
    "longitude",
    "tree_count",               # number of trees in the ward (aggregated)
    # --- Categorical (ordinal-encoded) ---
    "region_heat_island_severity_enc",  # 0–3
    "region_traffic_density_enc",       # 0–1
    "uhi_reduction_potential_enc",      # 0–1
    "drought_tolerance_enc",            # 0–2
    "water_requirement_enc",            # 0–2
]

# -----------------------------------------------------------------------
# 2.  Ordinal encoding maps  (consistent with training)
# -----------------------------------------------------------------------
CATEGORY_ORDINALS: Dict[str, Dict[str, int]] = {
    "region_heat_island_severity_enc": {
        "moderate": 0,
        "moderate-high": 1,
        "high": 2,
        "very high": 3,
    },
    "region_traffic_density_enc": {
        "moderate": 0,
        "high": 1,
    },
    "uhi_reduction_potential_enc": {
        "medium": 0,
        "high": 1,
    },
    "drought_tolerance_enc": {
        "low": 0,
        "medium": 1,
        "high": 2,
    },
    "water_requirement_enc": {
        "high": 0,
        "medium": 1,
        "low": 2,
    },
}

# -----------------------------------------------------------------------
# 3.  Median imputation defaults
#     (populated from the training dataset; approximate values used as
#      fallback when training imputer is not available)
# -----------------------------------------------------------------------
IMPUTATION_DEFAULTS: Dict[str, float] = {
    "height_m": 12.0,
    "canopy_diameter_m": 9.0,
    "dbh_cm": 30.0,
    "shade_area_sqm": 60.0,
    "crown_volume_m3": 300.0,
    "leaf_area_index": 3.5,
    "transpiration_rate_l_day": 45.0,
    "cooling_score_35": 70.0,
    "co2_score_25": 60.0,
    "growth_score_15": 65.0,
    "urban_suit_score_10": 75.0,
    "pollution_score_5": 70.0,
    "drought_score_5": 65.0,
    "maintenance_score_5": 70.0,
    "total_score": 68.0,
    "co2_sequestration_kg_yr": 120.0,
    "o2_production_kg_yr": 90.0,
    "carbon_stored_kg": 150.0,
    "total_biomass_kg": 320.0,
    "air_pollution_tolerance_index": 16.0,
    "pm25_reduction_ug_m3": 5.0,
    "pm10_reduction_ug_m3": 8.0,
    "so2_absorption": 0.5,
    "no2_absorption": 0.4,
    "elevation_m": 565.0,
    "latitude": 18.52,
    "longitude": 73.86,
    "tree_count": 10,
    "region_heat_island_severity_enc": 1.0,
    "region_traffic_density_enc": 0.0,
    "uhi_reduction_potential_enc": 1.0,
    "drought_tolerance_enc": 1.0,
    "water_requirement_enc": 1.0,
}


def _encode_categorical(raw_val: Any, mapping: Dict[str, int], default: float) -> float:
    """Ordinal-encode a single categorical value; fall back to default on unknown."""
    if raw_val is None or (isinstance(raw_val, float) and np.isnan(raw_val)):
        return default
    key = str(raw_val).strip().lower()
    return float(mapping.get(key, default))


def engineer_ward_features(ward_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Convert a raw ward-level dictionary (from the request body or aggregated
    from the dataset) into the canonical feature dict expected by the model.

    ward_data keys mirror the JSON dataset field names (snake_case).
    """

    def get(key: str, default: float | None = None) -> float:
        val = ward_data.get(key)
        if val is None:
            return IMPUTATION_DEFAULTS.get(key, default if default is not None else 0.0)
        try:
            return float(val)
        except (ValueError, TypeError):
            return IMPUTATION_DEFAULTS.get(key, default if default is not None else 0.0)

    features: Dict[str, float] = {
        "height_m": get("height_m"),
        "canopy_diameter_m": get("canopy_diameter_m"),
        "dbh_cm": get("dbh_cm"),
        "shade_area_sqm": get("shade_area_sqm"),
        "crown_volume_m3": get("crown_volume_m3"),
        "leaf_area_index": get("leaf_area_index"),
        "transpiration_rate_l_day": get("transpiration_rate_l_day"),
        "cooling_score_35": get("cooling_score_35"),
        "co2_score_25": get("co2_score_25"),
        "growth_score_15": get("growth_score_15"),
        "urban_suit_score_10": get("urban_suit_score_10"),
        "pollution_score_5": get("pollution_score_5"),
        "drought_score_5": get("drought_score_5"),
        "maintenance_score_5": get("maintenance_score_5"),
        "total_score": get("total_score"),
        "co2_sequestration_kg_yr": get("co2_sequestration_kg_yr"),
        "o2_production_kg_yr": get("o2_production_kg_yr"),
        "carbon_stored_kg": get("carbon_stored_kg"),
        "total_biomass_kg": get("total_biomass_kg"),
        "air_pollution_tolerance_index": get("air_pollution_tolerance_index"),
        "pm25_reduction_ug_m3": get("pm25_reduction_ug_m3"),
        "pm10_reduction_ug_m3": get("pm10_reduction_ug_m3"),
        "so2_absorption": get("so2_absorption"),
        "no2_absorption": get("no2_absorption"),
        "elevation_m": get("elevation_m"),
        "latitude": get("latitude"),
        "longitude": get("longitude"),
        "tree_count": get("tree_count"),
        # Categorical ordinal encodings
        "region_heat_island_severity_enc": _encode_categorical(
            ward_data.get("region_heat_island_severity"),
            CATEGORY_ORDINALS["region_heat_island_severity_enc"],
            IMPUTATION_DEFAULTS["region_heat_island_severity_enc"],
        ),
        "region_traffic_density_enc": _encode_categorical(
            ward_data.get("region_traffic_density"),
            CATEGORY_ORDINALS["region_traffic_density_enc"],
            IMPUTATION_DEFAULTS["region_traffic_density_enc"],
        ),
        "uhi_reduction_potential_enc": _encode_categorical(
            ward_data.get("uhi_reduction_potential"),
            CATEGORY_ORDINALS["uhi_reduction_potential_enc"],
            IMPUTATION_DEFAULTS["uhi_reduction_potential_enc"],
        ),
        "drought_tolerance_enc": _encode_categorical(
            ward_data.get("drought_tolerance"),
            CATEGORY_ORDINALS["drought_tolerance_enc"],
            IMPUTATION_DEFAULTS["drought_tolerance_enc"],
        ),
        "water_requirement_enc": _encode_categorical(
            ward_data.get("water_requirement"),
            CATEGORY_ORDINALS["water_requirement_enc"],
            IMPUTATION_DEFAULTS["water_requirement_enc"],
        ),
    }
    return features


def features_to_dataframe(feature_dict: Dict[str, float]) -> pd.DataFrame:
    """Return a single-row DataFrame in canonical FEATURE_NAMES column order."""
    row = {k: [feature_dict.get(k, IMPUTATION_DEFAULTS.get(k, 0.0))] for k in FEATURE_NAMES}
    return pd.DataFrame(row, columns=FEATURE_NAMES)


def batch_to_dataframe(feature_dicts: list[Dict[str, float]]) -> pd.DataFrame:
    """Convert a list of feature dicts into a multi-row DataFrame."""
    rows = []
    for fd in feature_dicts:
        row = {k: fd.get(k, IMPUTATION_DEFAULTS.get(k, 0.0)) for k in FEATURE_NAMES}
        rows.append(row)
    return pd.DataFrame(rows, columns=FEATURE_NAMES)
