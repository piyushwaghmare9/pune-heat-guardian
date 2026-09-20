"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { getImpactSummary, getRegionalImpact } from "@/services/impactService"
import { ImpactSummary, RegionalImpact } from "@/types/impact"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Map, ClipboardList, TreeDeciduous, Info, AlertTriangle, BarChart3, ShieldCheck } from "lucide-react"

function ImpactContent() {
  const searchParams = useSearchParams()
  const regionQuery = searchParams.get("region")

  const [summary, setSummary] = useState<ImpactSummary | null>(null)
  const [regionalImpact, setRegionalImpact] = useState<RegionalImpact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      try {
        const [sumData, regData] = await Promise.all([
          getImpactSummary(),
          getRegionalImpact()
        ])
        
        if (mounted) {
          setSummary(sumData)
          setRegionalImpact(
            regionQuery ? regData.filter(r => r.regionId === regionQuery) : regData
          )
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    loadData()
    return () => { mounted = false }
  }, [regionQuery])

  if (isLoading) {
    return <div className="h-64 animate-pulse bg-surface-muted rounded-xl w-full max-w-6xl mx-auto"></div>
  }

  if (!summary) {
    return (
      <div className="w-full max-w-6xl mx-auto text-center py-16 px-4 border border-dashed rounded-2xl bg-surface-muted/30">
        <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-foreground mb-1">No Impact Data Logged</h2>
        <p className="text-xs text-muted-foreground">Launch a verified plantation plan to begin tracking environmental progress.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-6xl mx-auto">
      
      {/* 1. Methodology Disclaimer Banner */}
      <div className="bg-surface border border-border/80 rounded-xl p-4 text-xs flex gap-3.5 items-start shadow-xs">
        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-foreground text-sm">Scientific Impact Methodology</span>
          <p className="text-muted-foreground leading-relaxed">
            HeatGuard AI strictly distinguishes between verified field inventory and algorithmic projections. Tree counts reflect audited municipal and community plantation drives. Thermal cooling potential is derived from localized canopy area formulas.
          </p>
        </div>
      </div>

      {/* 2. Top-Line Verified Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/80 bg-surface shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Trees Planned</span>
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <TreeDeciduous className="h-4 w-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{summary.totalTreesPlanned?.toLocaleString() || "—"}</span>
            </div>
            <div className="flex mt-3 pt-3 border-t border-border/50">
              <Badge variant="primary" className="text-[10px] uppercase">Documented</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/80 bg-surface shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Plans</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ClipboardList className="h-4 w-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{summary.totalPlans?.toLocaleString() || "—"}</span>
            </div>
            <div className="flex mt-3 pt-3 border-t border-border/50">
              <Badge variant="success" className="text-[10px] uppercase">Registered</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-surface shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Wards Covered</span>
                <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <Map className="h-4 w-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{summary.totalRegions?.toLocaleString() || "—"}</span>
            </div>
            <div className="flex mt-3 pt-3 border-t border-border/50">
              <Badge variant="neutral" className="text-[10px] uppercase">Pune Zones</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-surface shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Area Green (m²)</span>
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Leaf className="h-4 w-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{summary.totalArea?.toLocaleString() || "—"}</span>
            </div>
            <div className="flex mt-3 pt-3 border-t border-border/50">
              <Badge variant="neutral" className="text-[10px] uppercase">Restored</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Regional Breakdown Table */}
      <Card className="border border-border/80 bg-surface shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Regional Intervention Progress</CardTitle>
              <CardDescription className="text-xs">Audit breakdown across monitored Pune municipal wards</CardDescription>
            </div>
            <Badge variant="neutral" className="text-[10px]">10 Target Wards</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {regionalImpact.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-8">No regional data recorded for this selection.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-muted/50 border-b border-border/60">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Pune Ward / Zone</th>
                    <th className="px-5 py-3 font-semibold text-right">Trees Planned</th>
                    <th className="px-5 py-3 font-semibold text-right">Site Area (m²)</th>
                    <th className="px-5 py-3 font-semibold">Intervention Focus</th>
                    <th className="px-5 py-3 font-semibold text-right">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {regionalImpact.map((ri) => (
                    <tr key={ri.regionId} className="hover:bg-surface-muted/40 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-foreground whitespace-nowrap">{ri.regionName}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-semibold text-foreground">{ri.treesPlanned.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-muted-foreground">{ri.area.toLocaleString()}</td>
                      <td className="px-5 py-3.5 capitalize text-xs text-muted-foreground">{ri.primaryGoal}</td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Badge 
                          variant={ri.status === 'completed' ? 'success' : ri.status === 'in-progress' ? 'primary' : 'neutral'} 
                          className="capitalize text-[10px]"
                        >
                          {ri.status.replace('-', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  )
}

export default function ImpactPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader 
        title="Impact &amp; Environmental Analytics" 
        description="Transparent progress monitoring, canopy expansion metrics, and verified climate interventions across Pune."
        badge={
          <Badge variant="primary" className="gap-1.5 py-1 px-3">
            <BarChart3 className="h-3 w-3" />
            <span>Audited Telemetry</span>
          </Badge>
        }
      />
      <Suspense fallback={<div className="h-64 animate-pulse bg-surface-muted rounded-xl w-full max-w-6xl mx-auto"></div>}>
        <ImpactContent />
      </Suspense>
    </div>
  )
}
