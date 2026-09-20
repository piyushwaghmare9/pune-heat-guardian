"use client"

import * as React from "react"
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastVariant = "default" | "success" | "warning" | "danger" | "info"

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextType {
  toasts: ToastItem[]
  toast: (options: Omit<ToastItem, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastItem = { id, title, description, variant, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id)
        }, duration)
      }
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4 sm:p-0"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="alert"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl p-4 shadow-lg border text-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2",
              item.variant === "success" && "bg-surface-elevated border-success/30 text-foreground",
              item.variant === "danger" && "bg-surface-elevated border-danger/30 text-foreground",
              item.variant === "warning" && "bg-surface-elevated border-warning/30 text-foreground",
              item.variant === "info" && "bg-surface-elevated border-info/30 text-foreground",
              (!item.variant || item.variant === "default") && "bg-surface-elevated border-border text-foreground"
            )}
          >
            <div className="shrink-0 pt-0.5">
              {item.variant === "success" && <CheckCircle2 className="h-4 w-4 text-success" />}
              {item.variant === "danger" && <AlertCircle className="h-4 w-4 text-danger" />}
              {item.variant === "warning" && <AlertTriangle className="h-4 w-4 text-warning" />}
              {item.variant === "info" && <Info className="h-4 w-4 text-info" />}
              {(!item.variant || item.variant === "default") && <Info className="h-4 w-4 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground leading-snug">{item.title}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(item.id)}
              className="shrink-0 text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
