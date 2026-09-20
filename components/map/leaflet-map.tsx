"use client"

import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { MAP_CONFIG } from "@/config/mapConfig"
import { Loader2 } from "lucide-react"
import L from "leaflet"
import { datasetLoader } from "@/lib/data/dataset-loader"

// Fix for default marker icons in Leaflet with Next.js/Webpack
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
if (typeof window !== 'undefined') {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  })
}

// Helper component to handle flying to selected regions
function MapController({ center, zoom, resetTrigger }: { center: { lat: number; lng: number } | null, zoom: number, resetTrigger: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], zoom, { duration: 1.5 });
    } else {
      map.flyTo([MAP_CONFIG.PUNE_CENTER.lat, MAP_CONFIG.PUNE_CENTER.lng], MAP_CONFIG.DEFAULT_ZOOM, { duration: 1.5 });
    }
  }, [center, zoom, resetTrigger, map]);
  return null;
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
  resetTrigger = 0
}: LeafletMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium">Loading Map...</p>
      </div>
    )
  }

  const tileUrl = process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  const attribution = process.env.NEXT_PUBLIC_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  // Bounding box strictly derived from the dataset
  const bounds = datasetLoader.getDatasetBounds()
  // Add a slight margin (e.g. 0.05 degrees) to ensure all markers fit well inside
  const puneBounds = L.latLngBounds(
    [bounds.southWest.lat - 0.05, bounds.southWest.lng - 0.05],
    [bounds.northEast.lat + 0.05, bounds.northEast.lng + 0.05]
  )

  return (
    <MapContainer
      center={[defaultCenter.lat, defaultCenter.lng]}
      zoom={defaultZoom}
      minZoom={11}
      maxBounds={puneBounds}
      maxBoundsViscosity={1.0}
      zoomControl={false}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
    >
      <TileLayer
        url={tileUrl}
        attribution={attribution}
      />
      <MapController center={selectedCenter} zoom={selectedCenter ? 13 : defaultZoom} resetTrigger={resetTrigger} />
      {children}
    </MapContainer>
  )
}
