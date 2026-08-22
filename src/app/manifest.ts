import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pico — Startup opportunity radar",
    short_name: "Pico",
    description: "Clean, searchable, explainable public startup signals.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f2f2ed",
    theme_color: "#02261a",
    icons: [{ src: "/icon", sizes: "any", type: "image/png" }],
  };
}
