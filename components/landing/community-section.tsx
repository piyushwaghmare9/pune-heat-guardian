import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, HeartHandshake, ShieldCheck, Calendar } from "lucide-react"

export function CommunitySection() {
  const initiatives = [
    {
      title: "Pune Green Canopy Collective",
      type: "NGO Partner",
      drives: "12 Drives Completed",
      volunteers: "450+ Volunteers"
    },
    {
      title: "Hadapsar Urban Greening Trust",
      type: "Community Group",
      drives: "8 Drives Active",
      volunteers: "280+ Volunteers"
    },
    {
      title: "Clean Air & Biodiversity Forum",
      type: "Research & NGO",
      drives: "6 Monitored Sites",
      volunteers: "190+ Volunteers"
    }
  ]

  return (
    <section id="community" className="py-20 md:py-28 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary mb-4">
              <Users className="h-3.5 w-3.5" />
              <span>Civic Climate Mobilization</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
              Climate Action Works Best When Driven Together
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              HeatGuard AI empowers Pune&apos;s active network of environmental NGOs, resident welfare associations, student volunteers, and corporate CSR initiatives. Coordinate weekend plantation drives, track survival rates together, and claim collective microclimate impact.
            </p>
            
            <Link href="/community">
              <Button size="large" className="group gap-2 shadow-xs">
                Explore Community Initiatives
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <HeartHandshake className="h-3.5 w-3.5 text-secondary" />
                Active Pune Community Networks
              </span>
              <span className="text-xs text-secondary font-medium">Join or Partner</span>
            </div>

            {initiatives.map((item) => (
              <div 
                key={item.title}
                className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs hover:border-secondary/40 transition-colors flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                  <h3 className="text-sm font-bold text-foreground mt-1.5">{item.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.drives}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {item.volunteers}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
