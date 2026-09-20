"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Map, 
  BrainCircuit, 
  Sprout, 
  BarChart3, 
  Users, 
  Store, 
  UserCircle, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck, 
  Leaf,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarItem, SidebarSectionHeader } from "@/components/layout/sidebar"
import { useAuth } from "@/hooks/useAuth"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  const platformLinks = [
    { title: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Pune Heat Map", href: "/map", icon: Map },
    { title: "AI Recommendations", href: "/ai", icon: BrainCircuit },
    { title: "Plantation Planner", href: "/plantation", icon: Sprout },
    { title: "Impact Analytics", href: "/impact", icon: BarChart3 },
  ]

  const ecosystemLinks = [
    { title: "Community & NGOs", href: "/community", icon: Users },
    { title: "Green Vendors", href: "/vendors", icon: Store },
  ]

  const isCurrentActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b px-5">
        <Link 
          href="/" 
          onClick={onNavigate} 
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground group"
        >
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Leaf className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base leading-tight font-bold">HeatGuard AI</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Pune Climate Action</span>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <SidebarSectionHeader title="Platform" />
        {platformLinks.map((link) => (
          <SidebarItem
            key={link.href}
            title={link.title}
            href={link.href}
            icon={link.icon}
            isActive={isCurrentActive(link.href)}
            onClick={onNavigate}
          />
        ))}

        <SidebarSectionHeader title="Ecosystem" />
        {ecosystemLinks.map((link) => (
          <SidebarItem
            key={link.href}
            title={link.title}
            href={link.href}
            icon={link.icon}
            isActive={isCurrentActive(link.href)}
            onClick={onNavigate}
          />
        ))}

        <SidebarSectionHeader title="Account" />
        <SidebarItem
          title="Profile & Preferences"
          href="/profile"
          icon={UserCircle}
          isActive={pathname === "/profile"}
          onClick={onNavigate}
        />
        {user?.role === "ADMIN" && (
          <SidebarItem
            title="Admin Console"
            href="/admin"
            icon={ShieldCheck}
            isActive={pathname.startsWith("/admin")}
            badge="Admin"
            onClick={onNavigate}
          />
        )}
      </div>

      {/* User Footer Card */}
      <div className="border-t p-3 bg-surface-muted/40">
        {user ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface border border-border/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">{user.name || "User"}</span>
                <span className="text-[10px] text-muted-foreground truncate capitalize">{user.role?.toLowerCase() || "Member"}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-danger shrink-0"
              onClick={() => logout()}
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/login" onClick={onNavigate}>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r bg-surface shadow-xs">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity" 
          onClick={() => setIsMobileOpen(false)}
        >
          <div 
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] border-r bg-surface shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-3 top-4 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>
            <SidebarContent onNavigate={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 text-muted-foreground"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Region context pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <MapPin className="h-3 w-3" />
              <span>Pune Metropolitan Region</span>
            </div>
          </div>

          {/* Center search placeholder */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Quick search wards, trees, species..."
                className="pl-9 pr-4 h-9 bg-surface-muted/60 border-border/80 text-xs rounded-lg focus:bg-background"
                disabled
              />
              <span className="absolute right-2.5 top-2.5 text-[10px] text-muted-foreground/70 bg-surface px-1.5 py-0.5 rounded border border-border">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground relative" 
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>

            {user ? (
              <Link href="/profile" className="flex items-center gap-2 pl-2">
                <div className="h-8 w-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="small">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
