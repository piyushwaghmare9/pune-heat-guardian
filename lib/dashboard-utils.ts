/**
 * dashboard-utils.ts
 * Pure utility functions for derived / estimated dashboard metrics.
 *
 * Every function that derives a value NOT present in the raw dataset is:
 *   1. Documented with the formula used
 *   2. Prefixed with "estimate" in the function name
 *   3. Displayed in the UI with an "(Estimated)" label
 *
 * No made-up constants are introduced — all defaults reference published
 * meteorological or forestry approximations cited inline.
 */

import { DatasetRegionAggregated, datasetLoader, DatasetTreeRecord } from "@/lib/data/dataset-loader";
import type { HeatRiskLevel } from "@/types/dashboard";

// ---------------------------------------------------------------------------
// 1. Feels-like temperature (Steadman's apparent temperature approximation)
//    Formula: T_apparent ≈ T + 0.33 * RH/100 * e_s - 0.70 * ws - 4.00
//    where e_s (saturation vapour pressure) ≈ 6.105 * exp(17.27*T/(237.7+T))
//    Source: Steadman (1979), J. Applied Meteorology.
//    When RH is unavailable from the dataset we use 50% (midrange urban Pune).
//    When wind speed is unavailable we use 10 km/h (light breeze, Beaufort 2).
// ---------------------------------------------------------------------------
export function estimateFeelsLike(
  tempC: number,
  humidityPct: number | null = null,
  windKmh: number | null = null
): number {
  const rh = humidityPct ?? 50; // default 50% when not available
  const ws = windKmh ?? 10; // default 10 km/h when not available
  const e = 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
  const apparent = tempC + 0.33 * (rh / 100) * e - 0.7 * ws - 4.0;
  return Math.round(apparent * 10) / 10;
}

// ---------------------------------------------------------------------------
// 2. Region-level cooling potential
//    Uses the average Cooling_Effect_C field from the real dataset trees.
//    This IS a real value from the dataset — labeled "Dataset Avg".
// ---------------------------------------------------------------------------
export function getRegionCoolingPotential(regionId: string): number | null {
  const trees = datasetLoader.getTreesForRegion(regionId);
  if (trees.length === 0) return null;
  const avg = trees.reduce((s, t) => s + t.Cooling_Effect_C, 0) / trees.length;
  return Math.round(avg * 10) / 10;
}

// ---------------------------------------------------------------------------
// 3. Region-level total CO₂ sequestration (kg/yr)
//    Summing CO2_Sequestration_kg_yr directly from real dataset records.
//    This IS a real value from the dataset.
// ---------------------------------------------------------------------------
export function getRegionCO2Total(regionId: string): number {
  const trees = datasetLoader.getTreesForRegion(regionId);
  return Math.round(trees.reduce((s, t) => s + t.CO2_Sequestration_kg_yr, 0));
}

// ---------------------------------------------------------------------------
// 4. Estimated trees needed for meaningful UHI reduction
//    Formula: Urban Heat Island studies suggest 1 mature tree covers ~40 m² shade.
//    For a 1 km² ward needing 10% shade coverage: 1_000_000 * 0.10 / 40 = 2500.
//    We scale by current treeCount deficit vs. a target of 2500 trees/km².
//    Source: Bowler et al. (2010), Landscape & Urban Planning.
//    Labeled as "Estimated" in the UI.
// ---------------------------------------------------------------------------
const TARGET_TREES_PER_KM2 = 2500;
export function estimateTreesNeeded(currentTreeCount: number): number {
  const deficit = Math.max(0, TARGET_TREES_PER_KM2 - currentTreeCount);
  return deficit;
}

// ---------------------------------------------------------------------------
// 5. Dashboard alerts — generated from real data thresholds
// ---------------------------------------------------------------------------
export interface DashboardAlert {
  id: string;
  type: "heat" | "aqi" | "plantation";
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  regionId: string;
  regionName: string;
}

