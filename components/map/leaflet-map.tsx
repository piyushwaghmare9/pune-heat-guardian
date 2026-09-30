"use client"

import React, { useEffect, useState, useMemo } from "react"
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { MAP_CONFIG } from "@/config/mapConfig"
import { Loader2 } from "lucide-react"
import L from "leaflet"

// Fix for default marker icons in Leaflet with Next.js/Webpack
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
if (typeof window !== "undefined") {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  })
}

// Strict geographical boundary for Pune Metropolitan Region
// South-West: Katraj/Sinhagad/Dhayari (18.42, 73.70)
// North-East: Pimpri-Chinchwad/Bhosari/Wagholi (18.66, 73.98)
const PUNE_BOUNDS_CORNERS: [[number, number], [number, number]] = [
  [18.41, 73.69],
  [18.67, 73.99],
]

// Helper component to lock bounds and handle flying to selected regions
function MapController({
  center,
  zoom,
  resetTrigger,
  puneBounds,
}: {
  center: { lat: number; lng: number } | null
  zoom: number
  resetTrigger: number
  puneBounds: L.LatLngBounds
}) {
  const map = useMap()

  // Enforce Pune limits on map instance
  useEffect(() => {
    map.setMaxBounds(puneBounds)
    map.setMinZoom(11.8)
    map.setMaxZoom(17)
  }, [map, puneBounds])

  // Pan to selected region or return to Pune center
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], Math.max(zoom, 13), { duration: 1.2 })
    } else {
      map.flyTo(
        [MAP_CONFIG.PUNE_CENTER.lat, MAP_CONFIG.PUNE_CENTER.lng],
        MAP_CONFIG.DEFAULT_ZOOM,
        { duration: 1.2 }
      )
    }
  }, [center, zoom, resetTrigger, map])

  return null
}

interface LeafletMapProps {
  children: React.ReactNode
  selectedCenter: { lat: number; lng: number } | null
  defaultCenter?: { lat: number; lng: number }
  defaultZoom?: number
  resetTrigger?: number
}

export default function LeafletMap({
  children,
  selectedCenter,
  defaultCenter = MAP_CONFIG.PUNE_CENTER,
  defaultZoom = MAP_CONFIG.DEFAULT_ZOOM,
  resetTrigger = 0,
}: LeafletMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Create Pune LatLngBounds object once
  const puneBounds = useMemo(
    () => L.latLngBounds(PUNE_BOUNDS_CORNERS[0], PUNE_BOUNDS_CORNERS[1]),
    []
  )

  if (!mounted) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium">Loading Pune Heat Map...</p>
      </div>
    )
  }

  // Open-source OpenStreetMap tiles — zero API key required, zero watermarks
  const envTile = process.env.NEXT_PUBLIC_MAP_TILE_URL
  const tileUrl =
    envTile && !envTile.includes("cartocdn")
      ? envTile
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'

  return (
    <MapContainer
      center={[defaultCenter.lat, defaultCenter.lng]}
      zoom={defaultZoom}
      minZoom={11.8}
      maxZoom={17}
      maxBounds={puneBounds}
      maxBoundsViscosity={1.0}
      zoomControl={false}
      scrollWheelZoom={true}
      bounceAtZoomLimits={true}
      className="w-full h-full z-0"
    >
      <TileLayer
        url={tileUrl}
        attribution={attribution}
        maxZoom={19}
        subdomains={["a", "b", "c"]}
      />
      <ZoomControl position="bottomright" />
      <MapController
        center={selectedCenter}
        zoom={selectedCenter ? 13.5 : defaultZoom}
        resetTrigger={resetTrigger}
        puneBounds={puneBounds}
      />
      {children}
    </MapContainer>
  )
}
