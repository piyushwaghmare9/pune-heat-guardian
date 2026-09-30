"use client"

import React from "react"
import Link from "next/link"
import { Store, ArrowRight, Sprout, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const VENDOR_CATEGORIES = [
  { icon: Sprout, label: "Plant Nurseries", color: "text-heat-low" },
  { icon: Store, label: "Plantation Services", color: "text-primary" },
  { icon: Droplets, label: "Irrigation Support", color: "text-sky-500" },
]

export function VendorSupportCard() {
  return (
    <Card className="flex flex-col border-border/60">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Store className="h-3.5 w-3.5 text-primary" />
          </div>
          <CardTitle className="text-sm font-bold">Plantation Support</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Connect with verified suppliers, nurseries, and plantation service
          providers in Pune.
        </p>

        <div className="flex flex-col gap-1.5">
          {VENDOR_CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <div key={cat.label} className="flex items-center gap-2 text-xs">
                <Icon className={`h-3.5 w-3.5 shrink-0 ${cat.color}`} />
                <span className="text-foreground-secondary">{cat.label}</span>
              </div>
            )
          })}
        </div>

        <Link href="/vendors">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between text-xs mt-1"
          >
            <span>Find Vendors</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
