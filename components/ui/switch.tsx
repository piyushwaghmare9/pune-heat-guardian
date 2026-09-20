import * as React from "react"
import { cn } from "@/lib/utils"

export type SwitchProps = React.InputHTMLAttributes<HTMLInputElement>

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "h-6 w-11 rounded-full bg-border transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-checked:bg-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            className
          )}
        >
          <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
        </div>
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
