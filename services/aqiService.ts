import { fetchApi } from './api';
import { AQIData } from '@/types';

export const getAqiData = (regionId: string) => {
  return fetchApi<AQIData>(`/aqi/${regionId}`);
};
