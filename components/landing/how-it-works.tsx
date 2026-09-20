import React from "react"
import { Search, Eye, Sparkles, Sprout, BarChart3, ArrowRight } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Identify",
      description: "Pinpoint urban heat islands and surface temperature anomalies across Pune's municipal wards."
    },
    {
      number: "02",
      icon: Eye,
      title: "Understand",
      description: "Analyze microclimates, tree canopy deficit, vehicular density, and local heat vulnerability indices."
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Recommend",
      description: "AI matches the best native tree species based on soil compatibility, water stress, and cooling power."
    },
    {
      number: "04",
      icon: Sprout,
      title: "Plan",
      description: "Structure actionable urban forestry drives with site requirements and nursery sourcing."
    },
    {
      number: "05",
      icon: BarChart3,
      title: "Track",
      description: "Verify plantation progress, monitor sapling survival rates, and measure verified cooling impact."
    }
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-surface-muted/40 border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            Systematic Methodology
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            How HeatGuard AI Operates
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A continuous closed-loop cycle connecting satellite and localized heat data to tangible urban forestry intervention.
          </p>
        </div>

        {/* 5-step horizontal flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div 
                key={step.number} 
                className="group relative flex flex-col rounded-xl border border-border/80 bg-surface p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                {/* Top row: Number and Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-mono tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {step.number}
                  </span>
                  <div className="h-9 w-9 rounded-lg bg-surface-muted border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-4.5 w-4.5 stroke-[1.8]" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow indicator between items on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <span className="h-6 w-6 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground text-xs shadow-xs">
                      &rarr;
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
