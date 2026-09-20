import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "small" | "medium" | "large"
}

export function Spinner({ className, size = "medium", ...props }: SpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
      {...props}
    />
  )
}
