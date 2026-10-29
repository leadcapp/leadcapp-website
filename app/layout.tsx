import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Nav, { StatusPill } from "@/components/Nav";
import Booking from "@/components/Booking";
import ScrollEffects from "@/components/ScrollEffects";
import Analytics from "@/components/Analytics";
import { site } from "@/lib/data";
import "./globals.css";

// Fonts are bundled with the site (no Google Fonts request): Inter Tight (variable) and JetBrains Mono.
const interTight = localFont({ src: "./fonts/InterTight.woff2", weight: "100 900", variable: "--font-inter-tight", display: "swap" });
const mono = localFont({ src: "./fonts/JetBrainsMono.woff2", weight: "400", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "App & Website Development in Malappuram, Kerala | LeadCapp",
    template: "%s | LeadCapp Software Solutions",
  },
  description:
    "Malappuram-based team building Android & iOS apps, websites and web platforms for businesses across Kerala and India. MVPs from ₹30,000. Book a free call.",
  applicationName: site.legalName,
  keywords: [
    "LeadCapp", "LeadCapp Software Solutions", "app development company in Malappuram", "app development company in Kerala", "app development company in India", "mobile app development Kerala",
    "website development company", "Next.js development", "Flutter app development", "MVP development India", "software company Kerala", "software company Malappuram", "website development Malappuram",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "LeadCapp Software Solutions · Your idea deserves a great app",
    description: site.description,
    url: site.url,
    siteName: site.legalName,
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "LeadCapp Software Solutions", description: site.description },
};

// Tells Google who the company is (name, logo, contact, Instagram) for the brand search result.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // ProfessionalService is a kind of Organization (LocalBusiness), so Google can show it for "near me" style searches.
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${site.url}/#org`,
      image: `${site.url}/logo-512.png`,
      priceRange: "₹30,000+",
      areaServed: [{ "@type": "City", name: "Malappuram" }, { "@type": "State", name: "Kerala" }, { "@type": "Country", name: "India" }],
      knowsAbout: ["Mobile app development", "Android app development", "iOS app development", "Website development", "Next.js", "Flutter", "UI/UX design", "AI integration"],
      name: site.legalName,
      alternateName: ["LeadCapp", "Lead Capp"],
      url: site.url,
      logo: `${site.url}/logo-512.png`,
      email: site.email,
      telephone: site.phone,
      description: site.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.streetAddress,
        addressLocality: site.city,
        addressRegion: site.region,
        postalCode: site.postalCode,
        addressCountry: "IN",
      },
      geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
      hasMap: site.mapsUrl,
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "10:00",
          closes: "19:00",
        },
      ],
      sameAs: [site.instagram],
      contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: site.email, telephone: site.phone, areaServed: "IN", availableLanguage: ["en", "ml", "hi"] }],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.legalName,
      alternateName: "LeadCapp",
      publisher: { "@id": `${site.url}/#org` },
      inLanguage: "en-IN",
    },
  ],
};

export const viewport: Viewport = { themeColor: "#101010", colorScheme: "dark", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Nav />
        <StatusPill />
        <main id="top">{children}</main>
        <Booking />
        <ScrollEffects />
        <Analytics />
      </body>
    </html>
  );
}
