import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sprout, MapPin, Trees, Ruler, Clock } from "lucide-react"

export function PlantationPreview() {
  return (
    <section className="py-20 md:py-28 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
              <Sprout className="h-3.5 w-3.5" />
              <span>Turn-Key Implementation</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
              Structured Plantation Planning Before You Break Ground
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              Transition seamlessly from species recommendations to site execution. Calculate planting density, estimate required saplings, configure water management, and schedule maintenance intervals tailored to Pune&apos;s monsoon patterns.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/plantation" className="w-full sm:w-auto">
                <Button size="large" className="w-full sm:w-auto group gap-2 shadow-xs">
                  Launch Plantation Planner
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/action" className="w-full sm:w-auto">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  Browse Active Projects
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Card className="shadow-lg border border-border/80 bg-surface overflow-hidden rounded-2xl">
              <div className="h-11 bg-surface-muted border-b flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">Active Plan Draft &bull; Pune East Corridor</span>
                </div>
                <Badge variant="success" className="text-[10px]">Ready to Deploy</Badge>
              </div>

              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border/70 bg-surface-muted/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <MapPin className="h-3.5 w-3.5" /> Target Ward
                    </div>
                    <div className="text-sm font-bold text-foreground">Hadapsar Industrial</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-surface-muted/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Ruler className="h-3.5 w-3.5" /> Project Area
                    </div>
                    <div className="text-sm font-bold text-foreground">2,400 sq. meters</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Trees className="h-4 w-4 text-primary" /> Recommended Canopy Mix
                    </span>
                    <span className="font-bold text-primary">320 Native Trees</span>
                  </div>
                  <div className="w-full bg-surface-muted h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-primary h-full w-[45%]" title="Neem (45%)" />
                    <div className="bg-emerald-600 h-full w-[35%]" title="Karanj (35%)" />
                    <div className="bg-teal-500 h-full w-[20%]" title="Peepal (20%)" />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                    <span>45% Neem</span>
                    <span>35% Karanj</span>
                    <span>20% Peepal</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Projected Cooling in 3 Yrs:
                  </span>
                  <span className="font-bold text-primary">&minus;2.3&deg;C Surface Temp</span>
                </div>
              </CardContent>
            </Card>

            <div className="absolute -z-10 -bottom-6 -right-6 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  )
}
