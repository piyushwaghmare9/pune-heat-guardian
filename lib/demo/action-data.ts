import { ClimateActionProject, ProjectEvidence, ProjectParticipant } from "@/types/action";

export const MOCK_PROJECTS: ClimateActionProject[] = [
  {
    id: "proj-001",
    name: "Kothrud Urban Canopy Expansion",
    description: "A community-driven tree plantation initiative aiming to cool down high-risk zones in Kothrud.",
    actionType: "Tree Plantation",
    regionId: "kothrud",
    organizationId: "org-001",
    coordinatorId: "user-1", // Demo User
    status: "Verified",
    treesPlanned: 500,
    treesPlanted: 500,
    treesVerified: 485,
    species: ["Neem", "Peepal"],
    areaSqM: 2000,
    targetStartDate: "2025-06-01T00:00:00Z",
    targetCompletionDate: "2025-08-15T00:00:00Z",
    estimatedCoolingImpact: "-1.2°C Localized",
    estimatedCarbonImpact: "10.5 tons/year",
    dataStatus: "demo",
    createdAt: "2025-05-10T00:00:00Z",
    updatedAt: "2025-08-20T00:00:00Z",
    milestones: [
      { id: "m-1", title: "Site Prepared", description: "Land cleared and marked.", status: "Completed", targetDate: "2025-06-05T00:00:00Z", completedDate: "2025-06-04T00:00:00Z" },
      { id: "m-2", title: "Trees Procured", description: "Saplings arrived from vendor.", status: "Completed", targetDate: "2025-06-15T00:00:00Z", completedDate: "2025-06-14T00:00:00Z" },
      { id: "m-3", title: "Plantation Completed", description: "All 500 trees planted.", status: "Completed", targetDate: "2025-07-30T00:00:00Z", completedDate: "2025-07-28T00:00:00Z" }
    ]
  },
  {
    id: "proj-002",
    name: "Hinjawadi IT Park Greening",
    description: "Creating green corridors along the main roads to reduce the urban heat island effect.",
    actionType: "Urban Greening",
    regionId: "hinjawadi",
    organizationId: "org-002",
    coordinatorId: "user-3", // Some other user
    status: "In Progress",
    treesPlanned: 1200,
    treesPlanted: 600,
    treesVerified: 0,
    species: ["Banyan", "Mango"],
    areaSqM: 5000,
    targetStartDate: "2026-07-01T00:00:00Z",
    targetCompletionDate: "2026-10-01T00:00:00Z",
    dataStatus: "demo",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-07-15T00:00:00Z",
    milestones: [
      { id: "m-4", title: "Site Prepared", description: "Roadside digging complete.", status: "Completed", targetDate: "2026-07-10T00:00:00Z", completedDate: "2026-07-09T00:00:00Z" },
      { id: "m-5", title: "Phase 1 Plantation", description: "First 600 trees.", status: "Completed", targetDate: "2026-08-01T00:00:00Z", completedDate: "2026-07-28T00:00:00Z" },
      { id: "m-6", title: "Phase 2 Plantation", description: "Remaining trees.", status: "Pending", targetDate: "2026-09-15T00:00:00Z" }
    ]
  },
  {
    id: "proj-003",
    name: "Shivajinagar Cooling Initiative",
    description: "Planting shade trees around public transit stops.",
    actionType: "Tree Plantation",
    regionId: "shivajinagar",
    coordinatorId: "user-1", // Demo User
    status: "Verification Pending",
    treesPlanned: 200,
    treesPlanted: 200,
    species: ["Neem"],
    areaSqM: 800,
    targetStartDate: "2026-08-01T00:00:00Z",
    targetCompletionDate: "2026-08-20T00:00:00Z",
    dataStatus: "demo",
    createdAt: "2026-07-20T00:00:00Z",
    updatedAt: "2026-08-21T00:00:00Z",
    milestones: [
      { id: "m-7", title: "Plantation Completed", description: "Completed successfully.", status: "Completed", targetDate: "2026-08-20T00:00:00Z", completedDate: "2026-08-19T00:00:00Z" }
    ]
  }
];

export const MOCK_EVIDENCE: ProjectEvidence[] = [
  {
    id: "ev-001",
    projectId: "proj-001",
    submittedBy: "user-1",
    type: "Photo",
    description: "Completion photos of Kothrud site.",
    submittedAt: "2025-08-16T00:00:00Z",
    verificationStatus: "Accepted",
    reviewedBy: "admin-1",
    reviewedAt: "2025-08-20T00:00:00Z",
    reviewComment: "Verified via satellite and site inspection logs."
  },
  {
    id: "ev-002",
    projectId: "proj-003",
    submittedBy: "user-1",
    type: "Report",
    description: "Post-plantation survival report.",
    submittedAt: "2026-08-21T00:00:00Z",
    verificationStatus: "Pending"
  }
];

export const MOCK_PARTICIPANTS: ProjectParticipant[] = [];

// Helper functions (mocking database queries)
export const getProjects = () => [...MOCK_PROJECTS];
export const getProjectById = (id: string) => MOCK_PROJECTS.find(p => p.id === id);
export const getEvidenceForProject = (projectId: string) => MOCK_EVIDENCE.filter(e => e.projectId === projectId);
export const addProject = (project: ClimateActionProject) => {
  MOCK_PROJECTS.push(project);
  return project;
};
export const updateProject = (id: string, updates: Partial<ClimateActionProject>) => {
  const idx = MOCK_PROJECTS.findIndex(p => p.id === id);
  if (idx > -1) {
    MOCK_PROJECTS[idx] = { ...MOCK_PROJECTS[idx], ...updates, updatedAt: new Date().toISOString() };
    return MOCK_PROJECTS[idx];
  }
  return null;
};
export const addEvidence = (evidence: ProjectEvidence) => {
  MOCK_EVIDENCE.push(evidence);
  return evidence;
};
export const updateEvidence = (id: string, updates: Partial<ProjectEvidence>) => {
  const idx = MOCK_EVIDENCE.findIndex(e => e.id === id);
  if (idx > -1) {
    MOCK_EVIDENCE[idx] = { ...MOCK_EVIDENCE[idx], ...updates };
    return MOCK_EVIDENCE[idx];
  }
  return null;
};
