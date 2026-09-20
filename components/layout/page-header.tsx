import React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  badge?: React.ReactNode
  breadcrumbs?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  description, 
  badge,
  breadcrumbs,
  children,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 pb-6 md:pb-8", className)}>
      {breadcrumbs && (
        <div className="text-xs text-muted-foreground">
          {breadcrumbs}
        </div>
      )}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
