# HeatGuard AI - Phase 1 Foundation

## 1. Project Objective
To establish a clean, scalable Next.js architecture from zero, laying the foundation for the subsequent 9 phases of development without introducing heavy UI or backend logic prematurely.

## 2. Technology Stack
- Next.js (v15+)
- TypeScript
- Tailwind CSS
- Next.js App Router
- ESLint

## 3. Folder Structure
- `app/` (Routing and layouts)
- `components/` (Reusable components scoped by feature and domain)
- `config/` (App configuration logic)
- `services/` (API logic abstraction)
- `types/` (TypeScript interfaces)
- `hooks/` & `lib/` (Empty placeholders for future logic)

## 4. Routing Architecture
The App Router is configured with empty functional stubs serving as placeholders:
- `/dashboard`
- `/map`
- `/ai`
- `/plantation`
- `/impact`
- `/community`
- `/vendors`
- `/profile`
- `/admin`

## 5. Component Architecture
Components are structured logically:
- `components/ui/` for basic atoms (e.g., Button, Card).
- `components/layout/` for structural pieces (e.g., SiteHeader, SiteFooter, PageContainer).

## 6. Styling Architecture
Global styles in `app/globals.css` with thematic CSS variables tracking HeatGuard AI's core identity (e.g., semantic coloring, heat risk levels). Tailwind utilities rely on this configuration.

## 7. API Architecture
A central `services/api.ts` handles the base API URL (via `.env`), header application, and error checking. Stub modules (`heatService.ts`, etc.) proxy requests to `api.ts`.

## 8. Type Architecture
Foundational domain entities (`Region`, `Tree`, `HeatData`) are defined strictly in `types/index.ts` avoiding `any` types.

## 9. Environment Variables
Created `.env.example` to track necessary keys (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_KEY`). Included `.env.local` inside `.gitignore`.

## 10. Map Architecture
Prepared the route `/map` placeholder, ready for Map components (Google Maps/Leaflet) in Phase 5.

## 11. Accessibility Approach
Semantic HTML5 tags (`<main>`, `<header>`, `<footer>`) are used throughout. Future UI components will focus on WCAG standards.

## 12. Performance Approach
All layouts and pages default to Next.js Server Components.

## 13. Security Approach
No hardcoded API keys. All keys will be sourced through `.env.local`.

## 14. What Was Completed
- Scaffolded all foundational routes and components.
- Established Next.js and Tailwind setup.
- Designed API integration stubs.
- Wrote basic layout wrappers and error/404 boundaries.

## 15. What Belongs to Phase 2
- UI/UX Design System implementation.
- Refinement of `components/ui/` and overarching component styling using Lucide icons.
