"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

interface MapWrapperProps {
  selectedRegionId?: string | null
  onRegionSelect?: (regionId: string | null) => void
  /** Compact mode reduces the map height for dashboard use */
  compact?: boolean
}

const HeatMap = dynamic(
  () => import("@/components/map/heat-map").then((mod) => mod.HeatMap),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-surface-muted min-h-[420px] rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
)

export function MapWrapper({ selectedRegionId, onRegionSelect, compact }: MapWrapperProps) {
  return (
    <HeatMap
      externalSelectedRegionId={selectedRegionId}
      onExternalRegionSelect={onRegionSelect}
      compact={compact}
    />
  )
}
