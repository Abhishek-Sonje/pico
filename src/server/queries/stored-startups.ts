import "server-only";
import { desc, eq, inArray } from "drizzle-orm";
import { getDatabase } from "@/db";
import {
  people,
  roles,
  scoreReasons,
  sourceRuns,
  startupLinks,
  startupPeople,
  startups,
  startupTechnologies,
  technologies,
} from "@/db/schema";
import type { DashboardData, StartupProfile } from "@/lib/types";

export async function getStoredDashboardData(): Promise<DashboardData> {
  const db = getDatabase();
  const rows = await db
    .select()
    .from(startups)
    .where(eq(startups.source, "yc-companies"))
    .orderBy(desc(startups.signalScore));
  const startupIds = rows.map(({ id }) => id);
  const [allRoles, allLinks, allReasons, allPeople, allTechnologies] =
    startupIds.length
      ? await Promise.all([
          db.select().from(roles).where(inArray(roles.startupId, startupIds)),
          db
            .select()
            .from(startupLinks)
            .where(inArray(startupLinks.startupId, startupIds)),
          db
            .select()
            .from(scoreReasons)
            .where(inArray(scoreReasons.startupId, startupIds)),
          db
            .select({
              startupId: startupPeople.startupId,
              id: people.id,
              name: people.name,
              role: people.role,
              sourceUrl: people.sourceUrl,
            })
            .from(startupPeople)
            .innerJoin(people, eq(startupPeople.personId, people.id))
            .where(inArray(startupPeople.startupId, startupIds)),
          db
            .select({
              startupId: startupTechnologies.startupId,
              name: technologies.name,
            })
            .from(startupTechnologies)
            .innerJoin(
              technologies,
              eq(startupTechnologies.technologyId, technologies.id),
            )
            .where(inArray(startupTechnologies.startupId, startupIds)),
        ])
      : [[], [], [], [], []];

  const profiles: StartupProfile[] = rows.map((startup) => {
    const roleRows = allRoles.filter((role) => role.startupId === startup.id);
    const linkRows = allLinks.filter((link) => link.startupId === startup.id);
    const reasonRows = allReasons.filter(
      (reason) => reason.startupId === startup.id,
    );
    const personRows = allPeople.filter(
      (person) => person.startupId === startup.id,
    );
    const technologyRows = allTechnologies.filter(
      (technology) => technology.startupId === startup.id,
    );
    return {
      id: startup.id,
      name: startup.name,
      slug: startup.slug,
      description: startup.description,
      industry: startup.industry,
      location: startup.location,
      batch: startup.batch,
      source: startup.source,
      sourceUrl: startup.sourceUrl,
      websiteUrl: startup.websiteUrl,
      signalScore: startup.signalScore,
      sourcePublishedAt: startup.sourcePublishedAt?.toISOString() ?? null,
      roles: roleRows.map(
        ({ id, title, location, remote, salary, applyUrl, sourceUrl }) => ({
          id,
          title,
          location,
          remote,
          salary,
          applyUrl,
          sourceUrl,
        }),
      ),
      people: personRows.map(({ id, name, role, sourceUrl }) => ({
        id,
        name,
        role,
        sourceUrl,
      })),
      links: linkRows.map(({ id, type, url, label }) => ({
        id,
        type,
        url,
        label,
      })),
      technologies: technologyRows.map(({ name }) => name),
      scoreReasons: reasonRows.map(({ label, points, present }) => ({
        label,
        points,
        present,
      })),
      missingFields: [
        !startup.description && "Description",
        !startup.location && "Location",
        !startup.websiteUrl && "Website",
        !roleRows.length && "Open roles",
        !personRows.length && "Founder information",
        !roleRows.some((role) => role.applyUrl) && "Apply link",
      ].filter(Boolean) as string[],
    };
  });
  const latestRuns = await db
    .select()
    .from(sourceRuns)
    .where(eq(sourceRuns.source, "yc-companies"))
    .orderBy(desc(sourceRuns.startedAt));
  const seen = new Set<string>();
  const health = latestRuns
    .filter((run) => !seen.has(run.source) && seen.add(run.source))
    .map((run) => ({
      source: run.source,
      sourceName: "YC Companies",
      sourceUrl: "https://www.ycombinator.com/companies",
      collectorId: run.collectorId,
      status: run.status,
      recordsFound: run.recordsFound,
      recordsValid: run.recordsValid,
      recordsInvalid: run.recordsInvalid,
      lastRunAt: run.finishedAt?.toISOString() ?? run.startedAt.toISOString(),
      demo: false,
    }));
  const runHistory = latestRuns.slice(0, 6).map((run) => ({
    id: run.id,
    status: run.status,
    recordsFound: run.recordsFound,
    recordsValid: run.recordsValid,
    recordsInvalid: run.recordsInvalid,
    startedAt: run.startedAt.toISOString(),
    finishedAt: run.finishedAt?.toISOString() ?? null,
  }));
  return {
    startups: profiles,
    health,
    runHistory,
    mode: "live",
    notice: null,
  };
}
