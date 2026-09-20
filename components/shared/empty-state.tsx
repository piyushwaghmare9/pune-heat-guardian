import React from "react"
import { LucideIcon, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center border border-dashed rounded-xl border-border/80 bg-surface-muted/30 min-h-[280px]",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-border/60 shadow-xs mb-4 text-muted-foreground">
        <Icon className="h-6 w-6 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
