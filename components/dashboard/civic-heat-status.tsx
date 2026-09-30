"use client"

import React, { useMemo } from "react"
import { Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { HeatRiskBadge } from "@/components/heat/heat-risk-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { datasetLoader } from "@/lib/data/dataset-loader"
import {
  estimateFeelsLike,
  getCityAvgTemperature,
} from "@/lib/dashboard-utils"
import { cn } from "@/lib/utils"
import type { HeatRiskLevel } from "@/types/dashboard"

interface CivicHeatStatusProps {
  selectedRegionId: string | null
}

const RISK_STEPS: { level: HeatRiskLevel; label: string }[] = [
  { level: "LOW", label: "Low" },
  { level: "MODERATE", label: "Moderate" },
  { level: "HIGH", label: "High" },
  { level: "EXTREME", label: "Extreme" },
]

const RISK_COLORS: Record<HeatRiskLevel, string> = {
  LOW: "text-heat-low border-heat-low bg-heat-low/10",
  MODERATE: "text-heat-moderate border-heat-moderate bg-heat-moderate/10",
  HIGH: "text-heat-high border-heat-high bg-heat-high/10",
  EXTREME: "text-heat-extreme border-heat-extreme bg-heat-extreme/10",
}

const RISK_TEMP_COLOR: Record<HeatRiskLevel, string> = {
  LOW: "text-heat-low",
  MODERATE: "text-heat-moderate",
  HIGH: "text-heat-high",
  EXTREME: "text-heat-extreme",
}

export function CivicHeatStatus({ selectedRegionId }: CivicHeatStatusProps) {
  const regions = useMemo(() => datasetLoader.getRegions(), [])

  const regionData = useMemo(() => {
    if (selectedRegionId) {
      return regions.find((r) => r.id === selectedRegionId) ?? regions[0]
    }
    // Default to hottest region
    return [...regions].sort((a, b) => b.avgTemperatureC - a.avgTemperatureC)[0]
  }, [selectedRegionId, regions])

  if (!regionData) {
    return (
      <Card>
        <CardContent className="p-5 space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-16 w-32" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    )
  }

  const feelsLike = estimateFeelsLike(regionData.avgTemperatureC)
  const currentRisk = regionData.riskLevel
  const cityAvg = getCityAvgTemperature()

  // Time string for "last updated" (we use dataset which is static, so we show today)
  const now = new Date()
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Risk color accent strip */}
      <div
        className={cn(
          "h-1.5 w-full",
          currentRisk === "EXTREME" && "bg-heat-extreme",
          currentRisk === "HIGH" && "bg-heat-high",
          currentRisk === "MODERATE" && "bg-heat-moderate",
          currentRisk === "LOW" && "bg-heat-low"
        )}
      />

      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-overline mb-1">Current Heat Status</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <h2 className="text-h3 font-bold text-foreground leading-tight">
                  {regionData.name}
                </h2>
              </div>
            </div>
            <HeatRiskBadge level={currentRisk} />
          </div>

          {/* Big temperature + feels-like */}
          <div className="flex items-end gap-6">
            <div>
              <div
                className={cn(
                  "text-6xl sm:text-7xl font-black tracking-tighter leading-none",
                  RISK_TEMP_COLOR[currentRisk]
                )}
              >
                {regionData.avgTemperatureC}°
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">
                Dataset Avg Temperature
              </div>
            </div>
            <div className="pb-1.5 space-y-1">
              <div className="text-sm text-muted-foreground">
                Feels like{" "}
                <span className="font-semibold text-foreground">
                  {feelsLike}°C
                </span>{" "}
                <span className="text-[10px] text-muted-foreground/70">
                  (Estimated)
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                City avg:{" "}
                <span className="font-medium text-foreground">
                  {cityAvg}°C
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Dataset · Updated {timeStr}</span>
              </div>
            </div>
          </div>

          {/* 4-step risk indicator */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Heat Risk Level
            </p>
            <div className="flex items-center gap-1.5">
              {RISK_STEPS.map((step, idx) => {
                const isActive = step.level === currentRisk
                const isPast =
                  RISK_STEPS.findIndex((s) => s.level === currentRisk) > idx

                return (
                  <React.Fragment key={step.level}>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={cn(
                          "h-2 w-full rounded-full transition-all duration-300",
                          isActive
                            ? RISK_COLORS[step.level].split(" ")[0].replace("text-", "bg-")
                            : isPast
                            ? "bg-border-strong"
                            : "bg-border"
                        )}
                        style={{
                          backgroundColor: isActive
                            ? `var(--color-heat-${step.level.toLowerCase()})`
                            : isPast
                            ? "var(--color-border-strong)"
                            : "var(--color-border)",
                        }}
                      />
                      <span
                        className={cn(
                          "text-[10px] font-medium whitespace-nowrap",
                          isActive
                            ? RISK_COLORS[step.level].split(" ")[0]
                            : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {idx < RISK_STEPS.length - 1 && (
                      <div className="h-[2px] w-2 shrink-0 bg-border rounded-full" />
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
