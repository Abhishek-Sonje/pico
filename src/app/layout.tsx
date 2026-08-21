import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: { default: "Pico — Startup opportunity radar", template: "%s | Pico" },
  description:
    "Discover startups worth applying to through clean, searchable, explainable public hiring signals.",
  openGraph: {
    title: "Pico — Startup opportunity radar",
    description: "Public startup signals, cleaned and scored.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1792,
        height: 944,
        alt: "Pico startup opportunity radar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pico — Startup opportunity radar",
    description: "Public startup signals, cleaned and scored.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
