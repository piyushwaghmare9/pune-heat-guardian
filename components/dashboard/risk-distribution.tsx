"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { RISK_DISTRIBUTION } from "@/lib/demo/dashboard-data"

export function RiskDistribution() {
  return (
    <Card className="shadow-subtle h-full flex flex-col">
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>Percentage of monitored zones by heat risk level</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center min-h-[300px]">
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={RISK_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {RISK_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: any) => [`${value}%`, 'Regions']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-foreground">10</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Regions</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4 px-4">
          {RISK_DISTRIBUTION.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.fill }} />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
