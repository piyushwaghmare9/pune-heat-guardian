import React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  return (
    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
      <Avatar fallback="US" className="h-8 w-8" />
    </Button>
  )
}
