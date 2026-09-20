import React from "react"
import { MetricCard } from "@/components/data-display/metric-card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Activity, Droplets, AlertTriangle, Wind } from "lucide-react"
import { DEMO_REGIONS_SUMMARY } from "@/lib/demo/dashboard-data"

export function MetricGrid({ regionId }: { regionId?: string }) {
  // Use passed regionId or default to the first demo region
  const currentRegion = DEMO_REGIONS_SUMMARY.find(r => r.region.id === regionId) || DEMO_REGIONS_SUMMARY[0]
  const demoData = currentRegion.environmental
  const risk = currentRegion.risk

  const getRiskBadge = () => {
    switch (risk) {
      case "EXTREME": return <Badge variant="heat-extreme">Critical</Badge>
      case "HIGH": return <Badge variant="heat-high">High Alert</Badge>
      case "MODERATE": return <Badge variant="heat-moderate">Moderate</Badge>
      default: return <Badge variant="heat-low">Normal</Badge>
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <MetricCard
        title="Peak Temperature"
        value={demoData.temperature?.toString() ?? "--"}
        unit="°C"
        icon={Thermometer}
        iconColor="text-heat-high"
        iconBg="bg-heat-high/10"
        trend="positive"
        description="+1.8°C above historical 10-year mean"
      />
      <MetricCard
        title="Heat Vulnerability"
        value={risk ?? "MODERATE"}
        badge={getRiskBadge()}
        icon={AlertTriangle}
        iconColor={risk === "EXTREME" ? "text-danger" : "text-warning"}
        iconBg={risk === "EXTREME" ? "bg-danger/10" : "bg-warning/10"}
        trend="neutral"
        description="High built density & low canopy cover"
      />
      <MetricCard
        title="Air Quality (AQI)"
        value={demoData.aqi?.toString() ?? "124"}
        unit="AQI"
        icon={Activity}
        iconColor="text-amber-500"
        iconBg="bg-amber-500/10"
        trend="negative"
        description="Moderate PM2.5 in central transit zones"
      />
      <MetricCard
        title="Relative Humidity"
        value={demoData.humidity?.toString() ?? "48"}
        unit="%"
        icon={Droplets}
        iconColor="text-teal-600"
        iconBg="bg-teal-500/10"
        trend="neutral"
        description="Consistent dry pre-monsoon baseline"
      />
    </div>
  )
}
