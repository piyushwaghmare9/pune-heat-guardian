import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Leaf, Activity, ArrowRight, ShieldCheck, Sprout } from "lucide-react";
import { getProjects } from "@/lib/demo/action-data";

export const metadata = {
  title: 'Climate Action Registry — HeatGuard AI',
  description: 'Explore verified urban heat mitigation and tree plantation projects in Pune.',
};

export default function ActionRegistryPage() {
  const publicProjects = getProjects().filter(
    (p) => p.status === 'Verified' || p.status === 'Monitoring' || p.status === 'Completed' || p.status === 'In Progress'
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <PageHeader 
        title="Climate Action Registry" 
        description="Explore active, verified municipal and civic climate interventions designed to mitigate urban heat in Pune."
        badge={
          <Badge variant="primary" className="gap-1.5 py-1 px-3">
            <ShieldCheck className="h-3 w-3" />
            <span>Verified Registry</span>
          </Badge>
        }
      >
        <Link href="/plantation">
          <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
            <Sprout className="h-3.5 w-3.5" />
            <span>Register New Initiative</span>
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {publicProjects.map((project) => {
          const planned = project.treesPlanned || 0;
          const planted = project.treesPlanted || 0;
          const percent = planned > 0 ? Math.min(100, Math.round((planted / planned) * 100)) : 0;
            
          return (
            <Card key={project.id} className="border border-border/80 bg-surface shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <Badge variant={project.status === 'Verified' ? 'success' : 'primary'} className="uppercase text-[10px]">
                    {project.status === 'Verified' && <ShieldCheck className="w-3 h-3 mr-1 inline" />}
                    {project.status}
                  </Badge>
                  <Badge variant="neutral" className="text-[10px] text-muted-foreground">{project.actionType}</Badge>
                </div>
                <CardTitle className="text-base font-bold text-foreground leading-snug">{project.name}</CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{project.description}</p>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-emerald-500" /> Trees Planted
                      </span>
                      <span className="font-bold text-foreground">
                        {project.treesPlanted || 0} <span className="text-muted-foreground font-normal">/ {project.treesPlanned}</span>
                      </span>
                    </div>
                    <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  {project.estimatedCoolingImpact && (
                    <div className="flex justify-between text-xs pt-2 border-t border-border/60">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-blue-500" /> Est. Cooling
                      </span>
                      <span className="font-semibold text-primary">{project.estimatedCoolingImpact}</span>
                    </div>
                  )}
                </div>

                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs group">
                    <span>View Project Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}

        {publicProjects.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed rounded-xl p-6 bg-surface-muted/20 text-xs">
            No verified public projects available at this time.
          </div>
        )}
      </div>
    </div>
  );
}
