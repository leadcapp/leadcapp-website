import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Nav, { StatusPill } from "@/components/Nav";
import Booking from "@/components/Booking";
import ScrollEffects from "@/components/ScrollEffects";
import { site } from "@/lib/data";
import "./globals.css";

// Fonts are bundled with the site (no Google Fonts request): Inter Tight (variable) and JetBrains Mono.
const interTight = localFont({ src: "./fonts/InterTight.woff2", weight: "100 900", variable: "--font-inter-tight", display: "swap" });
const mono = localFont({ src: "./fonts/JetBrainsMono.woff2", weight: "400", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "LeadCapp · App & Web Development Agency in India", template: "%s · LeadCapp" },
  description: site.description,
  openGraph: {
    title: "LeadCapp · Your idea deserves a great app",
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#101010", colorScheme: "dark", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${mono.variable}`}>
      <body>
        <Nav />
        <StatusPill />
        <main id="top">{children}</main>
        <Booking />
        <ScrollEffects />
      </body>
    </html>
  );
}
