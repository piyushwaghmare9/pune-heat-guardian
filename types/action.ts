export type ProjectStatus = 
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Planned"
  | "In Progress"
  | "Evidence Submitted"
  | "Verification Pending"
  | "Verified"
  | "Monitoring"
  | "Completed"
  | "Rejected"
  | "Archived";

export type ActionType = 
  | "Tree Plantation"
  | "Heat Mitigation"
  | "Urban Greening"
  | "Maintenance"
  | "Community Awareness";

export type EvidenceStatus = "Pending" | "Accepted" | "Rejected";

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Blocked";
  targetDate: string; // ISO string
  completedDate?: string; // ISO string
}

export interface ProjectEvidence {
  id: string;
  projectId: string;
  submittedBy: string; // User ID
  type: "Photo" | "Document" | "Report";
  fileUrl?: string; // Demo reference
  description: string;
  submittedAt: string; // ISO string
  verificationStatus: EvidenceStatus;
  reviewedBy?: string; // Admin ID
  reviewedAt?: string; // ISO string
  reviewComment?: string;
}

export interface ProjectParticipant {
  id: string;
  projectId: string;
  participantId: string; // User or Vendor ID
  role: "Coordinator" | "Volunteer" | "Vendor" | "NGO";
  status: "Requested" | "Accepted" | "Rejected" | "Completed";
}

export interface ClimateActionProject {
  id: string;
  name: string;
  description: string;
  actionType: ActionType;
  regionId: string;
  organizationId?: string; // If owned by an NGO
  coordinatorId: string; // User ID
  status: ProjectStatus;
  
  // Specific to Tree Plantation (can be optional for other types)
  treesPlanned?: number;
  treesPlanted?: number;
  treesVerified?: number;
  species?: string[];
  areaSqM?: number;
  
  // Timeline
  targetStartDate: string;
  targetCompletionDate: string;
  
  // Impact estimations
  estimatedCoolingImpact?: string;
  estimatedCarbonImpact?: string;
  
  // Relationships
  milestones: ProjectMilestone[];
  dataStatus: "demo" | "live" | "estimated";
  
  createdAt: string;
  updatedAt: string;
}
