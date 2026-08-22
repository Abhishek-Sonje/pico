import { z } from "zod";
import { activeDataSources } from "@/lib/types";
const optionalBoolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();
export const filtersSchema = z.object({
  q: z.string().trim().max(120).default(""),
  source: z.enum(activeDataSources).optional(),
  role: z.string().trim().max(80).optional(),
  remote: optionalBoolean,
  hasApplyLink: optionalBoolean,
  hasFounderInfo: optionalBoolean,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export type StartupFilters = Omit<
  z.infer<typeof filtersSchema>,
  "page" | "limit"
>;
