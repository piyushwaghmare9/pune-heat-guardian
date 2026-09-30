"use client"

import React, { useMemo, useState } from "react"
import { ArrowUpDown, MapPin, Flame } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { HeatRiskBadge } from "@/components/heat/heat-risk-badge"
import { AppShell } from "@/components/layout/app-shell"
import { datasetLoader } from "@/lib/data/dataset-loader"
import { useRouter } from "next/navigation"

type SortKey = "temp" | "trees" | "name"
type SortDir = "asc" | "desc"

interface SortBtnProps {
  label: string
  sk: SortKey
  isActive: boolean
  onClick: (sk: SortKey) => void
}

function SortBtn({ label, sk, isActive, onClick }: SortBtnProps) {
  return (
    <button
      onClick={() => onClick(sk)}
      className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded transition-colors
        ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  )
}

export default function HotspotsPage() {
  const [sortKey, setSortKey] = useState<SortKey>("temp")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const router = useRouter()

  const regions = useMemo(() => datasetLoader.getRegions(), [])

  const sorted = useMemo(() => {
    return [...regions].sort((a, b) => {
      let cmp = 0
      if (sortKey === "temp") cmp = a.avgTemperatureC - b.avgTemperatureC
      else if (sortKey === "trees") cmp = a.treeCount - b.treeCount
      else cmp = a.name.localeCompare(b.name)
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [regions, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-heat-extreme" />
            <h1 className="text-2xl font-bold text-foreground">All Hotspots</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {regions.length} regions monitored · sorted by {sortKey} ({sortDir})
          </p>
        </div>

        <Card>
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium mr-1">Sort by:</span>
              <SortBtn label="Temperature" sk="temp" isActive={sortKey === "temp"} onClick={handleSort} />
              <SortBtn label="Trees" sk="trees" isActive={sortKey === "trees"} onClick={handleSort} />
              <SortBtn label="Name" sk="name" isActive={sortKey === "name"} onClick={handleSort} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {sorted.map((r, idx) => (
                <button
                  key={r.id}
                  onClick={() => router.push(`/dashboard?region=${r.id}`)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-surface-muted/50 transition-colors"
                >
                  <span className="text-xs font-bold text-muted-foreground w-6 shrink-0 tabular-nums">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-semibold text-foreground truncate">
                      {r.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-foreground shrink-0">
                    {r.avgTemperatureC}°C
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                    {r.treeCount} trees
                  </span>
                  <div className="shrink-0">
                    <HeatRiskBadge level={r.riskLevel} />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
