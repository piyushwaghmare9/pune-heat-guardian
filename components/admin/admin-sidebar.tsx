"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  Target, 
  LineChart, 
  Settings, 
  ShieldCheck,
  ArrowLeft,
  SlidersHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ADMIN_NAV = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Organizations", href: "/admin/organizations", icon: Building2 },
  { title: "Vendors", href: "/admin/vendors", icon: Briefcase },
  { title: "Initiatives", href: "/admin/initiatives", icon: Target },
  { title: "Projects & Verification", href: "/admin/projects", icon: ShieldCheck },
  { title: "Impact & Telemetry", href: "/admin/impact", icon: LineChart },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/80 bg-surface min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2 text-warning font-bold tracking-tight">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm">Admin Console</span>
          </div>
          <Badge variant="warning" className="text-[10px]">Restricted</Badge>
        </div>
        
        <nav className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1">
            System Modules
          </span>
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150",
                  isActive 
                    ? "bg-warning/15 text-warning font-bold" 
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-warning" />
                )}
                <Icon className={cn("h-4 w-4", isActive ? "text-warning" : "text-muted-foreground")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-border/60">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit to Dashboard</span>
        </Link>
      </div>
    </aside>
  );
}
