import { User } from "@/types/auth";

// Simulating a backend database of users for the demo environment
export const DEMO_USERS: User[] = [
  {
    id: "admin-1",
    name: "Platform Administrator",
    email: "admin@heatguard.ai",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: new Date("2023-01-01T00:00:00Z").toISOString(),
  },
  {
    id: "org-1-user",
    name: "Pune Green Brigade Contact",
    email: "contact@punegreenbrigade.org",
    role: "ORGANIZATION",
    status: "ACTIVE",
    createdAt: new Date("2023-05-15T00:00:00Z").toISOString(),
    organizationId: "org-1", // Links to DEMO_ORGANIZATIONS
  },
  {
    id: "ven-1-user",
    name: "Sahyadri Nurseries Admin",
    email: "admin@sahyadrinurseries.com",
    role: "VENDOR",
    status: "ACTIVE",
    createdAt: new Date("2023-06-20T00:00:00Z").toISOString(),
    vendorId: "ven-1", // Links to DEMO_VENDORS
  },
  {
    id: "user-1",
    name: "Jane Citizen",
    email: "jane.citizen@example.com",
    role: "USER",
    status: "ACTIVE",
    createdAt: new Date("2023-08-10T00:00:00Z").toISOString(),
  },
  {
    id: "user-suspended",
    name: "Suspended User",
    email: "suspended@example.com",
    role: "USER",
    status: "SUSPENDED",
    createdAt: new Date("2023-09-01T00:00:00Z").toISOString(),
  }
];

export const DEMO_TOKENS: Record<string, string> = {
  // Mapping a mock secure token to a user ID for the demo backend
  "demo-token-admin": "admin-1",
  "demo-token-org": "org-1-user",
  "demo-token-ven": "ven-1-user",
  "demo-token-user": "user-1",
};
