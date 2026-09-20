import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, TrendingDown, Trees, Wind, Droplets } from "lucide-react"

export function ImpactSection() {
  const impactStats = [
    {
      icon: TrendingDown,
      value: "-3.5°C",
      label: "Target Heat Reduction",
      detail: "In high-density vulnerable wards"
    },
    {
      icon: Trees,
      value: "25,000+",
      label: "Native Trees Targeted",
      detail: "Planned across 10 municipal wards"
    },
    {
      icon: Wind,
      value: "600 Tons",
      label: "Annual Carbon Offset",
      detail: "At canopy maturity (Year 5+)"
    },
    {
      icon: Droplets,
      value: "40% Less",
      label: "Irrigation Dependency",
      detail: "Through drought-hardy indigenous species"
    }
  ]

  return (
    <section id="impact" className="py-20 md:py-28 bg-surface-muted/30 border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <div className="mx-auto max-w-3xl mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Target Impact Metrics</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Quantifying Climate Action for Pune
          </h2>
          
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every seedling planted through HeatGuard AI contributes to verifiable microclimate improvements. We model ecological ROI across canopy growth, temperature relief, and biodiversity restoration.
          </p>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div 
                key={stat.label}
                className="p-6 rounded-2xl border border-border/80 bg-surface shadow-xs text-left flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 stroke-[1.8]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {stat.label}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pt-3 border-t border-border/60">
                  {stat.detail}
                </div>
              </div>
            )
          })}
        </div>

        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/impact">
            <Button size="large" className="group gap-2 shadow-xs">
              Explore Live Impact Analytics
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/action">
            <Button variant="outline" size="large">
              View Verified Projects Registry
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
