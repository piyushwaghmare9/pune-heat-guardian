# 🌳 HEATGUARD AI — PHASE 5: INTERACTIVE PUNE HEAT MAP

## Objective
The goal of Phase 5 was to integrate the geographic intelligence layer into HeatGuard AI. This phase established the interactive Pune Heat Map via Google Maps, introduced the `?region=` URL routing state to seamlessly share data between the Dashboard and the Map, and upgraded the `services/` layer to cleanly separate API integration from UI rendering.

## Map Architecture

### Google Maps Integration (`@vis.gl/react-google-maps`)
We installed Google's official Next.js App Router-compatible React library to handle the map canvas and marker overlays without performance bottlenecks.
- `MapContainer` manages the `APIProvider` initialization securely. If `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is missing in the environment, the app displays a graceful warning instead of crashing.
- `HeatMap` handles zoom/pan constraints, coordinates, and URL synchronization. 

### Data Flow & Mock Policy
```text
Map UI → services/regionService.ts → Typed Data (MapRegion)
```
Since actual external environmental APIs (FastAPI) are not yet live, the `regionService.ts` simulates a network delay and maps the existing Dashboard Demo Data onto the explicit `lat`/`lng` boundaries of our 10 defined Pune regions. This proves the architecture without fabricating unverified scientific numbers on the frontend.

## Components Implemented
Residing natively in `components/map/`:
- **`MapContainer`**: Secure Google Maps API initialization boundary.
- **`HeatMap`**: Core interactive component managing the Pune focus state.
- **`RegionMarker`**: Utilizes `AdvancedMarker` with a custom HTML overlay that visualizes heat intensity (radius/opacity) and risk category through semantic CSS variables (`--color-heat-extreme`).
- **`SelectedRegionPanel`**: A responsive UI overlay that reveals environmental indicators when a region is clicked, explicitly badging them as "Demo Data" and providing direct navigation links to `/dashboard`, `/ai`, and `/plantation`.

## State & Dashboard Integration
- Deep linking is active: accessing `/map?region=hinjawadi` instantly pans the map to Hinjawadi and opens its environmental panel.
- The `searchParams` payload was cascaded into `app/dashboard/page.tsx`. Navigating from the Map's "View Analytics Dashboard" button correctly populates the Dashboard's `MetricGrid` and `HeatSummary` with the chosen region's context.

## Validation & Accessibility
- `npm run build` executed flawlessly. The Map components correctly execute as `"use client"` boundaries, while the main `app/map/page.tsx` routes remain performant Server Components.
- Map markers maintain focus boundaries and cursor styling, and the `SelectedRegionPanel` avoids overlapping vital controls on mobile resolutions.

## Phase 6 Boundary
Phase 5 is officially complete. The geographic intelligence layer is robust, securely handles Google Maps rendering, and actively synchronizes region states with the Dashboard. 
The project is perfectly positioned for **Phase 6: AI Tree Recommendations + Plantation Planner**, where the `/ai` and `/plantation` routes will be built out.
