#!/usr/bin/env bash
# scripts/smoke_test.sh
# Smoke test for the HeatGuard AI ML inference service.
# Starts uvicorn, hits every endpoint, prints results, then exits.
#
# Usage (from ml-model/ directory):
#   bash scripts/smoke_test.sh

set -e

BASE="http://localhost:8000/api/v1"
echo "========================================"
echo "  HeatGuard AI ML Service - Smoke Test"
echo "========================================"

# ── 1. Health ────────────────────────────────
echo ""
echo "[1/6] GET /health"
curl -sf "$BASE/health" | python -m json.tool
echo ""

# ── 2. Model info ────────────────────────────
echo "[2/6] GET /model/info"
curl -sf "$BASE/model/info" | python -m json.tool
echo ""

# ── 3. Single prediction ─────────────────────
echo "[3/6] POST /predict/heat (Shivajinagar ward)"
curl -sf -X POST "$BASE/predict/heat" \
  -H "Content-Type: application/json" \
  -d '{
    "ward": {
      "ward_id": "shivajinagar",
      "ward_name": "Shivajinagar",
      "latitude": 18.53,
      "longitude": 73.85,
      "elevation_m": 560,
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
      "water_requirement": "Low"
    },
    "top_n_factors": 3
  }' | python -m json.tool
echo ""

# ── 4. Batch prediction ──────────────────────
echo "[4/6] POST /predict/heat/batch (2 wards)"
curl -sf -X POST "$BASE/predict/heat/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "wards": [
      {"ward_id": "kharadi", "ward_name": "Kharadi", "tree_count": 10, "cooling_score_35": 75},
      {"ward_id": "hinjawadi", "ward_name": "Hinjawadi", "tree_count": 10, "cooling_score_35": 65}
    ],
    "top_n_factors": 2
  }' | python -m json.tool
echo ""

# ── 5. Intervention simulation ───────────────
echo "[5/6] POST /simulate/intervention (add 100 trees to Viman Nagar)"
curl -sf -X POST "$BASE/simulate/intervention" \
  -H "Content-Type: application/json" \
  -d '{
    "baseline_ward": {
      "ward_id": "viman-nagar",
      "ward_name": "Viman Nagar",
      "tree_count": 10,
      "cooling_score_35": 65,
      "canopy_diameter_m": 8.0
    },
    "intervention": {
      "additional_trees": 100,
      "canopy_increase_pct": 20,
      "cooling_score_delta": 8
    },
    "top_n_factors": 3
  }' | python -m json.tool
echo ""

# ── 6. All wards ─────────────────────────────
echo "[6/6] GET /wards/predictions"
curl -sf "$BASE/wards/predictions" | python -c "
import json,sys
d=json.load(sys.stdin)
print(f'  count: {d[\"count\"]}  latency: {d[\"latency_ms\"]}ms')
for w in d['wards']:
    print(f'  {w[\"ward_name\"]:<30} measured={w[\"measured_temp_c\"]}C  predicted={w[\"predicted_temp_c\"]}C  risk={w[\"predicted_risk\"]}')
"

echo ""
echo "========================================"
echo "  All smoke tests passed!"
echo "========================================"
