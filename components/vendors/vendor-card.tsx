"use client"

import React, { useState } from "react"
import { Vendor } from "@/types/vendor"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Globe, Send, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface VendorCardProps {
  vendor: Vendor
}

export function VendorCard({ vendor }: VendorCardProps) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const handleSponsor = (e: React.FormEvent) => {
    e.preventDefault()
    // Explicitly denoting demo submission without backend
    setSubmitted(true)
  }

  const isDemo = vendor.verificationStatus === "Demo"
  const isVerified = vendor.verificationStatus === "Verified"

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col gap-4">
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-bold text-lg leading-tight">{vendor.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span>{vendor.category}</span>
            </div>
          </div>
          <Badge variant={isVerified ? "success" : isDemo ? "neutral" : "warning"} className="text-[10px] uppercase">
            {vendor.verificationStatus}
          </Badge>
        </div>

        <div className="flex flex-col gap-2 text-sm text-foreground">
          <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Services Provided</div>
          <div className="flex flex-wrap gap-2">
            {vendor.services.map(svc => (
              <Badge key={svc} variant="neutral" className="bg-surface-muted text-[10px] font-normal">
                {svc}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="capitalize">{vendor.regions.join(", ")}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-foreground">Availability:</span> <span className="text-muted-foreground">{vendor.availability}</span>
          </div>
        </div>

        {!showForm && !submitted && (
          <div className="flex gap-3 mt-2 border-t pt-4">
            <Button variant="outline" size="small" className="flex-1" onClick={() => setShowForm(true)}>
              Contact / Sponsor
            </Button>
            {vendor.website && (
              <Button variant="primary" size="small" className="flex-1" onClick={() => window.open(vendor.website, '_blank')}>
                <Globe className="h-4 w-4 mr-2" /> Website
              </Button>
            )}
          </div>
        )}

        {showForm && !submitted && (
          <form onSubmit={handleSponsor} className="mt-4 border-t pt-4 flex flex-col gap-3 animate-in fade-in">
            <div className="text-sm font-semibold mb-1">Send Inquiry to {vendor.name}</div>
            <Input required placeholder="Your Name or Organization" />
            <Input required type="email" placeholder="Email Address" />
            <textarea 
              required
              placeholder="What services or sponsorship are you looking for?" 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="small" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" size="small" className="flex-1">
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Note: This is a demo. Messages are not currently sent.
            </p>
          </form>
        )}

        {submitted && (
          <div className="mt-4 border-t pt-4 flex flex-col items-center justify-center gap-2 py-4 bg-success/5 rounded-md text-success animate-in slide-in-from-bottom-2">
            <CheckCircle2 className="h-8 w-8" />
            <span className="font-medium">Inquiry Sent!</span>
            <span className="text-xs text-muted-foreground text-center">
              (Demo submission completed. No actual email was dispatched.)
            </span>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
