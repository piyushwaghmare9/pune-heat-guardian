import datasetRaw from './dataset.json';

export interface DatasetTreeRecord {
  Tree_ID: string;
  Region: string;
  Scientific_Name: string;
  Common_Name: string;
  Local_Name_Marathi: string;
  Family: string;
  Tree_Type: string;
  Latitude: number;
  Longitude: number;
  Ward_Name: string;
  Pincode: number;
  Elevation_m: number;
  Height_m: number;
  Canopy_Diameter_m: number;
  DBH_cm: number;
  Age_Estimate_yrs: number;
  Leaf_Type: string;
  Root_System: string;
  Wood_Density_g_cm3: number;
  CO2_Sequestration_kg_yr: number;
  O2_Production_kg_yr: number;
  Dust_Filtering_Capacity: string;
  Air_Pollution_Tolerance_Index: number;
  Cooling_Effect_C: number;
  Shade_Area_sqm: number;
  Growth_Rate: string;
  Life_Expectancy_yrs: number;
  Drought_Tolerance: string;
  Water_Requirement: string;
  Soil_Type_Preference: string;
  Sunlight_Requirement: string;
  Pavement_Damage_Risk: string;
  Pruning_Requirement: string;
  Allergenic_Potential: string;
  Maintenance_Cost_Level: string;
  Wildlife_Attraction: string;
  Street_Suitability: string;
  Cooling_Score_35: number;
  CO2_Score_25: number;
  Growth_Score_15: number;
  Urban_Suit_Score_10: number;
  Pollution_Score_5: number;
  Drought_Score_5: number;
  Maintenance_Score_5: number;
  Total_Score: number;
  Economic_Value_INR: number;
  Medicinal_Use: string;
  Fruit_Bearing: string;
  Cultural_Significance: string;
  UHI_Reduction_Potential: string;
  Microclimate_Impact: string;
  Transpiration_Rate_L_day: number;
  Avg_Temperature_C: number;
  "PM2.5_Reduction_ug_m3": number;
  "PM10_Reduction_ug_m3": number;
  SO2_Absorption: number;
  NO2_Absorption: number;
  Bark_Type: string;
  Leaf_Area_Index: number;
  Specific_Leaf_Area: number;
  Crown_Volume_m3: number;
  Above_Ground_Biomass_kg: number;
  Below_Ground_Biomass_kg: number;
  Region_Heat_Island_Severity: string;
  Region_Primary_Challenge: string;
  Region_Soil_Profile: string;
  Region_Traffic_Density: string;
  Pest_Vulnerability: string;
  Disease_Resistance: string;
  Structural_Stability: string;
  Wind_Resistance: string;
  Total_Biomass_kg: number;
  Carbon_Stored_kg: number;
  Rank_in_Pune: number;
}

export interface DatasetRegionAggregated {
  id: string;
  name: string;
  avgTemperatureC: number;
  treeCount: number;
  center: { lat: number; lng: number };
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "EXTREME";
}

const trees = (datasetRaw as unknown as { trees: DatasetTreeRecord[] }).trees;

/**
 * Derives risk level strictly based on aggregated average temperature
 */
const calculateRiskLevel = (temp: number): "LOW" | "MODERATE" | "HIGH" | "EXTREME" => {
  if (temp < 29.4) return "LOW";
  if (temp < 29.8) return "MODERATE";
  if (temp < 30.2) return "HIGH";
  return "EXTREME";
};

/**
 * Pre-computes and caches the region aggregations
 */
const buildRegionAggregations = (): DatasetRegionAggregated[] => {
  const regionsMap = new Map<string, DatasetTreeRecord[]>();
  
  trees.forEach(tree => {
    if (!regionsMap.has(tree.Region)) {
      regionsMap.set(tree.Region, []);
    }
    regionsMap.get(tree.Region)!.push(tree);
  });

  const aggregated: DatasetRegionAggregated[] = [];

  regionsMap.forEach((regionTrees, regionName) => {
    const avgTemp = regionTrees.reduce((acc, t) => acc + t.Avg_Temperature_C, 0) / regionTrees.length;
    const avgLat = regionTrees.reduce((acc, t) => acc + t.Latitude, 0) / regionTrees.length;
    const avgLng = regionTrees.reduce((acc, t) => acc + t.Longitude, 0) / regionTrees.length;

    aggregated.push({
      id: regionName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: regionName,
      avgTemperatureC: Number(avgTemp.toFixed(1)),
      treeCount: regionTrees.length,
      center: { lat: avgLat, lng: avgLng },
      riskLevel: calculateRiskLevel(avgTemp)
    });
  });

  return aggregated;
};

const AGGREGATED_REGIONS = buildRegionAggregations();

export const datasetLoader = {
  getRegions: () => AGGREGATED_REGIONS,
  getRegionById: (id: string) => AGGREGATED_REGIONS.find(r => r.id === id),
  getTreesForRegion: (regionId: string) => {
    const region = AGGREGATED_REGIONS.find(r => r.id === regionId);
    if (!region) return [];
    return trees.filter(t => t.Region === region.name);
  },
  getAllTrees: () => trees,
  getDatasetBounds: () => {
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    trees.forEach(t => {
      if (t.Latitude < minLat) minLat = t.Latitude;
      if (t.Latitude > maxLat) maxLat = t.Latitude;
      if (t.Longitude < minLng) minLng = t.Longitude;
      if (t.Longitude > maxLng) maxLng = t.Longitude;
    });
    return {
      southWest: { lat: minLat, lng: minLng },
      northEast: { lat: maxLat, lng: maxLng }
    };
  }
};
