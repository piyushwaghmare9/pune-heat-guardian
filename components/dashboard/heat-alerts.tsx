"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { AlertTriangle, Flame, Sprout, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { datasetLoader } from "@/lib/data/dataset-loader"
import {
  generateAlertsForRegion,
  generateTopAlerts,
  type DashboardAlert,
} from "@/lib/dashboard-utils"
import { useRegion } from "@/context/region-context"
import { cn } from "@/lib/utils"

const ALERT_ICONS = {
  heat: Flame,
  aqi: AlertTriangle,
  plantation: Sprout,
}

const ALERT_SEVERITY_STYLES: Record<
  "critical" | "warning" | "info",
  { bar: string; icon: string; bg: string; border: string }
> = {
  critical: {
    bar: "bg-heat-extreme",
    icon: "text-heat-extreme",
    bg: "bg-heat-extreme/5",
    border: "border-heat-extreme/20",
  },
  warning: {
    bar: "bg-heat-high",
    icon: "text-heat-high",
    bg: "bg-heat-high/5",
    border: "border-heat-high/20",
  },
  info: {
    bar: "bg-heat-low",
    icon: "text-heat-low",
    bg: "bg-heat-low/5",
    border: "border-heat-low/20",
  },
}

function AlertRow({ alert }: { alert: DashboardAlert }) {
  const Icon = ALERT_ICONS[alert.type]
  const styles = ALERT_SEVERITY_STYLES[alert.severity]

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border relative overflow-hidden",
        styles.bg,
        styles.border
      )}
    >
      {/* Left accent bar */}
      <div className={cn("absolute left-0 inset-y-0 w-1 rounded-l-lg", styles.bar)} />
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-background border border-border/60")}>
        <Icon className={cn("h-3.5 w-3.5", styles.icon)} />
      </div>
      <div className="flex-1 min-w-0 pl-1">
        <p className="text-sm font-semibold text-foreground leading-tight">
          {alert.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {alert.description}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
          📍 {alert.regionName}
        </p>
      </div>
    </div>
  )
}

export function HeatAlerts() {
  const { selectedRegionId } = useRegion()

  const alerts = useMemo((): DashboardAlert[] => {
    if (selectedRegionId) {
      const region = datasetLoader.getRegionById(selectedRegionId)
      if (region) {
        const regionAlerts = generateAlertsForRegion(region)
        // If region has no alerts, fall back to top alerts
        return regionAlerts.length > 0 ? regionAlerts.slice(0, 3) : generateTopAlerts(3)
      }
    }
    return generateTopAlerts(3)
  }, [selectedRegionId])

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-heat-extreme/10 border border-heat-extreme/20 flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5 text-heat-extreme" />
            </div>
            <CardTitle className="text-sm font-bold">Heat Alerts</CardTitle>
          </div>
          {alerts.length > 0 && (
            <span className="h-5 w-5 rounded-full bg-heat-extreme text-white text-[10px] font-bold flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Generated from real heat thresholds
        </p>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col gap-2">
        {alerts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-6 text-center">
            <div>
              <div className="h-10 w-10 rounded-full bg-heat-low/10 border border-heat-low/20 flex items-center justify-center mx-auto mb-2">
                <Sprout className="h-5 w-5 text-heat-low" />
              </div>
              <p className="text-sm font-medium text-foreground">No active alerts</p>
              <p className="text-xs text-muted-foreground mt-1">
                This area is within normal heat parameters.
              </p>
            </div>
          </div>
        ) : (
          alerts.map((alert) => <AlertRow key={alert.id} alert={alert} />)
        )}

        <div className="mt-auto pt-3 border-t border-border/60">
          <Link href="/alerts">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between text-xs"
            >
              <span>View all alerts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
