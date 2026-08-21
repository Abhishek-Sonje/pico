import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "Pico — Startup opportunity radar", template: "%s | Pico" },
  description: "Discover startups worth applying to through clean, searchable, explainable public hiring signals.",
  openGraph: { title: "Pico — Startup opportunity radar", description: "Find the startup signal before everyone else.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
