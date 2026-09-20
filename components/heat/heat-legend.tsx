import React from "react"
import { cn } from "@/lib/utils"

interface HeatLegendProps {
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function HeatLegend({ orientation = "horizontal", className }: HeatLegendProps) {
  const items = [
    { label: "Low (<32°C)", colorClass: "bg-heat-low" },
    { label: "Moderate (32-35°C)", colorClass: "bg-heat-moderate" },
    { label: "High (35-38°C)", colorClass: "bg-heat-high" },
    { label: "Extreme (>38°C)", colorClass: "bg-heat-extreme" },
  ]

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn(
        "flex gap-3",
        orientation === "horizontal" ? "flex-wrap items-center justify-between" : "flex-col"
      )}>
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full shrink-0 shadow-xs", item.colorClass)} />
            <span className="text-[11px] font-medium text-foreground-secondary whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
