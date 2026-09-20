import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { HeatRiskBadge } from "@/components/heat/heat-risk-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEMO_REGIONS_SUMMARY } from "@/lib/demo/dashboard-data"
import { ArrowRight, Droplets, Wind, Sparkles, MapPin } from "lucide-react"

export function RegionalHeatList() {
  return (
    <Card className="shadow-xs border border-border/80 bg-surface">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold">Monitored Wards &amp; Urban Zones</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive telemetry across Pune municipal zones and industrial corridors.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral" className="text-[10px]">10 Active Wards</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-muted/50 border-b border-border/60">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Ward / Region</th>
                <th scope="col" className="px-5 py-3 font-semibold">Heat Vulnerability</th>
                <th scope="col" className="px-5 py-3 font-semibold">Temperature</th>
                <th scope="col" className="px-5 py-3 font-semibold">Air Quality</th>
                <th scope="col" className="px-5 py-3 font-semibold text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {DEMO_REGIONS_SUMMARY.map((row) => (
                <tr 
                  key={row.region.id} 
                  className="bg-surface hover:bg-surface-muted/40 transition-colors group"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-semibold text-foreground">{row.region.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <HeatRiskBadge level={row.risk || "LOW"} />
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-foreground">{row.environmental.temperature}&deg;C</span>
                      {row.environmental.humidity && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                          <Droplets className="h-3 w-3 text-teal-600" /> {row.environmental.humidity}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-foreground">
                      <span className="font-semibold">{row.environmental.aqi} AQI</span>
                      <Wind className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/ai?region=${row.region.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary gap-1">
                          <Sparkles className="h-3 w-3" />
                          <span>AI Plan</span>
                        </Button>
                      </Link>
                      <Link href={`/map?region=${row.region.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <span>Map</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
