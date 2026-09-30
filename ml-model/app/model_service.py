"""
model_service.py
Loads the XGBoost model once at startup and exposes predict / batch_predict.
Feature alignment with the training feature list is done explicitly before
every inference call.
"""

from __future__ import annotations

import json
import logging
import os
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

from app.config import settings
from app.features import FEATURE_NAMES, engineer_ward_features, features_to_dataframe, batch_to_dataframe
from app.risk import temperature_to_risk
from app.explain import explainer_instance
from app.schemas import FactorContribution, HeatPredictionResult

logger = logging.getLogger(__name__)


class ModelService:
    """Singleton inference service — loaded once at lifespan startup."""

    def __init__(self) -> None:
        self._model: Optional[Any] = None
        self._metadata: Dict[str, Any] = {}
        self._feature_names: List[str] = FEATURE_NAMES
        self._loaded: bool = False

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def load(self) -> None:
        """Load model from disk. Raises RuntimeError on failure."""
        import xgboost as xgb

        model_path = Path(settings.MODEL_PATH)
        if not model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at '{model_path}'. "
                "Run scripts/train_model.py to create it."
            )

        self._model = xgb.XGBRegressor()
        self._model.load_model(str(model_path))
        logger.info("XGBoost model loaded from '%s'.", model_path)

        # Prefer booster feature names over our hardcoded list (detects skew)
        try:
            booster_features = self._model.get_booster().feature_names
            if booster_features and booster_features != self._feature_names:
                logger.warning(
                    "Training/serving skew detected: model feature names differ from features.py. "
                    "Using model's feature names. Update features.py to resolve skew.\n"
                    "  Model  : %s\n  Serving: %s",
                    booster_features,
                    self._feature_names,
                )
                self._feature_names = list(booster_features)
        except Exception:
            pass  # booster may not have feature names if trained without them

        # Load optional metadata
        meta_path = Path(settings.MODEL_METADATA_PATH)
        if meta_path.exists():
            with meta_path.open() as f:
                self._metadata = json.load(f)
            logger.info("Model metadata loaded: version=%s", self._metadata.get("version", "unknown"))
        else:
            logger.warning("No model_metadata.json found at '%s'.", meta_path)
            self._metadata = {
                "version": "unknown",
                "task": "regression",
                "metrics": {},
                "trained_at": None,
                "training_data_source": "Pune_Heat_Guardian.json",
            }

        # Setup SHAP explainer
        explainer_instance.setup(self._model)

        self._loaded = True

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    @property
    def metadata(self) -> Dict[str, Any]:
        return self._metadata

    @property
    def model_version(self) -> str:
        return self._metadata.get("version", "unknown")

    @property
    def feature_names(self) -> List[str]:
        return self._feature_names

    # ------------------------------------------------------------------
    # Inference helpers
    # ------------------------------------------------------------------

    def _align_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Reorder / add columns to match exactly what the model expects.
        Missing columns are filled with median imputation defaults.
        """
        from app.features import IMPUTATION_DEFAULTS
        for col in self._feature_names:
            if col not in df.columns:
                df[col] = IMPUTATION_DEFAULTS.get(col, 0.0)
        return df[self._feature_names]

    def _build_prediction(
        self,
        ward_id: str,
        ward_name: str,
        df_row: pd.DataFrame,
        top_n: int,
    ) -> HeatPredictionResult:
        """Run model inference and SHAP for a single row."""
        raw_pred: float = float(self._model.predict(df_row)[0])
        risk = temperature_to_risk(raw_pred)

        half_w = settings.CONFIDENCE_INTERVAL_C
        shap_factors = explainer_instance.top_factors(df_row, self._feature_names, top_n)
        factors = [FactorContribution(**f) for f in shap_factors]

        return HeatPredictionResult(
            ward_id=ward_id,
            ward_name=ward_name,
            predicted_temp_c=round(raw_pred, 2),
            confidence_lower=round(raw_pred - half_w, 2),
            confidence_upper=round(raw_pred + half_w, 2),
            confidence_label="estimated",
            risk_level=risk,
            top_factors=factors,
            source="model",
            model_version=self.model_version,
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def predict(
        self,
        ward_dict: Dict[str, Any],
        ward_id: str,
        ward_name: str,
        top_n: int = 5,
    ) -> HeatPredictionResult:
        """Single-ward prediction."""
        self._require_loaded()
        feat = engineer_ward_features(ward_dict)
        df = self._align_features(features_to_dataframe(feat))
        return self._build_prediction(ward_id, ward_name, df, top_n)

    def batch_predict(
        self,
        ward_dicts: List[Dict[str, Any]],
        ward_ids: List[str],
        ward_names: List[str],
        top_n: int = 3,
    ) -> List[HeatPredictionResult]:
        """Vectorised batch prediction — no per-row Python loop."""
        self._require_loaded()
        feat_dicts = [engineer_ward_features(w) for w in ward_dicts]
        df = self._align_features(batch_to_dataframe(feat_dicts))

        raw_preds: np.ndarray = self._model.predict(df)

        # SHAP is computed row-by-row (TreeExplainer accepts matrices but
        # we still need per-row factors — vectorised at SHAP level)
        results: List[HeatPredictionResult] = []
        for i, (ward_id, ward_name) in enumerate(zip(ward_ids, ward_names)):
            row_df = df.iloc[[i]]
            shap_factors = explainer_instance.top_factors(
                row_df, self._feature_names, top_n
            )
            raw_pred = float(raw_preds[i])
            half_w = settings.CONFIDENCE_INTERVAL_C
            factors = [FactorContribution(**f) for f in shap_factors]
            results.append(
                HeatPredictionResult(
                    ward_id=ward_id,
                    ward_name=ward_name,
                    predicted_temp_c=round(raw_pred, 2),
                    confidence_lower=round(raw_pred - half_w, 2),
                    confidence_upper=round(raw_pred + half_w, 2),
                    confidence_label="estimated",
                    risk_level=temperature_to_risk(raw_pred),
                    top_factors=factors,
                    source="model",
                    model_version=self.model_version,
                )
            )
        return results

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _require_loaded(self) -> None:
        if not self._loaded or self._model is None:
            raise RuntimeError("Model is not loaded. Check startup logs.")


# Module-level singleton
model_service = ModelService()
