import { z } from "zod";
import { dataSources } from "@/lib/types";
const optionalBoolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();
export const filtersSchema = z.object({
  q: z.string().trim().max(120).default(""),
  source: z.enum(dataSources).optional(),
  role: z.string().trim().max(80).optional(),
  remote: optionalBoolean,
  hasApplyLink: optionalBoolean,
  hasFounderInfo: optionalBoolean,
});
export type StartupFilters = z.infer<typeof filtersSchema>;
