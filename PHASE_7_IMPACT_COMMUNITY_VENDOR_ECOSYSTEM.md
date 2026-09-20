# 🌳 HEATGUARD AI — PHASE 7: IMPACT ANALYTICS, COMMUNITY & VENDOR ECOSYSTEM

## Overview
Phase 7 extends HeatGuard AI beyond environmental analysis and into **measurable civic action**. It introduces three robust modules tracking the real-world plantation activity triggered by the platform: Impact Analytics (`/impact`), NGOs & Communities (`/community`), and Plantation Partners (`/vendors`).

## Module A: Impact Analytics (`/impact`)
The Impact Analytics page provides a dashboard view of the active urban greening activity across Pune. 
- **Methodology Honesty:** HeatGuard AI strictly refuses to fabricate exact ecological impacts (e.g. "We cooled Pune by 0.5°C"). The platform overtly separates the measured *Plantation Plans* metric from backend *Environmental Metrics*, hiding the latter until valid scientific coefficients are attached to the API. 
- **Regional Breakdown:** Allows users to view exactly how many trees are planned for specific heat-island regions.

## Module B: Community & NGOs (`/community`)
Connects users to civic organizations (`OrganizationCard`) and active planting drives (`InitiativeCard`). 
- Features a demo form allowing citizens to "Express Interest" in joining an initiative.
- Deep-links directly from the Map component. 

## Module C: Vendors & Sponsors (`/vendors`)
Connects the plantation plans derived in Phase 6 to actual suppliers (`VendorCard`). 
- Categorized correctly (Nurseries, Landscapers, Irrigation).
- Enforces strict `Verification Status` checks on all partners to maintain platform integrity.
- Avoids implementing payment gateways to remain compliant with Phase 7 boundaries.

## Shared Data & Routing Infrastructure
- **Strict Data Provenance:** Because the backend is not yet fully active, all data in these modules is sourced from a heavily structured `lib/demo/ecosystem-data.ts`. Every single metric and vendor card is explicitly badged as `Demo` or `Unavailable` in the UI to prevent fabricated claims. 
- **Contextual URL Routing:** All three modules dynamically accept the `?region=` parameter, seamlessly filtering their content to match the user's active exploration without needing complex Redux/Context state managers.

## Backend Readiness
Services (`impactService.ts`, `communityService.ts`, `vendorService.ts`) simulate network latency and use Promise wrappers. This means that migrating to the FastAPI / MongoDB stack in the future requires swapping exactly one file per service, leaving the Next.js UI entirely untouched.
