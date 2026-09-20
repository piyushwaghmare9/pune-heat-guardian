export type Role = "USER" | "ORGANIZATION" | "VENDOR" | "ADMIN";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  createdAt: string;
  organizationId?: string; // If role is ORGANIZATION
  vendorId?: string;       // If role is VENDOR
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}
