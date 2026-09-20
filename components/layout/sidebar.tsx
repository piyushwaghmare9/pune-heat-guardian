import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SidebarItemProps {
  title: string
  href: string
  icon: LucideIcon
  isActive?: boolean
  badge?: string | number
  onClick?: () => void
}

export function SidebarItem({ title, href, icon: Icon, isActive, badge, onClick }: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive 
          ? "bg-primary/10 text-primary font-semibold" 
          : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
      )}
    >
      {/* Active left indicator pill */}
      {isActive && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
      )}
      
      <div className="flex items-center gap-3 min-w-0">
        <Icon className={cn(
          "h-4 w-4 shrink-0 transition-colors", 
          isActive ? "text-primary stroke-[2.2]" : "text-muted-foreground group-hover:text-foreground stroke-[1.8]"
        )} />
        <span className="truncate">{title}</span>
      </div>

      {badge !== undefined && (
        <span className={cn(
          "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
          isActive ? "bg-primary text-white" : "bg-surface-muted text-muted-foreground"
        )}>
          {badge}
        </span>
      )}
    </Link>
  )
}

export function SidebarSectionHeader({ title }: { title: string }) {
  return (
    <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-1.5 mt-5 first:mt-1">
      {title}
    </div>
  )
}

export function Sidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <aside className={cn("flex flex-col border-r bg-background", className)}>
      {children}
    </aside>
  )
}
