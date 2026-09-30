# HeatGuard AI — ML Inference Service

XGBoost-based ward-level temperature prediction for the HeatGuard AI platform.

## Stack
- Python 3.12, FastAPI 0.115, Uvicorn
- XGBoost 3.4, scikit-learn 1.9, SHAP 0.52
- Pydantic v2, pydantic-settings
- Pytest 9.1

---

## Setup

```bash
cd heatguard-ai/ml-model
pip install -r requirements.txt
```

---

## Train the model

Aggregates `lib/data/dataset.json` (10 Pune wards × tree-level records) and trains an XGBoost regressor:

```bash
python scripts/train_model.py
# → models/heatguard_xgb.json
# → models/model_metadata.json
```

> With 10 ward-level rows, CV RMSE ≈ 0.56 °C, R² ≈ −2.5 (expected with tiny dataset). Serve as a live demo; retrain with more ward-level GIS data for production.

---

## Run the API

```bash
uvicorn app.main:app --reload --port 8000
```

Or from the Next.js root:

```bash
npm run dev:all   # starts Next.js + uvicorn together
```

---

## Environment variables

Copy `.env.example` → `.env` and adjust:

| Variable | Default | Description |
|---|---|---|
| `MODEL_PATH` | `models/heatguard_xgb.json` | Path to model file |
| `MODEL_METADATA_PATH` | `models/model_metadata.json` | Path to metadata |
| `ALLOWED_ORIGINS` | `["http://localhost:3000"]` | CORS origins |
| `RISK_THRESHOLD_LOW` | `29.4` | °C below = LOW |
| `RISK_THRESHOLD_MODERATE` | `29.8` | °C below = MODERATE |
| `RISK_THRESHOLD_HIGH` | `30.2` | °C below = HIGH |
| `DATASET_PATH` | `../lib/data/dataset.json` | Path to dataset (for `/wards/predictions`) |

---

## API Contract

All endpoints under `/api/v1`. Interactive docs at `http://localhost:8000/docs`.

### `GET /api/v1/health`
```json
{ "status": "ok", "model_loaded": true, "model_version": "1.0.0" }
```

### `GET /api/v1/model/info`
Returns version, feature list, metrics (RMSE/MAE/R²), training date.

### `POST /api/v1/predict/heat`
**Request:**
```json
{
  "ward": {
    "ward_id": "shivajinagar",
    "ward_name": "Shivajinagar",
    "latitude": 18.53,
    "longitude": 73.85,
    "tree_count": 10,
    "cooling_score_35": 100.0,
    "region_heat_island_severity": "High"
  },
  "top_n_factors": 3
}
```
**Response:**
```json
{
  "prediction": {
    "ward_id": "shivajinagar",
    "predicted_temp_c": 29.39,
    "confidence_lower": 28.59,
    "confidence_upper": 30.19,
    "confidence_label": "estimated",
    "risk_level": "LOW",
    "top_factors": [
      { "feature": "latitude", "display_name": "Latitude", "shap_value": -0.12, "direction": "reduces_heat" }
    ],
    "source": "model",
    "model_version": "1.0.0"
  },
  "latency_ms": 12.4
}
```

### `POST /api/v1/predict/heat/batch`
Same as above but with `"wards": [...]` array input.

### `POST /api/v1/simulate/intervention`
**Request:**
```json
{
  "baseline_ward": { "ward_id": "viman-nagar", "ward_name": "Viman Nagar", "tree_count": 10 },
  "intervention": { "additional_trees": 100, "canopy_increase_pct": 20, "cooling_score_delta": 8 }
}
```
**Response:**
```json
{
  "baseline_temp_c": 30.53,
  "predicted_temp_c": 30.49,
  "cooling_delta_c": -0.04,
  "baseline_risk": "EXTREME",
  "predicted_risk": "EXTREME",
  "risk_changed": false
}
```

### `GET /api/v1/wards/predictions`
All 10 Pune wards: measured temp, predicted temp, delta, risk levels.

---

## Feature → Dataset mapping

| Model Feature | Dataset Field | Aggregation |
|---|---|---|
| `height_m` | `Height_m` | mean per ward |
| `canopy_diameter_m` | `Canopy_Diameter_m` | mean |
| `cooling_score_35` | `Cooling_Score_35` | mean |
| `co2_score_25` | `CO2_Score_25` | mean |
| `leaf_area_index` | `Leaf_Area_Index` | mean |
| `transpiration_rate_l_day` | `Transpiration_Rate_L_day` | mean |
| `tree_count` | count of records per Region | count |
| `region_heat_island_severity_enc` | `Region_Heat_Island_Severity` | ordinal-encoded |
| … | … | … |

Full mapping in [`app/features.py`](app/features.py).

---

## Tests

```bash
python -m pytest tests/ -v
# 28 passed
```

---

## Swap in a retrained model

1. Place new model at `models/heatguard_xgb.json` (or update `MODEL_PATH` in `.env`).
2. Run `python scripts/export_model_metadata.py --model models/heatguard_xgb.json` to regenerate metadata.
3. Restart uvicorn — model is loaded at startup.

> If the new model has different feature names, the service will log a **training/serving skew warning** and adopt the model's feature names. Update `app/features.py` accordingly.

---

## Known Limitations / Open Questions

1. **Small training set**: Only 10 ward-aggregated rows → CV R² is negative (overfit to tiny data). For production, use tree-level rows (~100) or synthetic ward augmentation.
2. **Intervention test warning**: Adding trees sometimes shows +0.04 °C delta (noise from small dataset). This is a known small-sample artefact, not a logic bug.
3. **Confidence intervals**: Reported as `±0.8 °C` (config-driven estimate). For true intervals, train a quantile XGBoost (`objective="reg:quantileerror"`) at α=0.1 and α=0.9.
4. **File storage for evidence**: Not implemented in ML service scope.
