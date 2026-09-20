import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
