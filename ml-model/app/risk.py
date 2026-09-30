"""
risk.py
Maps a numeric predicted temperature (°C) to a categorical HeatGuard risk level.
Single source of truth shared by model_service and simulation logic.
"""

from app.config import settings

RiskLevel = str  # "LOW" | "MODERATE" | "HIGH" | "EXTREME"


def temperature_to_risk(temp_c: float) -> RiskLevel:
    """
    Thresholds mirror DATASET_INTEGRATION.md:
      < 29.4  → LOW
      29.4–29.8 → MODERATE
      29.8–30.2 → HIGH
      ≥ 30.2  → EXTREME
    """
    if temp_c < settings.RISK_THRESHOLD_LOW:
        return "LOW"
    elif temp_c < settings.RISK_THRESHOLD_MODERATE:
        return "MODERATE"
    elif temp_c < settings.RISK_THRESHOLD_HIGH:
        return "HIGH"
    else:
        return "EXTREME"


def risk_to_temp_midpoint(risk: RiskLevel) -> float:
    """Returns the midpoint temperature (°C) for a given risk level bucket."""
    midpoints = {
        "LOW": settings.RISK_THRESHOLD_LOW - 0.5,
        "MODERATE": (settings.RISK_THRESHOLD_LOW + settings.RISK_THRESHOLD_MODERATE) / 2,
        "HIGH": (settings.RISK_THRESHOLD_MODERATE + settings.RISK_THRESHOLD_HIGH) / 2,
        "EXTREME": settings.RISK_THRESHOLD_HIGH + 0.5,
    }
    return midpoints.get(risk, settings.RISK_THRESHOLD_HIGH)
