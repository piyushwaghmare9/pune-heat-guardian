import React from "react"
import { Database, LineChart, BrainCircuit, Sprout, Award } from "lucide-react"

export function SolutionSection() {
  const pillars = [
    {
      step: "DATA",
      icon: Database,
      title: "Environmental Telemetry",
      desc: "Aggregates ward-level surface temperatures, vegetation indices, canopy metrics, and demographic exposure."
    },
    {
      step: "INSIGHT",
      icon: LineChart,
      title: "Heat Risk Scoring",
      desc: "Computes localized Heat Vulnerability Indices (HVI) to objectively rank intervention priorities."
    },
    {
      step: "RECOMMENDATION",
      icon: BrainCircuit,
      title: "Bio-Climatic Tree Matching",
      desc: "AI engine recommends native species matching soil type, moisture tolerance, and maximum cooling potential."
    },
    {
      step: "ACTION",
      icon: Sprout,
      title: "Structured Plantation",
      desc: "Builds turn-key plantation plans, links to verified local nurseries, and mobilizes community groups."
    },
    {
      step: "IMPACT",
      icon: Award,
      title: "Verified Cooling",
      desc: "Audits project lifecycle from sapling planting to mature canopy coverage with verifiable cooling metrics."
    }
  ]

  return (
    <section id="solution" className="py-20 md:py-28 bg-surface-muted/30 border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            The HeatGuard AI Solution
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            From Raw Heat Data to Verified Cooling
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A comprehensive pipeline bridging scientific climate intelligence with on-the-ground native tree plantation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div 
                key={pillar.step} 
                className="relative rounded-xl border border-border/70 bg-surface p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {pillar.step}
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
