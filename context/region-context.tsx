"use client"

import React, { createContext, useContext, useCallback, ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface RegionContextValue {
  selectedRegionId: string | null
  setSelectedRegion: (id: string | null) => void
}

const RegionContext = createContext<RegionContextValue | null>(null)

export function RegionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedRegionId = searchParams.get("region")

  const setSelectedRegion = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (id) {
        params.set("region", id)
      } else {
        params.delete("region")
      }
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  return (
    <RegionContext.Provider value={{ selectedRegionId, setSelectedRegion }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error("useRegion must be used within RegionProvider")
  return ctx
}
