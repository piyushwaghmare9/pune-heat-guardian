import { Vendor, VendorCategory } from "@/types/vendor";
import { DEMO_VENDORS } from "@/lib/demo/ecosystem-data";

export async function getVendors(regionId?: string, category?: VendorCategory | "All"): Promise<Vendor[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...DEMO_VENDORS];
      
      if (regionId) {
        filtered = filtered.filter(v => v.regions.includes(regionId));
      }
      if (category && category !== "All") {
        filtered = filtered.filter(v => v.category === category);
      }

      resolve(filtered);
    }, 400);
  });
}
