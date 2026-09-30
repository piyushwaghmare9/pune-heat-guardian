"use client"

import React from "react"
import Link from "next/link"
import { MapPin, Calendar, ArrowUpRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRegion } from "@/context/region-context"

import { CivicHeatStatus } from "@/components/dashboard/civic-heat-status"
import { TodayConditions } from "@/components/dashboard/today-conditions"
import { HotspotZones } from "@/components/dashboard/hotspot-zones"
import { MapWrapper } from "@/components/map/map-wrapper"
import { HeatLegend } from "@/components/heat/heat-legend"
import { AiRecommendationPanel } from "@/components/dashboard/ai-recommendation-panel"
import { HeatTrendChart } from "@/components/dashboard/heat-trend-chart"
import { ImpactPanel } from "@/components/dashboard/impact-panel"
import { HeatAlerts } from "@/components/dashboard/heat-alerts"
import { VendorSupportCard } from "@/components/dashboard/vendor-support-card"
import { MlPredictionPanel } from "@/components/ml/ml-prediction-panel"
import { Button } from "@/components/ui/button"


function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function DashboardGreeting() {
  const { user } = useAuth()
  const greeting = getGreeting()
  const firstName = user?.name?.split(" ")[0] ?? "there"

  const now = new Date()
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {greeting},{" "}
          <span className="text-primary">{firstName}</span>
        </h1>
        <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{dateStr}</span>
          <span className="text-border-strong">·</span>
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>Pune Metropolitan Region</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-heat-low/10 border border-heat-low/20 text-xs font-medium text-heat-low">
          <span className="h-1.5 w-1.5 rounded-full bg-heat-low animate-pulse" />
          Dataset Live
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { selectedRegionId, setSelectedRegion } = useRegion()

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-8">
      {/* ── 1. Greeting header ── */}
      <DashboardGreeting />

      {/* ── 2. Heat Status + Today's Conditions ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <CivicHeatStatus selectedRegionId={selectedRegionId} />
        </div>
        <div className="md:col-span-1">
          <TodayConditions selectedRegionId={selectedRegionId} />
        </div>
      </div>

      {/* ── 3. Heat Map (full width) ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-foreground">Pune Heat Map</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any region to explore heat data and get recommendations
            </p>
          </div>
          <Link href="/map">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              Explore Full Map
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <MapWrapper
          selectedRegionId={selectedRegionId}
          onRegionSelect={setSelectedRegion}
          compact
        />
        <div className="mt-3 px-1">
          <HeatLegend orientation="horizontal" />
        </div>
      </section>

      {/* ── 4. Hotspots + Cooler Zones ── */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-3">
          Zone Intelligence
        </h2>
        <HotspotZones />
      </section>

      {/* ── 5. AI Recommendations + Impact ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AiRecommendationPanel />
        <ImpactPanel />
      </div>

      {/* ── 5b. ML Predictions panel ── */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-3">
          XGBoost Predictions
        </h2>
        <MlPredictionPanel />
      </section>

      {/* ── 6. Heat Trend ── */}
      <section>
        <HeatTrendChart />
      </section>

      {/* ── 7. Alerts + Vendor (secondary row) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <HeatAlerts />
        </div>
        <div className="md:col-span-1">
          <VendorSupportCard />
        </div>
      </div>
    </div>
  )
}
