# 🌳 HEATGUARD AI — PHASE 6: AI TREE RECOMMENDATIONS & PLANTATION PLANNER

## Objective
Phase 6 connects the geographic and environmental intelligence established in Phase 5 to actionable, explainable decision support. We built a robust tree recommendation engine driven by actual environmental constraints, paired with a practical Plantation Planner for translating those recommendations into physical planting strategies.

## AI Tree Recommendations (`/ai`)

### Scoring Model Architecture
The AI Tree recommendation engine is currently powered by a deterministic, transparent weighted algorithm avoiding "black box" LLM generation for scientific claims. It utilizes the project's precise specification:
- **Cooling Potential**: 35%
- **Carbon (CO₂)**: 25%
- **Growth Characteristics**: 15%
- **Urban Suitability**: 10%
- **Pollution Tolerance**: 5%
- **Drought Tolerance**: 5%
- **Maintenance Needs**: 5%

*Implementation*: `services/recommendationService.ts` executes this calculation in real-time on the dataset.

### Data Provenance & Integrity
- An explicit, typed Demo Dataset (`lib/demo/tree-data.ts`) was created featuring species like Neem, Peepal, and Arjun.
- Every tree object enforces a `dataStatus` (e.g., `demo`, `verified`) rendering in the UI so the user understands the scientific certainty of the recommendation.
- Artificial AI text generation was deliberately omitted to prevent the fabrication of non-existent ecological formulas.

### Features
- **URL Synchronization**: Integrates directly with the `?region=` state from `/map` and `/dashboard`.
- **Explainability**: Trees generate "Why it fits" (Reasons) and "Known Limitations" based strictly on their underlying math thresholds.

## Plantation Planner (`/plantation`)

### Context Transfer
When trees are selected in the AI module, they are securely passed to the Plantation Planner via URL parameters (`?region=...&tree=...&tree=...`). This guarantees that the user can share a direct link to their pre-populated plan without requiring an immediate database commit.

### Calculations & Anti-Fabrication
- Users can manipulate quantities and designate a total available plantation area (m²).
- The planner calculates total trees and estimates Density (m² per tree).
- If the density falls below standard urban horticultural thresholds (< 5m² per tree), a warning is thrown.
- **Strict Adherence**: The UI explicitly states that exact cooling and carbon reduction estimates are deferred until validated environmental coefficients are integrated, adhering to the core directive against fabricating scientific results.

## State Management & Scalability
- Relies heavily on Next.js Server Components intercepting `searchParams`.
- Client states manage internal quantities without mutating the global URL repeatedly for rapid updates.
- Ready to be swapped to a FastAPI backend: `recommendationService.ts` correctly simulates async fetching.

## Boundary Reached
This concludes Phase 6. The frontend now contains the full logic pipeline: Map exploration → Dashboard analysis → AI recommendation → Plantation action.

*(Note: Phase 7 elements such as NGO integrations or marketplace features were deliberately excluded as per the project constraints).*
