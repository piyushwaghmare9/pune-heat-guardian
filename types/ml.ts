/**
 * types/ml.ts
 * Shared TypeScript types for the ML inference integration.
 * Used by services/api.ts, hooks/use-ward-predictions.ts, and UI components.
 */

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "EXTREME";
export type DataSource = "model" | "dataset";

export interface FactorContribution {
  feature: string;
  display_name: string;
  shap_value: number;
  feature_value: number;
  direction: "increases_heat" | "reduces_heat";
}

export interface HeatPrediction {
  ward_id: string;
  ward_name: string;
  predicted_temp_c: number;
  confidence_lower: number;
  confidence_upper: number;
  /** "estimated" when true prediction interval is not available */
  confidence_label: string;
  risk_level: RiskLevel;
  top_factors: FactorContribution[];
  source: DataSource;
  model_version: string;
  latency_ms?: number;
}

export interface WardPredictionSummary {
  ward_id: string;
  ward_name: string;
  measured_temp_c: number;
  predicted_temp_c: number;
  /** predicted − measured; positive = model predicts hotter than dataset */
  delta_c: number;
  measured_risk: RiskLevel;
  predicted_risk: RiskLevel;
  source: DataSource;
  model_version: string;
  latitude: number;
  longitude: number;
  tree_count: number;
}

export interface InterventionResult {
  ward_id: string;
  ward_name: string;
  baseline_temp_c: number;
  predicted_temp_c: number;
  /** negative = cooling achieved */
  cooling_delta_c: number;
  baseline_risk: RiskLevel;
  predicted_risk: RiskLevel;
  risk_changed: boolean;
  top_factors: FactorContribution[];
  latency_ms: number;
}

export interface ModelInfo {
  model_version: string;
  feature_names: string[];
  num_features: number;
  task: string;
  metrics: {
    rmse?: number | null;
    mae?: number | null;
    r2?: number | null;
    accuracy?: number | null;
    f1?: number | null;
  };
  trained_at?: string | null;
  training_data_source?: string | null;
  n_estimators?: number | null;
}

export interface MlHealthStatus {
  status: string;
  model_loaded: boolean;
  model_version: string;
}

/** Minimal ward feature payload for ML prediction requests */
export interface WardFeatureInput {
  ward_id: string;
  ward_name: string;
  latitude?: number;
  longitude?: number;
  elevation_m?: number;
  tree_count?: number;
  height_m?: number;
  canopy_diameter_m?: number;
  dbh_cm?: number;
  cooling_score_35?: number;
  co2_score_25?: number;
  total_score?: number;
  region_heat_island_severity?: string;
  region_traffic_density?: string;
  uhi_reduction_potential?: string;
  drought_tolerance?: string;
  water_requirement?: string;
}

export interface InterventionParams {
  additional_trees?: number;
  canopy_increase_pct?: number;
  cooling_score_delta?: number;
}
