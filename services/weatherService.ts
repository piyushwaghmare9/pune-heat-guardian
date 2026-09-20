import { fetchApi } from './api';
import { WeatherData } from '@/types';

export const getWeatherData = (regionId: string) => {
  return fetchApi<WeatherData>(`/weather/${regionId}`);
};
