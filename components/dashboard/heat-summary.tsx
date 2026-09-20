import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeatRiskBadge } from "@/components/heat/heat-risk-badge"
import { ArrowRight, MapPin, Sparkles, Sprout, Thermometer, Droplets, Wind } from "lucide-react"
import { DEMO_REGIONS_SUMMARY } from "@/lib/demo/dashboard-data"

export function HeatSummary({ regionId }: { regionId?: string }) {
  const currentRegion = DEMO_REGIONS_SUMMARY.find(r => r.region.id === regionId) || DEMO_REGIONS_SUMMARY[0]

  return (
    <Card className="shadow-xs border border-border/80 bg-surface h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Region Spotlight</CardTitle>
          <div className="flex items-center gap-1 text-xs text-primary font-medium">
            <MapPin className="h-3.5 w-3.5" />
            <span>Active Focus</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 flex-1 flex flex-col justify-between gap-5">
        <div className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">
              Monitored Ward
            </div>
            <div className="text-xl font-extrabold text-foreground tracking-tight">
              {currentRegion.region.name}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted/50 border border-border/60">
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Vulnerability Status</div>
              <HeatRiskBadge level={currentRegion.risk || "LOW"} />
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5">Surface Temp</div>
              <span className="text-lg font-bold text-foreground">
                {currentRegion.environmental.temperature ?? "--"}°C
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-border/60 bg-surface-elevated flex items-center gap-2">
              <Droplets className="h-4 w-4 text-teal-600" />
              <div>
                <span className="text-muted-foreground block text-[10px]">Humidity</span>
                <span className="font-semibold text-foreground">{currentRegion.environmental.humidity ?? 45}%</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-border/60 bg-surface-elevated flex items-center gap-2">
              <Wind className="h-4 w-4 text-amber-500" />
              <div>
                <span className="text-muted-foreground block text-[10px]">Air Quality</span>
                <span className="font-semibold text-foreground">{currentRegion.environmental.aqi ?? 120} AQI</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Elevated surface temperatures driven by high impervious surface density. Priority recommended for native shade tree planting.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-border/60">
          <Link href={`/map?region=${currentRegion.region.id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full justify-between group">
              <span>View On Heat Map</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-muted-foreground" />
            </Button>
          </Link>
          <Link href={`/ai?region=${currentRegion.region.id}`} className="w-full">
            <Button variant="primary" size="sm" className="w-full justify-between group shadow-xs">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> AI Recommended Species
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
