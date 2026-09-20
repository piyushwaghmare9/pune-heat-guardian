import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Layers, Thermometer, ShieldAlert } from "lucide-react"

export function HeatPreview() {
  const previewWards = [
    { name: "Hadapsar Industrial", temp: "39.5°C", risk: "Extreme", variant: "heat-extreme" as const, deficit: "84%" },
    { name: "Shivajinagar Central", temp: "38.2°C", risk: "High", variant: "heat-high" as const, deficit: "68%" },
    { name: "Viman Nagar Corridor", temp: "37.1°C", risk: "High", variant: "heat-high" as const, deficit: "61%" },
    { name: "Kothrud Green Belt", temp: "33.8°C", risk: "Moderate", variant: "heat-moderate" as const, deficit: "34%" },
  ]

  return (
    <section className="py-20 md:py-28 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-heat-high/10 px-3 py-1 text-xs font-semibold text-heat-high mb-4">
              <Thermometer className="h-3.5 w-3.5" />
              <span>Interactive Ward Mapping</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
              Pinpoint Heat Severity at the Neighborhood Level
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              Explore ward-by-ward microclimate data for Pune. Identify severe heat hotspots, inspect surface temperature trends, analyze tree canopy deficits, and isolate vulnerable demographic zones.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/map" className="w-full sm:w-auto">
                <Button size="large" className="w-full sm:w-auto group gap-2 shadow-xs">
                  Explore Interactive Heat Map
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  View Heat Summary Table
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Card className="shadow-lg border border-border/80 bg-surface overflow-hidden rounded-2xl">
              {/* Card topbar */}
              <div className="h-11 bg-surface-muted border-b flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
                  <span className="ml-2 text-xs font-medium text-foreground">Pune Heat Vulnerability Index</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Layers className="h-3 w-3 text-primary" />
                  <span>4 Active Layers</span>
                </div>
              </div>

              <CardContent className="p-5 sm:p-6 space-y-4">
                {/* Visual heat gradient gauge */}
                <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                  <div className="flex justify-between items-center text-xs font-semibold text-foreground mb-2">
                    <span>Heat Spectrum (&deg;C)</span>
                    <span className="text-muted-foreground font-normal text-[11px]">30&deg;C &mdash; 42&deg;C</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 to-red-600 shadow-inner" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5 font-medium">
                    <span>Low Risk (&lt;32&deg;C)</span>
                    <span>Moderate</span>
                    <span>High Risk</span>
                    <span className="text-danger font-semibold">Critical (&gt;39&deg;C)</span>
                  </div>
                </div>

                {/* Ward heat list preview */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Selected High-Risk Monitored Zones
                  </div>
                  {previewWards.map((ward) => (
                    <div 
                      key={ward.name} 
                      className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-surface-elevated hover:bg-surface-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-foreground">{ward.name}</div>
                          <div className="text-[11px] text-muted-foreground">Canopy Deficit: {ward.deficit}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-foreground">{ward.temp}</span>
                        <Badge variant={ward.variant} className="text-[10px] px-2">
                          {ward.risk}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>

            {/* Ambient blur behind card */}
            <div className="absolute -z-10 -bottom-6 -right-6 h-64 w-64 rounded-full bg-heat-high/10 blur-3xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  )
}
