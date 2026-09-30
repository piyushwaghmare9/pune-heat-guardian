import React, { Suspense } from "react"
import { RegionProvider } from "@/context/region-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense>
      <RegionProvider>{children}</RegionProvider>
    </Suspense>
  )
}
