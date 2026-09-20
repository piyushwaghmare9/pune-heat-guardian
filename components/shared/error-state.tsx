import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Unable to load data",
  description = "An error occurred while fetching environmental records. Please try again.",
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center border rounded-xl border-danger/25 bg-danger/5 min-h-[280px]",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 border border-danger/20 mb-4 text-danger">
        <AlertTriangle className="h-6 w-6 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-danger mb-1.5 tracking-tight">{title}</h3>
      <p className="text-sm text-foreground-secondary max-w-sm mb-6 leading-relaxed">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm" className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </Button>
      )}
    </div>
  )
}
