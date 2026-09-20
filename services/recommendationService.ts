import { TreeRecommendation, TreeBase } from '@/types/tree';
import { datasetLoader, DatasetTreeRecord } from '@/lib/data/dataset-loader';

/**
 * Maps a raw dataset tree record into the normalized internal TreeBase type.
 */
const mapDatasetTreeToBase = (record: DatasetTreeRecord): TreeBase => {
  return {
    id: record.Tree_ID,
    commonName: record.Common_Name,
    scientificName: record.Scientific_Name,
    coolingScore: record.Cooling_Score_35,
    carbonScore: record.CO2_Score_25,
    growthScore: record.Growth_Score_15,
    urbanSuitabilityScore: record.Urban_Suit_Score_10,
    pollutionToleranceScore: record.Pollution_Score_5,
    droughtToleranceScore: record.Drought_Score_5,
    maintenanceScore: record.Maintenance_Score_5,
    waterRequirement: record.Water_Requirement,
    
    treeType: record.Tree_Type,
    ageEstimateYrs: record.Age_Estimate_yrs,
    transpirationRateLDay: record.Transpiration_Rate_L_day,
    avgTemperatureC: record.Avg_Temperature_C,
    pm25Reduction: record["PM2.5_Reduction_ug_m3"],
    economicValueINR: record.Economic_Value_INR,
    diseaseResistance: record.Disease_Resistance,

    source: "Pune Heat Guardian Dataset",
    dataStatus: "real"
  };
};

/**
 * Implements the HeatGuard AI documented scoring model exactly as specified:
 * Cooling        35%
 * CO₂            25%
 * Growth         15%
 * Urban          10%
 * Pollution       5%
 * Drought         5%
 * Maintenance     5%
 */
const calculateOverallScore = (tree: TreeBase): number => {
  const score = 
    (tree.coolingScore * 0.35) +
    (tree.carbonScore * 0.25) +
    (tree.growthScore * 0.15) +
    (tree.urbanSuitabilityScore * 0.10) +
    (tree.pollutionToleranceScore * 0.05) +
    (tree.droughtToleranceScore * 0.05) +
    (tree.maintenanceScore * 0.05);
    
  return Math.round(score);
};

const generateReasons = (tree: TreeBase): string[] => {
  const reasons: string[] = [];
  if (tree.coolingScore >= 90) reasons.push("Exceptional cooling potential for extreme heat conditions.");
  if (tree.urbanSuitabilityScore >= 90) reasons.push("Highly suitable for dense urban infrastructure.");
  if (tree.droughtToleranceScore >= 90) reasons.push("Excellent drought tolerance minimizes watering needs.");
  if (tree.carbonScore >= 90) reasons.push("Strong carbon sequestration profile.");
  if (tree.pollutionToleranceScore >= 90) reasons.push("Thrives in areas with high vehicle emissions or poor AQI.");
  return reasons;
};

const generateLimitations = (tree: TreeBase): string[] => {
  const limitations: string[] = [];
  if (tree.urbanSuitabilityScore < 75) limitations.push("Roots or canopy may conflict with nearby infrastructure/roads.");
  if (tree.maintenanceScore < 80) limitations.push("May require regular pruning or pest management.");
  if (tree.waterRequirement === "High") limitations.push("High water requirement limits suitability in dry regions.");
  return limitations;
};

export interface RecommendationContext {
  regionId: string;
  primaryGoalId?: string;
}

export const getTreeRecommendations = async (context: RecommendationContext): Promise<TreeRecommendation[]> => {
  // Use exact dataset filtering based on region
  let rawTrees: DatasetTreeRecord[] = [];
  if (context.regionId && context.regionId !== "all") {
    rawTrees = datasetLoader.getTreesForRegion(context.regionId);
  } else {
    rawTrees = datasetLoader.getAllTrees();
  }

  const scoredTrees: TreeRecommendation[] = rawTrees.map(raw => {
    const tree = mapDatasetTreeToBase(raw);
    return {
      ...tree,
      overallScore: calculateOverallScore(tree),
      reasons: generateReasons(tree),
      limitations: generateLimitations(tree),
    };
  });

  // Sort by overall score descending
  return scoredTrees.sort((a, b) => b.overallScore - a.overallScore);
};

export const getTreeDetails = async (treeId: string): Promise<TreeRecommendation | undefined> => {
  const trees = await getTreeRecommendations({ regionId: "all" });
  return trees.find(t => t.id === treeId);
};
