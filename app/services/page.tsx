import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { Products } from "@/components/sections/Products";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Business cash advances, working capital, lines of credit, equipment financing, and invoice factoring for New York businesses. Funding within 24 hours when the timing aligns.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: "/services",
    title: "Funding Services for New York Businesses | Miracle Advance",
    description:
      "Cash advance and working capital solutions structured around how your business actually operates.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Funding built around how your business runs."
        lead="Miracle Advance provides fast, flexible cash advance solutions to small and mid-sized businesses across New York. Every product below is structured to your revenue, with repayment aligned to your cash flow rather than a fixed calendar."
      />

      {/* hideMeta suppresses the range, speed, and term column. The catalogue
          itself lives in lib/products.ts and is shared with the homepage, so
          the two pages cannot describe the same product differently. */}
      <Products hideMeta ctaHref="/contact" />

      <CtaBand
        heading="Not sure which fits?"
        body="Send us a note about your business and we will point you to the structure that makes sense. No credit pull to start the conversation."
        primaryHref="/contact"
        primaryLabel="Contact us"
        headingId="services-cta-heading"
      />
    </>
  );
}
