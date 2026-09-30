"use client";

/**
 * components/ml/intervention-panel.tsx
 * Shows projected cooling (°C) and risk level change when a plantation plan is applied.
 * Calls /simulate/intervention on the ML backend.
 */

import React, { useState } from "react";
import { Sparkles, Loader2, TrendingDown, TrendingUp, Minus, BrainCircuit, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelBadge } from "./model-badge";
import { simulateIntervention } from "@/services/api";
import type { InterventionResult, WardFeatureInput } from "@/types/ml";
import { datasetLoader } from "@/lib/data/dataset-loader";

interface InterventionPanelProps {
  regionId: string;
  treesToPlant?: number;
}

function mapRegionToWardFeature(regionId: string, treeCount: number): WardFeatureInput {
  const region = datasetLoader.getRegionById(regionId);
  const trees = datasetLoader.getTreesForRegion(regionId);

  if (!region || trees.length === 0) {
    return { ward_id: regionId, ward_name: regionId, tree_count: treeCount };
  }

  const avg = (field: string): number => {
    const vals = trees.map((t) => (t as unknown as Record<string, unknown>)[field]).filter((v) => typeof v === "number") as number[];
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };

  return {
    ward_id: regionId,
    ward_name: region.name,
    latitude: region.center.lat,
    longitude: region.center.lng,
    tree_count: trees.length,
    cooling_score_35: avg("Cooling_Score_35"),
    co2_score_25: avg("CO2_Score_25"),
    total_score: avg("Total_Score"),
    height_m: avg("Height_m"),
    canopy_diameter_m: avg("Canopy_Diameter_m"),
    region_heat_island_severity: trees[0]?.Region_Heat_Island_Severity as string | undefined,
    region_traffic_density: trees[0]?.Region_Traffic_Density as string | undefined,
    uhi_reduction_potential: trees[0]?.UHI_Reduction_Potential as string | undefined,
    drought_tolerance: trees[0]?.Drought_Tolerance as string | undefined,
    water_requirement: trees[0]?.Water_Requirement as string | undefined,
  };
}

const RISK_COLORS: Record<string, string> = {
  LOW: "text-heat-low",
  MODERATE: "text-heat-moderate",
  HIGH: "text-heat-high",
  EXTREME: "text-heat-extreme",
};

export function InterventionPanel({ regionId, treesToPlant = 50 }: InterventionPanelProps) {
  const [result, setResult] = useState<InterventionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localTreeCount, setLocalTreeCount] = useState(treesToPlant);

  const handleSimulate = async () => {
    if (!regionId) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const wardFeature = mapRegionToWardFeature(regionId, localTreeCount);
      const res = await simulateIntervention(
        wardFeature,
        {
          additional_trees: localTreeCount,
          canopy_increase_pct: Math.min(localTreeCount / 5, 30),
          cooling_score_delta: Math.min(localTreeCount / 10, 10),
        },
        5
      );

      if (!res) {
        setError("ML service unavailable. Start the FastAPI server at localhost:8000.");
      } else {
        setResult(res);
      }
    } catch {
      setError("Simulation request failed. Check that the ML service is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const delta = result?.cooling_delta_c ?? 0;
  const DeltaIcon = delta < -0.01 ? TrendingDown : delta > 0.01 ? TrendingUp : Minus;
  const deltaColor = delta < -0.01 ? "text-heat-low" : delta > 0.01 ? "text-heat-extreme" : "text-muted-foreground";

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-4 w-4 text-violet-500" />
        <h4 className="text-sm font-bold text-foreground">ML Intervention Simulator</h4>
        <ModelBadge source="model" compact />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground whitespace-nowrap">Trees to plant:</label>
          <input
            type="number"
            min={1}
            max={1000}
            value={localTreeCount}
            onChange={(e) => setLocalTreeCount(Math.max(1, Number(e.target.value)))}
            className="w-20 h-8 px-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <Button
          size="sm"
          onClick={handleSimulate}
          disabled={isLoading || !regionId}
          className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs shrink-0"
        >
          {isLoading ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Simulating...</>
          ) : (
            <><Sparkles className="h-3.5 w-3.5" /> Simulate</>
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="p-3 rounded-lg bg-surface border border-border/60">
            <div className="text-[10px] text-muted-foreground mb-1">Baseline</div>
            <div className="text-lg font-bold text-foreground">{result.baseline_temp_c.toFixed(2)}°C</div>
            <div className={`text-[11px] font-semibold ${RISK_COLORS[result.baseline_risk]}`}>
              {result.baseline_risk}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-surface border border-border/60">
            <div className="text-[10px] text-muted-foreground mb-1">After Planting</div>
            <div className="text-lg font-bold text-foreground">{result.predicted_temp_c.toFixed(2)}°C</div>
            <div className={`text-[11px] font-semibold ${RISK_COLORS[result.predicted_risk]}`}>
              {result.predicted_risk}
              {result.risk_changed && <span className="ml-1 text-heat-low">(changed)</span>}
            </div>
          </div>

          {/* Delta badge */}
          <div className={`col-span-2 flex items-center justify-center gap-1.5 text-sm font-bold ${deltaColor}`}>
            <DeltaIcon className="h-4 w-4" />
            {delta < 0
              ? `${Math.abs(delta).toFixed(3)}°C projected cooling`
              : delta > 0
              ? `+${delta.toFixed(3)}°C (model suggests heating — check feature skew)`
              : "No change predicted"}
          </div>
        </div>
      )}
    </div>
  );
}
