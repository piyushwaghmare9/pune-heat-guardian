import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Store, CheckCircle2, ShieldCheck, MapPin } from "lucide-react"

export function VendorSection() {
  const nurseries = [
    {
      name: "Sahyadri Native Plants Nursery",
      location: "Sinhagad Road, Pune",
      stock: "15,000+ Native Saplings",
      specialty: "Western Ghats Endemics"
    },
    {
      name: "Vasant Agro Forestry Center",
      location: "Wagholi / Hadapsar, Pune",
      stock: "22,000+ Saplings",
      specialty: "High-Drought Urban Trees"
    },
    {
      name: "Pune Municipal Bio-Diversity Hub",
      location: "Shivajinagar, Pune",
      stock: "10,000+ Saplings",
      specialty: "Avenue & Shade Trees"
    }
  ]

  return (
    <section id="vendors" className="py-20 md:py-28 bg-surface-muted/40 border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="order-2 lg:order-1 space-y-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-primary" />
                Verified Native Nurseries Network
              </span>
              <span className="text-xs text-primary font-medium">PMC Certified</span>
            </div>

            {nurseries.map((nursery) => (
              <div 
                key={nursery.name}
                className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs hover:border-primary/40 transition-colors flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{nursery.name}</h3>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{nursery.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-2">
                    <span className="font-semibold text-primary">{nursery.stock}</span>
                    <span className="text-muted-foreground">&bull;</span>
                    <span className="text-muted-foreground">{nursery.specialty}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <CheckCircle2 className="h-3 w-3" /> In Stock
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
              <Store className="h-3.5 w-3.5" />
              <span>Native Nursery Network</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
              Connect Planting Plans Directly to Local Nurseries
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              Recommendation without seed stock leads to dead ends. HeatGuard AI bridges our AI species planner directly with verified local Pune nurseries stocking indigenous, hardy saplings &mdash; guaranteeing availability and healthy root balls.
            </p>
            
            <Link href="/vendors">
              <Button size="large" className="group gap-2 shadow-xs">
                Browse Verified Vendors
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
