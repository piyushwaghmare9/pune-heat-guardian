"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, Leaf, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getTreeRecommendations } from "@/services/recommendationService"
import { getTopHotspots, estimateTreesNeeded } from "@/lib/dashboard-utils"
import { datasetLoader } from "@/lib/data/dataset-loader"
import { useRegion } from "@/context/region-context"
import type { TreeRecommendation } from "@/types/tree"
import { cn } from "@/lib/utils"

const PRIORITY_CONFIG: Record<
  "LOW" | "MODERATE" | "HIGH" | "EXTREME",
  { label: string; class: string }
> = {
  LOW: { label: "Normal Priority", class: "bg-heat-low/10 text-heat-low" },
  MODERATE: { label: "Moderate Priority", class: "bg-heat-moderate/10 text-heat-moderate" },
  HIGH: { label: "High Priority", class: "bg-heat-high/10 text-heat-high" },
  EXTREME: { label: "Urgent Action", class: "bg-heat-extreme/10 text-heat-extreme" },
}

export function AiRecommendationPanel() {
  const { selectedRegionId } = useRegion()

  // Default to the top hotspot when no region is selected
  const hotspots = React.useMemo(() => getTopHotspots(1), [])
  const effectiveRegionId = selectedRegionId ?? hotspots[0]?.id ?? null

  const regionData = React.useMemo(() => {
    if (!effectiveRegionId) return null
    return datasetLoader.getRegionById(effectiveRegionId) ?? null
  }, [effectiveRegionId])

  const [trees, setTrees] = useState<TreeRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!effectiveRegionId) return
    let cancelled = false
    // All state updates are inside the async chain — no synchronous setState in effect body
    Promise.resolve()
      .then(() => {
        if (!cancelled) {
          setLoading(true)
          setError(false)
        }
        return getTreeRecommendations({ regionId: effectiveRegionId })
      })
      .then((data) => {
        if (!cancelled) {
          setTrees(data.slice(0, 3))
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [effectiveRegionId])

  const treesNeeded = regionData
    ? estimateTreesNeeded(regionData.treeCount)
    : null

  const priorityConfig = regionData
    ? PRIORITY_CONFIG[regionData.riskLevel]
    : PRIORITY_CONFIG["LOW"]

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">AI Tree Recommendation</CardTitle>
              {regionData && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  For {regionData.name}
                </p>
              )}
            </div>
          </div>
          {regionData && (
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap",
                priorityConfig.class
              )}
            >
              {priorityConfig.label}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col gap-4">
        {/* Trees needed estimate */}
        {treesNeeded !== null && treesNeeded > 0 && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/20">
            <Leaf className="h-4 w-4 text-primary shrink-0" />
            <p className="text-xs text-foreground leading-snug">
              <span className="font-bold text-primary">{treesNeeded.toLocaleString()}</span>{" "}
              more trees estimated to meet urban coverage targets{" "}
              <span className="text-muted-foreground">(Estimated)</span>
            </p>
          </div>
        )}

        {/* Species list */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 py-4 text-center justify-center text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Unable to load recommendations</span>
          </div>
        )}

        {!loading && !error && trees.length === 0 && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No recommendations available for this region.
          </div>
        )}

        {!loading && !error && trees.length > 0 && (
          <div className="flex flex-col gap-2">
            {trees.map((tree, idx) => (
              <div
                key={tree.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-surface-muted/30 hover:bg-surface-muted/60 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">
                      {tree.commonName}
                    </span>
                    <Badge variant="success" className="text-[9px] px-1.5 py-0">
                      Score {tree.overallScore}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-0.5">
                    {tree.scientificName}
                  </p>
                  {tree.reasons.length > 0 ? (
                    <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">
                      {tree.reasons[0]}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Cooling score: {tree.coolingScore}/100 · Water: {tree.waterRequirement}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-auto pt-3 border-t border-border/60">
          <Link href={`/ai${effectiveRegionId ? `?region=${effectiveRegionId}` : ""}`}>
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-between group"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                View AI Recommendations
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
