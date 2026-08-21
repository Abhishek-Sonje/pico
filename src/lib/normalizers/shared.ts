import type { LinkType } from "@/lib/types";
import type { NormalizedStartup } from "@/lib/validators/startup.schema";

export function cleanText(value: string | null | undefined) {
  const cleaned = value?.replace(/\s+/g, " ").trim();
  return cleaned || null;
}

export function uniqueStrings(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function inferMissingFields(startup: NormalizedStartup) {
  return [
    !startup.websiteUrl && "Website",
    startup.people.length === 0 && "Founder information",
    !startup.roles.some((role) => role.applyUrl) && "Apply link",
    !startup.roles.some((role) => role.salary) && "Salary",
  ].filter(Boolean) as string[];
}

export function buildLinks(
  sourceUrl: string,
  websiteUrl?: string | null,
  additional: Array<{
    type: LinkType;
    url: string;
    label?: string | null;
  }> = [],
) {
  const links = [
    { type: "source" as const, url: sourceUrl, label: "Source" },
    ...(websiteUrl
      ? [{ type: "website" as const, url: websiteUrl, label: "Website" }]
      : []),
    ...additional,
  ];

  return links.filter(
    (link, index) =>
      links.findIndex(
        (other) => other.url === link.url && other.type === link.type,
      ) === index,
  );
}
