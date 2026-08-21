export const dataSources = ["hn", "yc-companies", "yc-jobs"] as const;
export type DataSource = (typeof dataSources)[number];
export type HealthStatus = "healthy" | "warning" | "failed";
export type LinkType =
  | "website"
  | "careers"
  | "apply"
  | "twitter"
  | "linkedin"
  | "github"
  | "email"
  | "source";

export type StartupRole = {
  id: string;
  title: string;
  location: string | null;
  remote: boolean | null;
  salary: string | null;
  applyUrl: string | null;
  sourceUrl: string;
};
export type StartupPerson = {
  id: string;
  name: string;
  role: string | null;
  sourceUrl: string;
};
export type StartupLink = {
  id: string;
  type: LinkType;
  url: string;
  label: string | null;
};
export type ScoreReason = { label: string; points: number; present: boolean };

export type StartupProfile = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  batch: string | null;
  source: DataSource;
  sourceUrl: string;
  websiteUrl: string | null;
  sourcePublishedAt: string | null;
  signalScore: number;
  roles: StartupRole[];
  people: StartupPerson[];
  links: StartupLink[];
  technologies: string[];
  scoreReasons: ScoreReason[];
  missingFields: string[];
};

export type SourceHealth = {
  source: DataSource;
  sourceName: string;
  sourceUrl: string;
  collectorId: string | null;
  status: HealthStatus;
  recordsFound: number;
  recordsValid: number;
  recordsInvalid: number;
  lastRunAt: string | null;
  demo: boolean;
};
export type DashboardData = {
  startups: StartupProfile[];
  health: SourceHealth[];
  mode: "live" | "demo";
  notice: string | null;
};
