"""
export_model_metadata.py
Reads an already-trained XGBoost model and writes/updates model_metadata.json.
Useful when you save a model externally and just need the metadata file regenerated.

Usage:
    cd heatguard-ai/ml-model
    python scripts/export_model_metadata.py --model models/heatguard_xgb.json
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import xgboost as xgb
from app.features import FEATURE_NAMES


def export_metadata(model_path: Path, out_path: Path) -> None:
    print(f"Loading model from {model_path}...")
    model = xgb.XGBRegressor()
    model.load_model(str(model_path))

    booster_features = model.get_booster().feature_names or FEATURE_NAMES
    n_estimators = model.get_booster().num_boosted_rounds()

    metadata = {
        "version": "1.0.0",
        "task": "regression",
        "target": "Avg_Temperature_C",
        "feature_names": list(booster_features),
        "n_features": len(booster_features),
        "n_estimators": n_estimators,
        "metrics": {
            "rmse": None,
            "mae": None,
            "r2": None,
        },
        "training_data_source": "Pune_Heat_Guardian.json",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "notes": "Metadata exported from existing model artifact.",
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata written to {out_path}")
    print(f"Features ({len(booster_features)}): {booster_features[:5]}...")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export XGBoost model metadata.")
    parser.add_argument(
        "--model",
        type=Path,
        default=Path("models/heatguard_xgb.json"),
        help="Path to model file (.json or .ubj)",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=Path("models/model_metadata.json"),
        help="Output path for metadata JSON",
    )
    args = parser.parse_args()
    export_metadata(args.model, args.out)
