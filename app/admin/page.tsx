"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Briefcase, Target, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  return (
    <div className="p-8 flex flex-col gap-8 max-w-6xl mx-auto">
      <PageHeader 
        title="Platform Overview" 
        description="High-level metrics and system status."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex justify-between items-center text-muted-foreground mb-2">
              <span className="text-sm font-medium">Total Users</span>
              <Users className="h-4 w-4" />
            </div>
            <span className="text-3xl font-bold">1,284</span>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-warning">
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex justify-between items-center text-muted-foreground mb-2">
              <span className="text-sm font-medium">Organizations</span>
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-3xl font-bold">42</span>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-success">
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex justify-between items-center text-muted-foreground mb-2">
              <span className="text-sm font-medium">Vendors</span>
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="text-3xl font-bold">31</span>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-info">
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex justify-between items-center text-muted-foreground mb-2">
              <span className="text-sm font-medium">Active Initiatives</span>
              <Target className="h-4 w-4" />
            </div>
            <span className="text-3xl font-bold">18</span>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Pending Verifications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 bg-background rounded-md border shadow-sm">
              <div className="flex flex-col">
                <span className="font-medium text-sm">3 Organizations awaiting review</span>
                <span className="text-xs text-muted-foreground">Verification required for public listing.</span>
              </div>
              <Link href="/admin/organizations"><Button size="small" variant="outline">Review</Button></Link>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-md border shadow-sm">
              <div className="flex flex-col">
                <span className="font-medium text-sm">1 Vendor awaiting review</span>
                <span className="text-xs text-muted-foreground">Verification required for public listing.</span>
              </div>
              <Link href="/admin/vendors"><Button size="small" variant="outline">Review</Button></Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Administrative Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col border-l-2 border-muted pl-4 py-1">
                <span className="text-muted-foreground text-xs">Today, 10:42 AM</span>
                <span className="font-medium">System Admin suspended user <span className="text-primary font-mono">user-suspended</span></span>
              </div>
              <div className="flex flex-col border-l-2 border-success pl-4 py-1">
                <span className="text-muted-foreground text-xs">Yesterday, 4:15 PM</span>
                <span className="font-medium">Verified organization <span className="text-primary font-mono">Pune Green Brigade</span></span>
              </div>
              <div className="flex flex-col border-l-2 border-muted pl-4 py-1">
                <span className="text-muted-foreground text-xs">Sep 15, 2:00 PM</span>
                <span className="font-medium">Updated Tree Recommendation weights (Cooling coefficient adjustment)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
