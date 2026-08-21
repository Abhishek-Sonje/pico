import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const dataSourceEnum = pgEnum("data_source", [
  "hn",
  "yc-companies",
  "yc-jobs",
]);
export const healthStatusEnum = pgEnum("health_status", [
  "healthy",
  "warning",
  "failed",
]);
export const linkTypeEnum = pgEnum("link_type", [
  "website",
  "careers",
  "apply",
  "twitter",
  "linkedin",
  "github",
  "email",
  "source",
]);

export const startups = pgTable(
  "startups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    industry: text("industry"),
    location: text("location"),
    batch: text("batch"),
    source: dataSourceEnum("source").notNull(),
    sourceUrl: text("source_url").notNull(),
    websiteUrl: text("website_url"),
    signalScore: integer("signal_score").notNull().default(0),
    sourcePublishedAt: timestamp("source_published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("startups_name_source_unique").on(table.name, table.source),
    uniqueIndex("startups_slug_unique").on(table.slug),
    index("startups_search_idx").on(table.name),
    index("startups_score_idx").on(table.signalScore),
  ],
);

export const people = pgTable(
  "people",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    role: text("role"),
    sourceUrl: text("source_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("people_name_source_url_unique").on(
      table.name,
      table.sourceUrl,
    ),
  ],
);
export const startupPeople = pgTable(
  "startup_people",
  {
    startupId: uuid("startup_id")
      .references(() => startups.id, { onDelete: "cascade" })
      .notNull(),
    personId: uuid("person_id")
      .references(() => people.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.startupId, table.personId] })],
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    startupId: uuid("startup_id")
      .references(() => startups.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    location: text("location"),
    remote: boolean("remote"),
    salary: text("salary"),
    applyUrl: text("apply_url"),
    sourceUrl: text("source_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("roles_startup_title_source_unique").on(
      table.startupId,
      table.title,
      table.sourceUrl,
    ),
    index("roles_title_idx").on(table.title),
  ],
);
export const startupLinks = pgTable(
  "startup_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    startupId: uuid("startup_id")
      .references(() => startups.id, { onDelete: "cascade" })
      .notNull(),
    type: linkTypeEnum("type").notNull(),
    url: text("url").notNull(),
    label: text("label"),
  },
  (table) => [
    uniqueIndex("startup_links_startup_type_url_unique").on(
      table.startupId,
      table.type,
      table.url,
    ),
  ],
);
export const sourceRuns = pgTable(
  "source_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    source: dataSourceEnum("source").notNull(),
    collectorId: text("collector_id"),
    status: healthStatusEnum("status").notNull(),
    recordsFound: integer("records_found").notNull().default(0),
    recordsValid: integer("records_valid").notNull().default(0),
    recordsInvalid: integer("records_invalid").notNull().default(0),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (table) => [
    index("source_runs_source_started_idx").on(table.source, table.startedAt),
  ],
);
export const scoreReasons = pgTable(
  "score_reasons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    startupId: uuid("startup_id")
      .references(() => startups.id, { onDelete: "cascade" })
      .notNull(),
    label: text("label").notNull(),
    points: integer("points").notNull(),
    present: boolean("present").notNull(),
  },
  (table) => [
    uniqueIndex("score_reasons_startup_label_unique").on(
      table.startupId,
      table.label,
    ),
  ],
);
export const technologies = pgTable(
  "technologies",
  { id: uuid("id").defaultRandom().primaryKey(), name: text("name").notNull() },
  (table) => [uniqueIndex("technologies_name_unique").on(table.name)],
);
export const startupTechnologies = pgTable(
  "startup_technologies",
  {
    startupId: uuid("startup_id")
      .references(() => startups.id, { onDelete: "cascade" })
      .notNull(),
    technologyId: uuid("technology_id")
      .references(() => technologies.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.startupId, table.technologyId] })],
);
