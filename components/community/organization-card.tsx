"use client"

import React, { useState } from "react"
import { Organization } from "@/types/community"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, MapPin, Users } from "lucide-react"

interface OrganizationCardProps {
  organization: Organization
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col gap-4">
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-bold text-lg leading-tight">{organization.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{organization.type}</span>
            </div>
          </div>
          <Badge variant={organization.status === "demo" ? "neutral" : "info"} className="text-[10px] uppercase">
            {organization.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {organization.focusAreas.map(area => (
            <Badge key={area} variant="neutral" className="bg-surface-muted text-[10px] font-normal">
              {area}
            </Badge>
          ))}
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="capitalize">{organization.regions.join(", ")}</span>
        </div>

        <p className={`text-sm text-foreground mt-2 ${expanded ? "" : "line-clamp-2"}`}>
          {organization.description}
        </p>

        <div className="flex gap-3 mt-2 border-t pt-4">
          <Button variant="outline" size="small" onClick={() => setExpanded(!expanded)} className="flex-1">
            {expanded ? "Less Details" : "Read More"}
          </Button>
          {organization.website && (
            <Button variant="primary" size="small" className="flex-1" onClick={() => window.open(organization.website, '_blank')}>
              <Globe className="h-4 w-4 mr-2" /> Website
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
