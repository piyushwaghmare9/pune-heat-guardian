# DATASET_INTEGRATION

This document serves as the primary mapping reference between the `Pune_Heat_Guardian.json` dataset and the HeatGuard AI Next.js web application.

## Dataset Information
- **Source**: `Pune_Heat_Guardian.json` (Attached Dataset)
- **Primary Entity**: Trees
- **Schema Mapping Overview**: The dataset consists of an array of Tree objects, each deeply coupled with regional context and environmental measurements. Since no standalone Region dataset was provided, Region records are aggregated on-the-fly from unique `Region` values found inside the Tree objects.

## Data Normalization & Aggregation Strategy

### Regions
Regions are dynamically discovered by taking a distinct set of `Region` strings. For each region:
- `TreeCount` is calculated based on matching records.
- `Avg_Temperature_C` is aggregated by taking the mean of `Avg_Temperature_C` across all tree records in that region.
- `Center` (Coordinates) is determined by computing the centroid (mean Latitude and Longitude) of all trees in that region.
- `Risk Level` (Categorical) is algorithmically derived from the average temperature:
  - `< 29.4°C` → `LOW`
  - `29.4°C - 29.8°C` → `MODERATE`
  - `29.8°C - 30.2°C` → `HIGH`
  - `> 30.2°C` → `EXTREME`

### Tree Recommendations
Trees are mapped from the JSON to the internal `TreeRecommendation` type:
- `Tree_ID` -> `id`
- `Common_Name` -> `commonName`
- `Scientific_Name` -> `scientificName`
- `Cooling_Score_35` -> `coolingScore`
- `CO2_Score_25` -> `carbonScore`
- `Growth_Score_15` -> `growthScore`
- `Urban_Suit_Score_10` -> `urbanSuitabilityScore`
- `Pollution_Score_5` -> `pollutionToleranceScore`
- `Drought_Score_5` -> `droughtToleranceScore`
- `Maintenance_Score_5` -> `maintenanceScore`
- `Water_Requirement` -> `waterRequirement`

The `overallScore` is calculated dynamically by HeatGuard AI's strict 35/25/15/10/5/5/5 weighting applied against the dataset values.

## Architectural Flow
```text
Pune_Heat_Guardian.json
          ↓
lib/data/dataset-loader.ts (Normalizer & Aggregator)
          ↓
┌─────────┴─────────┐
↓                   ↓
regionService      recommendationService
↓                   ↓
Map UI / Dashboard / AI Actions
```
