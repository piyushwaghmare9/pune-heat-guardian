"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getMapRegions, MapRegion } from "@/services/regionService"
import { getTreeRecommendations } from "@/services/recommendationService"
import { TreeRecommendation } from "@/types/tree"
import { RegionMarker } from "./region-marker"
import { SelectedRegionPanel } from "./selected-region-panel"
import { MAP_CONFIG } from "@/config/mapConfig"
import { HeatLegend } from "@/components/heat/heat-legend"
import { ActionMarker } from "./action-marker"
import { Layers, MapPin, RotateCcw } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"

// Dynamically import Leaflet Map and Heat Layer to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })
const HeatLayer = dynamic(() => import("./heat-layer").then(mod => mod.HeatLayer), { ssr: false })

export function HeatMap() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRegion = searchParams.get("region")
  
  const [regions, setRegions] = useState<MapRegion[]>([])
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(urlRegion)
  
  const [projects, setProjects] = useState<any[]>([])
  const [showProjects, setShowProjects] = useState(false)
  
  const [resetTrigger, setResetTrigger] = useState(0)
  
  const [trees, setTrees] = useState<TreeRecommendation[]>([])
  const [isLoadingTrees, setIsLoadingTrees] = useState(false)

  // Fetch data
  useEffect(() => {
    let isMounted = true
    getMapRegions().then((data) => {
      if (isMounted) {
        setRegions(data)
      }
    })
    fetch('/api/v1/projects?visibility=public')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.projects) {
          setProjects(data.projects)
        }
      })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  // Sync URL to State
  useEffect(() => {
    if (urlRegion && urlRegion !== selectedRegionId) {
      setSelectedRegionId(urlRegion)
    }
  }, [urlRegion])

  const handleRegionClick = (regionId: string) => {
    setIsLoadingTrees(true)
    setSelectedRegionId(regionId)
    router.push(`/map?region=${regionId}`, { scroll: false })
  }

  // Fetch trees when region changes
  useEffect(() => {
    let active = true
    if (selectedRegionId) {
      getTreeRecommendations({ regionId: selectedRegionId })
        .then(data => {
          if (active) {
            setTrees(data)
            setIsLoadingTrees(false)
          }
        })
        .catch(() => {
          if (active) {
            setTrees([])
            setIsLoadingTrees(false)
          }
        })
    } else {
      setTrees([])
      setIsLoadingTrees(false)
    }
    return () => { active = false }
  }, [selectedRegionId])

  const handleResetMap = () => {
    handleClosePanel()
    setResetTrigger(prev => prev + 1)
  }

  const handleClosePanel = () => {
    setSelectedRegionId(null)
    router.push(`/map`, { scroll: false })
  }

  const selectedRegion = regions.find(r => r.region.id === selectedRegionId)
  
  // Format data for the heat layer based on regions
  const heatData = regions.map(r => {
    let intensity = 0.2;
    switch (r.risk) {
      case "MODERATE": intensity = 0.4; break;
      case "HIGH": intensity = 0.7; break;
      case "EXTREME": intensity = 1.0; break;
    }
    return {
      lat: r.center.lat,
      lng: r.center.lng,
      intensity
    }
  });

  return (
    <div className="flex flex-col lg:flex-row w-full h-[620px] lg:h-[800px] rounded-2xl overflow-hidden border border-border/80 shadow-md bg-surface-muted relative">
      
      {/* Map Container */}
      <div className={`relative h-full transition-all duration-300 ${selectedRegion ? 'w-full lg:w-[65%]' : 'w-full'}`}>
        <LeafletMap 
          selectedCenter={selectedRegion?.center || null}
          resetTrigger={resetTrigger}
        >
          {regions.map((region) => (
            <RegionMarker
              key={region.region.id}
              region={region}
              isSelected={selectedRegionId === region.region.id}
              onClick={handleRegionClick}
            />
          ))}

          {showProjects && projects.map((proj) => (
            <ActionMarker 
              key={proj.id} 
              project={proj} 
              onClick={(id) => router.push(`/projects/${id}`)}
            />
          ))}

          {heatData.length > 0 && (
            <HeatLayer data={heatData} radius={45} blur={35} maxZoom={13} />
          )}
        </LeafletMap>

        {/* Map Overlays & Layer Controls */}
        <div className="absolute top-4 right-4 md:left-4 md:right-auto z-[400] flex flex-col gap-2.5 pointer-events-auto max-w-[280px]">
          <div className="bg-surface/95 backdrop-blur-md rounded-xl border border-border/80 shadow-md px-3.5 py-3 pointer-events-auto">
            <h3 className="font-bold text-xs text-foreground uppercase tracking-wider mb-2">Heat Risk Layer</h3>
            <HeatLegend />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              variant={showProjects ? "primary" : "outline"}
              onClick={() => setShowProjects(!showProjects)}
              className="gap-1.5 text-xs shadow-sm backdrop-blur-md bg-surface/90"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showProjects ? 'Hide Projects' : 'Show Projects'}</span>
            </Button>

            <Button 
              size="sm"
              variant="outline"
              onClick={handleResetMap}
              className="gap-1.5 text-xs shadow-sm backdrop-blur-md bg-surface/90"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side Panel / Mobile Bottom Sheet */}
      {selectedRegion && (
        <div className="absolute inset-x-0 bottom-0 h-[65%] lg:relative lg:h-full lg:w-[35%] bg-surface border-t lg:border-t-0 lg:border-l border-border/80 shadow-2xl lg:shadow-none z-[500] lg:z-10 rounded-t-2xl lg:rounded-none animate-in slide-in-from-bottom-full lg:slide-in-from-right-full transition-all">
          <SelectedRegionPanel 
            region={selectedRegion} 
            trees={trees}
            isLoadingTrees={isLoadingTrees}
            onClose={handleClosePanel} 
          />
        </div>
      )}
    </div>
  )
}
