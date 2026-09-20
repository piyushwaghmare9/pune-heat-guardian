import { RegionHeatSummary } from '@/types/dashboard';
import { datasetLoader } from '@/lib/data/dataset-loader';

export interface MapRegion extends RegionHeatSummary {
  center: { lat: number; lng: number };
  treeCount: number;
}

/**
 * Returns regions with integrated heat and coordinate data derived dynamically from the primary JSON dataset.
 */
export const getMapRegions = async (): Promise<MapRegion[]> => {
  // Simulate minor network delay if required, or return instantly
  const regions = datasetLoader.getRegions();
  
  return regions.map(r => ({
    region: { id: r.id, name: r.name, coordinates: r.center },
    risk: r.riskLevel,
    environmental: {
      temperature: r.avgTemperatureC,
      humidity: null, // Not present in current dataset aggregation
      aqi: null,
      heatIndex: null,
      lastUpdated: new Date().toISOString()
    },
    center: r.center,
    treeCount: r.treeCount
  }));
};

export const getMapRegionById = async (id: string): Promise<MapRegion | undefined> => {
  const regions = await getMapRegions();
  return regions.find(r => r.region.id === id);
};
