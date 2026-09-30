"use client";

/**
 * components/ml/ward-ml-card.tsx
 * Displays ML prediction vs measured temperature comparison for a single ward.
 * Used on the Dashboard in the "Zone Intelligence" section.
 */

import React from "react";
import { TrendingUp, TrendingDown, Minus, BrainCircuit } from "lucide-react";
import type { WardPredictionSummary } from "@/types/ml";
import { ModelBadge } from "./model-badge";

interface WardMlCardProps {
  prediction: WardPredictionSummary;
  onClick?: (wardId: string) => void;
  isSelected?: boolean;
}

export function WardMlCard({ prediction, onClick, isSelected }: WardMlCardProps) {
  const { delta_c, measured_temp_c, predicted_temp_c, predicted_risk, ward_name } = prediction;

  const deltaAbs = Math.abs(delta_c);
  const deltaLabel =
    delta_c > 0.05
      ? `+${deltaAbs.toFixed(2)}°C hotter than measured`
      : delta_c < -0.05
      ? `${deltaAbs.toFixed(2)}°C cooler than measured`
      : "matches measured temp";

  const deltaColor =
    delta_c > 0.05
      ? "text-heat-extreme"
      : delta_c < -0.05
      ? "text-heat-low"
      : "text-muted-foreground";

  const DeltaIcon =
    delta_c > 0.05 ? TrendingUp : delta_c < -0.05 ? TrendingDown : Minus;

  return (
    <button
      type="button"
      onClick={() => onClick?.(prediction.ward_id)}
      className={`
        w-full text-left p-3 rounded-xl border transition-all duration-150
        hover:border-primary/40 hover:bg-primary/5
        ${isSelected ? "border-primary/40 bg-primary/5" : "border-border/60 bg-surface-elevated"}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-semibold text-foreground truncate">{ward_name}</span>
        <ModelBadge source="model" modelVersion={prediction.model_version} compact />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-1.5">
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">Measured</div>
          <div className="text-base font-bold text-foreground">{measured_temp_c.toFixed(1)}°C</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
            <BrainCircuit className="h-2.5 w-2.5" /> Predicted
          </div>
          <div className="text-base font-bold text-foreground">{predicted_temp_c.toFixed(1)}°C</div>
        </div>
      </div>

      <div className={`flex items-center gap-1 text-[11px] font-medium ${deltaColor}`}>
        <DeltaIcon className="h-3 w-3" />
        <span>{deltaLabel}</span>
      </div>
    </button>
  );
}
