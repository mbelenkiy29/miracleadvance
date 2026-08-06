// Placeholder legal copy for a financial services company. Must be reviewed by
// counsel familiar with commercial finance and merchant cash advance regulation
// before publishing.

import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand } from "@/components/sections/CtaBand";
import { LegalList, LegalSection } from "@/components/sections/LegalSection";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of the Miracle Advance LLC website and business funding services, including eligibility, the application process, and limitation of liability.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    url: "/terms",
    title: "Terms of Service | Miracle Advance",
    description:
      "Terms governing use of the Miracle Advance LLC website and funding services.",
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

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        lead="These terms govern your use of the Miracle Advance LLC website and funding services."
        meta={`Effective Date: ${EFFECTIVE_DATE}`}
      />

      <div className="mx-auto max-w-3xl px-6 pb-16 md:px-8 md:pb-24">
        <LegalSection heading="1. Acceptance of Terms">
          <p>
            By accessing or using the services provided by Miracle Advance LLC,
            including our website and funding services, you agree to be bound by
            these Terms of Service and all applicable laws and regulations. If
            you do not agree with these terms, please do not use our website or
            services.
          </p>
        </LegalSection>

        <LegalSection heading="2. Services Provided">
          <p>
            Miracle Advance LLC provides business funding solutions, including
            merchant cash advances and related financial services. All funding
            approvals are subject to underwriting review, eligibility
            requirements, and applicable agreements.
          </p>
        </LegalSection>

        <LegalSection heading="3. Eligibility">
          <p>To use our services, you must:</p>
          <LegalList
            items={[
              "Be at least 18 years old",
              "Provide accurate and complete information",
              "Operate a legally registered business",
              "Have the authority to enter into agreements on behalf of your business",
            ]}
          />
          <p>We reserve the right to refuse service at our discretion.</p>
        </LegalSection>

        <LegalSection heading="4. Application and Approval Process">
          <p>
            Submitting an application does not guarantee approval or funding.
            Funding decisions are based on factors including, but not limited
            to:
          </p>
          <LegalList
            items={[
              "Business revenue",
              "Time in business",
              "Bank activity",
              "Creditworthiness",
              "Verification of submitted information",
            ]}
          />
          <p>
            You agree that all information provided is truthful and accurate.
          </p>
        </LegalSection>

        <LegalSection heading="5. Use of Website">
          <p>You agree not to:</p>
          <LegalList
            items={[
              "Use the website for unlawful purposes",
              "Attempt to gain unauthorized access to our systems",
              "Transmit harmful software or malicious code",
              "Interfere with the operation or security of the website",
            ]}
          />
          <p>
            We may suspend or terminate access for violations of these terms.
          </p>
        </LegalSection>

        <LegalSection heading="6. Intellectual Property">
          <p>
            All content on this website, including text, graphics, logos, and
            branding, is the property of Miracle Advance LLC and may not be
            copied, reproduced, or distributed without written permission.
          </p>
        </LegalSection>

        <LegalSection heading="7. No Financial Advice">
          <p>
            The information provided on this website is for informational
            purposes only and does not constitute legal, tax, or financial
            advice. You should consult qualified professionals regarding your
            specific business and financial situation.
          </p>
        </LegalSection>

        <LegalSection heading="8. Limitation of Liability">
          <p>
            Miracle Advance LLC shall not be liable for any indirect,
            incidental, special, or consequential damages arising from the use
            of our website or services. We do not guarantee uninterrupted or
            error-free access to the website.
          </p>
        </LegalSection>

        <LegalSection heading="9. Third-Party Links">
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the content, privacy policies, or practices of any
            third-party sites.
          </p>
        </LegalSection>

        <LegalSection heading="10. Privacy">
          <p>
            Your use of our services is also governed by our{" "}
            <Link
              href="/privacy"
              className="text-foreground underline decoration-accent-strong underline-offset-4 transition-colors duration-200 ease-out hover:text-accent-strong"
            >
              Privacy Policy
            </Link>
            . By using our website, you consent to the collection and use of
            information as outlined in the Privacy Policy.
          </p>
        </LegalSection>

        <LegalSection heading="11. Changes to Terms">
          <p>
            We reserve the right to update or modify these Terms of Service at
            any time. Changes will be posted on this page with an updated
            effective date. Continued use of our website or services constitutes
            acceptance of those changes.
          </p>
        </LegalSection>

        <LegalSection heading="12. Governing Law">
          {/* TODO: confirm jurisdiction with counsel. The company is described
              as New York based with a New York address, but this clause names
              New Jersey. Left as supplied. */}
          <p>
            These Terms of Service shall be governed and interpreted in
            accordance with the laws of the State of New Jersey, without regard
            to conflict of law principles.
          </p>
        </LegalSection>

        <LegalSection heading="13. Contact Us">
          <p>
            If you have questions regarding these Terms of Service, please
            contact us through our contact form or email us at <MailLink />.
          </p>
        </LegalSection>
      </div>

      <CtaBand
        heading="Questions about these terms?"
        body="Reach out and we will get you a clear answer before you sign anything."
        primaryHref="/contact"
        primaryLabel="Contact Us"
        headingId="terms-cta-heading"
      />
    </>
  );
}
