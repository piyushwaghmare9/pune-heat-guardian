import React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { MapWrapper } from "@/components/map/map-wrapper"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export const metadata = {
  title: 'Pune Heat Map — HeatGuard AI',
  description: 'Explore heat conditions, microclimatic variance, and urban heat vulnerability across monitored regions of Pune.',
}

export default function MapPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader 
        title="Pune Urban Heat Map" 
        description="Interactive thermal surface modeling, ward-level heat risk assessment, and active urban forestry interventions across Pune."
        badge={
          <Badge variant="primary" className="gap-1.5 py-1 px-3">
            <MapPin className="h-3 w-3" />
            <span>10 Wards Active</span>
          </Badge>
        }
      />
      
      <div className="w-full">
        <MapWrapper />
      </div>
    </div>
  )
}
