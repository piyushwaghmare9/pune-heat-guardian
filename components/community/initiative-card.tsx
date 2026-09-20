"use client"

import React, { useState } from "react"
import { Initiative } from "@/types/community"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Target, Send, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface InitiativeCardProps {
  initiative: Initiative
}

export function InitiativeCard({ initiative }: InitiativeCardProps) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const handleParticipate = (e: React.FormEvent) => {
    e.preventDefault()
    // Explicitly denoting demo submission without backend
    setSubmitted(true)
  }

  return (
    <Card className="shadow-sm border-primary/10">
      <CardContent className="p-5 flex flex-col gap-4">
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-bold text-lg leading-tight text-primary">{initiative.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground capitalize">
              <MapPin className="h-3 w-3" />
              <span>{initiative.regionId}</span>
            </div>
          </div>
          <Badge variant={initiative.dataStatus === "demo" ? "neutral" : "success"} className="text-[10px] uppercase">
            {initiative.dataStatus} data
          </Badge>
        </div>

        <div className="bg-surface-muted rounded-md p-3 text-sm">
          <div className="flex items-start gap-2 font-medium">
            <Target className="h-4 w-4 text-primary mt-0.5" />
            {initiative.goal}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm mt-1">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Status</span>
            <span className="font-medium">{initiative.status}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Trees Planned</span>
            <span className="font-medium">{initiative.treesPlanned?.toLocaleString() || "TBD"}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          {initiative.description}
        </p>

        {!showForm && !submitted && (
          <Button className="w-full mt-2" size="large" onClick={() => setShowForm(true)}>
            Participate in Initiative
          </Button>
        )}

        {showForm && !submitted && (
          <form onSubmit={handleParticipate} className="mt-4 border-t pt-4 flex flex-col gap-3 animate-in fade-in">
            <div className="text-sm font-semibold mb-1">Express Interest</div>
            <Input required placeholder="Your Name" />
            <Input required type="email" placeholder="Email Address" />
            <textarea 
              required
              placeholder="How would you like to help?" 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="large" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" size="large" className="flex-1">
                <Send className="h-4 w-4 mr-2" /> Submit
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Note: This is a demo. Submissions are not currently persisted to a backend.
            </p>
          </form>
        )}

        {submitted && (
          <div className="mt-4 border-t pt-4 flex flex-col items-center justify-center gap-2 py-4 bg-success/5 rounded-md text-success animate-in slide-in-from-bottom-2">
            <CheckCircle2 className="h-8 w-8" />
            <span className="font-medium">Interest Registered!</span>
            <span className="text-xs text-muted-foreground text-center">
              (Demo submission completed. No backend connection active.)
            </span>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
