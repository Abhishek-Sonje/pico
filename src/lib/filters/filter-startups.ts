import type { StartupProfile } from "@/lib/types";
import type { StartupFilters } from "@/lib/validators/filters.schema";

export function filterStartups(
  startups: StartupProfile[],
  filters: StartupFilters,
) {
  const query = filters.q?.trim().toLowerCase() ?? "";

  return startups.filter((startup) => {
    const searchText = [
      startup.name,
      startup.description,
      ...startup.technologies,
      ...startup.roles.map((role) => role.title),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchText.includes(query)) &&
      (!filters.source || startup.source === filters.source) &&
      (!filters.role ||
        startup.roles.some((role) =>
          role.title.toLowerCase().includes(filters.role!.toLowerCase()),
        )) &&
      (filters.remote !== true || startup.roles.some((role) => role.remote)) &&
      (filters.hasApplyLink !== true ||
        startup.roles.some((role) => role.applyUrl) ||
        startup.links.some((link) =>
          ["apply", "careers"].includes(link.type),
        )) &&
      (filters.hasFounderInfo !== true || startup.people.length > 0)
    );
  });
}
