export type VendorCategory = "Tree Nursery" | "Plant Supplier" | "Plantation Service" | "Irrigation" | "Landscape Service" | "Environmental Service" | "Sponsor";

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  services: string[];
  regions: string[]; // Region IDs
  availability: string;
  website?: string;
  verificationStatus: "Verified" | "Pending Review" | "Demo" | "Unavailable";
}
