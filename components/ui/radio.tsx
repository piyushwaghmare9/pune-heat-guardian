import * as React from "react"
import { cn } from "@/lib/utils"

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement>

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="radio"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary accent-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Radio.displayName = "Radio"

export { Radio }
