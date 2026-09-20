"use client"

import React, { useEffect, useState } from "react"
import { getMapRegionById, MapRegion } from "@/services/regionService"
import { Thermometer, Activity, Droplets } from "lucide-react"
import { HeatRiskBadge } from "@/components/heat/heat-risk-badge"

export function EnvironmentalContext({ regionId }: { regionId: string }) {
  const [regionData, setRegionData] = useState<MapRegion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (regionId) {
      setLoading(true)
      getMapRegionById(regionId).then(data => {
        if (mounted) {
          setRegionData(data || null)
          setLoading(false)
        }
      })
    }
    return () => { mounted = false }
  }, [regionId])

  if (loading) return <div className="h-24 animate-pulse bg-surface-muted rounded-md w-full"></div>
  if (!regionData) return null

  const env = regionData.environmental

  return (
    <div className="bg-surface-muted rounded-md p-4 border flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{regionData.region.name} Conditions</h3>
        <HeatRiskBadge level={regionData.risk || "LOW"} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
            <Thermometer className="h-3 w-3" /> Temp
          </span>
          <span className="font-medium">{env.temperature ?? "—"}°C</span>
          <span className="text-[10px] text-muted-foreground mt-1">Live</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
            <Activity className="h-3 w-3" /> AQI
          </span>
          <span className="font-medium">{env.aqi ?? "—"}</span>
          <span className="text-[10px] text-muted-foreground mt-1">Live</span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
            <Droplets className="h-3 w-3" /> Humidity
          </span>
          <span className="font-medium">{env.humidity ?? "—"}%</span>
          <span className="text-[10px] text-muted-foreground mt-1">Estimated</span>
        </div>

        <div className="flex flex-col justify-end">
          <span className="text-xs font-semibold text-warning">Demo Data Status</span>
        </div>
      </div>
    </div>
  )
}
