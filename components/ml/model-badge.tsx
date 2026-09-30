"use client";

/**
 * ModelBadge
 * Reusable badge that shows:
 *   - "Predicted by XGBoost v{version}" for model-sourced data
 *   - "Measured dataset" for dataset-sourced data
 * Includes an optional tooltip with RMSE/R² metrics.
 */

import React from "react";
import { BrainCircuit, Database, Info } from "lucide-react";
import type { DataSource, ModelInfo } from "@/types/ml";

interface ModelBadgeProps {
  source: DataSource;
  modelVersion?: string;
  modelInfo?: ModelInfo | null;
  /** If true, renders a compact pill without extra text */
  compact?: boolean;
}

export function ModelBadge({
  source,
  modelVersion,
  modelInfo,
  compact = false,
}: ModelBadgeProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const isModel = source === "model";
  const label = isModel
    ? `XGBoost${modelVersion && modelVersion !== "N/A" ? ` v${modelVersion}` : ""}`
    : "Measured Dataset";

  const tooltipContent = () => {
    if (!modelInfo) return null;
    const { metrics } = modelInfo;
    return (
      <div className="text-[11px] leading-relaxed space-y-1">
        {metrics.rmse != null && (
          <div>
            <span className="font-semibold text-foreground">RMSE:</span>{" "}
            <span className="text-muted-foreground">{metrics.rmse.toFixed(4)}°C</span>
          </div>
        )}
        {metrics.mae != null && (
          <div>
            <span className="font-semibold text-foreground">MAE:</span>{" "}
            <span className="text-muted-foreground">{metrics.mae.toFixed(4)}°C</span>
          </div>
        )}
        {metrics.r2 != null && (
          <div>
            <span className="font-semibold text-foreground">R²:</span>{" "}
            <span className="text-muted-foreground">{metrics.r2.toFixed(4)}</span>
          </div>
        )}
        {modelInfo.trained_at && (
          <div className="border-t border-border/60 pt-1 mt-1">
            <span className="text-muted-foreground">
              Trained: {new Date(modelInfo.trained_at).toLocaleDateString("en-IN")}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative inline-flex items-center">
      <div
        className={`
          inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold
          border transition-colors select-none
          ${isModel
            ? "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400"
            : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
          }
        `}
      >
        {isModel ? (
          <BrainCircuit className="h-3 w-3 shrink-0" />
        ) : (
          <Database className="h-3 w-3 shrink-0" />
        )}
        {!compact && <span>{label}</span>}

        {/* Info button for tooltip */}
        {isModel && modelInfo && (
          <button
            type="button"
            className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label="Model accuracy metrics"
          >
            <Info className="h-2.5 w-2.5" />
          </button>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && modelInfo && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 w-44 p-3 rounded-xl bg-surface border border-border shadow-xl"
          role="tooltip"
        >
          <p className="text-[10px] font-bold text-foreground mb-1.5 uppercase tracking-wider">
            Model Accuracy
          </p>
          {tooltipContent()}
        </div>
      )}
    </div>
  );
}
