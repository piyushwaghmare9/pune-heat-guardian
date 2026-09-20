import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-lg", className)}
      {...props}
    />
  )
}

function SkeletonText({ className, lines = 3, ...props }: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3.5",
            i === lines - 1 ? "w-3/5" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-border p-5 space-y-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-5 rounded-md" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

function SkeletonMetric({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-border p-5 space-y-3", className)} {...props}>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-9 w-16" />
      <Skeleton className="h-3 w-36" />
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonMetric }
