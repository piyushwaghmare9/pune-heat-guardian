"""
config.py
Centralised Pydantic-Settings configuration for the HeatGuard AI ML service.
All values are read from environment variables or fall back to safe defaults.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Model ---
    MODEL_PATH: str = "models/heatguard_xgb.json"
    MODEL_METADATA_PATH: str = "models/model_metadata.json"

    # --- API ---
    APP_TITLE: str = "HeatGuard AI — ML Inference Service"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"

    # --- CORS ---
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # --- Risk thresholds (avg temperature °C → level) ---
    # Derived from the HeatGuard AI DATASET_INTEGRATION.md spec
    RISK_THRESHOLD_LOW: float = 29.4       # < this → LOW
    RISK_THRESHOLD_MODERATE: float = 29.8  # < this → MODERATE
    RISK_THRESHOLD_HIGH: float = 30.2      # < this → HIGH
    # >= HIGH threshold → EXTREME

    # --- Prediction interval half-width used when quantile models unavailable ---
    CONFIDENCE_INTERVAL_C: float = 0.8

    # --- Dataset path (relative to ml-model/) used by ward predictions ---
    DATASET_PATH: str = "../lib/data/dataset.json"

    # --- Logging ---
    LOG_LEVEL: str = "INFO"


settings = Settings()
