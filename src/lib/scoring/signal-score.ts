import type { NormalizedStartup } from "@/lib/validators/startup.schema";
import type { ScoreReason } from "@/lib/types";

const FRESH_DAYS = 45;
export function calculateSignalScore(
  startup: NormalizedStartup,
  now = new Date(),
) {
  const hasRole = startup.roles.length > 0;
  const hasApply =
    startup.roles.some((role) => role.applyUrl) ||
    startup.links.some(
      (link) => link.type === "apply" || link.type === "careers",
    );
  const hasPeople = startup.people.length > 0;
  const hasPlace =
    Boolean(startup.location) ||
    startup.roles.some((role) => role.location || role.remote);
  const fresh = startup.sourcePublishedAt
    ? now.getTime() - startup.sourcePublishedAt.getTime() <=
      FRESH_DAYS * 86_400_000
    : false;
  const hasSalary = startup.roles.some((role) => role.salary);
  const checks: Array<[string, number, boolean]> = [
    ["Hiring roles found", 25, hasRole],
    ["Clear apply link available", 15, hasApply],
    ["Founder or team information available", 10, hasPeople],
    ["Remote or location information available", 10, hasPlace],
    ["Technology stack detected", 15, startup.technologies.length > 0],
    ["Fresh public source signal", 10, fresh],
    ["Company website available", 10, Boolean(startup.websiteUrl)],
    ["Salary listed", 5, hasSalary],
  ];
  const reasons: ScoreReason[] = checks.map(([label, points, present]) => ({
    label,
    points,
    present,
  }));
  return {
    score: reasons.reduce(
      (total, reason) => total + (reason.present ? reason.points : 0),
      0,
    ),
    reasons,
  };
}
