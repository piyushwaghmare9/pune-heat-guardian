"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet.heat"

interface HeatDataPoint {
  lat: number
  lng: number
  intensity: number // 0 to 1
}

interface HeatLayerProps {
  data: HeatDataPoint[]
  radius?: number
  blur?: number
  maxZoom?: number
}

export function HeatLayer({ data, radius = 25, blur = 15, maxZoom = 13 }: HeatLayerProps) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // Format data for leaflet.heat: [lat, lng, intensity]
    const points = data.map(p => [p.lat, p.lng, p.intensity] as L.HeatLatLngTuple)
    
    // Create the heat layer
    // @ts-ignore - leaflet.heat types are sometimes incomplete
    const heatLayer = L.heatLayer(points, {
      radius,
      blur,
      maxZoom,
      // Create a gradient that matches our Heat Risk colors conceptually
      gradient: {
        0.2: 'rgb(220, 252, 231)', // Low
        0.4: 'rgb(254, 240, 138)', // Moderate
        0.7: 'rgb(254, 215, 170)', // High
        1.0: 'rgb(254, 202, 202)'  // Extreme
      }
    })

    // Add to map
    heatLayer.addTo(map)

    // Cleanup on unmount
    return () => {
      map.removeLayer(heatLayer)
    }
  }, [map, data, radius, blur, maxZoom])

  return null
}
