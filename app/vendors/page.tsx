"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { getVendors } from "@/services/vendorService"
import { Vendor, VendorCategory } from "@/types/vendor"
import { VendorCard } from "@/components/vendors/vendor-card"
import { DEMO_REGIONS_SUMMARY } from "@/lib/demo/dashboard-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Store, Filter } from "lucide-react"

const VENDOR_CATEGORIES: (VendorCategory | "All")[] = [
  "All",
  "Tree Nursery",
  "Plant Supplier",
  "Plantation Service",
  "Irrigation",
  "Landscape Service",
  "Environmental Service",
  "Sponsor"
]

function VendorsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRegion = searchParams.get("region")

  const [regionFilter, setRegionFilter] = useState<string>(urlRegion || "All")
  const [categoryFilter, setCategoryFilter] = useState<VendorCategory | "All">("All")
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      setIsLoading(true)
      try {
        const queryRegion = regionFilter === "All" ? undefined : regionFilter
        const data = await getVendors(queryRegion, categoryFilter)
        
        if (mounted) {
          setVendors(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    loadData()
    return () => { mounted = false }
  }, [regionFilter, categoryFilter])

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setRegionFilter(val)
    if (val === "All") {
      router.push("/vendors", { scroll: false })
    } else {
      router.push(`/vendors?region=${val}`, { scroll: false })
    }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-6xl mx-auto">
      
      {/* Filter Controls Card */}
      <Card className="border border-border/80 bg-surface shadow-xs">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full sm:w-auto">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Target Pune Ward
            </label>
            <select 
              value={regionFilter} 
              onChange={handleRegionChange}
              className="h-9 w-full rounded-lg border border-border bg-surface-muted/50 px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="All">All Pune Wards &amp; Suburbs</option>
              {DEMO_REGIONS_SUMMARY.map(r => (
                <option key={r.region.id} value={r.region.id}>{r.region.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Supplier Category
            </label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value as VendorCategory | "All")}
              className="h-9 w-full rounded-lg border border-border bg-surface-muted/50 px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {VENDOR_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 animate-pulse bg-surface-muted rounded-xl"></div>
          <div className="h-48 animate-pulse bg-surface-muted rounded-xl"></div>
          <div className="h-48 animate-pulse bg-surface-muted rounded-xl"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
            <h2 className="text-lg font-bold text-foreground">Verified Local Nurseries &amp; Suppliers</h2>
            <Badge variant="primary" className="text-[10px]">{vendors.length} Verified</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vendors.length === 0 ? (
              <div className="col-span-full text-center py-16 px-4 border border-dashed rounded-xl border-border/80 text-muted-foreground text-xs bg-surface-muted/20">
                No plantation partners match your criteria in this ward.
                <div className="mt-1 text-muted-foreground/70">Try selecting &quot;All Regions&quot; or resetting the category filter.</div>
              </div>
            ) : (
              vendors.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function VendorsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader 
        title="Verified Native Nurseries &amp; Partners" 
        description="Connect directly with certified indigenous sapling nurseries, compost providers, and urban forestry contractors in Pune."
        badge={
          <Badge variant="primary" className="gap-1.5 py-1 px-3">
            <Store className="h-3 w-3" />
            <span>PMC Certified Network</span>
          </Badge>
        }
      />
      <Suspense fallback={<div className="h-64 animate-pulse bg-surface-muted rounded-xl w-full max-w-6xl mx-auto"></div>}>
        <VendorsContent />
      </Suspense>
    </div>
  )
}
