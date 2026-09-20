import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "border-transparent bg-primary/10 text-primary",
        secondary: "border-transparent bg-secondary/10 text-secondary",
        neutral: "border-transparent bg-surface-muted text-foreground-secondary",
        success: "border-transparent bg-success/10 text-success",
        warning: "border-transparent bg-warning/10 text-warning",
        danger: "border-transparent bg-danger/10 text-danger",
        info: "border-transparent bg-info/10 text-info",
        "heat-low": "border-transparent bg-heat-low/10 text-heat-low",
        "heat-moderate": "border-transparent bg-heat-moderate/10 text-heat-moderate",
        "heat-high": "border-transparent bg-heat-high/10 text-heat-high",
        "heat-extreme": "border-transparent bg-heat-extreme/10 text-heat-extreme",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
