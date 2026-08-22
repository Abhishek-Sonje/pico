import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return ["", "/dashboard", "/health"].map((path) => ({
    url: new URL(path || "/", base).toString(),
    changeFrequency: path ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
