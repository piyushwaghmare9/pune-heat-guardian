"use client"

import React from "react"
import { Marker } from "react-leaflet"
import L from "leaflet"
import { MapRegion } from "@/services/regionService"
import { renderToString } from "react-dom/server"

interface RegionMarkerProps {
  region: MapRegion
  isSelected: boolean
  onClick: (regionId: string) => void
}

const getRiskColor = (risk: string | null) => {
  switch (risk) {
    case "LOW": return "var(--color-heat-low, #dcfce7)"
    case "MODERATE": return "var(--color-heat-moderate, #fef08a)"
    case "HIGH": return "var(--color-heat-high, #fed7aa)"
    case "EXTREME": return "var(--color-heat-extreme, #fecaca)"
    default: return "hsl(var(--muted-foreground))"
  }
}

export function RegionMarker({ region, isSelected, onClick }: RegionMarkerProps) {
  const color = getRiskColor(region.risk)

  // We must convert the React elements to an HTML string for Leaflet's divIcon
  const iconHtml = renderToString(
    <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${isSelected ? "z-10 scale-125" : "hover:scale-110 z-0"}`}>
      {/* Outer pulse ring */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{ backgroundColor: color, transform: isSelected ? 'scale(2.5)' : 'scale(1.8)' }}
      />
      {/* Inner solid core */}
      <div 
        className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-md ${isSelected ? "border-foreground" : "border-background"}`}
        style={{ backgroundColor: color }}
      />
    </div>
  )

  const icon = L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })

  return (
    <Marker
      position={[region.center.lat, region.center.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(region.region.id)
      }}
      title={region.region.name}
    />
  )
}
