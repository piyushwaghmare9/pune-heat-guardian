export type DataStatus = "live" | "verified" | "estimated" | "demo" | "unavailable";

export interface ImpactSummary {
  totalTreesPlanned: number | null;
  totalTreesPlanted: number | null;
  totalPlans: number | null;
  totalRegions: number | null;
  totalArea: number | null; // sq meters
  
  environmentalMetrics: {
    estimatedCooling: number | null;
    estimatedCarbon: number | null;
  };

  dataStatus: DataStatus;
}

export interface RegionalImpact {
  regionId: string;
  regionName: string;
  treesPlanned: number;
  area: number; // sq meters
  primaryGoal: string;
  status: "planning" | "in-progress" | "completed";
}
