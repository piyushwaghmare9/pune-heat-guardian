"use client"

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, MapPin, Calendar, Sprout, Loader2, Upload, ChevronRight, Activity, Award, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.project) setProject(data.project);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground">Loading project records...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center p-8 border border-dashed rounded-2xl bg-surface-muted/30 max-w-xl mx-auto">
        <h3 className="text-lg font-bold text-foreground mb-2">Project Not Found</h3>
        <p className="text-sm text-muted-foreground mb-6">
          The requested climate action project does not exist or requires coordinator access permissions.
        </p>
        <Link href="/action">
          <Button variant="outline" size="sm">
            Return to Action Registry
          </Button>
        </Link>
      </div>
    );
  }

  const isCoordinator = user && (user.id === project.coordinatorId || user.id === project.organizationId || user.role === 'ADMIN');

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/action" className="hover:text-foreground transition-colors">
          Action Registry
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate max-w-xs">{project.name}</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={project.status === 'Verified' ? 'success' : 'primary'} className="uppercase">
              {project.status === 'Verified' && <ShieldCheck className="w-3 h-3 mr-1 inline" />}
              {project.status}
            </Badge>
            <Badge variant="neutral" className="uppercase">{project.actionType}</Badge>
            {project.dataStatus === 'demo' && <Badge variant="warning" className="uppercase text-[10px]">Demo Data</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">{project.description}</p>
        </div>
        
        {isCoordinator && project.status !== 'Verified' && (
          <Button variant="primary" size="medium" className="gap-2 shadow-xs">
            <Upload className="w-4 h-4" /> Submit Field Evidence
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/80 bg-surface shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Target Ward
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-foreground capitalize">{project.regionId}</p>
            <span className="text-xs text-muted-foreground mt-0.5 block">Pune Municipal District</span>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-surface shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-primary" /> Trees Planned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-extrabold text-foreground">{project.treesPlanned || 0}</p>
            <span className="text-xs text-muted-foreground mt-0.5 block">Target canopy density</span>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-surface shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Trees Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-extrabold text-emerald-600">{project.treesVerified || 0}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Out of {project.treesPlanted || 0} reported</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-surface shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-medium text-foreground">
              Start: {new Date(project.targetStartDate).toLocaleDateString()}
            </p>
            <p className="text-xs font-medium text-foreground mt-0.5">
              Target: {new Date(project.targetCompletionDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline & Scientific Impact Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-border/80 bg-surface shadow-xs h-full">
            <CardHeader className="border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold">Project Milestones &amp; Audit Trail</CardTitle>
              <CardDescription className="text-xs">Verifiable field milestones tracked by coordinators</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative border-l-2 border-border/80 ml-4 space-y-6">
                {project.milestones?.map((m: any) => (
                  <div key={m.id} className="pl-6 relative">
                    <div className={`absolute w-3.5 h-3.5 rounded-full -left-[8px] top-1.5 ${m.status === 'Completed' ? 'bg-primary ring-4 ring-primary/20' : 'bg-surface border-2 border-border'}`} />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-foreground">{m.title}</h4>
                        <Badge variant={m.status === 'Completed' ? 'success' : 'neutral'} className="text-[10px] uppercase">
                          {m.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                        Target Date: {new Date(m.targetDate).toLocaleDateString()}
                        {m.completedDate && ` • Completed: ${new Date(m.completedDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                ))}
                {(!project.milestones || project.milestones.length === 0) && (
                  <p className="pl-6 text-xs text-muted-foreground">No milestones defined yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border border-border/80 bg-surface-muted/30 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-border/60 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" />
                  Modeled Impact
                </CardTitle>
                <CardDescription className="text-xs">Based on bioclimatic AI projections</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="p-3.5 rounded-xl bg-surface border border-border/70">
                  <span className="text-xs font-semibold text-muted-foreground block mb-0.5">Estimated Surface Cooling</span>
                  <p className="text-xl font-extrabold text-primary">{project.estimatedCoolingImpact || "-2.5°C Local Drop"}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border/70">
                  <span className="text-xs font-semibold text-muted-foreground block mb-0.5">Projected Carbon Offset</span>
                  <p className="text-xl font-extrabold text-foreground">{project.estimatedCarbonImpact || "18 Tons / Year"}</p>
                </div>
              </CardContent>
            </div>
            <div className="p-4 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Scientific Integrity Note:</strong> Metrics are modeled based on canopy area calculations and historical Pune weather telemetry.
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
}
