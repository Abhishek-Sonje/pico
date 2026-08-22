import type { StartupProfile } from "@/lib/types";

const normalizeTechnology = (technology: string) =>
  technology.trim().toLocaleLowerCase();

export function calculateTechnologyMatch(
  startup: StartupProfile,
  selectedTechnologies: string[],
) {
  if (!selectedTechnologies.length) return null;

  const companyTechnologies = new Set(
    startup.technologies.map(normalizeTechnology),
  );
  const matchedTechnologies = selectedTechnologies.filter((technology) =>
    companyTechnologies.has(normalizeTechnology(technology)),
  );

  return {
    score: Math.round(
      (matchedTechnologies.length / selectedTechnologies.length) * 100,
    ),
    matchedTechnologies,
  };
}
