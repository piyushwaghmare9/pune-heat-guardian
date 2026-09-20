"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Initiative } from "@/types/community";
import { DEMO_INITIATIVES } from "@/lib/demo/ecosystem-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminInitiativesPage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInitiatives(DEMO_INITIATIVES);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleArchive = (id: string) => {
    setInitiatives(prev => prev.map(i => i.id === id ? { ...i, status: "Closed" } : i));
  };

  const columns = [
    { header: "Initiative Name", accessorKey: "name" as keyof Initiative },
    { header: "Region", accessorKey: "regionId" as keyof Initiative },
    { 
      header: "Goal", 
      cell: (i: Initiative) => <span className="text-xs text-muted-foreground truncate block max-w-[200px]">{i.goal}</span>
    },
    { 
      header: "Status", 
      cell: (i: Initiative) => (
        <Badge 
          variant={i.status === 'Open' ? 'success' : i.status === 'Closed' ? 'neutral' : 'info'} 
          className="uppercase text-[10px]"
        >
          {i.status}
        </Badge>
      )
    },
    { 
      header: "Data Source", 
      cell: (i: Initiative) => (
        <Badge variant="neutral" className="uppercase text-[10px]">{i.dataStatus}</Badge>
      )
    },
    {
      header: "Actions",
      cell: (i: Initiative) => (
        <div className="flex gap-2">
          {i.status !== 'Closed' && (
            <Button size="small" variant="outline" className="text-danger hover:text-danger hover:bg-danger/10" onClick={() => handleArchive(i.id)}>
              Archive
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Initiative Moderation" 
        description="Monitor and moderate community plantation drives."
      />

      {isLoading ? (
        <div className="h-64 animate-pulse bg-surface-muted rounded-md w-full"></div>
      ) : (
        <DataTable columns={columns} data={initiatives} />
      )}
    </div>
  );
}
