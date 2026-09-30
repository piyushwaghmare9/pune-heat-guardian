/**
 * weatherService.ts
 * Provides live & modeled meteorological data for Pune regions using
 * Open-Meteo's open-access API (no API key required).
 */

export interface LiveWeatherData {
  temperature: number; // °C
  humidity: number; // %
  apparentTemperature: number; // °C
  uvIndex: number;
  windSpeed: number; // km/h
  aqi: number; // US AQI
  isLive: boolean;
  lastUpdated: string;
}

// In-memory cache for 5 minutes
const cache = new Map<string, { data: LiveWeatherData; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getFallbackWeather(_lat: number, _lng: number): LiveWeatherData {
  const hour = new Date().getHours();
  // Estimate UV based on hour of day in Pune
  let estimatedUV = 0;
  if (hour >= 11 && hour <= 14) estimatedUV = 7.5;
  else if (hour >= 9 && hour < 11) estimatedUV = 4.5;
  else if (hour > 14 && hour <= 17) estimatedUV = 3.5;

  return {
    temperature: 28.5,
    humidity: 58,
    apparentTemperature: 29.8,
    uvIndex: estimatedUV,
    windSpeed: 8.5,
    aqi: 105,
    isLive: false,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Fetches live weather & air quality telemetry for coordinates without requiring an API key.
 * Uses Open-Meteo open data with automatic fallback to estimated values.
 */
export async function getLiveWeather(
  lat: number = 18.5204,
  lng: number = 73.8567
): Promise<LiveWeatherData> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,uv_index,wind_speed_10m`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi`;

    const [wRes, aRes] = await Promise.all([
      fetch(weatherUrl, { signal: controller.signal }),
      fetch(aqiUrl, { signal: controller.signal }),
    ]);

    clearTimeout(timeoutId);

    if (!wRes.ok) {
      throw new Error(`Weather fetch failed: ${wRes.status}`);
    }

    const wData = await wRes.json();
    const aData = aRes.ok ? await aRes.json() : null;

    const currentW = wData?.current || {};
    const currentA = aData?.current || {};

    const result: LiveWeatherData = {
      temperature: currentW.temperature_2m ?? 28.5,
      humidity: currentW.relative_humidity_2m ?? 55,
      apparentTemperature: currentW.apparent_temperature ?? 29.0,
      uvIndex: currentW.uv_index ?? 0,
      windSpeed: currentW.wind_speed_10m ?? 8.0,
      aqi: currentA.us_aqi ?? 100,
      isLive: true,
      lastUpdated: new Date().toISOString(),
    };

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
    return result;
  } catch {
    clearTimeout(timeoutId);
    const fallback = getFallbackWeather(lat, lng);
    return fallback;
  }
}

// Backward-compatible stub
export const getWeatherData = async (_regionId: string) => {
  return getLiveWeather();
};