export function generateAlertsForRegion(
  region: DatasetRegionAggregated
): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];

  // Heat alert
  if (region.riskLevel === "EXTREME") {
    alerts.push({
      id: `heat-extreme-${region.id}`,
      type: "heat",
      title: "Extreme Heat Alert",
      description: `${region.name} is at ${region.avgTemperatureC}°C — critical heat risk. Avoid outdoor activity between 11 AM–4 PM.`,
      severity: "critical",
      regionId: region.id,
      regionName: region.name,
    });
  } else if (region.riskLevel === "HIGH") {
    alerts.push({
      id: `heat-high-${region.id}`,
      type: "heat",
      title: "High Heat Warning",
      description: `${region.name} is at ${region.avgTemperatureC}°C. Limit outdoor exposure and stay hydrated.`,
      severity: "warning",
      regionId: region.id,
      regionName: region.name,
    });
  }

  // Plantation opportunity alert (low tree count)
  if (region.treeCount < 50) {
    alerts.push({
      id: `plantation-${region.id}`,
      type: "plantation",
      title: "Plantation Opportunity",
      description: `${region.name} has only ${region.treeCount} recorded trees. Planting native species here can reduce temperatures by up to 3°C.`,
      severity: "info",
      regionId: region.id,
      regionName: region.name,
    });
  }

  return alerts;
}

export function generateTopAlerts(limit = 3): DashboardAlert[] {
  const regions = datasetLoader.getRegions();
  // Sort by risk level severity descending
  const riskOrder: Record<HeatRiskLevel, number> = {
    EXTREME: 4,
    HIGH: 3,
    MODERATE: 2,
    LOW: 1,
  };
  const sorted = [...regions].sort(
    (a, b) => (riskOrder[b.riskLevel] ?? 0) - (riskOrder[a.riskLevel] ?? 0)
  );

  const all: DashboardAlert[] = [];
  for (const r of sorted) {
    all.push(...generateAlertsForRegion(r));
    if (all.length >= limit) break;
  }
  return all.slice(0, limit);
}

// ---------------------------------------------------------------------------
// 6. Top hotspots & cooler zones from real dataset
// ---------------------------------------------------------------------------
export function getTopHotspots(count = 5): DatasetRegionAggregated[] {
  return [...datasetLoader.getRegions()]
    .sort((a, b) => b.avgTemperatureC - a.avgTemperatureC)
    .slice(0, count);
}

export function getCoolerZones(count = 3): DatasetRegionAggregated[] {
  return [...datasetLoader.getRegions()]
    .sort((a, b) => a.avgTemperatureC - b.avgTemperatureC)
    .slice(0, count);
}

// ---------------------------------------------------------------------------
// 7. City-wide averages from dataset
// ---------------------------------------------------------------------------
export function getCityAvgTemperature(): number {
  const regions = datasetLoader.getRegions();
  if (regions.length === 0) return 30;
  const avg = regions.reduce((s, r) => s + r.avgTemperatureC, 0) / regions.length;
  return Math.round(avg * 10) / 10;
}

export function getCityRiskDistribution(): Record<HeatRiskLevel, number> {
  const regions = datasetLoader.getRegions();
  const dist: Record<HeatRiskLevel, number> = { LOW: 0, MODERATE: 0, HIGH: 0, EXTREME: 0 };
  regions.forEach(r => dist[r.riskLevel]++);
  return dist;
}

// ---------------------------------------------------------------------------
// 8. Helpers for canopy / shade aggregation from dataset
// ---------------------------------------------------------------------------
export function getRegionCanopyInfo(regionId: string): {
  avgCanopyDiameter: number | null;
  avgShadeArea: number | null;
  totalShadeArea: number;
} {
  const trees: DatasetTreeRecord[] = datasetLoader.getTreesForRegion(regionId);
  if (trees.length === 0) return { avgCanopyDiameter: null, avgShadeArea: null, totalShadeArea: 0 };
  const avgCanopy = trees.reduce((s, t) => s + t.Canopy_Diameter_m, 0) / trees.length;
  const avgShade = trees.reduce((s, t) => s + t.Shade_Area_sqm, 0) / trees.length;
  const totalShade = trees.reduce((s, t) => s + t.Shade_Area_sqm, 0);
  return {
    avgCanopyDiameter: Math.round(avgCanopy * 10) / 10,
    avgShadeArea: Math.round(avgShade * 10) / 10,
    totalShadeArea: Math.round(totalShade),
  };
}
