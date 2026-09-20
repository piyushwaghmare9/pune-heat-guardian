import { PlantationPlan, PlantationSummary } from "@/types/plantation";

export const calculatePlantationSummary = (plan: PlantationPlan): PlantationSummary => {
  const totalTrees = plan.trees.reduce((sum, item) => sum + item.quantity, 0);
  const warnings: string[] = [];

  // Very basic non-fabricated density warning.
  // Standard urban trees often require ~10-25 sq meters each depending on species.
  // We avoid fabricating a hard formula, but warn if density is extremely absurd (e.g. 500 trees in 50 sq meters).
  if (plan.availableAreaSqM > 0) {
    const sqMetersPerTree = plan.availableAreaSqM / (totalTrees || 1);
    if (sqMetersPerTree < 5) {
      warnings.push("High density: Less than 5 m² per tree. Please consult local horticultural guidelines for adequate spacing.");
    }
  }

  // We explicitly do NOT fabricate exact temperature cooling impact numbers.
  // We denote that it relies on the model.
  return {
    totalTrees,
    estimatedDensityWarnings: warnings,
    estimatedCooling: "Impact estimation will be available when validated environmental coefficients are connected.",
    estimatedCarbon: "Impact estimation will be available when validated environmental coefficients are connected."
  };
};
