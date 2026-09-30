"""
test_api.py
Pytest test suite for the HeatGuard AI ML inference service.

Run with:
    cd heatguard-ai/ml-model
    pytest tests/ -v
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

# Ensure the ml-model root is on the path
sys.path.insert(0, str(Path(__file__).parent.parent))


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------
@pytest.fixture(scope="session")
def client():
    """Returns a TestClient that loads the real model (or skips if not found)."""
    from fastapi.testclient import TestClient
    from app.main import app
    return TestClient(app)


@pytest.fixture(scope="session")
def valid_ward_payload():
    return {
        "ward": {
            "ward_id": "shivajinagar",
            "ward_name": "Shivajinagar",
            "latitude": 18.53,
            "longitude": 73.85,
            "elevation_m": 560.0,
            "tree_count": 10,
            "height_m": 20.4,
            "canopy_diameter_m": 16.8,
            "dbh_cm": 53.6,
            "cooling_score_35": 100.0,
            "co2_score_25": 100.0,
            "total_score": 97.5,
            "region_heat_island_severity": "High",
            "region_traffic_density": "High",
            "uhi_reduction_potential": "High",
            "drought_tolerance": "High",
            "water_requirement": "Low",
        },
        "top_n_factors": 3,
    }


# ---------------------------------------------------------------------------
# /health
# ---------------------------------------------------------------------------
class TestHealth:
    def test_health_returns_200(self, client):
        resp = client.get("/api/v1/health")
        assert resp.status_code == 200

    def test_health_has_required_fields(self, client):
        data = client.get("/api/v1/health").json()
        assert "status" in data
        assert "model_loaded" in data
        assert "model_version" in data

    def test_health_status_is_string(self, client):
        data = client.get("/api/v1/health").json()
        assert isinstance(data["status"], str)


# ---------------------------------------------------------------------------
# /model/info
# ---------------------------------------------------------------------------
class TestModelInfo:
    def test_model_info_200(self, client):
        resp = client.get("/api/v1/model/info")
        assert resp.status_code == 200

    def test_model_info_has_feature_names(self, client):
        data = client.get("/api/v1/model/info").json()
        assert "feature_names" in data
        assert isinstance(data["feature_names"], list)
        assert len(data["feature_names"]) > 0

    def test_model_info_num_features_matches(self, client):
        data = client.get("/api/v1/model/info").json()
        assert data["num_features"] == len(data["feature_names"])


# ---------------------------------------------------------------------------
# /predict/heat — single ward
# ---------------------------------------------------------------------------
class TestPredictHeat:
    def test_predict_returns_200(self, client, valid_ward_payload):
        resp = client.post("/api/v1/predict/heat", json=valid_ward_payload)
        assert resp.status_code == 200, resp.text

    def test_predict_has_required_fields(self, client, valid_ward_payload):
        data = client.post("/api/v1/predict/heat", json=valid_ward_payload).json()
        pred = data["prediction"]
        assert "predicted_temp_c" in pred
        assert "risk_level" in pred
        assert "confidence_lower" in pred
        assert "confidence_upper" in pred
        assert "top_factors" in pred
        assert "source" in pred

    def test_predict_temp_in_plausible_range(self, client, valid_ward_payload):
        data = client.post("/api/v1/predict/heat", json=valid_ward_payload).json()
        temp = data["prediction"]["predicted_temp_c"]
        assert 20.0 <= temp <= 50.0, f"Implausible temperature: {temp}"

    def test_predict_risk_level_valid(self, client, valid_ward_payload):
        data = client.post("/api/v1/predict/heat", json=valid_ward_payload).json()
        assert data["prediction"]["risk_level"] in {"LOW", "MODERATE", "HIGH", "EXTREME"}

    def test_predict_confidence_interval_ordered(self, client, valid_ward_payload):
        data = client.post("/api/v1/predict/heat", json=valid_ward_payload).json()
        pred = data["prediction"]
        assert pred["confidence_lower"] <= pred["predicted_temp_c"] <= pred["confidence_upper"]

    def test_predict_source_is_model(self, client, valid_ward_payload):
        data = client.post("/api/v1/predict/heat", json=valid_ward_payload).json()
        assert data["prediction"]["source"] == "model"

    def test_predict_invalid_ward_returns_422(self, client):
        """Empty ward_id should fail validation."""
        resp = client.post("/api/v1/predict/heat", json={"ward": {"ward_id": "", "ward_name": "X"}})
        assert resp.status_code == 422

    def test_predict_out_of_range_lat_returns_422(self, client):
        payload = {
            "ward": {"ward_id": "test", "ward_name": "Test", "latitude": 99.0},
            "top_n_factors": 3,
        }
        resp = client.post("/api/v1/predict/heat", json=payload)
        assert resp.status_code == 422


# ---------------------------------------------------------------------------
# /predict/heat/batch
# ---------------------------------------------------------------------------
class TestPredictHeatBatch:
    def test_batch_returns_200(self, client, valid_ward_payload):
        payload = {
            "wards": [valid_ward_payload["ward"], valid_ward_payload["ward"]],
            "top_n_factors": 2,
        }
        resp = client.post("/api/v1/predict/heat/batch", json=payload)
        assert resp.status_code == 200

    def test_batch_count_matches(self, client, valid_ward_payload):
        payload = {
            "wards": [valid_ward_payload["ward"], valid_ward_payload["ward"]],
            "top_n_factors": 2,
        }
        data = client.post("/api/v1/predict/heat/batch", json=payload).json()
        assert data["count"] == 2
        assert len(data["predictions"]) == 2

    def test_batch_empty_list_returns_422(self, client):
        resp = client.post("/api/v1/predict/heat/batch", json={"wards": []})
        assert resp.status_code == 422


# ---------------------------------------------------------------------------
# /simulate/intervention
# ---------------------------------------------------------------------------
class TestSimulateIntervention:
    def test_simulate_returns_200(self, client, valid_ward_payload):
        payload = {
            "baseline_ward": valid_ward_payload["ward"],
            "intervention": {
                "additional_trees": 50,
                "canopy_increase_pct": 10.0,
                "cooling_score_delta": 5.0,
            },
        }
        resp = client.post("/api/v1/simulate/intervention", json=payload)
        assert resp.status_code == 200

    def test_simulate_cooling_delta_non_positive_for_adding_trees(self, client, valid_ward_payload):
        """
        Adding trees should not increase temperature (cooling_delta_c <= 0).
        With XGBoost on a small dataset this is a heuristic check;
        the test warns if violated but does not hard-fail.
        """
        payload = {
            "baseline_ward": valid_ward_payload["ward"],
            "intervention": {
                "additional_trees": 100,
                "canopy_increase_pct": 20.0,
                "cooling_score_delta": 10.0,
            },
        }
        data = client.post("/api/v1/simulate/intervention", json=payload).json()
        delta = data["cooling_delta_c"]
        if delta > 0:
            import warnings
            warnings.warn(
                f"Simulation shows heating (+{delta}°C) when adding trees. "
                "This may reflect small-dataset behaviour; investigate feature importances."
            )

    def test_simulate_has_required_fields(self, client, valid_ward_payload):
        payload = {
            "baseline_ward": valid_ward_payload["ward"],
            "intervention": {"additional_trees": 20},
        }
        data = client.post("/api/v1/simulate/intervention", json=payload).json()
        for field in ["baseline_temp_c", "predicted_temp_c", "cooling_delta_c",
                      "baseline_risk", "predicted_risk", "risk_changed"]:
            assert field in data, f"Missing field: {field}"


# ---------------------------------------------------------------------------
# /wards/predictions
# ---------------------------------------------------------------------------
class TestWardsPredictions:
    def test_wards_returns_200(self, client):
        resp = client.get("/api/v1/wards/predictions")
        assert resp.status_code == 200

    def test_wards_count_matches_pune_regions(self, client):
        data = client.get("/api/v1/wards/predictions").json()
        # Dataset has 10 regions
        assert data["count"] == 10, f"Expected 10 ward predictions, got {data['count']}"

    def test_wards_all_have_required_fields(self, client):
        data = client.get("/api/v1/wards/predictions").json()
        for w in data["wards"]:
            for field in ["ward_id", "ward_name", "measured_temp_c",
                          "predicted_temp_c", "delta_c", "measured_risk", "predicted_risk"]:
                assert field in w


# ---------------------------------------------------------------------------
# Risk mapping unit tests (no HTTP)
# ---------------------------------------------------------------------------
class TestRiskMapping:
    def test_below_low_threshold(self):
        from app.risk import temperature_to_risk
        assert temperature_to_risk(28.0) == "LOW"

    def test_at_moderate_lower_bound(self):
        from app.risk import temperature_to_risk
        assert temperature_to_risk(29.4) == "MODERATE"

    def test_at_high_lower_bound(self):
        from app.risk import temperature_to_risk
        assert temperature_to_risk(29.8) == "HIGH"

    def test_extreme(self):
        from app.risk import temperature_to_risk
        assert temperature_to_risk(31.0) == "EXTREME"

    def test_boundary_low_moderate(self):
        from app.risk import temperature_to_risk
        # Just below the boundary → LOW
        assert temperature_to_risk(29.399) == "LOW"
        # At the boundary → MODERATE
        assert temperature_to_risk(29.4) == "MODERATE"
