"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { getOrganizations, getInitiatives } from "@/services/communityService"
import { Organization, Initiative } from "@/types/community"
import { OrganizationCard } from "@/components/community/organization-card"
import { InitiativeCard } from "@/components/community/initiative-card"
import { DEMO_REGIONS_SUMMARY } from "@/lib/demo/dashboard-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Filter } from "lucide-react"

function CommunityContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRegion = searchParams.get("region")

  const [regionFilter, setRegionFilter] = useState<string>(urlRegion || "All")
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      setIsLoading(true)
      try {
        const queryRegion = regionFilter === "All" ? undefined : regionFilter
        const [orgs, inits] = await Promise.all([
          getOrganizations(queryRegion),
          getInitiatives(queryRegion)
        ])
        
        if (mounted) {
          setOrganizations(orgs)
          setInitiatives(inits)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    loadData()
    return () => { mounted = false }
  }, [regionFilter])

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setRegionFilter(val)
    if (val === "All") {
      router.push("/community", { scroll: false })
    } else {
      router.push(`/community?region=${val}`, { scroll: false })
    }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-6xl mx-auto">
      
      {/* Filter Card */}
      <Card className="border border-border/80 bg-surface shadow-xs">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold text-xs text-foreground uppercase tracking-wider">
              Filter by Pune Ward:
            </span>
          </div>
          <select 
            value={regionFilter} 
            onChange={handleRegionChange}
            className="h-9 w-full sm:w-64 rounded-lg border border-border bg-surface-muted/50 px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="All">All Pune Wards &amp; Zones</option>
            {DEMO_REGIONS_SUMMARY.map(r => (
              <option key={r.region.id} value={r.region.id}>{r.region.name}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 animate-pulse bg-surface-muted rounded-xl"></div>
          <div className="h-80 animate-pulse bg-surface-muted rounded-xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Initiatives Column */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
              <h2 className="text-lg font-bold text-foreground">Active Drives &amp; Initiatives</h2>
              <Badge variant="primary" className="text-[10px]">{initiatives.length} Active</Badge>
            </div>
            
            <div className="flex flex-col gap-3.5">
              {initiatives.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl border-border/80 text-muted-foreground text-xs bg-surface-muted/20">
                  No active initiatives recorded for this ward.
                </div>
              ) : (
                initiatives.map(init => <InitiativeCard key={init.id} initiative={init} />)
              )}
            </div>
          </section>

          {/* Organizations Column */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
              <h2 className="text-lg font-bold text-foreground">Partner NGOs &amp; Groups</h2>
              <Badge variant="neutral" className="text-[10px]">{organizations.length} Registered</Badge>
            </div>
            
            <div className="flex flex-col gap-3.5">
              {organizations.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl border-border/80 text-muted-foreground text-xs bg-surface-muted/20">
                  No registered partner organizations found for this ward.
                </div>
              ) : (
                organizations.map(org => <OrganizationCard key={org.id} organization={org} />)
              )}
            </div>
          </section>

        </div>
      )}
    </div>
  )
}

export default function CommunityPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader 
        title="Community &amp; Civic Mobilization" 
        description="Connect with environmental NGOs, local resident associations, and climate volunteer drives in Pune."
        badge={
          <Badge variant="secondary" className="gap-1.5 py-1 px-3">
            <Users className="h-3 w-3" />
            <span>Civic Ecosystem</span>
          </Badge>
        }
      />
      <Suspense fallback={<div className="h-64 animate-pulse bg-surface-muted rounded-xl w-full max-w-6xl mx-auto"></div>}>
        <CommunityContent />
      </Suspense>
    </div>
  )
}
