import "server-only";
import { desc, eq } from "drizzle-orm";
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
    .orderBy(desc(startups.signalScore));
  const profiles: StartupProfile[] = await Promise.all(
    rows.map(async (startup) => {
      const [roleRows, linkRows, reasonRows, personRows, technologyRows] =
        await Promise.all([
          db.select().from(roles).where(eq(roles.startupId, startup.id)),
          db
            .select()
            .from(startupLinks)
            .where(eq(startupLinks.startupId, startup.id)),
          db
            .select()
            .from(scoreReasons)
            .where(eq(scoreReasons.startupId, startup.id)),
          db
            .select({
              id: people.id,
              name: people.name,
              role: people.role,
              sourceUrl: people.sourceUrl,
            })
            .from(startupPeople)
            .innerJoin(people, eq(startupPeople.personId, people.id))
            .where(eq(startupPeople.startupId, startup.id)),
          db
            .select({ name: technologies.name })
            .from(startupTechnologies)
            .innerJoin(
              technologies,
              eq(startupTechnologies.technologyId, technologies.id),
            )
            .where(eq(startupTechnologies.startupId, startup.id)),
        ]);
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
        people: personRows,
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
          !startup.websiteUrl && "Website",
          !personRows.length && "Founder information",
          !roleRows.some((role) => role.applyUrl) && "Apply link",
        ].filter(Boolean) as string[],
      };
    }),
  );
  const latestRuns = await db
    .select()
    .from(sourceRuns)
    .orderBy(desc(sourceRuns.startedAt));
  const seen = new Set<string>();
  const health = latestRuns
    .filter((run) => !seen.has(run.source) && seen.add(run.source))
    .map((run) => ({
      source: run.source,
      sourceName:
        run.source === "hn"
          ? "Hacker News"
          : run.source === "yc-companies"
            ? "YC Companies"
            : "YC Jobs",
      sourceUrl:
        run.source === "hn"
          ? "https://news.ycombinator.com/submitted?id=whoishiring"
          : run.source === "yc-companies"
            ? "https://www.ycombinator.com/companies"
            : "https://www.ycombinator.com/jobs",
      collectorId: run.collectorId,
      status: run.status,
      recordsFound: run.recordsFound,
      recordsValid: run.recordsValid,
      recordsInvalid: run.recordsInvalid,
      lastRunAt: run.finishedAt?.toISOString() ?? run.startedAt.toISOString(),
      demo: false,
    }));
  return { startups: profiles, health, mode: "live", notice: null };
}
