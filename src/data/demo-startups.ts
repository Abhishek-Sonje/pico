import type {
  DashboardData,
  DataSource,
  SourceHealth,
  StartupProfile,
} from "@/lib/types";

const now = "2026-08-18T10:00:00.000Z";
const base = (
  id: string,
  name: string,
  source: DataSource,
  score: number,
): StartupProfile => ({
  id,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  description: null,
  industry: null,
  location: null,
  batch: null,
  source,
  sourceUrl:
    source === "product-hunt"
      ? "https://www.producthunt.com/"
      : source === "yc-companies"
        ? "https://www.ycombinator.com/companies"
        : "https://www.ycombinator.com/jobs",
  websiteUrl: null,
  sourcePublishedAt: now,
  signalScore: score,
  roles: [],
  people: [],
  links: [],
  technologies: [],
  scoreReasons: [],
  missingFields: [],
});

export const demoStartups: StartupProfile[] = [
  {
    ...base("demo-1", "Orbital", "yc-jobs", 95),
    description:
      "Developer infrastructure for teams shipping reliable AI products.",
    industry: "Developer tools",
    location: "Remote · US / Europe",
    websiteUrl: "https://example.com",
    technologies: ["TypeScript", "Postgres", "Rust"],
    roles: [
      {
        id: "r1",
        title: "Senior product engineer",
        location: "Remote",
        remote: true,
        salary: "$160k–$205k",
        applyUrl: "https://example.com/jobs/product-engineer",
        sourceUrl: "https://www.ycombinator.com/jobs",
      },
      {
        id: "r2",
        title: "Infrastructure engineer",
        location: "New York / Remote",
        remote: true,
        salary: null,
        applyUrl: "https://example.com/jobs/infra",
        sourceUrl: "https://www.ycombinator.com/jobs",
      },
    ],
    people: [
      {
        id: "p1",
        name: "Maya Chen",
        role: "Co-founder",
        sourceUrl: "https://example.com/team",
      },
    ],
    links: [
      {
        id: "l1",
        type: "website",
        url: "https://example.com",
        label: "Website",
      },
      {
        id: "l2",
        type: "careers",
        url: "https://example.com/jobs",
        label: "Careers",
      },
    ],
    scoreReasons: [
      { label: "Hiring roles found", points: 25, present: true },
      { label: "Clear apply link available", points: 15, present: true },
      {
        label: "Founder or team information available",
        points: 10,
        present: true,
      },
    ],
    missingFields: [],
  },
  {
    ...base("demo-2", "Tandem Health", "yc-companies", 82),
    description:
      "Care coordination software that gives clinical teams more time with patients.",
    industry: "Healthcare",
    location: "San Francisco, CA",
    batch: "W24",
    websiteUrl: "https://example.org",
    technologies: ["React", "Python"],
    roles: [
      {
        id: "r3",
        title: "Full-stack engineer",
        location: "San Francisco",
        remote: false,
        salary: "$145k–$190k",
        applyUrl: "https://example.org/apply",
        sourceUrl: "https://www.ycombinator.com/jobs",
      },
    ],
    people: [
      {
        id: "p2",
        name: "Ari Patel",
        role: "Founder",
        sourceUrl: "https://www.ycombinator.com/companies",
      },
    ],
    links: [
      {
        id: "l3",
        type: "apply",
        url: "https://example.org/apply",
        label: "Apply",
      },
    ],
    scoreReasons: [
      { label: "Hiring roles found", points: 25, present: true },
      { label: "Salary listed", points: 5, present: true },
    ],
    missingFields: [],
  },
  {
    ...base("demo-3", "Morrow Systems", "product-hunt", 61),
    description: "Automation for climate operations teams.",
    industry: "Climate",
    location: "London",
    technologies: ["Go"],
    sourceUrl: "https://www.producthunt.com/",
    roles: [],
    scoreReasons: [
      { label: "Hiring roles found", points: 25, present: false },
      { label: "Salary listed", points: 5, present: false },
    ],
    missingFields: ["Open roles", "Apply link", "Founder information"],
  },
];

const health = (
  source: DataSource,
  name: string,
  valid: number,
): SourceHealth => ({
  source,
  sourceName: name,
  sourceUrl:
    source === "product-hunt"
      ? "https://www.producthunt.com/"
      : source === "yc-companies"
        ? "https://www.ycombinator.com/companies"
        : "https://www.ycombinator.com/jobs",
  collectorId: null,
  status: "healthy",
  recordsFound: valid,
  recordsValid: valid,
  recordsInvalid: 0,
  lastRunAt: now,
  demo: true,
});
export const demoDashboardData: DashboardData = {
  startups: demoStartups,
  health: [
    health("product-hunt", "Product Hunt", 38),
    health("yc-companies", "YC Companies", 112),
    health("yc-jobs", "YC Jobs", 74),
  ],
  mode: "demo",
  notice: "Demo data — connect Neon and Bright Data to see live source runs.",
};
