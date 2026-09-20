import React from "react"
import { Thermometer } from "lucide-react"
import { cn } from "@/lib/utils"
import { HeatRiskLevel } from "./heat-risk-badge"

export function HeatRiskIndicator({ level, showLabel = true }: { level: HeatRiskLevel, showLabel?: boolean }) {
  const colorMap: Record<HeatRiskLevel, string> = {
    LOW: "text-heat-low",
    MODERATE: "text-heat-moderate",
    HIGH: "text-heat-high",
    EXTREME: "text-heat-extreme"
  }
  
  const labelMap: Record<HeatRiskLevel, string> = {
    LOW: "Low",
    MODERATE: "Moderate",
    HIGH: "High",
    EXTREME: "Extreme"
  }

  return (
    <div className="flex items-center gap-1.5">
      <Thermometer className={cn("h-4 w-4", colorMap[level])} />
      {showLabel && (
        <span className={cn("text-sm font-medium", colorMap[level])}>
          {labelMap[level]}
        </span>
      )}
    </div>
  )
}
