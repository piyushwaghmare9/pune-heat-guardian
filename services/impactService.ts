import { ImpactSummary, RegionalImpact } from "@/types/impact";
import { DEMO_IMPACT_SUMMARY, DEMO_REGIONAL_IMPACT } from "@/lib/demo/ecosystem-data";

/**
 * Retrieves the global platform impact summary.
 */
export async function getImpactSummary(): Promise<ImpactSummary> {
  // Simulate network latency for future backend compatibility
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DEMO_IMPACT_SUMMARY);
    }, 500);
  });
}

/**
 * Retrieves historical/planned impact segmented by region.
 */
export async function getRegionalImpact(): Promise<RegionalImpact[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DEMO_REGIONAL_IMPACT);
    }, 500);
  });
}
