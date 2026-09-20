# 🌳 HEATGUARD AI — PHASE 10
## Advanced Climate Action Intelligence, Project Lifecycle & Verification

Phase 10 successfully extends HeatGuard AI from an environmental-awareness mapping tool into a full-fledged **Climate Action Platform**. Users can now plan, track, verify, and document real-world climate interventions (like Tree Plantations).

### 1. New Features & Components
- **Public Action Registry (`/action`)**: A public-facing dashboard listing all active and verified climate action projects.
- **Detailed Project Dashboards (`/projects/[id]`)**: Comprehensive project view featuring milestone tracking, timelines, and impact estimates.
- **Plantation Planner Bridge (`/plantation`)**: Users can now directly "Launch" a Climate Action Project based on the AI's area/density calculation.
- **Action Map Layer**: Added a new geographic layer to the `HeatMap` to distinctly render active projects with specialized markers.
- **Admin Verification Portal (`/admin/projects`)**: Admins can audit incoming project states, monitor evidence, and transition projects to `Verified`.

### 2. Architecture & Data Models
- **`ClimateActionProject`**: Tracks project status, trees planned/planted, target dates, and coordinator.
- **`ProjectMilestone`**: Allows step-by-step progress tracking for implementation transparency.
- **`ProjectEvidence`**: Framework for uploading photos/documents for Admin verification to prevent data fabrication.

### 3. API Routes & Security
- `GET /api/v1/projects`: Respects visibility flags, ensuring the public only sees `Verified` or safe active projects, while admins can see everything.
- `POST /api/v1/projects`: Protects project creation, deriving ownership securely from the authenticated user token.
- `PATCH /api/v1/projects/[id]`: Protects mass-assignment and strictly limits `Verification` status updates to ADMIN roles only.
- `POST /api/v1/projects/[id]/evidence`: Secures evidence submission.

### 4. Verification Workflow
```text
Draft → In Progress → Evidence Submitted → Verification Pending → Admin Review → Verified 
```
Only an Admin can move a project to the `Verified` state, guaranteeing trust in the platform's public metrics.

### 5. Known Limitations & Future Improvements
- **File Storage**: The Evidence submission currently accepts mock `fileUrl` references. In the future, this should be hooked up to an S3 bucket or Vercel Blob.
- **Notifications**: Not currently implemented due to missing infrastructure, but the schema allows easy webhook integration when a project's status changes.
