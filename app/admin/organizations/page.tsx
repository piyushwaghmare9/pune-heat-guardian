"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Organization } from "@/types/community";
import { DEMO_ORGANIZATIONS } from "@/lib/demo/ecosystem-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a mock 'Pending' organization for verification queue demonstration
    const mockPendingOrg: Organization = {
      id: "org-pending-1",
      name: "New Pune Earth Foundation",
      type: "Civic Initiative",
      regions: ["swargate"],
      focusAreas: ["Water Conservation", "Tree Planting"],
      description: "A newly formed trust seeking platform verification.",
      status: "pending" as any, // 'pending' status for demo
    };

    setTimeout(() => {
      setOrgs([mockPendingOrg, ...DEMO_ORGANIZATIONS]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleApprove = (id: string) => {
    // Mock approve action
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: "verified" } : o));
  };

  const columns = [
    { header: "Name", accessorKey: "name" as keyof Organization },
    { header: "Type", accessorKey: "type" as keyof Organization },
    { 
      header: "Verification", 
      cell: (o: Organization) => (
        <Badge 
          variant={o.status === 'demo' ? 'neutral' : o.status === 'verified' ? 'success' : 'warning'} 
          className="uppercase text-[10px]"
        >
          {o.status}
        </Badge>
      )
    },
    { 
      header: "Regions", 
      cell: (o: Organization) => <span className="text-xs capitalize">{o.regions.join(", ")}</span>
    },
    {
      header: "Actions",
      cell: (o: Organization) => (
        <div className="flex gap-2">
          {o.status === 'pending' as any ? (
            <>
              <Button size="small" variant="primary" onClick={() => handleApprove(o.id)}>Approve</Button>
              <Button size="small" variant="outline" className="text-danger hover:text-danger hover:bg-danger/10">Reject</Button>
            </>
          ) : (
            <Button size="small" variant="outline">View Details</Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Organization Verification Queue" 
        description="Review and verify NGO and community partners."
      />

      {isLoading ? (
        <div className="h-64 animate-pulse bg-surface-muted rounded-md w-full"></div>
      ) : (
        <DataTable columns={columns} data={orgs} />
      )}
    </div>
  );
}
