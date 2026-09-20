"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TreeDeciduous, Activity, Database } from "lucide-react";
import { ImpactSummary } from "@/types/impact";
import { getImpactSummary } from "@/services/impactService";

export default function AdminImpactPage() {
  const [summary, setSummary] = useState<ImpactSummary | null>(null);

  useEffect(() => {
    getImpactSummary().then(setSummary);
  }, []);

  return (
    <div className="p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Impact & Data Settings" 
        description="Inspect environmental modeling metrics and data sources."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommendation Model Weights */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <TreeDeciduous className="h-5 w-5 text-primary" />
              AI Recommendation Model
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="font-mono font-medium">1.0.0-beta</span>
            </div>
            
            <div className="space-y-3 mt-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Scoring Weights (Read-Only)</span>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between bg-surface-muted p-2 rounded-md">
                  <span>Cooling</span><span className="font-medium">35%</span>
                </div>
                <div className="flex justify-between bg-surface-muted p-2 rounded-md">
                  <span>CO₂ Capture</span><span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between bg-surface-muted p-2 rounded-md">
                  <span>Growth Speed</span><span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between bg-surface-muted p-2 rounded-md">
                  <span>Urban Fit</span><span className="font-medium">10%</span>
                </div>
                <div className="flex justify-between bg-surface-muted p-2 rounded-md">
                  <span>Pollution</span><span className="font-medium">5%</span>
                </div>
                <div className="flex justify-between bg-surface-muted p-2 rounded-md">
                  <span>Drought</span><span className="font-medium">5%</span>
                </div>
                <div className="flex justify-between bg-surface-muted p-2 rounded-md">
                  <span>Maintenance</span><span className="font-medium">5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Impact Summary */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Global Impact Aggregation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4">
            
            <div className="bg-destructive/5 border border-destructive/20 rounded-md p-4 text-sm flex gap-3 items-center">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">Scientific Integrity Warning</span>
                <span className="text-muted-foreground text-xs mt-0.5">
                  The backend lacks verified municipal botanical models. Environmental indicators (Carbon/Cooling) remain disabled to prevent fabrication of ecological claims.
                </span>
              </div>
            </div>

            {summary && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Trees Planned</span>
                  <span className="text-2xl font-bold">{summary.totalTreesPlanned}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Data Status</span>
                  <Badge variant="neutral" className="w-fit mt-1 uppercase text-[10px]">{summary.dataStatus}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Data Sources */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Data Provenance & Health
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-surface-muted border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Domain</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Freshness</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-4 font-semibold text-foreground">Environmental (Temp/AQI)</td>
                    <td className="px-4 py-4">Internal API Mock</td>
                    <td className="px-4 py-4"><span className="text-muted-foreground italic">Static</span></td>
                    <td className="px-4 py-4"><Badge variant="neutral" className="uppercase text-[10px]">Demo Data</Badge></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-4 font-semibold text-foreground">Geographic Regions</td>
                    <td className="px-4 py-4">Static Configuration</td>
                    <td className="px-4 py-4"><span className="text-muted-foreground italic">Static</span></td>
                    <td className="px-4 py-4"><Badge variant="success" className="uppercase text-[10px]">Verified Live</Badge></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-semibold text-foreground">Botanical Trees DB</td>
                    <td className="px-4 py-4">FastAPI Database (Offline)</td>
                    <td className="px-4 py-4"><span className="text-muted-foreground italic">Unreachable</span></td>
                    <td className="px-4 py-4"><Badge variant="neutral" className="uppercase text-[10px]">Demo Data</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
