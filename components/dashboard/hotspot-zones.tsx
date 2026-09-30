"use client"

import React, { useMemo } from "react"
import { Flame, Leaf, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HeatRiskBadge } from "@/components/heat/heat-risk-badge"
import { Button } from "@/components/ui/button"
import { getTopHotspots, getCoolerZones } from "@/lib/dashboard-utils"
import { useRegion } from "@/context/region-context"
import { cn } from "@/lib/utils"
import Link from "next/link"

function ZoneRow({
  id,
  name,
  temp,
  riskLevel,
  treeCount,
  isSelected,
  onSelect,
}: {
  id: string
  name: string
  temp: number
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "EXTREME"
  treeCount: number
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150",
        "hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isSelected
          ? "bg-primary/8 border border-primary/20"
          : "border border-transparent hover:border-border/60"
      )}
      aria-pressed={isSelected}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={cn(
            "text-sm font-semibold truncate",
            isSelected ? "text-primary" : "text-foreground"
          )}
        >
          {name}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {treeCount} trees
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-bold text-foreground tabular-nums">
          {temp}°C
        </span>
        <HeatRiskBadge level={riskLevel} />
      </div>
    </button>
  )
}

export function HotspotZones() {
  const { selectedRegionId, setSelectedRegion } = useRegion()
  const hotspots = useMemo(() => getTopHotspots(5), [])
  const coolerZones = useMemo(() => getCoolerZones(3), [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Hotspots card */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-heat-extreme/10 border border-heat-extreme/20 flex items-center justify-center">
                <Flame className="h-3.5 w-3.5 text-heat-extreme" />
              </div>
              <CardTitle className="text-sm font-bold">Top Hotspots</CardTitle>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              Sorted by temp ↓
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-3 flex-1 flex flex-col gap-1">
          {hotspots.map((r) => (
            <ZoneRow
              key={r.id}
              id={r.id}
              name={r.name}
              temp={r.avgTemperatureC}
              riskLevel={r.riskLevel}
              treeCount={r.treeCount}
              isSelected={selectedRegionId === r.id}
              onSelect={setSelectedRegion}
            />
          ))}
          <Link href="/hotspots" className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-xs text-muted-foreground hover:text-foreground"
            >
              <span>View all zones</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Cooler zones card */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-heat-low/10 border border-heat-low/20 flex items-center justify-center">
                <Leaf className="h-3.5 w-3.5 text-heat-low" />
              </div>
              <CardTitle className="text-sm font-bold">Cooler Zones</CardTitle>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              Sorted by temp ↑
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-3 flex-1 flex flex-col gap-1">
          {coolerZones.map((r) => (
            <ZoneRow
              key={r.id}
              id={r.id}
              name={r.name}
              temp={r.avgTemperatureC}
              riskLevel={r.riskLevel}
              treeCount={r.treeCount}
              isSelected={selectedRegionId === r.id}
              onSelect={setSelectedRegion}
            />
          ))}
          <div className="mt-2 px-3 py-2 rounded-lg bg-heat-low/5 border border-heat-low/20">
            <p className="text-[11px] text-heat-low font-medium">
              💡 These areas demonstrate the cooling impact of existing urban forests.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
