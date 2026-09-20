"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { AppShell } from "@/components/layout/app-shell"

interface NavigationShellProps {
  children: React.ReactNode
}

export function NavigationShell({ children }: NavigationShellProps) {
  const pathname = usePathname()

  // Marketing & Public pages use SiteHeader + SiteFooter
  const isMarketingPage = pathname === "/" || pathname === "/login" || pathname === "/signup"
  
  // Admin pages have their own layout (AdminSidebar)
  const isAdminPage = pathname.startsWith("/admin")

  if (isAdminPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    )
  }

  if (isMarketingPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 flex flex-col">{children}</main>
        <SiteFooter />
      </div>
    )
  }

  // All application pages (dashboard, map, ai, plantation, impact, community, vendors, action, projects, profile)
  // use the unified AppShell with sidebar navigation
  return <AppShell>{children}</AppShell>
}
