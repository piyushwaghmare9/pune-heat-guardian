import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function ChartContainer({ title, description, children }: ChartContainerProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full bg-surface-muted/30 rounded-md border border-dashed flex items-center justify-center p-4">
          {/* Recharts or similar chart library goes here in the future */}
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
