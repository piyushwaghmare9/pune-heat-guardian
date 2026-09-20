"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Map, ClipboardList, ShieldCheck, Mail, Calendar, LogOut, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="h-64 animate-pulse bg-surface-muted rounded-xl w-full max-w-4xl mx-auto"></div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-5xl mx-auto">
      <PageHeader 
        title="Profile &amp; Preferences" 
        description="Manage your HeatGuard AI credentials, organizational affiliation, and urban forestry participation."
        badge={
          <Badge variant="primary" className="gap-1.5 py-1 px-3">
            <User className="h-3 w-3" />
            <span className="capitalize">{user.role?.toLowerCase() || "Member"}</span>
          </Badge>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <Card className="md:col-span-2 border border-border/80 bg-surface shadow-xs">
          <CardHeader className="border-b border-border/60 bg-surface-muted/30 pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1.5 mt-0.5">
                    <Mail className="h-3 w-3" /> {user.email}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={user.status === 'ACTIVE' ? 'success' : 'warning'} className="uppercase text-[10px]">
                {user.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col gap-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-border/70 bg-surface-muted/30">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Access Privilege
                </span>
                <span className="font-bold text-foreground text-sm">{user.role}</span>
              </div>

              <div className="p-3.5 rounded-xl border border-border/70 bg-surface-muted/30">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Registered On
                </span>
                <span className="font-bold text-foreground text-sm font-mono">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Session active via secure cookie</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => logout()}
                className="text-xs text-danger hover:bg-danger/10 hover:border-danger/30 gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Quick Actions / Role-Specific Cards */}
        <div className="flex flex-col gap-4">
          
          {user.role === 'ADMIN' && (
            <Card className="border border-warning/30 bg-warning/5 shadow-xs">
              <CardHeader className="pb-3 border-b border-warning/20">
                <CardTitle className="text-sm font-bold text-warning flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Console
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  You hold system administrator privileges across Pune user, organization, and project registries.
                </p>
                <Link href="/admin">
                  <Button variant="outline" className="w-full text-warning border-warning/40 hover:bg-warning/10 text-xs" size="sm">
                    Open Admin Console
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {user.role === 'ORGANIZATION' && (
            <Card className="border border-border/80 bg-surface shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-primary" />
                  NGO Management
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Manage your organization&apos;s verified initiatives and volunteer drives in Pune.
                </p>
                <Link href="/community">
                  <Button variant="outline" className="w-full text-xs" size="sm">
                    View Community Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card className="border border-border/80 bg-surface shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4 text-primary" />
                Plantation Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Design custom site plantation plans and monitor ward cooling.
              </p>
              <Link href="/plantation">
                <Button className="w-full text-xs gap-1.5" size="sm">
                  <Map className="h-3.5 w-3.5" />
                  <span>Start New Plan</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
