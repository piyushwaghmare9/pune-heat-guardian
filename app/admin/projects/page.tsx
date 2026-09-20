"use client"

import React, { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Eye, CheckCircle, XCircle } from "lucide-react"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/projects') // Admin should see all, ignoring visibility flag
      .then(res => res.json())
      .then(data => {
        if (data.projects) setProjects(data.projects);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [])

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Verified" })
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, status: "Verified" } : p))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Project Moderation & Verification" 
        description="Review submitted climate action projects, audit evidence, and verify real-world impact."
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-surface-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Project Name</th>
                  <th className="px-6 py-4 font-semibold">Region</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project.id} className="bg-background hover:bg-surface-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{project.name}</td>
                    <td className="px-6 py-4 capitalize">{project.regionId}</td>
                    <td className="px-6 py-4">
                      <Badge variant="neutral" className="bg-surface-muted">{project.actionType}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={project.status === 'Verified' ? 'success' : project.status === 'Verification Pending' ? 'warning' : 'neutral'}>
                        {project.status === 'Verified' && <ShieldCheck className="w-3 h-3 mr-1 inline" />}
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="small" onClick={() => window.open(`/projects/${project.id}`, '_blank')}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        {project.status === 'Verification Pending' && (
                          <>
                            <Button variant="primary" size="small" onClick={() => handleVerify(project.id)}>
                              <CheckCircle className="w-4 h-4 mr-1" /> Verify
                            </Button>
                            <Button variant="danger" size="small">
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
