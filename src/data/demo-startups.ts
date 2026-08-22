import type {
  DashboardData,
  DataSource,
  SourceHealth,
  StartupProfile,
} from "@/lib/types";

const now = "2026-08-22T16:30:00.000Z";
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
    ...base("demo-1", "Orbital", "yc-companies", 95),
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
    ...base("demo-3", "Morrow Systems", "yc-companies", 61),
    description: "Automation for climate operations teams.",
    industry: "Climate",
    location: "London",
    technologies: ["Go"],
    sourceUrl: "https://www.ycombinator.com/companies",
    roles: [],
    scoreReasons: [
      { label: "Hiring roles found", points: 25, present: false },
      { label: "Salary listed", points: 5, present: false },
    ],
    missingFields: ["Open roles", "Apply link", "Founder information"],
  },
  {
    ...base("demo-4", "Kiteframe AI", "yc-companies", 90),
    description:
      "Evaluation infrastructure for teams deploying production AI agents.",
    industry: "Artificial intelligence",
    location: "San Francisco / Remote",
    batch: "S26",
    websiteUrl: "https://example.net/kiteframe",
    technologies: ["Python", "TypeScript", "Postgres", "Kubernetes"],
    roles: [
      {
        id: "r4",
        title: "AI infrastructure engineer",
        location: "San Francisco / Remote",
        remote: true,
        salary: "$170k–$220k",
        applyUrl: "https://example.net/kiteframe/careers",
        sourceUrl: "https://www.ycombinator.com/companies",
      },
    ],
    people: [
      {
        id: "p4",
        name: "Nora Alvarez",
        role: "Co-founder",
        sourceUrl: "https://www.ycombinator.com/companies",
      },
    ],
    links: [
      {
        id: "l4",
        type: "careers",
        url: "https://example.net/kiteframe/careers",
        label: "Careers",
      },
    ],
    scoreReasons: [
      { label: "Hiring roles found", points: 25, present: true },
      { label: "Clear apply link available", points: 15, present: true },
      { label: "Technology stack detected", points: 15, present: true },
      { label: "Salary listed", points: 5, present: true },
    ],
    missingFields: [],
  },
  {
    ...base("demo-5", "Ledgerlane", "yc-companies", 78),
    description: "Real-time reconciliation for modern finance teams.",
    industry: "Fintech",
    location: "New York, NY",
    batch: "W26",
    websiteUrl: "https://example.net/ledgerlane",
    technologies: ["Go", "React", "Postgres", "AWS"],
    roles: [
      {
        id: "r5",
        title: "Backend engineer",
        location: "New York, NY",
        remote: false,
        salary: "$155k–$195k",
        applyUrl: "https://example.net/ledgerlane/apply",
        sourceUrl: "https://www.ycombinator.com/companies",
      },
    ],
    people: [],
    links: [
      {
        id: "l5",
        type: "apply",
        url: "https://example.net/ledgerlane/apply",
        label: "Apply",
      },
    ],
    scoreReasons: [
      { label: "Hiring roles found", points: 25, present: true },
      { label: "Clear apply link available", points: 15, present: true },
      { label: "Technology stack detected", points: 15, present: true },
    ],
    missingFields: ["Founder information"],
  },
  {
    ...base("demo-6", "Relay Robotics", "yc-companies", 74),
    description: "Autonomous inspection software for industrial facilities.",
    industry: "Industrials",
    location: "Austin, TX",
    batch: "S25",
    websiteUrl: "https://example.net/relay-robotics",
    technologies: ["C++", "Python", "ROS", "Computer Vision"],
    roles: [
      {
        id: "r6",
        title: "Robotics software engineer",
        location: "Austin, TX",
        remote: false,
        salary: null,
        applyUrl: "https://example.net/relay-robotics/jobs",
        sourceUrl: "https://www.ycombinator.com/companies",
      },
    ],
    people: [
      {
        id: "p6",
        name: "Samir Rao",
        role: "Founder",
        sourceUrl: "https://www.ycombinator.com/companies",
      },
    ],
    links: [],
    scoreReasons: [
      { label: "Hiring roles found", points: 25, present: true },
      {
        label: "Founder or team information available",
        points: 10,
        present: true,
      },
      { label: "Technology stack detected", points: 15, present: true },
    ],
    missingFields: ["Salary"],
  },
  {
    ...base("demo-7", "Northstar Bio", "yc-companies", 69),
    description: "Laboratory workflow software for early-stage biotech teams.",
    industry: "Biotech",
    location: "Boston, MA / Remote",
    batch: "W25",
    websiteUrl: "https://example.net/northstar-bio",
    technologies: ["React", "Python", "GraphQL"],
    roles: [
      {
        id: "r7",
        title: "Product engineer",
        location: "US / Remote",
        remote: true,
        salary: "$140k–$180k",
        applyUrl: "https://example.net/northstar-bio/careers",
        sourceUrl: "https://www.ycombinator.com/companies",
      },
    ],
    people: [],
    links: [
      {
        id: "l7",
        type: "careers",
        url: "https://example.net/northstar-bio/careers",
        label: "Careers",
      },
    ],
    scoreReasons: [
      { label: "Hiring roles found", points: 25, present: true },
      { label: "Clear apply link available", points: 15, present: true },
      {
        label: "Remote or location information available",
        points: 10,
        present: true,
      },
    ],
    missingFields: ["Founder information"],
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
  health: [health("yc-companies", "YC Companies", demoStartups.length)],
  runHistory: [
    {
      id: "demo-run-1",
      status: "healthy",
      recordsFound: demoStartups.length,
      recordsValid: demoStartups.length,
      recordsInvalid: 0,
      startedAt: now,
      finishedAt: now,
    },
  ],
  mode: "demo",
  notice:
    "Curated beta demo · fictional records for feature evaluation. Connect Neon and Bright Data to view live YC Companies data.",
};
