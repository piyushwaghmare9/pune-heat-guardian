"use client";

/**
 * components/ml/ml-prediction-panel.tsx
 * Dashboard panel showing ML-predicted hottest/coolest wards with delta vs measured.
 * Includes model health status indicator.
 */

import React, { useEffect, useState } from "react";
import { BrainCircuit, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWardPredictions } from "@/hooks/use-ward-predictions";
import { MlFallbackBanner } from "./ml-fallback-banner";
import { ModelBadge } from "./model-badge";
import { checkMlHealth, getModelInfo } from "@/services/api";
import type { MlHealthStatus, ModelInfo } from "@/types/ml";
import { useRegion } from "@/context/region-context";

export function MlPredictionPanel() {
  const { predictions, isLoading, isFallback, refresh } = useWardPredictions();
  const { setSelectedRegion } = useRegion();
  const [health, setHealth] = useState<MlHealthStatus | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    checkMlHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
    getModelInfo()
      .then(setModelInfo)
      .catch(() => setModelInfo(null));
  }, []);

  const sorted = [...predictions].sort(
    (a, b) => b.predicted_temp_c - a.predicted_temp_c
  );
  const hottest = sorted.slice(0, 3);
  const coolest = sorted.slice(-3).reverse();

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <BrainCircuit className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <CardTitle className="text-sm font-bold">ML Predictions</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {health && (
              <div
                className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  health.model_loaded
                    ? "text-green-600 bg-green-500/10 border-green-500/20"
                    : "text-amber-600 bg-amber-500/10 border-amber-500/20"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${health.model_loaded ? "bg-green-500 animate-pulse" : "bg-amber-500"}`}
                />
                {health.model_loaded ? "Model Ready" : "Degraded"}
              </div>
            )}
            <button
              onClick={refresh}
              className="p-1 rounded-md hover:bg-surface-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh predictions"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-3 flex flex-col gap-3">
        <MlFallbackBanner visible={isFallback} />

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-surface-muted animate-pulse" />
            ))}
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs text-amber-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Start the ML service at <code className="font-mono">localhost:8000</code> to see predictions.</span>
          </div>
        ) : (
          <>
            {/* Predicted Hottest */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <TrendingUp className="h-3 w-3 text-heat-extreme" />
                Predicted Hottest
              </div>
              <div className="space-y-1.5">
                {hottest.map((w) => (
                  <button
                    key={w.ward_id}
                    type="button"
                    onClick={() => setSelectedRegion(w.ward_id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border/60 hover:border-heat-high/40 hover:bg-heat-high/5 transition-all text-left"
                  >
                    <span className="text-sm font-medium text-foreground truncate">{w.ward_name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {w.measured_temp_c.toFixed(1)}°C
                      </span>
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {w.predicted_temp_c.toFixed(1)}°C
                      </span>
                      <ModelBadge source={w.source} modelVersion={w.model_version} modelInfo={modelInfo} compact />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Predicted Coolest */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <TrendingDown className="h-3 w-3 text-heat-low" />
                Predicted Coolest
              </div>
              <div className="space-y-1.5">
                {coolest.map((w) => (
                  <button
                    key={w.ward_id}
                    type="button"
                    onClick={() => setSelectedRegion(w.ward_id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border/60 hover:border-heat-low/40 hover:bg-heat-low/5 transition-all text-left"
                  >
                    <span className="text-sm font-medium text-foreground truncate">{w.ward_name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {w.measured_temp_c.toFixed(1)}°C
                      </span>
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {w.predicted_temp_c.toFixed(1)}°C
                      </span>
                      <ModelBadge source={w.source} modelVersion={w.model_version} modelInfo={modelInfo} compact />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground border-t border-border/60 pt-2 mt-1">
              <span>Left = Measured °C</span>
              <span className="font-bold text-foreground">Right = Predicted °C</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
