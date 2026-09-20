import { TreeRecommendation } from "./tree";

export interface PlantationGoal {
  id: string;
  label: string;
}

export interface PlantationTreeSelection {
  tree: TreeRecommendation;
  quantity: number;
}

export interface PlantationPlan {
  regionId: string;
  availableAreaSqM: number;
  primaryGoalId: string;
  trees: PlantationTreeSelection[];
}

export interface PlantationSummary {
  totalTrees: number;
  estimatedDensityWarnings: string[];
  // Impact estimations (if supported by models)
  estimatedCooling?: string;
  estimatedCarbon?: string;
}
