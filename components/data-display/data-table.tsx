import React from "react"

export function DataTable({ headers, children }: { headers: string[], children: React.ReactNode }) {
  return (
    <div className="w-full overflow-auto border rounded-md">
      <table className="w-full text-sm text-left">
        <thead className="bg-surface text-muted-foreground uppercase text-xs">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-3 font-medium tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {children}
        </tbody>
      </table>
    </div>
  )
}
