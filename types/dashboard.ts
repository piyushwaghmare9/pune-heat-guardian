export type HeatRiskLevel = "LOW" | "MODERATE" | "HIGH" | "EXTREME";

export interface Region {
  id: string;
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EnvironmentalData {
  temperature: number | null; // °C
  humidity: number | null; // %
  aqi: number | null; // Air Quality Index
  heatIndex: number | null; // °C
  lastUpdated: string | null;
}

// Aliases for specific services
export type WeatherData = EnvironmentalData;
export type AQIData = EnvironmentalData;
export type HeatData = EnvironmentalData;

export interface RegionHeatSummary {
  region: Region;
  risk: HeatRiskLevel | null;
  environmental: EnvironmentalData;
}

export interface HeatTrendPoint {
  timestamp: string;
  temperature: number;
  averageTemperature: number;
}

export interface DashboardOverview {
  activeRegionsCount: number;
  overallRiskLevel: HeatRiskLevel | null;
  cityAverageTemp: number | null;
}
