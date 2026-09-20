"use client"

import React from "react"
import Link from "next/link"
import { MapRegion } from "@/services/regionService"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeatRiskBadge } from "@/components/heat/heat-risk-badge"
import { X, ArrowRight, Activity, Thermometer, Droplets, Sparkles, Sprout, Store, Users, ShieldCheck, Database } from "lucide-react"
import { TreeRecommendation } from "@/types/tree"

interface SelectedRegionPanelProps {
  region: MapRegion
  trees?: TreeRecommendation[]
  isLoadingTrees?: boolean
  onClose: () => void
}

export function SelectedRegionPanel({ region, trees, isLoadingTrees, onClose }: SelectedRegionPanelProps) {
  const env = region.environmental

  return (
    <div className="w-full h-full flex flex-col bg-surface overflow-hidden">
      {/* Panel Top Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/80 shrink-0 bg-surface-muted/40">
        <div>
          <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Ward Telemetry
          </div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">{region.region.name}</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" 
          onClick={onClose}
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Scrollable Content Body */}
      <div className="p-4 sm:p-5 flex flex-col gap-5 overflow-y-auto flex-1">
        
        {/* Heat & Microclimate Environmental Profile */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Microclimate Diagnostics
          </div>
          
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-surface-elevated border border-border/70 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Thermometer className="h-3.5 w-3.5 text-heat-high" />
                <span>Peak Temp</span>
              </div>
              <div className="text-xl font-extrabold text-foreground">
                {env.temperature ?? "--"}&deg;C
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-border/70 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Heat Risk</span>
              </div>
              <div className="mt-0.5">
                <HeatRiskBadge level={region.risk || "LOW"} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-border/70 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Droplets className="h-3.5 w-3.5 text-teal-600" />
                <span>Humidity</span>
              </div>
              <div className="text-base font-bold text-foreground">
                {env.humidity ? `${env.humidity}%` : "45% (Est.)"}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-border/70 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Activity className="h-3.5 w-3.5 text-amber-500" />
                <span>Air Quality</span>
              </div>
              <div className="text-base font-bold text-foreground">
                {env.aqi ? `${env.aqi} AQI` : "120 AQI"}
              </div>
            </div>
          </div>
        </div>

        {/* Existing Canopy & Tree Intelligence */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-muted-foreground">Urban Forestry Data</span>
            <span className="text-xs text-primary font-semibold">{region.treeCount} Cataloged Trees</span>
          </div>

          {isLoadingTrees ? (
            <div className="p-6 rounded-xl border border-dashed border-border/80 bg-surface-muted/30 text-center text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-spin mx-auto mb-2 text-primary" />
              Computing bio-climatic species match...
            </div>
          ) : trees && trees.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[11px] text-muted-foreground">
                Top AI-ranked indigenous species for this thermal profile:
              </div>
              {trees.slice(0, 3).map((tree, idx) => (
                <div 
                  key={tree.id} 
                  className="p-3 rounded-xl border border-border/70 bg-surface-elevated hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-muted-foreground">0{idx + 1}</span>
                      <span className="text-xs font-bold text-foreground">{tree.commonName}</span>
                    </div>
                    <Badge variant="success" className="text-[10px] py-0 px-1.5">
                      {tree.overallScore ? `${tree.overallScore}% Fit` : "Recommended"}
                    </Badge>
                  </div>
                  {tree.scientificName && (
                    <div className="text-[11px] italic text-muted-foreground mb-1 font-serif">
                      {tree.scientificName}
                    </div>
                  )}
                  {tree.reasons && tree.reasons.length > 0 && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {tree.reasons[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-border/60 bg-surface-muted/30 text-center text-xs text-muted-foreground">
              Select or generate tree recommendations for this ward.
            </div>
          )}
        </div>

        {/* Dataset Source Attribution */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/5 border border-primary/15 text-xs">
          <span className="flex items-center gap-1.5 text-primary font-medium">
            <Database className="h-3.5 w-3.5" />
            <span>Telemetry Source</span>
          </span>
          <span className="font-semibold text-foreground text-[11px]">PMC Guardian Model</span>
        </div>

        {/* Primary and Secondary Actions */}
        <div className="space-y-2 pt-2 border-t border-border/60 mt-auto">
          <Link href={`/dashboard?region=${region.region.id}`} className="w-full block">
            <Button size="medium" className="w-full justify-between shadow-xs group">
              <span>Inspect Full Analytics</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link href={`/ai?region=${region.region.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>AI Species</span>
              </Button>
            </Link>
            <Link href={`/plantation?region=${region.region.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                <Sprout className="h-3.5 w-3.5 text-primary" />
                <span>Plan Planting</span>
              </Button>
            </Link>
            <Link href={`/community?region=${region.region.id}`} className="w-full">
              <Button variant="ghost" size="sm" className="w-full gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>NGO Groups</span>
              </Button>
            </Link>
            <Link href={`/vendors?region=${region.region.id}`} className="w-full">
              <Button variant="ghost" size="sm" className="w-full gap-1 text-xs text-muted-foreground">
                <Store className="h-3.5 w-3.5" />
                <span>Nurseries</span>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
