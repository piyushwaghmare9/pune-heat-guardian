"use client"

import React from "react"
import { Marker } from "react-leaflet"
import L from "leaflet"
import { ShieldCheck, Sprout } from "lucide-react"
import { renderToString } from "react-dom/server"

interface ActionMarkerProps {
  project: any;
  onClick: (projectId: string) => void;
}

const REGION_OFFSETS: Record<string, {lat: number, lng: number}> = {
  "shivajinagar": { lat: 18.5314, lng: 73.8446 },
  "kothrud": { lat: 18.5089, lng: 73.8010 }, 
  "hinjawadi": { lat: 18.5913, lng: 73.7381 },
  "hadapsar": { lat: 18.4967, lng: 73.9417 },
  "viman_nagar": { lat: 18.5626, lng: 73.9167 }
};

export function ActionMarker({ project, onClick }: ActionMarkerProps) {
  const coord = REGION_OFFSETS[project.regionId];
  if (!coord) return null;

  const isVerified = project.status === 'Verified';

  // For Lucide icons in SSR/string, we can use an SVG string or standard markup
  const IconComponent = isVerified ? ShieldCheck : Sprout;
  const bgColor = isVerified ? 'bg-emerald-500' : 'bg-blue-500';

  const iconHtml = renderToString(
    <div className="relative group cursor-pointer transition-transform hover:scale-110">
      <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${bgColor}`}>
        {/* We have to render the SVG explicitly or rely on global CSS if we use Lucide string rendering. 
            Since we're using renderToString on Lucide components, it produces inline SVGs. */}
        <IconComponent className="w-4 h-4 text-white" />
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-background border rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
        <p className="text-xs font-bold truncate text-foreground">{project.name}</p>
        <p className="text-[10px] text-muted-foreground">{project.actionType}</p>
        <div className="mt-1 flex items-center justify-between text-[10px] text-foreground">
          <span>{project.status}</span>
          <span className="font-semibold">{project.treesPlanted || 0} Trees</span>
        </div>
      </div>
    </div>
  )

  const icon = L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16], // Anchor at center
  })

  return (
    <Marker
      position={[coord.lat, coord.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(project.id)
      }}
      zIndexOffset={1000} // Ensure it's above other elements
    />
  )
}
