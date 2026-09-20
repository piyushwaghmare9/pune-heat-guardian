export interface TreeBase {
  id: string;
  commonName: string;
  scientificName: string;

  // Normalized scores (0-100)
  coolingScore: number;
  carbonScore: number;
  growthScore: number;
  urbanSuitabilityScore: number;
  pollutionToleranceScore: number;
  droughtToleranceScore: number;
  maintenanceScore: number;

  // Descriptive Attributes
  waterRequirement: string;
  
  // Extra Dataset Attributes for Region Panel
  treeType?: string;
  ageEstimateYrs?: number;
  transpirationRateLDay?: number;
  avgTemperatureC?: number;
  pm25Reduction?: number;
  economicValueINR?: number;
  diseaseResistance?: string;

  // Provenance
  source: string;
  dataStatus: "real" | "verified" | "demo" | "estimated" | "unavailable";
}

export interface TreeRecommendation extends TreeBase {
  overallScore: number;
  reasons: string[];
  limitations: string[];
}
