"""
explain.py
SHAP-based feature importance for per-prediction explanations.
Uses TreeExplainer (fast, exact, designed for XGBoost).
"""

from __future__ import annotations

import logging
from typing import Optional, TYPE_CHECKING
import numpy as np
import pandas as pd

if TYPE_CHECKING:
    import xgboost as xgb
    import shap

logger = logging.getLogger(__name__)

# Human-readable labels for each canonical feature
FEATURE_DISPLAY_NAMES: dict[str, str] = {
    "height_m": "Tree Height (m)",
    "canopy_diameter_m": "Canopy Diameter (m)",
    "dbh_cm": "Trunk Diameter (cm)",
    "shade_area_sqm": "Shade Area (m²)",
    "crown_volume_m3": "Crown Volume (m³)",
    "leaf_area_index": "Leaf Area Index",
    "transpiration_rate_l_day": "Transpiration Rate (L/day)",
    "cooling_score_35": "Cooling Score (35%)",
    "co2_score_25": "CO₂ Score (25%)",
    "growth_score_15": "Growth Score (15%)",
    "urban_suit_score_10": "Urban Suitability (10%)",
    "pollution_score_5": "Pollution Tolerance (5%)",
    "drought_score_5": "Drought Tolerance (5%)",
    "maintenance_score_5": "Maintenance Score (5%)",
    "total_score": "Composite Tree Score",
    "co2_sequestration_kg_yr": "CO₂ Sequestration (kg/yr)",
    "o2_production_kg_yr": "O₂ Production (kg/yr)",
    "carbon_stored_kg": "Carbon Stored (kg)",
    "total_biomass_kg": "Total Biomass (kg)",
    "air_pollution_tolerance_index": "Air Pollution Tolerance Index",
    "pm25_reduction_ug_m3": "PM2.5 Reduction (µg/m³)",
    "pm10_reduction_ug_m3": "PM10 Reduction (µg/m³)",
    "so2_absorption": "SO₂ Absorption",
    "no2_absorption": "NO₂ Absorption",
    "elevation_m": "Elevation (m)",
    "latitude": "Latitude",
    "longitude": "Longitude",
    "tree_count": "Tree Count (Ward)",
    "region_heat_island_severity_enc": "UHI Severity",
    "region_traffic_density_enc": "Traffic Density",
    "uhi_reduction_potential_enc": "UHI Reduction Potential",
    "drought_tolerance_enc": "Drought Tolerance (Ward)",
    "water_requirement_enc": "Water Requirement (Ward)",
}


class SHAPExplainer:
    """Wrapper around shap.TreeExplainer; initialised once with the model."""

    def __init__(self) -> None:
        self._explainer: Optional[object] = None

    def setup(self, model: "xgb.XGBRegressor") -> None:
        """Initialise the TreeExplainer. Called once at startup."""
        try:
            import shap
            self._explainer = shap.TreeExplainer(model)
            logger.info("SHAP TreeExplainer initialised successfully.")
        except Exception as exc:
            logger.warning("SHAP initialisation failed: %s. Explanations will be unavailable.", exc)
            self._explainer = None

    def top_factors(
        self,
        df_row: pd.DataFrame,
        feature_names: list[str],
        top_n: int = 5,
    ) -> list[dict]:
        """
        Return the top-N SHAP contributions for a single-row DataFrame.
        Returns an empty list if SHAP is unavailable.
        """
        if self._explainer is None:
            return []
        try:
            import shap as _shap
            shap_values = self._explainer.shap_values(df_row)
            # For regression, shap_values is (n_rows, n_features)
            if isinstance(shap_values, list):
                sv = np.array(shap_values[0])
            else:
                sv = np.array(shap_values)
            row_sv = sv[0] if sv.ndim == 2 else sv

            indices = np.argsort(np.abs(row_sv))[::-1][:top_n]
            results = []
            for idx in indices:
                name = feature_names[idx]
                sv_val = float(row_sv[idx])
                feat_val = float(df_row.iloc[0, idx])
                results.append({
                    "feature": name,
                    "display_name": FEATURE_DISPLAY_NAMES.get(name, name),
                    "shap_value": round(sv_val, 4),
                    "feature_value": round(feat_val, 4),
                    "direction": "reduces_heat" if sv_val < 0 else "increases_heat",
                })
            return results
        except Exception as exc:
            logger.warning("SHAP explanation failed: %s", exc)
            return []


# Singleton instance — shared by model_service
explainer_instance = SHAPExplainer()
