"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Vendor } from "@/types/vendor";
import { DEMO_VENDORS } from "@/lib/demo/ecosystem-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a mock 'Pending Review' vendor for verification demo
    const mockPendingVendor: Vendor = {
      id: "ven-pending-1",
      name: "AgriTech Supplies",
      category: "Irrigation",
      services: ["Drip systems", "Sensors"],
      regions: ["hinjawadi"],
      availability: "Immediate",
      verificationStatus: "Pending Review" as any, 
    };

    setTimeout(() => {
      setVendors([mockPendingVendor, ...DEMO_VENDORS]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleApprove = (id: string) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, verificationStatus: "Verified" } : v));
  };

  const columns = [
    { header: "Name", accessorKey: "name" as keyof Vendor },
    { header: "Category", accessorKey: "category" as keyof Vendor },
    { 
      header: "Status", 
      cell: (v: Vendor) => (
        <Badge 
          variant={v.verificationStatus === 'Verified' ? 'success' : v.verificationStatus === 'Demo' ? 'neutral' : 'warning'} 
          className="uppercase text-[10px]"
        >
          {v.verificationStatus}
        </Badge>
      )
    },
    { 
      header: "Services", 
      cell: (v: Vendor) => <span className="text-xs text-muted-foreground">{v.services.join(", ")}</span>
    },
    {
      header: "Actions",
      cell: (v: Vendor) => (
        <div className="flex gap-2">
          {v.verificationStatus === 'Pending Review' as any ? (
            <>
              <Button size="small" variant="primary" onClick={() => handleApprove(v.id)}>Verify</Button>
              <Button size="small" variant="outline" className="text-danger hover:text-danger hover:bg-danger/10">Reject</Button>
            </>
          ) : (
            <Button size="small" variant="outline">View Listing</Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Vendor Verification" 
        description="Verify service providers before they are publicly listed in the ecosystem."
      />

      {isLoading ? (
        <div className="h-64 animate-pulse bg-surface-muted rounded-md w-full"></div>
      ) : (
        <DataTable columns={columns} data={vendors} />
      )}
    </div>
  );
}
