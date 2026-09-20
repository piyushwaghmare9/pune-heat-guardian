import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Map, LayoutDashboard, Leaf } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-24 sm:py-32 text-white">
      {/* Background organic glow elements */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 translate-y-1/2 h-96 w-96 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-xs mb-6 border border-white/15">
          <Leaf className="h-3.5 w-3.5 text-emerald-300" />
          <span>Building Cooler, Climate-Resilient Urban Corridors</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-3xl mx-auto">
          Understand Your Microclimate.
          <br />
          Plan Urban Cooling Today.
        </h2>

        <p className="text-base sm:text-lg text-emerald-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join municipal leaders, community NGOs, and urban planners using HeatGuard AI to identify heat vulnerabilities and plant high-impact native urban forests.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/map" className="w-full sm:w-auto">
            <Button 
              size="large" 
              className="w-full sm:w-auto bg-white text-primary hover:bg-emerald-50 hover:text-primary-active font-semibold shadow-lg group gap-2"
            >
              <Map className="h-4 w-4" />
              Explore Pune Heat Map
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-primary" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button 
              size="large" 
              className="w-full sm:w-auto border border-white/30 bg-primary-hover/60 text-white hover:bg-white/15 backdrop-blur-xs gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Launch Live Dashboard
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-xs text-emerald-200/80 font-medium">
          Open climate data for Pune &bull; Native species intelligence &bull; Zero external proprietary map lock-in
        </p>
      </div>
    </section>
  )
}
