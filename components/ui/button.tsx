import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-subtle hover:shadow-medium",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        outline: "border border-border bg-background hover:bg-surface hover:text-foreground hover:border-border-strong",
        ghost: "hover:bg-surface hover:text-foreground",
        danger: "bg-danger text-white hover:bg-danger/90",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        small: "h-8 rounded-md px-3 text-xs",
        md: "h-9 px-4 py-2",
        medium: "h-9 px-4 py-2",
        lg: "h-11 px-6 text-base",
        large: "h-11 px-6 text-base",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
