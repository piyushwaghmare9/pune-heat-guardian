import React from "react"
import { MetricGrid } from "@/components/dashboard/metric-grid"
import { HeatSummary } from "@/components/dashboard/heat-summary"
import { HeatMapPreview } from "@/components/dashboard/heat-map-preview"
import { TemperatureTrend } from "@/components/dashboard/temperature-trend"
import { RiskDistribution } from "@/components/dashboard/risk-distribution"
import { RegionalHeatList } from "@/components/dashboard/regional-heat-list"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, RefreshCw } from "lucide-react"

export const metadata = {
  title: "Dashboard — Pune Climate Intelligence | HeatGuard AI",
  description: "Monitor heat anomalies, microclimatic trends, and urban forestry intervention priorities across Pune.",
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const regionId = typeof params.region === 'string' ? params.region : undefined

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Top Header & Context */}
      <PageHeader 
        title="Heat Intelligence Overview" 
        description="Monitor microclimate conditions, ward-level heat vulnerabilities, and AI-recommended interventions across Pune."
        badge={
          <Badge variant="success" className="gap-1.5 py-1 px-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Live</span>
          </Badge>
        }
      >
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-surface border border-border px-3 py-1.5 rounded-lg">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated: Today, 14:00 IST</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground bg-surface-muted border border-border px-3 py-1.5 rounded-lg">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Pune Metropolitan Area</span>
          </div>
        </div>
      </PageHeader>
      
      {/* Primary Metrics Layer */}
      <MetricGrid regionId={regionId} />

      {/* Secondary Layer: Summaries & Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HeatSummary regionId={regionId} />
        </div>
        <div className="lg:col-span-2">
          <HeatMapPreview />
        </div>
      </div>

      {/* Tertiary Layer: Analytics & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TemperatureTrend />
        </div>
        <div className="lg:col-span-1">
          <RiskDistribution />
        </div>
      </div>

      {/* Data Table Layer */}
      <div className="w-full">
        <RegionalHeatList />
      </div>
    </div>
  )
}
