import React from "react"
import { Badge } from "@/components/ui/badge"

export type HeatRiskLevel = "LOW" | "MODERATE" | "HIGH" | "EXTREME" | string

export function HeatRiskBadge({ level }: { level: HeatRiskLevel }) {
  const normalized = (level || "LOW").toUpperCase() as "LOW" | "MODERATE" | "HIGH" | "EXTREME"

  const levelMap: Record<"LOW" | "MODERATE" | "HIGH" | "EXTREME", { variant: "heat-low" | "heat-moderate" | "heat-high" | "heat-extreme", label: string }> = {
    LOW: { variant: "heat-low", label: "Low Risk" },
    MODERATE: { variant: "heat-moderate", label: "Moderate" },
    HIGH: { variant: "heat-high", label: "High Risk" },
    EXTREME: { variant: "heat-extreme", label: "Critical Risk" }
  }

  const config = levelMap[normalized] || levelMap.LOW

  return (
    <Badge variant={config.variant} className="font-semibold text-[11px] px-2.5 py-0.5">
      {config.label}
    </Badge>
  )
}
