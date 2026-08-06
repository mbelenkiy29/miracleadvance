import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const siteUrl = "https://miracleadvancellc.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Miracle Advance LLC, Commercial Financing From $5,000 to $1M+ in New York",
    template: "%s | Miracle Advance LLC",
  },
  description:
    "Nationwide commercial financing from $5,000 to over $1 million. SBA loans, lines of credit, working capital, and equipment financing with same-day funding when the timing aligns.",
  keywords: [
    "commercial financing",
    "small business loans",
    "SBA loans",
    "working capital",
    "merchant cash advance",
    "equipment financing",
    "business line of credit",
    "invoice factoring",
  ],
  applicationName: "Miracle Advance LLC",
  authors: [{ name: "Miracle Advance LLC" }],
  creator: "Miracle Advance LLC",
  publisher: "Miracle Advance LLC",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Miracle Advance LLC",
    title: "Capital that moves at the speed of your business.",
    description:
      "From $5,000 to over $1 million. Same-day funding when the timing aligns. A financing partner built for how businesses actually operate.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital that moves at the speed of your business.",
    description:
      "From $5,000 to over $1 million. Same-day funding when the timing aligns.",
  },
  // REVIEW LINK ONLY. The site is deployed to a *.vercel.app URL for the client
  // to look at, and must stay out of the index until it launches on its real
  // domain — otherwise a half-finished build gets crawled and then competes
  // with the production site as duplicate content.
  //
  // Restore to `index: true, follow: true` (both blocks) at launch, together
  // with `siteUrl` above. There is deliberately no robots.txt Disallow: it
  // would block the crawl and stop Google from ever reading this tag.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  colorScheme: "light",
};

const address = {
  "@type": "PostalAddress",
  streetAddress: "75 Wall Street",
  addressLocality: "New York",
  addressRegion: "NY",
  postalCode: "10005",
  addressCountry: "US",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FinancialService",
      "@id": `${siteUrl}/#financialservice`,
      name: "Miracle Advance LLC",
      url: siteUrl,
      description:
        "Miracle Advance LLC connects businesses with funding and working capital opportunities across a network of financing sources, from $5,000 to over $1 million.",
      telephone: "+1-786-902-2025",
      email: "deals@miracleadvancellc.com",
      foundingDate: "2014",
      areaServed: { "@type": "Country", name: "United States" },
      address,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Business Financing Products",
        itemListElement: [
          "SBA Loans",
          "Installment Loans",
          "Line of Credit",
          "Merchant Cash Advance",
          "Working Capital",
          "Revenue-Based Financing",
          "Invoice Factoring",
          "Equipment Financing",
          "Payday Loans",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: "Miracle Advance LLC",
      url: siteUrl,
      telephone: "+1-786-902-2025",
      email: "deals@miracleadvancellc.com",
      priceRange: "$$",
      address,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:bg-foreground focus:px-4 focus:py-3 focus:text-sm focus:text-background"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          // Build-time constant. No user input is interpolated here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
