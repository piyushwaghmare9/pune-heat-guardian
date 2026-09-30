# HeatGuard AI

## Overview
HeatGuard AI is an AI-powered urban heat intelligence and climate action platform designed for smarter, cooler cities. Initially focused on Pune, Maharashtra, India, the platform helps users understand urban heat conditions, explore interactive heat maps, receive AI-based tree recommendations, and plan plantation activities.

## Technology
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- FastAPI (Backend - Future Phase)
- MongoDB (Database - Future Phase)

### Documentation
- [Phase 1: Foundation](./PHASE_1_FOUNDATION.md)
- [Phase 2: UI/UX Design System](./PHASE_2_UI_UX_DESIGN_SYSTEM.md)
- [Phase 3: Landing Page & Navigation](./PHASE_3_LANDING_PAGE.md)
- [Phase 4: Dashboard & Heat Intelligence](./PHASE_4_DASHBOARD_HEAT_INTELLIGENCE.md)
- [Phase 5: Interactive Pune Heat Map](./PHASE_5_INTERACTIVE_HEAT_MAP_LIVE_DATA.md)
- [Phase 6: AI Tree Recommendations & Plantation Planner](./PHASE_6_AI_TREE_RECOMMENDATIONS_PLANTATION.md)
- [Phase 7: Impact Analytics, Community & Vendor Ecosystem](./PHASE_7_IMPACT_COMMUNITY_VENDOR_ECOSYSTEM.md)

## Development
To start developing locally:

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

> **Note**: To view the component library, visit `/design-system` while running the local server.

### Running Frontend + ML Service Together

You can run both the Next.js frontend and the FastAPI ML inference service simultaneously:

```bash
# Option A: Run single command (Windows opens two terminal windows)
npm run dev:all

# Option B: Run via script
dev.bat        # Windows CMD
.\dev.ps1      # Windows PowerShell

# Option C: In two separate terminals
# Terminal 1 (Frontend):
npm run dev
# Terminal 2 (ML Service):
npm run dev:ml
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **ML API Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ML Service Details**: See [`ml-model/README.md`](./ml-model/README.md)

3. Build for production:
```bash
npm run build
```

## Project Structure
- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable React components grouped by feature (e.g., `ui/`, `layout/`).
- `config/`: Application configuration (e.g., site metadata, heat risks).
- `services/`: API integration services.
- `types/`: TypeScript type definitions and domain models.
- `public/`: Static assets.

## Roadmap
The website is being developed in 10 phases:
- Phase 1: Next.js Foundation + Architecture
- Phase 2: UI/UX Design System
- Phase 3: Landing Page + Website Navigation
- Phase 4: Dashboard + Heat Intelligence
- Phase 5: Interactive Pune Heat Map + Live Data
- Phase 6: AI Tree Recommendations + Plantation Planner
- Phase 7: Impact Analytics + NGO + Vendor Ecosystem
- [x] Phase 8: Authentication + User Profiles + Admin
- [x] Phase 9: Responsive + Performance + Security + Testing
- [x] Phase 10: Advanced Climate Action Intelligence, Project Lifecycle & Verification
