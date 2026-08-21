import "server-only";

import { and, eq } from "drizzle-orm";
import {
  people,
  roles,
  scoreReasons,
  startupLinks,
  startupPeople,
  startups,
  startupTechnologies,
  technologies,
} from "@/db/schema";
import { getDatabase } from "@/db";
import { calculateSignalScore } from "@/lib/scoring/signal-score";
import type { NormalizedStartup } from "@/lib/validators/startup.schema";

function slugify(name: string, source: NormalizedStartup["source"]) {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${source}`;
}

export async function persistStartup(input: NormalizedStartup) {
  const db = getDatabase();
  const { score, reasons } = calculateSignalScore(input);

  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(startups)
      .where(
        and(eq(startups.name, input.name), eq(startups.source, input.source)),
      )
      .limit(1);

    const [startup] = await tx
      .insert(startups)
      .values({
        name: input.name,
        slug: existing?.slug ?? slugify(input.name, input.source),
        description: input.description ?? existing?.description,
        industry: input.industry ?? existing?.industry,
        location: input.location ?? existing?.location,
        batch: input.batch ?? existing?.batch,
        source: input.source,
        sourceUrl: input.sourceUrl,
        websiteUrl: input.websiteUrl ?? existing?.websiteUrl,
        sourcePublishedAt:
          input.sourcePublishedAt ?? existing?.sourcePublishedAt,
        signalScore: score,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [startups.name, startups.source],
        set: {
          description: input.description ?? existing?.description,
          industry: input.industry ?? existing?.industry,
          location: input.location ?? existing?.location,
          batch: input.batch ?? existing?.batch,
          sourceUrl: input.sourceUrl,
          websiteUrl: input.websiteUrl ?? existing?.websiteUrl,
          sourcePublishedAt:
            input.sourcePublishedAt ?? existing?.sourcePublishedAt,
          signalScore: score,
          updatedAt: new Date(),
        },
      })
      .returning();

    for (const role of input.roles) {
      await tx
        .insert(roles)
        .values({ startupId: startup.id, ...role })
        .onConflictDoUpdate({
          target: [roles.startupId, roles.title, roles.sourceUrl],
          set: {
            location: role.location,
            remote: role.remote,
            salary: role.salary,
            applyUrl: role.applyUrl,
          },
        });
    }

    for (const person of input.people) {
      const [savedPerson] = await tx
        .insert(people)
        .values(person)
        .onConflictDoUpdate({
          target: [people.name, people.sourceUrl],
          set: { role: person.role },
        })
        .returning();
      await tx
        .insert(startupPeople)
        .values({ startupId: startup.id, personId: savedPerson.id })
        .onConflictDoNothing();
    }

    for (const link of input.links) {
      await tx
        .insert(startupLinks)
        .values({ startupId: startup.id, ...link })
        .onConflictDoNothing();
    }

    for (const name of input.technologies) {
      const [technology] = await tx
        .insert(technologies)
        .values({ name })
        .onConflictDoUpdate({ target: technologies.name, set: { name } })
        .returning();
      await tx
        .insert(startupTechnologies)
        .values({ startupId: startup.id, technologyId: technology.id })
        .onConflictDoNothing();
    }

    await tx.delete(scoreReasons).where(eq(scoreReasons.startupId, startup.id));
    if (reasons.length) {
      await tx.insert(scoreReasons).values(
        reasons.map((reason) => ({
          startupId: startup.id,
          ...reason,
        })),
      );
    }

    return startup;
  });
}
