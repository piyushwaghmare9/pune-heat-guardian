import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ThermometerSun, Trees, Compass, Users } from "lucide-react"

export function ProblemSection() {
  const problems = [
    {
      icon: ThermometerSun,
      title: "Urban Heat Islands",
      highlight: "+4.5°C Night Spikes",
      description: "Dense concrete corridors and asphalt in commercial wards trap day radiation, creating persistent nighttime thermal stress."
    },
    {
      icon: Trees,
      title: "Acute Canopy Deficit",
      highlight: "<12% Green Cover",
      description: "Rapid expansion has degraded natural green buffers in eastern and central Pune, eliminating critical natural shade."
    },
    {
      icon: Compass,
      title: "Uninformed Species Selection",
      highlight: "50%+ Mortality",
      description: "Planting non-native ornamental trees leads to high water consumption, poor root anchoring, and low microclimate cooling."
    },
    {
      icon: Users,
      title: "Fragmented Action",
      highlight: "Uncoordinated Efforts",
      description: "Citizen groups, NGOs, and municipal agencies work in silos without a centralized registry to direct plantings where heat is worst."
    }
  ]

  return (
    <section id="problem" className="py-20 md:py-28 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger mb-3">
            The Climate Challenge
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Urban Heat Is Unequal Across Our City
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Neighborhoods only kilometers apart experience drastically different surface temperatures based on built density, vehicular throughput, and tree canopy distribution.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index} className="border border-border/80 shadow-xs hover:shadow-md transition-shadow bg-surface-elevated">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger border border-danger/20">
                      <Icon className="h-5 w-5 stroke-[1.8]" />
                    </div>
                    <div className="text-xs font-bold text-danger uppercase tracking-wider mb-1">
                      {item.highlight}
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
