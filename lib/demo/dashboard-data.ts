import { HeatTrendPoint, RegionHeatSummary } from "@/types/dashboard";

// Explicitly mark as Demo Data as per Phase 4 requirements
export const DEMO_HEAT_TREND: HeatTrendPoint[] = [
  { timestamp: "08:00", temperature: 28, averageTemperature: 29 },
  { timestamp: "10:00", temperature: 31, averageTemperature: 30 },
  { timestamp: "12:00", temperature: 35, averageTemperature: 32 },
  { timestamp: "14:00", temperature: 37, averageTemperature: 34 },
  { timestamp: "16:00", temperature: 36, averageTemperature: 34 },
  { timestamp: "18:00", temperature: 33, averageTemperature: 31 },
  { timestamp: "20:00", temperature: 30, averageTemperature: 29 },
];

export const DEMO_REGIONS_SUMMARY: RegionHeatSummary[] = [
  {
    region: { id: "shivajinagar", name: "Shivajinagar" },
    risk: "MODERATE",
    environmental: { temperature: 33, humidity: 45, aqi: 85, heatIndex: 35, lastUpdated: new Date().toISOString() }
  },
  {
    region: { id: "kothrud", name: "Kothrud" },
    risk: "LOW",
    environmental: { temperature: 31, humidity: 42, aqi: 65, heatIndex: 32, lastUpdated: new Date().toISOString() }
  },
  {
    region: { id: "baner", name: "Baner–Balewadi" },
    risk: "HIGH",
    environmental: { temperature: 36, humidity: 38, aqi: 110, heatIndex: 38, lastUpdated: new Date().toISOString() }
  },
  {
    region: { id: "hinjawadi", name: "Hinjawadi" },
    risk: "HIGH",
    environmental: { temperature: 37, humidity: 35, aqi: 125, heatIndex: 39, lastUpdated: new Date().toISOString() }
  },
  {
    region: { id: "pimpri", name: "Pimpri–Chinchwad" },
    risk: "EXTREME",
    environmental: { temperature: 39, humidity: 40, aqi: 145, heatIndex: 42, lastUpdated: new Date().toISOString() }
  }
];

export const RISK_DISTRIBUTION = [
  { name: "Low", value: 15, fill: "var(--color-heat-low)" },
  { name: "Moderate", value: 35, fill: "var(--color-heat-moderate)" },
  { name: "High", value: 30, fill: "var(--color-heat-high)" },
  { name: "Extreme", value: 20, fill: "var(--color-heat-extreme)" },
];
