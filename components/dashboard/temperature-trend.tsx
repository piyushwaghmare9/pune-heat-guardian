"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DEMO_HEAT_TREND } from "@/lib/demo/dashboard-data"

export function TemperatureTrend() {
  return (
    <Card className="shadow-subtle h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Temperature Trend</CardTitle>
            <CardDescription>24-hour heat progression for selected region (Demo Data)</CardDescription>
          </div>
          <div className="inline-flex items-center rounded border border-warning/50 bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
            Demo
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DEMO_HEAT_TREND}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="timestamp" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
              domain={['dataMin - 2', 'dataMax + 2']}
              unit="°"
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area 
              type="monotone" 
              dataKey="temperature" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              name="Region Temp"
            />
            <Area 
              type="monotone" 
              dataKey="averageTemperature" 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none" 
              name="City Average"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
