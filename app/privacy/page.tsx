// Placeholder legal copy for a financial services company. Must be reviewed by
// counsel familiar with commercial finance and merchant cash advance regulation
// before publishing.

import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/CtaBand";
import { LegalList, LegalSection } from "@/components/sections/LegalSection";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Miracle Advance LLC collects, uses, discloses, and safeguards your information when you visit our website and use our business funding services.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    title: "Privacy Policy | Miracle Advance",
    description:
      "How Miracle Advance LLC collects, uses, and protects your personal information.",
  },
};

const EFFECTIVE_DATE = "August 1, 2026";

function MailLink() {
  return (
    <a
      href="mailto:deals@miracleadvancellc.com"
      className="text-foreground underline decoration-accent-strong underline-offset-4 transition-colors duration-200 ease-out hover:text-accent-strong"
    >
      deals@miracleadvancellc.com
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lead="We value your privacy and are committed to protecting your personal information."
        meta={`Effective Date: ${EFFECTIVE_DATE}`}
      />

      <div className="mx-auto max-w-3xl px-6 pb-16 md:px-8 md:pb-24">
        <LegalSection heading="1. Introduction">
          <p>
            At Miracle Advance LLC, we value your privacy and are committed to
            protecting your personal information. This Privacy Policy outlines
            how we collect, use, disclose, and safeguard your information when
            you visit our website and use our services.
          </p>
        </LegalSection>

        <LegalSection heading="2. Information We Collect">
          <p>We may collect the following types of information:</p>
          <LegalList
            items={[
              <>
                <span className="text-foreground">Personal Information:</span>{" "}
                When you apply for a cash advance, we may collect personal
                information such as your name, address, phone number, email
                address, Social Security number, and financial information.
              </>,
              <>
                <span className="text-foreground">
                  Non-Personal Information:
                </span>{" "}
                We may collect non-personal information about your interactions
                with our website, including your IP address, browser type, and
                pages visited.
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection heading="3. How We Use Your Information">
          <p>
            Your information is used to process your cash advance application,
            communicate with you regarding our services, and enhance our
            website. We may also disclose your information to comply with legal
            requirements.
          </p>
        </LegalSection>

        <LegalSection heading="Data Security">
          <p>
            We take reasonable measures to protect your personal information
            from unauthorized access. However, no method of transmission over
            the internet is completely secure, and we cannot guarantee absolute
            security.
          </p>
        </LegalSection>

        <LegalSection heading="Your Rights">
          <p>
            Depending on your location, you may have rights regarding your
            personal information, such as accessing, correcting, or deleting it.
            For inquiries about your rights, please contact us.
          </p>
        </LegalSection>

        <LegalSection heading="Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy occasionally. Changes will be
            posted on our website, so please review it periodically.
          </p>
        </LegalSection>

        <LegalSection heading="Contact Us">
          <p>
            For questions about this Privacy Policy or our practices, please
            reach out to us via our contact form or email us at <MailLink />.
          </p>
        </LegalSection>
      </div>

      <CtaBand
        heading="Questions about your data?"
        body="Reach out and we will walk you through exactly what we hold and why."
        primaryHref="/contact"
        primaryLabel="Contact Us"
        headingId="privacy-cta-heading"
      />
    </>
  );
}
