import { Organization, Initiative } from "@/types/community";
import { Vendor } from "@/types/vendor";
import { RegionalImpact, ImpactSummary } from "@/types/impact";

export const DEMO_ORGANIZATIONS: Organization[] = [
  {
    id: "org-1",
    name: "Pune Green Brigade",
    type: "NGO",
    regions: ["shivajinagar", "kothrud", "hinjawadi"],
    focusAreas: ["Urban Greening", "Tree Plantation"],
    description: "A coalition of local environmentalists focusing on restoring native tree cover in western Pune.",
    website: "https://example.com/pune-green-brigade",
    status: "demo"
  },
  {
    id: "org-2",
    name: "Tech City Climate Action",
    type: "Civic Initiative",
    regions: ["hinjawadi", "kharadi"],
    focusAreas: ["Heat Mitigation", "Corporate Plantation"],
    description: "Partnering with tech parks to build green corridors fighting the urban heat island effect.",
    status: "demo"
  }
];

export const DEMO_INITIATIVES: Initiative[] = [
  {
    id: "init-1",
    name: "Hinjawadi Green Corridor",
    regionId: "hinjawadi",
    organizationId: "org-2",
    goal: "Plant 500 shade trees along main IT park arteries.",
    treesPlanned: 500,
    status: "Open",
    description: "Looking for volunteers and corporate sponsors to secure saplings and manage weekend planting drives.",
    dataStatus: "demo"
  },
  {
    id: "init-2",
    name: "Kothrud Native Roots",
    regionId: "kothrud",
    organizationId: "org-1",
    goal: "Restore native species (Neem, Peepal) in residential societies.",
    treesPlanned: 200,
    status: "Planning",
    description: "Coordinating with residential welfare associations to identify safe planting spots.",
    dataStatus: "demo"
  }
];

export const DEMO_VENDORS: Vendor[] = [
  {
    id: "ven-1",
    name: "Sahyadri Native Nurseries",
    category: "Tree Nursery",
    services: ["Native Saplings", "Bulk Supply"],
    regions: ["shivajinagar", "kothrud", "swargate", "hinjawadi"],
    availability: "Available for bulk orders (>50 saplings)",
    verificationStatus: "Demo"
  },
  {
    id: "ven-2",
    name: "Urban Oasis Landscaping",
    category: "Plantation Service",
    services: ["Professional Planting", "Soil Preparation", "Initial Watering"],
    regions: ["kharadi", "vimannagar", "koregaonpark"],
    availability: "Booking required 2 weeks in advance",
    verificationStatus: "Demo"
  }
];

export const DEMO_IMPACT_SUMMARY: ImpactSummary = {
  totalTreesPlanned: 1240,
  totalTreesPlanted: 350,
  totalPlans: 28,
  totalRegions: 7,
  totalArea: 12400,
  environmentalMetrics: {
    estimatedCooling: null,
    estimatedCarbon: null,
  },
  dataStatus: "demo"
};

export const DEMO_REGIONAL_IMPACT: RegionalImpact[] = [
  {
    regionId: "hinjawadi",
    regionName: "Hinjawadi",
    treesPlanned: 500,
    area: 5000,
    primaryGoal: "Heat reduction",
    status: "planning"
  },
  {
    regionId: "kothrud",
    regionName: "Kothrud",
    treesPlanned: 200,
    area: 2500,
    primaryGoal: "Urban greening",
    status: "in-progress"
  },
  {
    regionId: "kharadi",
    regionName: "Kharadi",
    treesPlanned: 340,
    area: 3000,
    primaryGoal: "Heat reduction",
    status: "planning"
  }
];
