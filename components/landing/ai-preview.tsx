import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, TreePine, Droplets, Sun, Wind } from "lucide-react"

export function AIPreview() {
  const recommendedSpecies = [
    {
      common: "Neem",
      botanical: "Azadirachta indica",
      score: "96%",
      cooling: "High (-2.8°C)",
      water: "Low (Drought Hardy)",
      co2: "24 kg/yr",
      growth: "Moderate"
    },
    {
      common: "Karanj",
      botanical: "Pongamia pinnata",
      score: "92%",
      cooling: "High (-2.4°C)",
      water: "Very Low",
      co2: "22 kg/yr",
      growth: "Fast"
    },
    {
      common: "Peepal",
      botanical: "Ficus religiosa",
      score: "89%",
      cooling: "Extreme (-3.5°C)",
      water: "Moderate",
      co2: "32 kg/yr",
      growth: "Fast"
    }
  ]

  return (
    <section className="py-20 md:py-28 bg-surface-muted/40 border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Visual Showcase (Tree Cards) */}
          <div className="order-2 lg:order-1 space-y-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI Ranked Species Match (Pune Region)
              </span>
              <span className="text-xs text-primary font-medium">60+ Native Library</span>
            </div>

            {recommendedSpecies.map((species, i) => (
              <div 
                key={species.botanical}
                className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs hover:border-primary/40 transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <TreePine className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground flex items-center gap-2">
                        {species.common}
                        <Badge variant="success" className="text-[10px] py-0">
                          {species.score} Match
                        </Badge>
                      </div>
                      <div className="text-xs italic text-muted-foreground font-serif">
                        {species.botanical}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                  <div>
                    <span className="block text-[10px] text-muted-foreground/70">Cooling Impact</span>
                    <span className="font-semibold text-primary">{species.cooling}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted-foreground/70">Water Needs</span>
                    <span className="font-semibold text-foreground">{species.water}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted-foreground/70">CO2 Capture</span>
                    <span className="font-semibold text-foreground">{species.co2}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Copy and CTA */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Species Optimization Model</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
              From Heat Hotspot to Precision Planting Plan
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              HeatGuard AI evaluates tree suitability based on native bio-climatology, root infrastructure safety, drought resistance, and crown shade density. Avoid generic sapling giveaways &mdash; plant species engineered to survive and cool.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/ai" className="w-full sm:w-auto">
                <Button size="large" className="w-full sm:w-auto group gap-2 shadow-xs">
                  Generate Species Recommendations
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/plantation" className="w-full sm:w-auto">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  Open Plantation Planner
                </Button>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
