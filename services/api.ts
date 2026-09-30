/**
 * services/api.ts
 * Core API client shared across all services.
 *
 * Two base URLs:
 *   BASE_URL     – Next.js API routes  (/api/v1)
 *   ML_BASE_URL  – FastAPI ML service  (http://localhost:8000/api/v1)
 *
 * ML functions fall back to dataset/mock values gracefully when the backend
 * is unavailable or NEXT_PUBLIC_USE_ML_MODEL is "false".
 */

import type {
  HeatPrediction,
  WardPredictionSummary,
  InterventionResult,
  ModelInfo,
  MlHealthStatus,
  WardFeatureInput,
  InterventionParams,
  RiskLevel,
} from "@/types/ml";

// -----------------------------------------------------------------------
// Base URLs (from env with safe defaults)
// -----------------------------------------------------------------------
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const ML_BASE_URL =
  process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000/api/v1";

const USE_ML_MODEL =
  process.env.NEXT_PUBLIC_USE_ML_MODEL?.toLowerCase() !== "false";

// -----------------------------------------------------------------------
// Generic fetch helpers
// -----------------------------------------------------------------------

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/** Fetch with timeout (ms) and one automatic retry on network error. */
async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const { timeout = 8000, ...fetchOptions } = options;
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), timeout);

  const attemptFetch = async (): Promise<Response> => {
    return fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });
  };

  try {
    let response: Response;
    try {
      response = await attemptFetch();
    } catch (firstErr) {
      // One retry on network errors (not on abort)
      if ((firstErr as Error).name === "AbortError") throw firstErr;
      response = await attemptFetch();
    }

    clearTimeout(tid);

    if (!response.ok) {
      throw new Error(`ML API error: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  } catch (err) {
    clearTimeout(tid);
    throw err;
  }
}

// -----------------------------------------------------------------------
// ML API — health
// -----------------------------------------------------------------------

/** Check if the ML backend is alive and the model is loaded. */
export async function checkMlHealth(): Promise<MlHealthStatus> {
  return fetchWithTimeout<MlHealthStatus>(`${ML_BASE_URL}/health`);
}

// -----------------------------------------------------------------------
// ML API — model info
// -----------------------------------------------------------------------

/** Get model version, feature list, and training metrics. */
export async function getModelInfo(): Promise<ModelInfo> {
  return fetchWithTimeout<ModelInfo>(`${ML_BASE_URL}/model/info`);
}

// -----------------------------------------------------------------------
// ML API — single ward prediction
// -----------------------------------------------------------------------

export interface PredictHeatResponse {
  prediction: HeatPrediction;
  latency_ms: number;
}

/**
 * Predict heat for a single ward.
 * Falls back to a dataset-derived HeatPrediction if USE_ML_MODEL is false
 * or the ML service is unavailable.
 */
export async function predictHeat(
  ward: WardFeatureInput,
  topNFactors: number = 5,
  fallback?: Partial<HeatPrediction>
): Promise<HeatPrediction> {
  if (!USE_ML_MODEL) {
    return buildDatasetFallback(ward, fallback);
  }

  try {
    const res = await fetchWithTimeout<PredictHeatResponse>(
      `${ML_BASE_URL}/predict/heat`,
      {
        method: "POST",
        body: JSON.stringify({ ward, top_n_factors: topNFactors }),
      }
    );
    return res.prediction;
  } catch {
    return buildDatasetFallback(ward, fallback);
  }
}

// -----------------------------------------------------------------------
// ML API — batch prediction
// -----------------------------------------------------------------------

export interface PredictHeatBatchResponse {
  predictions: HeatPrediction[];
  count: number;
  latency_ms: number;
}

/**
 * Predict heat for multiple wards in a single vectorised call.
 * Falls back to dataset values per-ward if the ML service is down.
 */
export async function predictHeatBatch(
  wards: WardFeatureInput[],
  topNFactors: number = 3
): Promise<HeatPrediction[]> {
  if (!USE_ML_MODEL || wards.length === 0) {
    return wards.map((w) => buildDatasetFallback(w));
  }

  try {
    const res = await fetchWithTimeout<PredictHeatBatchResponse>(
      `${ML_BASE_URL}/predict/heat/batch`,
      {
        method: "POST",
        body: JSON.stringify({ wards, top_n_factors: topNFactors }),
      }
    );
    return res.predictions;
  } catch {
    return wards.map((w) => buildDatasetFallback(w));
  }
}

// -----------------------------------------------------------------------
// ML API — all wards prediction (for the map)
// -----------------------------------------------------------------------

export interface WardPredictionsResponse {
  wards: WardPredictionSummary[];
  count: number;
  latency_ms: number;
}

/**
 * Fetch model predictions for all 10 Pune wards in one call.
 * Returns an empty array (with graceful fallback) on error.
 */
export async function getWardPredictions(): Promise<WardPredictionSummary[]> {
  if (!USE_ML_MODEL) return [];

  try {
    const res = await fetchWithTimeout<WardPredictionsResponse>(
      `${ML_BASE_URL}/wards/predictions`
    );
    return res.wards;
  } catch {
    return [];
  }
}

// -----------------------------------------------------------------------
// ML API — intervention simulation
// -----------------------------------------------------------------------

/**
 * Simulate the effect of adding trees / increasing canopy on a ward.
 * Returns null (and does NOT throw) if the ML service is unavailable.
 */
export async function simulateIntervention(
  baselineWard: WardFeatureInput,
  intervention: InterventionParams,
  topNFactors: number = 5
): Promise<InterventionResult | null> {
  if (!USE_ML_MODEL) return null;

  try {
    return await fetchWithTimeout<InterventionResult>(
      `${ML_BASE_URL}/simulate/intervention`,
      {
        method: "POST",
        body: JSON.stringify({
          baseline_ward: baselineWard,
          intervention,
          top_n_factors: topNFactors,
        }),
      }
    );
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------
// Fallback builder
// -----------------------------------------------------------------------

function tempToRisk(temp: number): RiskLevel {
  if (temp < 29.4) return "LOW";
  if (temp < 29.8) return "MODERATE";
  if (temp < 30.2) return "HIGH";
  return "EXTREME";
}

function buildDatasetFallback(
  ward: WardFeatureInput,
  override?: Partial<HeatPrediction>
): HeatPrediction {
  // Use measured temp from features if available, otherwise a city-mean estimate
  const measuredTemp =
    typeof (ward as unknown as Record<string, unknown>).avg_temperature_c === "number"
      ? ((ward as unknown as Record<string, unknown>).avg_temperature_c as number)
      : 29.7;

  return {
    ward_id: ward.ward_id,
    ward_name: ward.ward_name,
    predicted_temp_c: measuredTemp,
    confidence_lower: measuredTemp - 0.8,
    confidence_upper: measuredTemp + 0.8,
    confidence_label: "dataset",
    risk_level: tempToRisk(measuredTemp),
    top_factors: [],
    source: "dataset",
    model_version: "N/A",
    ...override,
  };
}
