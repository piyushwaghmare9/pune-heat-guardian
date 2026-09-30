"use client";

/**
 * MlFallbackBanner
 * Unobtrusive banner displayed when the ML backend is unavailable
 * and the UI is running in dataset-fallback mode.
 */

import React, { useState } from "react";
import { WifiOff, X } from "lucide-react";

interface MlFallbackBannerProps {
  visible: boolean;
}

export function MlFallbackBanner({ visible }: MlFallbackBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!visible || dismissed) return null;

  return (
    <div className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
      <div className="flex items-center gap-2">
        <WifiOff className="h-3.5 w-3.5 shrink-0" />
        <span>
          ML backend offline — showing{" "}
          <span className="font-bold">measured dataset</span> values.
          Start the FastAPI server at{" "}
          <code className="font-mono text-[10px] bg-amber-500/15 px-1 py-0.5 rounded">
            localhost:8000
          </code>{" "}
          to enable predictions.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
