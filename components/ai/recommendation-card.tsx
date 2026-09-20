"use client"

import React, { useState } from "react"
import { TreeRecommendation } from "@/types/tree"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Info, Leaf, Plus, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecommendationCardProps {
  tree: TreeRecommendation
  rank: number
  onAddToPlan?: (tree: TreeRecommendation) => void
  isAdded?: boolean
}

export function RecommendationCard({ tree, rank, onAddToPlan, isAdded }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)

  const FactorBar = ({ label, score, weight }: { label: string, score: number, weight: number }) => (
    <div className="flex flex-col gap-1 w-full text-xs">
      <div className="flex justify-between text-muted-foreground">
        <span>{label} <span className="opacity-60 ml-1">({weight}%)</span></span>
        <span className="font-semibold text-foreground">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden border border-border/50">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300" 
          style={{ width: `${Math.min(score, 100)}%` }} 
        />
      </div>
    </div>
  )

  return (
    <Card className={cn(
      "overflow-hidden border border-border/80 bg-surface transition-all duration-200", 
      expanded ? "shadow-md border-primary/40" : "shadow-xs hover:shadow-md hover:border-border-strong"
    )}>
      <CardContent className="p-0">
        <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-6">
          
          {/* Rank & Match Score */}
          <div className="shrink-0 flex items-center md:items-start gap-4 md:flex-col md:w-36">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm">
              #{rank}
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {tree.overallScore}<span className="text-xs text-muted-foreground font-normal">/100</span>
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                Bio-Climate Fit
              </div>
            </div>
          </div>

          {/* Core Botanical Details */}
          <div className="flex-1 flex flex-col gap-2.5 min-w-0">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{tree.commonName}</h3>
                <Badge variant="success" className="text-[10px]">
                  {tree.coolingScore >= 85 ? "Extreme Cooling" : "High Cooling"}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground italic font-serif mt-0.5">
                {tree.scientificName}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-xs bg-surface-muted px-2.5 py-1 rounded-md text-foreground-secondary border border-border/60">
                Water: <span className="font-semibold text-foreground">{tree.waterRequirement}</span>
              </span>
              <span className="text-xs bg-surface-muted px-2.5 py-1 rounded-md text-foreground-secondary border border-border/60">
                Carbon: <span className="font-semibold text-foreground">{tree.carbonScore >= 80 ? "High Sequestration" : "Moderate"}</span>
              </span>
              <span className="text-xs bg-surface-muted px-2.5 py-1 rounded-md text-foreground-secondary border border-border/60">
                Maintenance: <span className="font-semibold text-foreground">{tree.maintenanceScore >= 80 ? "Low Care" : "Standard Care"}</span>
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-border/60">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Targeted Microclimate Benefits:
              </p>
              <ul className="flex flex-col gap-1.5">
                {tree.reasons.slice(0, 3).map((reason, i) => (
                  <li key={i} className="text-xs flex items-start gap-2 text-muted-foreground leading-relaxed">
                    <Check className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions Column */}
          <div className="flex flex-row md:flex-col gap-2 justify-end md:w-44 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-5 border-border/60 shrink-0">
            {onAddToPlan && (
              <Button 
                onClick={() => onAddToPlan(tree)} 
                variant={isAdded ? "secondary" : "primary"}
                disabled={isAdded}
                size="sm"
                className="w-full text-xs shadow-xs"
              >
                {isAdded ? (
                  <><Check className="mr-1.5 h-3.5 w-3.5" /> Added to Plan</>
                ) : (
                  <><Plus className="mr-1.5 h-3.5 w-3.5" /> Add to Plan</>
                )}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="w-full text-xs"
            >
              <Info className="mr-1.5 h-3.5 w-3.5" /> 
              {expanded ? "Hide Factors" : "View Factors"}
            </Button>
          </div>
        </div>

        {/* Expanded Scoring Breakdown */}
        {expanded && (
          <div className="border-t border-border/70 bg-surface-muted/50 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-150">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">
                Bioclimatic Factor Weights
              </h4>
              <div className="space-y-3">
                <FactorBar label="Cooling & Shading Power" score={tree.coolingScore} weight={35} />
                <FactorBar label="CO₂ Carbon Sequestration" score={tree.carbonScore} weight={25} />
                <FactorBar label="Growth Rate & Root Density" score={tree.growthScore} weight={15} />
                <FactorBar label="Urban Surface Suitability" score={tree.urbanSuitabilityScore} weight={10} />
                <FactorBar label="Pollution & Dust Tolerance" score={tree.pollutionToleranceScore} weight={5} />
                <FactorBar label="Drought & Heat Stress Resilience" score={tree.droughtToleranceScore} weight={5} />
                <FactorBar label="Municipal Maintenance Cost" score={tree.maintenanceScore} weight={5} />
              </div>
            </div>
            
            <div className="flex flex-col justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-warning mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Environmental Considerations
                </h4>
                {tree.limitations.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {tree.limitations.map((limit, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-warning font-bold">&bull;</span>
                        <span>{limit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">No significant adverse conditions recorded for this microclimate.</p>
                )}
              </div>
              
              <div className="p-3 bg-surface border border-border/70 rounded-xl text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Dataset Source:</span>
                  <span>{tree.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Audit Status:</span>
                  <span className="text-primary font-medium capitalize">{tree.dataStatus}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
