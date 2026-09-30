"use client"

import React, { useMemo } from "react"
import { Leaf, FlaskConical, Thermometer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { datasetLoader } from "@/lib/data/dataset-loader"
import {
  getRegionCoolingPotential,
  getRegionCO2Total,
  getTopHotspots,
  getRegionCanopyInfo,
} from "@/lib/dashboard-utils"
import { useRegion } from "@/context/region-context"


interface MetricTileProps {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  label: string
  value: string | number
  unit?: string
  note?: string
}

function MetricTile({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  unit,
  note,
}: MetricTileProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-surface-muted/30">
      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="text-lg font-bold text-foreground leading-tight">
          {value}
          {unit && (
            <span className="text-xs font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          )}
        </p>
        {note && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{note}</p>
        )}
      </div>
    </div>
  )
}

export function ImpactPanel() {
  const { selectedRegionId } = useRegion()

  const hotspot = useMemo(() => getTopHotspots(1)[0], [])
  const effectiveId = selectedRegionId ?? hotspot?.id ?? null

  const regionData = useMemo(() => {
    if (!effectiveId) return null
    return datasetLoader.getRegionById(effectiveId) ?? null
  }, [effectiveId])

  const coolingPotential = useMemo(
    () => (effectiveId ? getRegionCoolingPotential(effectiveId) : null),
    [effectiveId]
  )
  const co2Total = useMemo(
    () => (effectiveId ? getRegionCO2Total(effectiveId) : 0),
    [effectiveId]
  )
  const canopy = useMemo(
    () => (effectiveId ? getRegionCanopyInfo(effectiveId) : null),
    [effectiveId]
  )

  if (!regionData) {
    return (
      <Card>
        <CardContent className="p-5">
          <Skeleton className="h-4 w-40 mb-4" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const co2Tonnes = (co2Total / 1000).toFixed(1)
  const shadeCoverage = canopy?.totalShadeArea
    ? (canopy.totalShadeArea / 1000).toFixed(1)
    : null

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-heat-low/10 border border-heat-low/20 flex items-center justify-center">
            <Leaf className="h-3.5 w-3.5 text-heat-low" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold">
              Tree & Cooling Impact
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {regionData.name} · From dataset
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-2 gap-3">
        <MetricTile
          icon={Leaf}
          iconColor="text-heat-low"
          iconBg="bg-heat-low/10"
          label="Recorded Trees"
          value={regionData.treeCount.toLocaleString()}
          note="Dataset count"
        />

        <MetricTile
          icon={Thermometer}
          iconColor="text-sky-500"
          iconBg="bg-sky-500/10"
          label="Cooling Effect"
          value={coolingPotential ?? "–"}
          unit={coolingPotential ? "°C avg" : undefined}
          note="Dataset avg"
        />

        {shadeCoverage && (
          <MetricTile
            icon={Leaf}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-600/10"
            label="Shade Area"
            value={shadeCoverage}
            unit="k m²"
            note="Dataset total"
          />
        )}

        <MetricTile
          icon={FlaskConical}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
          label="CO₂ Absorbed"
          value={co2Tonnes}
          unit="t/yr"
          note="Dataset total (Estimated per tree)"
        />
      </CardContent>
    </Card>
  )
}
