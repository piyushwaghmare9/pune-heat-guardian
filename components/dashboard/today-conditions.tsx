"use client"

import React, { useMemo, useState, useEffect } from "react"
import { Droplets, Wind, Sun, Gauge, Radio } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { datasetLoader } from "@/lib/data/dataset-loader"
import { getLiveWeather, type LiveWeatherData } from "@/services/weatherService"

interface TodayConditionsProps {
  selectedRegionId: string | null
}

function getAqiDescription(aqi: number): string {
  if (aqi <= 50) return "Good quality"
  if (aqi <= 100) return "Moderate air"
  if (aqi <= 150) return "Sensitive caution"
  return "Unhealthy air"
}

function getUvDescription(uv: number): string {
  if (uv === 0) return "Zero (Nighttime)"
  if (uv <= 2) return "Low exposure"
  if (uv <= 5) return "Moderate"
  if (uv <= 7) return "High — shade needed"
  return "Very high — stay indoors"
}

function getWindDescription(speedKmh: number): string {
  if (speedKmh < 5) return "Calm / Light air"
  if (speedKmh <= 15) return "Gentle breeze"
  if (speedKmh <= 25) return "Moderate wind"
  return "Strong wind"
}

export function TodayConditions({ selectedRegionId }: TodayConditionsProps) {
  const regions = useMemo(() => datasetLoader.getRegions(), [])

  const regionData = useMemo(() => {
    if (selectedRegionId) {
      return regions.find((r) => r.id === selectedRegionId) ?? regions[0]
    }
    return [...regions].sort((a, b) => b.avgTemperatureC - a.avgTemperatureC)[0]
  }, [selectedRegionId, regions])

  const [weather, setWeather] = useState<LiveWeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!regionData) return
    let active = true

    // Fetch live weather data for the region coordinates
    getLiveWeather(regionData.center.lat, regionData.center.lng)
      .then((data) => {
        if (active) {
          setWeather(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [regionData])

  if (!regionData) return null

  const tiles = [
    {
      icon: Droplets,
      label: "Humidity",
      value: weather ? `${Math.round(weather.humidity)}%` : "55%",
      note: weather?.isLive ? "Live telemetry" : "Estimated average",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950/30",
    },
    {
      icon: Gauge,
      label: "Air Quality (AQI)",
      value: weather ? `${Math.round(weather.aqi)} AQI` : "100 AQI",
      note: weather ? getAqiDescription(weather.aqi) : "Moderate air",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      icon: Sun,
      label: "UV Index",
      value: weather ? `${weather.uvIndex.toFixed(1)}` : "0.0",
      note: weather ? getUvDescription(weather.uvIndex) : "Solar exposure",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: weather ? `${weather.windSpeed.toFixed(1)} km/h` : "8.5 km/h",
      note: weather ? getWindDescription(weather.windSpeed) : "Light breeze",
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-50 dark:bg-sky-950/30",
    },
  ]

  return (
    <Card className="h-full flex flex-col border border-border/80 shadow-xs">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-semibold text-foreground">
            Today&apos;s Conditions
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {regionData.name}
          </p>
        </div>

        {weather?.isLive ? (
          <Badge
            variant="success"
            className="text-[10px] gap-1 px-2 py-0.5"
          >
            <Radio className="h-2.5 w-2.5 animate-pulse" />
            <span>Live Data</span>
          </Badge>
        ) : (
          <Badge
            variant="neutral"
            className="text-[10px] gap-1 px-2 py-0.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>Modeled</span>
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-2.5">
          {tiles.map((tile) => {
            const Icon = tile.icon
            return (
              <div
                key={tile.label}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-muted/50 border border-border/60 transition-colors"
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${tile.bgColor}`}>
                  <Icon className={`h-4 w-4 ${tile.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground leading-none">
                    {tile.label}
                  </p>
                  <p className="text-base font-bold text-foreground mt-1 leading-tight">
                    {loading ? "..." : tile.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {tile.note}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Region context from dataset */}
        <div className="mt-4 pt-3 border-t border-border/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Cataloged Trees</span>
            <span className="font-semibold text-foreground">
              {regionData.treeCount} trees
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1.5">
            <span className="text-muted-foreground">Thermal Risk Level</span>
            <span
              className={`font-semibold ${
                regionData.riskLevel === "EXTREME"
                  ? "text-heat-extreme"
                  : regionData.riskLevel === "HIGH"
                  ? "text-heat-high"
                  : regionData.riskLevel === "MODERATE"
                  ? "text-heat-moderate"
                  : "text-heat-low"
              }`}
            >
              {regionData.riskLevel}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/80 mt-2 text-right">
            Open-Meteo &amp; Pune Urban GIS
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
