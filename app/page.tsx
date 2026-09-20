import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { SolutionSection } from "@/components/landing/solution-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { HeatPreview } from "@/components/landing/heat-preview"
import { AIPreview } from "@/components/landing/ai-preview"
import { PlantationPreview } from "@/components/landing/plantation-preview"
import { ImpactSection } from "@/components/landing/impact-section"
import { CommunitySection } from "@/components/landing/community-section"
import { VendorSection } from "@/components/landing/vendor-section"
import { FinalCTA } from "@/components/landing/final-cta"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "HeatGuard AI — Urban Heat Intelligence & Climate Action",
  description: "HeatGuard AI combines urban heat intelligence, environmental data, and AI-assisted planning to help communities understand heat risk and take targeted climate action.",
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <HeatPreview />
      <AIPreview />
      <PlantationPreview />
      <ImpactSection />
      <CommunitySection />
      <VendorSection />
      <FinalCTA />
    </>
  )
}
