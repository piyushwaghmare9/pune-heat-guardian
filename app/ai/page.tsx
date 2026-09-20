"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { EnvironmentalContext } from "@/components/ai/environmental-context"
import { RecommendationCard } from "@/components/ai/recommendation-card"
import { getTreeRecommendations } from "@/services/recommendationService"
import { TreeRecommendation } from "@/types/tree"
import { DEMO_REGIONS_SUMMARY } from "@/lib/demo/dashboard-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ArrowRight, Sparkles, Sprout, MapPin, SlidersHorizontal } from "lucide-react"

function AIRecommendationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRegion = searchParams.get("region")

  const [selectedRegionId, setSelectedRegionId] = useState<string>(urlRegion || "")
  const [recommendations, setRecommendations] = useState<TreeRecommendation[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [selectedTreesForPlan, setSelectedTreesForPlan] = useState<string[]>([])

  useEffect(() => {
    if (urlRegion && urlRegion !== selectedRegionId) {
      setSelectedRegionId(urlRegion)
    }
  }, [urlRegion])

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value
    setSelectedRegionId(newId)
    router.push(`/ai?region=${newId}`, { scroll: false })
    setHasAnalyzed(false)
    setRecommendations([])
  }

  const handleAnalyze = async () => {
    if (!selectedRegionId) return
    setIsAnalyzing(true)
    setHasAnalyzed(false)
    
    try {
      const results = await getTreeRecommendations({ regionId: selectedRegionId })
      setRecommendations(results)
      setHasAnalyzed(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAddToPlan = (tree: TreeRecommendation) => {
    if (!selectedTreesForPlan.includes(tree.id)) {
      setSelectedTreesForPlan(prev => [...prev, tree.id])
    }
  }

  const handleGoToPlanner = () => {
    const treeParams = selectedTreesForPlan.map(id => `tree=${id}`).join('&')
    router.push(`/plantation?region=${selectedRegionId}&${treeParams}`)
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* 1. Ward Selection Card */}
      <Card className="border border-border/80 bg-surface shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label htmlFor="region-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Target Pune Ward / Microclimate
              </label>
              <p className="text-xs text-muted-foreground">
                Select a monitored urban zone to pull localized heat and canopy metrics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select 
                id="region-select"
                value={selectedRegionId} 
                onChange={handleRegionChange}
                className="h-10 w-full sm:w-72 rounded-lg border border-border bg-surface-muted/50 px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                <option value="" disabled>Select a Pune ward...</option>
                {DEMO_REGIONS_SUMMARY.map(r => (
                  <option key={r.region.id} value={r.region.id}>{r.region.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Environmental Context Card */}
      {selectedRegionId && (
        <section className="animate-in fade-in slide-in-from-top-3">
          <EnvironmentalContext regionId={selectedRegionId} />
        </section>
      )}

      {/* 3. Analyze Action Bar */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-primary/20 bg-primary/5">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="h-4 w-4 text-primary" />
            Bio-Climatic Tree Recommendation Engine
          </h3>
          <p className="text-xs text-muted-foreground">
            Ranks 60+ indigenous Pune tree species by cooling power, survival rate, drought resilience, and municipal suitability.
          </p>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={!selectedRegionId || isAnalyzing}
          size="medium"
          className="w-full sm:w-auto shrink-0 gap-2 shadow-xs"
        >
          {isAnalyzing ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating Species...</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Run AI Evaluation</>
          )}
        </Button>
      </section>

      {/* 4. Results Section */}
      {hasAnalyzed && recommendations.length > 0 && (
        <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Ranked Native Species</h2>
                <Badge variant="success" className="text-xs">Top Matches</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Optimized for {DEMO_REGIONS_SUMMARY.find(r=>r.region.id === selectedRegionId)?.region.name} thermal conditions
              </p>
            </div>
            
            {selectedTreesForPlan.length > 0 && (
              <Button onClick={handleGoToPlanner} variant="primary" size="medium" className="gap-2 shadow-xs">
                <span>Continue to Planner ({selectedTreesForPlan.length} Selected)</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            {recommendations.slice(0, 6).map((tree, idx) => (
              <RecommendationCard 
                key={tree.id} 
                tree={tree} 
                rank={idx + 1} 
                onAddToPlan={handleAddToPlan}
                isAdded={selectedTreesForPlan.includes(tree.id)}
              />
            ))}
          </div>

          {selectedTreesForPlan.length > 0 && (
            <div className="sticky bottom-6 z-20 sm:hidden">
              <Button onClick={handleGoToPlanner} className="w-full shadow-lg gap-2" size="large">
                <span>Continue to Planner ({selectedTreesForPlan.length})</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default function AIPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader 
        title="AI Native Tree Recommendations" 
        description="Bio-climatic tree species matching optimized for local heat stress, soil moisture, and crown cooling in Pune."
        badge={
          <Badge variant="primary" className="gap-1.5 py-1 px-3">
            <Sparkles className="h-3 w-3" />
            <span>Bioclimatic AI v2.1</span>
          </Badge>
        }
      />
      <Suspense fallback={<div className="h-40 animate-pulse bg-surface-muted rounded-xl w-full"></div>}>
        <AIRecommendationsContent />
      </Suspense>
    </div>
  )
}
