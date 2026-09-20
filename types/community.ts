export type OrganizationType = "NGO" | "Student Group" | "Community Group" | "Environmental Organization" | "Civic Initiative" | "Institution";

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  regions: string[]; // Region IDs
  focusAreas: string[];
  description: string;
  website?: string;
  status: "verified" | "pending" | "demo";
}

export interface Initiative {
  id: string;
  name: string;
  regionId: string;
  organizationId: string;
  goal: string;
  treesPlanned?: number;
  status: "Planning" | "Open" | "In Progress" | "Completed" | "Closed";
  description: string;
  dataStatus: "live" | "verified" | "estimated" | "demo" | "unavailable";
}
