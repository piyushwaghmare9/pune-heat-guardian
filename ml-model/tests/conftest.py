"""
conftest.py
Pytest configuration — loads the XGBoost model once before the test session
so TestClient requests don't hit MODEL_NOT_LOADED (503).
"""

import sys
from pathlib import Path

# Ensure ml-model root is importable
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from app.model_service import model_service


def pytest_configure(config):
    """Load model once before any test collection starts."""
    try:
        if not model_service.is_loaded:
            model_service.load()
    except Exception as exc:
        print(f"\n[conftest] WARNING: Model failed to load: {exc}\n")
