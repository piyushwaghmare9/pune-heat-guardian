import { Organization, Initiative } from "@/types/community";
import { DEMO_ORGANIZATIONS, DEMO_INITIATIVES } from "@/lib/demo/ecosystem-data";

export async function getOrganizations(regionId?: string): Promise<Organization[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (regionId) {
        resolve(DEMO_ORGANIZATIONS.filter(org => org.regions.includes(regionId)));
      } else {
        resolve(DEMO_ORGANIZATIONS);
      }
    }, 400);
  });
}

export async function getInitiatives(regionId?: string): Promise<Initiative[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (regionId) {
        resolve(DEMO_INITIATIVES.filter(init => init.regionId === regionId));
      } else {
        resolve(DEMO_INITIATIVES);
      }
    }, 400);
  });
}
