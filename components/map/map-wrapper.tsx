"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const HeatMap = dynamic(
  () => import("@/components/map/heat-map").then((mod) => mod.HeatMap),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-surface-muted min-h-[600px] rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
)

export function MapWrapper() {
  return <HeatMap />
}
