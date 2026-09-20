import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { HeatLegend } from "@/components/heat/heat-legend"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, MapPin, ArrowUpRight } from "lucide-react"

export function HeatMapPreview() {
  return (
    <Card className="shadow-xs border border-border/80 bg-surface h-full flex flex-col overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-bold">Pune Regional Heat Map</CardTitle>
          <Badge variant="neutral" className="text-[10px]">Interactive Grid</Badge>
        </div>
        <Link href="/map">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary-hover">
            <span>Full Map View</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between p-0 relative">
        <div className="flex-1 min-h-[260px] bg-surface-muted/60 relative border-b overflow-hidden flex items-center justify-center">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          {/* Simulated Ward Heat Pins */}
          <div className="absolute top-[28%] left-[24%] flex items-center gap-1.5 bg-surface/90 border border-border px-2.5 py-1 rounded-full shadow-xs text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-heat-high animate-ping" />
            <span>Shivajinagar: 38.2°C</span>
          </div>

          <div className="absolute top-[48%] right-[22%] flex items-center gap-1.5 bg-surface/90 border border-heat-extreme/40 px-2.5 py-1 rounded-full shadow-xs text-xs font-bold text-heat-extreme">
            <span className="h-2 w-2 rounded-full bg-heat-extreme" />
            <span>Hadapsar: 39.5°C</span>
          </div>

          <div className="absolute bottom-[24%] left-[36%] flex items-center gap-1.5 bg-surface/90 border border-border px-2.5 py-1 rounded-full shadow-xs text-xs font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-heat-moderate" />
            <span>Kothrud: 33.8°C</span>
          </div>

          {/* Hover overlay inviting user to click */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <Link href="/map">
              <Button variant="primary" size="medium" className="gap-2 shadow-lg">
                <Map className="h-4 w-4" />
                Launch Full Heat Map Explorer
              </Button>
            </Link>
            <span className="text-xs text-muted-foreground">Pan, zoom, and inspect ward microclimates</span>
          </div>
        </div>
        
        <div className="p-4 bg-surface">
          <HeatLegend />
        </div>
      </CardContent>
    </Card>
  )
}
