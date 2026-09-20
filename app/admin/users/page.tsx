"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/admin/data-table";
import { User } from "@/types/auth";
import { DEMO_USERS } from "@/lib/demo/auth-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching users from backend
    setTimeout(() => {
      setUsers(DEMO_USERS);
      setIsLoading(false);
    }, 500);
  }, []);

  const columns = [
    { header: "Name", accessorKey: "name" as keyof User },
    { header: "Email", accessorKey: "email" as keyof User },
    { 
      header: "Role", 
      cell: (u: User) => (
        <Badge variant="neutral" className="uppercase text-[10px]">{u.role}</Badge>
      )
    },
    { 
      header: "Status", 
      cell: (u: User) => (
        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'} className="uppercase text-[10px]">{u.status}</Badge>
      )
    },
    { 
      header: "Created", 
      cell: (u: User) => <span className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
    },
    {
      header: "Actions",
      cell: (u: User) => (
        <div className="flex gap-2">
          {u.status === 'ACTIVE' && u.role !== 'ADMIN' ? (
            <Button variant="outline" size="small" className="text-danger hover:text-danger hover:bg-danger/10">Suspend</Button>
          ) : u.status === 'SUSPENDED' ? (
            <Button variant="outline" size="small" className="text-success hover:text-success hover:bg-success/10">Reactivate</Button>
          ) : null}
        </div>
      )
    }
  ];

  return (
    <div className="p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader 
        title="User Management" 
        description="View and manage platform accounts."
      />

      {isLoading ? (
        <div className="h-64 animate-pulse bg-surface-muted rounded-md w-full"></div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}
    </div>
  );
}
