import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

export interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  icon?: LucideIcon
  iconColor?: string
  iconBg?: string
  description?: string
  trend?: "positive" | "negative" | "neutral"
  badge?: React.ReactNode
  className?: string
}

export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  description,
  trend,
  badge,
  className
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden border border-border/80 bg-surface shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200", className)}>
      <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
            <div className="flex items-center gap-2">
              {badge && <div>{badge}</div>}
              {Icon && (
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", iconBg, iconColor)}>
                  <Icon className="h-4 w-4 stroke-[2]" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{value}</span>
            {unit && <span className="text-sm font-semibold text-muted-foreground">{unit}</span>}
          </div>
        </div>
        
        {(description || trend) && (
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center text-xs">
            {trend === "positive" && <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-success shrink-0" />}
            {trend === "negative" && <TrendingDown className="mr-1.5 h-3.5 w-3.5 text-danger shrink-0" />}
            {trend === "neutral" && <span className="mr-1.5 text-muted-foreground font-mono font-bold">&bull;</span>}
            
            <span className={cn(
              "leading-tight",
              trend === "positive" ? "text-success font-medium" : 
              trend === "negative" ? "text-danger font-medium" : 
              "text-muted-foreground"
            )}>
              {description}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
