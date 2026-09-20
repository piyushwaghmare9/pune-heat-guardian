import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Map, ShieldCheck, Thermometer, TreePine, Sparkles, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-24 md:pt-24 md:pb-32 border-b border-border/50">
      {/* Subtle ambient light glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-heat-high/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container relative mx-auto px-4 max-w-7xl">
        {/* Top Centered Headline */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-6 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>Pune Urban Heat Intelligence &bull; Active Monitoring</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
            Understand Urban Heat.
            <br />
            <span className="text-primary bg-gradient-to-r from-primary via-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Turn Climate Data Into Action.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            High-resolution temperature analytics, AI-guided native canopy modeling, and verifiable urban forestry interventions for Pune&apos;s most vulnerable microclimates.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link href="/map" className="w-full sm:w-auto">
              <Button size="large" className="w-full sm:w-auto group gap-2 shadow-md hover:shadow-lg">
                <Map className="h-4 w-4" />
                Explore Pune Heat Map
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="large" className="w-full sm:w-auto group gap-2">
                Open Live Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-6 pt-6 border-t border-border/60 max-w-xl mx-auto text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">10 Wards</div>
              <div className="text-xs text-muted-foreground">High-Risk Zones Tracked</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-primary">60+ Native</div>
              <div className="text-xs text-muted-foreground">Tree Species Modeled</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">-3.8&deg;C</div>
              <div className="text-xs text-muted-foreground">Max Simulated Cooling</div>
            </div>
          </div>
        </div>

        {/* Hero Interactive UI Preview Mockup */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-border/80 bg-surface shadow-2xl overflow-hidden backdrop-blur-xs">
          {/* Mock Browser/Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-surface-muted/70 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-danger/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <span className="ml-2 font-mono text-[11px] text-foreground-secondary hidden sm:inline">
                heatguard.ai/pune-intel/shivajinagar
              </span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Real-time Pune Climate Telemetry</span>
            </div>
          </div>

          {/* Inner Dashboard Preview Grid */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-background to-surface-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              
              {/* Card 1: Heat Hotspot Alert */}
              <div className="rounded-xl border border-heat-extreme/20 bg-surface-elevated p-4 shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-heat-extreme flex items-center gap-1">
                      <Thermometer className="h-3.5 w-3.5" /> Extreme Hotspot
                    </span>
                    <h3 className="font-bold text-base text-foreground mt-0.5">Hadapsar Industrial Zone</h3>
                  </div>
                  <Badge variant="heat-extreme" className="text-[11px]">39.6&deg;C</Badge>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Canopy Deficit:</span>
                    <span className="font-semibold text-danger">82% Bare Surface</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vulnerability Index:</span>
                    <span className="font-semibold text-foreground">8.9 / 10</span>
                  </div>
                  <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-heat-extreme h-full w-[89%]" />
                  </div>
                </div>
              </div>

              {/* Card 2: AI Recommendation Preview */}
              <div className="rounded-xl border border-primary/20 bg-surface-elevated p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-primary flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> AI Optimal Match
                    </span>
                    <Badge variant="success" className="text-[11px]">96% Match</Badge>
                  </div>
                  <h3 className="font-bold text-base text-foreground">Azadirachta indica (Neem)</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    High drought tolerance, dense crown shading, active carbon absorption for dense urban corridors.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Cooling Potential:</span>
                  <span className="font-semibold text-primary">&minus;2.8&deg;C Local Drop</span>
                </div>
              </div>

              {/* Card 3: Community Plantation Action */}
              <div className="rounded-xl border border-border bg-surface-elevated p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                      <TreePine className="h-3.5 w-3.5 text-primary" /> Active Drive
                    </span>
                    <Badge variant="neutral" className="text-[11px]">In Progress</Badge>
                  </div>
                  <h3 className="font-bold text-base text-foreground">Shivajinagar Green Corridor</h3>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Target: 500 Saplings</span>
                    <span className="font-semibold text-foreground">340 Planted</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-primary h-full w-[68%]" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Verified by Pune PMC</span>
                    <span className="text-primary font-medium flex items-center gap-0.5">
                      <ShieldCheck className="h-3 w-3" /> Certified
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
