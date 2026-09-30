"use client"

import React, { useMemo } from "react"
import { AlertTriangle, Flame, Sprout, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { AppShell } from "@/components/layout/app-shell"
import { generateTopAlerts, type DashboardAlert } from "@/lib/dashboard-utils"
import { cn } from "@/lib/utils"
import Link from "next/link"

const ALERT_ICONS = {
  heat: Flame,
  aqi: AlertTriangle,
  plantation: Sprout,
}

const SEVERITY_STYLES: Record<
  "critical" | "warning" | "info",
  { bar: string; badge: string; badgeText: string }
> = {
  critical: {
    bar: "bg-heat-extreme",
    badge: "bg-heat-extreme/10 text-heat-extreme border-heat-extreme/20",
    badgeText: "Critical",
  },
  warning: {
    bar: "bg-heat-high",
    badge: "bg-heat-high/10 text-heat-high border-heat-high/20",
    badgeText: "Warning",
  },
  info: {
    bar: "bg-heat-low",
    badge: "bg-heat-low/10 text-heat-low border-heat-low/20",
    badgeText: "Info",
  },
}

export default function AlertsPage() {
  // Generate alerts for all high-risk regions
  const alerts: DashboardAlert[] = useMemo(() => generateTopAlerts(20), [])

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-5 w-5 text-heat-extreme" />
            <h1 className="text-2xl font-bold text-foreground">Heat Alerts</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {alerts.length} active alerts generated from real heat thresholds
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="h-12 w-12 rounded-full bg-heat-low/10 flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-heat-low" />
                </div>
                <p className="font-semibold text-foreground">No active alerts</p>
                <p className="text-sm text-muted-foreground">
                  All monitored regions are within normal heat parameters.
                </p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => {
              const Icon = ALERT_ICONS[alert.type]
              const styles = SEVERITY_STYLES[alert.severity]
              return (
                <Card
                  key={alert.id}
                  className="overflow-hidden relative"
                >
                  <div
                    className={cn(
                      "absolute left-0 inset-y-0 w-1.5",
                      styles.bar
                    )}
                  />
                  <CardContent className="pl-7 pr-5 py-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-surface-muted border border-border/60 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-foreground-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-bold text-foreground">
                          {alert.title}
                        </h3>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                            styles.badge
                          )}
                        >
                          {styles.badgeText}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          📍 {alert.regionName}
                        </span>
                        <Link
                          href={`/dashboard?region=${alert.regionId}`}
                          className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5"
                        >
                          View region
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </AppShell>
  )
}
