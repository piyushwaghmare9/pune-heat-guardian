"use client"

import React from "react"
import { BarChart2 } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { RiskDistribution } from "@/components/dashboard/risk-distribution"
import { TemperatureTrend } from "@/components/dashboard/temperature-trend"
import { RegionalHeatList } from "@/components/dashboard/regional-heat-list"

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Heat risk distribution and temperature trends across Pune
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <TemperatureTrend />
          </div>
          <div className="lg:col-span-1">
            <RiskDistribution />
          </div>
        </div>

        <RegionalHeatList />
      </div>
    </AppShell>
  )
}
