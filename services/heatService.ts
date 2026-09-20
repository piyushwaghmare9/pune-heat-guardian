import { fetchApi } from './api';
import { HeatData } from '@/types';

export const getHeatData = (regionId: string) => {
  // Placeholder for real API call
  return fetchApi<HeatData>(`/heat/${regionId}`);
};
