"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getMapRegions, MapRegion } from "@/services/regionService"
import { getTreeRecommendations } from "@/services/recommendationService"
import { TreeRecommendation } from "@/types/tree"
import { WardPredictionSummary } from "@/types/ml"
import { RegionMarker } from "./region-marker"
import { SelectedRegionPanel } from "./selected-region-panel"
import { MAP_CONFIG } from "@/config/mapConfig"
import { HeatLegend } from "@/components/heat/heat-legend"
import { ActionMarker } from "./action-marker"
import { ModelBadge } from "@/components/ml/model-badge"
import { MlFallbackBanner } from "@/components/ml/ml-fallback-banner"
import { Layers, RotateCcw, BrainCircuit, Database } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { getWardPredictions } from "@/services/api"

interface ClimateProject {
  id: string
  title?: string
  region?: string
  center?: { lat: number; lng: number }
  status?: string
}

// Dynamically import Leaflet Map and Heat Layer to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })
const HeatLayer = dynamic(() => import("./heat-layer").then(mod => mod.HeatLayer), { ssr: false })

interface HeatMapProps {
  externalSelectedRegionId?: string | null
  onExternalRegionSelect?: (regionId: string | null) => void
  compact?: boolean
}

export function HeatMap({ externalSelectedRegionId, onExternalRegionSelect, compact }: HeatMapProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRegion = searchParams.get("region")

  const [regions, setRegions] = useState<MapRegion[]>([])
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(urlRegion)

  const [projects, setProjects] = useState<ClimateProject[]>([])
  const [showProjects, setShowProjects] = useState(false)

  const [resetTrigger, setResetTrigger] = useState(0)

  const [trees, setTrees] = useState<TreeRecommendation[]>([])
  const [isLoadingTrees, setIsLoadingTrees] = useState(false)

  // ML-mode state
  const [usePredicted, setUsePredicted] = useState(false)
  const [wardPredictions, setWardPredictions] = useState<WardPredictionSummary[]>([])
  const [mlFallback, setMlFallback] = useState(false)

  // Fetch base data
  useEffect(() => {
    let isMounted = true
    getMapRegions().then((data) => {
      if (isMounted) setRegions(data)
    })
    fetch('/api/v1/projects?visibility=public')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.projects) setProjects(data.projects)
      })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  // Fetch ML ward predictions when predicted mode is toggled on
  useEffect(() => {
    if (!usePredicted) return
    let isMounted = true
    getWardPredictions().then(preds => {
      if (!isMounted) return
      if (preds.length === 0) {
        setMlFallback(true)
      } else {
        setWardPredictions(preds)
        setMlFallback(false)
      }
    }).catch(() => {
      if (isMounted) setMlFallback(true)
    })
    return () => { isMounted = false }
  }, [usePredicted])

  // Sync URL → State
  useEffect(() => {
    if (urlRegion && urlRegion !== selectedRegionId) setSelectedRegionId(urlRegion)
  }, [urlRegion, selectedRegionId])

  // Sync external prop → internal state
  useEffect(() => {
    if (externalSelectedRegionId !== undefined && externalSelectedRegionId !== selectedRegionId) {
      setSelectedRegionId(externalSelectedRegionId)
    }
  }, [externalSelectedRegionId, selectedRegionId])

  const handleRegionClick = (regionId: string) => {
    setIsLoadingTrees(true)
    setSelectedRegionId(regionId)
    if (onExternalRegionSelect) {
      onExternalRegionSelect(regionId)
    } else {
      router.push(`/map?region=${regionId}`, { scroll: false })
    }
  }

  useEffect(() => {
    let active = true
    if (selectedRegionId) {
      getTreeRecommendations({ regionId: selectedRegionId })
        .then(data => {
          if (active) { setTrees(data); setIsLoadingTrees(false) }
        })
        .catch(() => {
          if (active) { setTrees([]); setIsLoadingTrees(false) }
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

  // --- Build heat layer data: use ML predicted risk when available ---
  const heatData = regions.map(r => {
    // Find ML prediction for this ward if available and in predicted mode
    const pred = usePredicted
      ? wardPredictions.find(w => w.ward_id === r.region.id)
      : null
    const effectiveRisk = pred?.predicted_risk ?? r.risk

    let intensity = 0.2
    switch (effectiveRisk) {
      case "MODERATE": intensity = 0.4; break
      case "HIGH": intensity = 0.7; break
      case "EXTREME": intensity = 1.0; break
    }
    return { lat: r.center.lat, lng: r.center.lng, intensity }
  })

  // Build enriched regions with ML predictions injected
  const enrichedRegions: MapRegion[] = regions.map(r => {
    const pred = usePredicted
      ? wardPredictions.find(w => w.ward_id === r.region.id)
      : null
    if (!pred) return r
    return {
      ...r,
      risk: pred.predicted_risk,
      environmental: {
        ...r.environmental,
        temperature: pred.predicted_temp_c,
      },
    }
  })

  return (
    <div className={`flex flex-col lg:flex-row w-full rounded-2xl overflow-hidden border border-border/80 shadow-md bg-surface-muted relative ${compact ? 'h-[420px]' : 'h-[620px] lg:h-[800px]'}`}>

      {/* Map Container */}
      <div className={`relative h-full transition-all duration-300 ${selectedRegion ? 'w-full lg:w-[65%]' : 'w-full'}`}>
        <LeafletMap
          selectedCenter={selectedRegion?.center || null}
          resetTrigger={resetTrigger}
        >
          {enrichedRegions.map((region) => (
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
        <div className="absolute top-4 right-4 md:left-4 md:right-auto z-[400] flex flex-col gap-2.5 pointer-events-auto max-w-[300px]">

          {/* ML Fallback Banner inline */}
          {usePredicted && mlFallback && (
            <div className="bg-surface/95 backdrop-blur-md rounded-xl border border-amber-500/40 shadow-md px-3 py-2">
              <MlFallbackBanner visible />
            </div>
          )}

          <div className="bg-surface/95 backdrop-blur-md rounded-xl border border-border/80 shadow-md px-3.5 py-3 pointer-events-auto">
            <h3 className="font-bold text-xs text-foreground uppercase tracking-wider mb-2">Heat Risk Layer</h3>
            <HeatLegend />
            {/* Measured / Predicted toggle */}
            <div className="mt-2.5 pt-2.5 border-t border-border/60 flex items-center gap-1.5">
              <button
                onClick={() => setUsePredicted(false)}
                className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded-md transition-all ${
                  !usePredicted
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Database className="h-3 w-3" /> Measured
              </button>
              <button
                onClick={() => setUsePredicted(true)}
                className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded-md transition-all ${
                  usePredicted
                    ? "bg-violet-600 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BrainCircuit className="h-3 w-3" /> Predicted
              </button>
            </div>
            {/* Source badge */}
            <div className="mt-1.5 flex justify-center">
              <ModelBadge source={usePredicted && !mlFallback ? "model" : "dataset"} compact={false} />
            </div>
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
            mlPrediction={
              usePredicted && !mlFallback
                ? wardPredictions.find(w => w.ward_id === selectedRegion.region.id)
                : undefined
            }
          />
        </div>
      )}
    </div>
  )
}
