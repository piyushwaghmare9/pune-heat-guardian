"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { getTreeDetails } from "@/services/recommendationService"
import { getMapRegionById, MapRegion } from "@/services/regionService"
import { calculatePlantationSummary } from "@/services/plantationService"
import { TreeRecommendation } from "@/types/tree"
import { PlantationPlan, PlantationTreeSelection, PlantationSummary } from "@/types/plantation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, ArrowLeft, Leaf, AlertTriangle, Loader2, Sparkles, Sprout, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/toast"

function PlantationPlannerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRegion = searchParams.get("region")
  const treeParams = searchParams.getAll("tree")
  const { toast } = useToast()

  const [regionData, setRegionData] = useState<MapRegion | null>(null)
  const [selections, setSelections] = useState<PlantationTreeSelection[]>([])
  const [area, setArea] = useState<string>("1000")
  const [isLoading, setIsLoading] = useState(true)
  const [isLaunching, setIsLaunching] = useState(false)
  
  const { user } = useAuth()

  // Load Initial Data
  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      setIsLoading(true)
      try {
        if (urlRegion) {
          const rData = await getMapRegionById(urlRegion)
          if (mounted && rData) setRegionData(rData)
        }
        
        if (treeParams.length > 0) {
          const loadedTrees = await Promise.all(
            treeParams.map(id => getTreeDetails(id))
          )
          
          const validTrees = loadedTrees.filter(t => t !== undefined) as TreeRecommendation[]
          if (mounted) {
            setSelections(validTrees.map(t => ({ tree: t, quantity: 15 })))
          }
        }
      } catch(e) {
        console.error(e)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    loadData()
    return () => { mounted = false }
  }, [urlRegion])

  const updateQuantity = (treeId: string, delta: number) => {
    setSelections(prev => prev.map(s => {
      if (s.tree.id === treeId) {
        const newQ = Math.max(1, s.quantity + delta)
        return { ...s, quantity: newQ }
      }
      return s
    }))
  }

  const removeTree = (treeId: string) => {
    setSelections(prev => prev.filter(s => s.tree.id !== treeId))
    toast({
      title: "Tree removed",
      description: "Updated species mix for this plantation plan.",
      variant: "default"
    })
  }

  if (isLoading) {
    return <div className="h-64 animate-pulse bg-surface-muted rounded-xl w-full max-w-5xl mx-auto"></div>
  }

  if (selections.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-16 px-6 border border-dashed rounded-2xl bg-surface-muted/30 flex flex-col items-center">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
          <Sprout className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">No Tree Species in Plan Yet</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
          Select high-priority native species from the AI recommendations catalog to configure planting density and calculate microclimate cooling.
        </p>
        <Link href={`/ai${urlRegion ? `?region=${urlRegion}` : ''}`}>
          <Button size="medium" className="gap-2 shadow-xs">
            <Sparkles className="h-4 w-4" />
            <span>Select Recommended Native Trees</span>
          </Button>
        </Link>
      </div>
    )
  }

  // Calculate Summary
  const plan: PlantationPlan = {
    regionId: urlRegion || "unknown",
    availableAreaSqM: parseInt(area) || 0,
    primaryGoalId: "heat-reduction",
    trees: selections
  }
  
  const summary: PlantationSummary = calculatePlantationSummary(plan)

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Inputs & Selected Trees */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href={`/ai${urlRegion ? `?region=${urlRegion}` : ''}`}>
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to AI Recommendations
            </Button>
          </Link>
          {regionData && (
            <Badge variant="primary" className="text-xs">
              Target Ward: {regionData.region.name}
            </Badge>
          )}
        </div>

        {/* Plantation Site Details Card */}
        <Card className="border border-border/80 bg-surface shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold">Site Geometry &amp; Goals</CardTitle>
            <CardDescription className="text-xs">Configure physical site parameters to calculate optimal planting density.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Available Planting Area (m²)
                </label>
                <Input 
                  type="number" 
                  value={area} 
                  onChange={(e) => setArea(e.target.value)}
                  min="50"
                  step="50"
                  className="h-10 text-sm"
                  placeholder="e.g. 1000"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Standard Pune school/park plot is ~1,000–2,500 m²
                </span>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Primary Intervention Objective
                </label>
                <select className="flex h-10 w-full rounded-lg border border-border bg-surface-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option>Urban Heat Reduction &amp; Dense Shade</option>
                  <option>Maximum Carbon Sequestration</option>
                  <option>Dust &amp; Particulate Filtration</option>
                  <option>Groundwater Recharge &amp; Soil Retention</option>
                </select>
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Calibrates survival and growth models
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Trees List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-foreground">Species Allocation</h3>
            <span className="text-xs text-muted-foreground font-medium">
              {selections.length} Species Selected
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {selections.map((sel) => (
              <Card key={sel.tree.id} className="border border-border/80 bg-surface shadow-xs">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-foreground">{sel.tree.commonName}</h4>
                      <Badge variant="success" className="text-[10px]">
                        {sel.tree.overallScore}% Fit
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground italic font-serif mt-0.5">{sel.tree.scientificName}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                      <span>Water: <strong className="text-foreground">{sel.tree.waterRequirement}</strong></span>
                      <span>&bull;</span>
                      <span>Cooling Score: <strong className="text-primary">{sel.tree.coolingScore}/100</strong></span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3 bg-surface-muted/70 p-1.5 rounded-lg border border-border/70 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-md" 
                        onClick={() => updateQuantity(sel.tree.id, -5)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="w-12 text-center font-bold font-mono text-sm text-foreground">
                        {sel.quantity}
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-md" 
                        onClick={() => updateQuantity(sel.tree.id, 5)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="h-6 w-px bg-border/70" />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-danger hover:bg-danger/10" 
                      onClick={() => removeTree(sel.tree.id)}
                      aria-label="Remove tree"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Link href={`/ai${urlRegion ? `?region=${urlRegion}` : ''}`}>
              <Button variant="outline" className="w-full border-dashed gap-1.5 text-xs py-5" size="medium">
                <Plus className="h-4 w-4" /> Add Another Native Species
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Plan Summary Card */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 flex flex-col gap-4">
          <Card className="border-primary/30 shadow-md bg-surface">
            <CardHeader className="bg-surface-muted/40 border-b border-border/70 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Plan Summary</CardTitle>
                <Badge variant="primary" className="text-[10px]">Calculated</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5 flex flex-col gap-5">
              
              <div className="flex justify-between items-center pb-3 border-b border-border/60">
                <span className="text-xs text-muted-foreground font-medium">Total Saplings Planned</span>
                <span className="text-2xl font-extrabold text-primary">{summary.totalTrees}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-border/60">
                <span className="text-xs text-muted-foreground font-medium">Average Area / Tree</span>
                <span className="font-semibold text-foreground text-sm font-mono">
                  {plan.availableAreaSqM > 0 && summary.totalTrees > 0 
                    ? Math.round(plan.availableAreaSqM / summary.totalTrees) 
                    : 0} m²
                </span>
              </div>

              {/* Density Warnings if overloaded */}
              {summary.estimatedDensityWarnings.length > 0 && (
                <div className="bg-danger/10 border border-danger/25 rounded-xl p-3 text-xs text-danger flex gap-2 items-start">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold">Density Caution</span>
                    <span>{summary.estimatedDensityWarnings[0]}</span>
                  </div>
                </div>
              )}

              {/* Cooling Impact Estimation */}
              <div className="bg-surface-muted/50 rounded-xl p-3.5 text-xs text-muted-foreground border border-border/70 space-y-1">
                <span className="font-bold text-foreground text-xs block">Estimated Microclimate Impact</span>
                <p className="leading-relaxed">{summary.estimatedCooling}</p>
              </div>

              {/* Action Triggers */}
              <div className="flex flex-col gap-2.5 pt-2">
                {user ? (
                  <Button 
                    className="w-full shadow-xs gap-2" 
                    size="medium" 
                    onClick={async () => {
                      setIsLaunching(true);
                      try {
                        const res = await fetch("/api/v1/projects", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: `Plantation Drive — ${regionData?.region.name || 'Pune Ward'}`,
                            actionType: "Tree Plantation",
                            regionId: urlRegion || "unknown",
                            treesPlanned: summary.totalTrees,
                            species: selections.map(s => s.tree.commonName),
                            areaSqM: parseInt(area) || 0
                          })
                        });
                        const data = await res.json();
                        if (data.project) {
                          toast({
                            title: "Project Launched!",
                            description: "Your plantation plan has been registered in the action registry.",
                            variant: "success"
                          });
                          router.push(`/projects/${data.project.id}`);
                        } else {
                          setIsLaunching(false);
                          toast({
                            title: "Launch failed",
                            description: "Could not save project. Please check fields.",
                            variant: "danger"
                          });
                        }
                      } catch (e) {
                        setIsLaunching(false);
                      }
                    }}
                    disabled={isLaunching || summary.totalTrees === 0}
                  >
                    {isLaunching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
                    <span>Launch Action Project</span>
                  </Button>
                ) : (
                  <Link href="/login" className="w-full">
                    <Button className="w-full" size="medium">Sign In to Launch Project</Button>
                  </Link>
                )}
                
                <Link href={`/impact${urlRegion ? `?region=${urlRegion}` : ''}`} className="w-full">
                  <Button variant="outline" className="w-full text-xs" size="sm">
                    View Impact Projections
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}

export default function PlantationPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader 
        title="Urban Plantation Planner" 
        description="Convert bioclimatic tree recommendations into site-specific planting specifications and density calculations."
        badge={
          <Badge variant="primary" className="gap-1.5 py-1 px-3">
            <Sprout className="h-3 w-3" />
            <span>Turn-Key Planning</span>
          </Badge>
        }
      />
      <Suspense fallback={<div className="h-64 animate-pulse bg-surface-muted rounded-xl w-full"></div>}>
        <PlantationPlannerContent />
      </Suspense>
    </div>
  )
}
