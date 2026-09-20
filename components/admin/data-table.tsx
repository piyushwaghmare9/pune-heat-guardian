"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface DataTableProps<T> {
  columns: {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, emptyMessage = "No results found." }: DataTableProps<T>) {
  return (
    <div className="w-full bg-background rounded-md border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-surface-muted border-b">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border/50 last:border-0 hover:bg-surface-muted/30 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-4">
                      {col.cell ? col.cell(row) : (col.accessorKey ? String(row[col.accessorKey]) : "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Simple demo pagination footer */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t bg-surface-muted/20">
          <span className="text-xs text-muted-foreground">Showing {data.length} records</span>
          <div className="flex gap-1">
            <Button variant="outline" size="small" disabled>Previous</Button>
            <Button variant="outline" size="small" disabled>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
