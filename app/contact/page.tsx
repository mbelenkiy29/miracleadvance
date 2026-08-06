import type { Metadata } from "next";

import { ApplicationForm } from "@/components/sections/ApplicationForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Apply for a business cash advance with a New York funding specialist. Complete the intake form and we will review your application within one business day, with funding available in 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact Miracle Advance | New York Business Funding",
    description:
      "Complete the funding application and a specialist will review it within one business day.",
  },
};

// TODO: replace the placeholder phone number and office address below once the
// client confirms the details for this location.
const DETAILS = [
  {
    label: "Phone",
    lines: [{ text: "(786) 902-2025", href: "tel:+17869022025", mono: true }],
  },
  {
    label: "Email",
    lines: [
      {
        text: "deals@miracleadvancellc.com",
        href: "mailto:deals@miracleadvancellc.com",
        mono: false,
      },
    ],
  },
  {
    label: "Office",
    lines: [
      { text: "75 Wall Street", href: null, mono: false },
      { text: "New York, NY 10005", href: null, mono: false },
    ],
  },
  {
    label: "Response time",
    lines: [
      { text: "Within one business day", href: null, mono: false },
      { text: "Funding in as little as 24 hours", href: null, mono: false },
    ],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's get your business funded."
        lead="Tell us how your business runs and a New York funding specialist will come back with real numbers. Approvals are fast, and funding can be in your account within 24 hours."
      />

      <section
        aria-labelledby="contact-form-heading"
        className="border-t border-border py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
            <div>
              <Reveal>
                <h2
                  id="contact-form-heading"
                  className="font-serif text-3xl text-foreground"
                >
                  Start your funding application
                </h2>
                <p className="mt-3 max-w-xl text-base text-muted-foreground">
                  Business and owner details go straight to our underwriting
                  team, who will come back to you with real numbers. It takes a
                  few minutes.
                </p>
                <p className="mt-3 max-w-xl text-sm text-muted">
                  Submitted over an encrypted connection and delivered straight
                  to our underwriting team. Your details are never stored on
                  this site and are used solely for funding and verification
                  purposes.
                </p>
              </Reveal>

              <div className="mt-8">
                <ApplicationForm />
              </div>
            </div>

            {/* Deliberately NOT wrapped in <Reveal>. This aside is the second
                column of the grid row holding the application form, so it
                stretches to that row's height — well over 2000px. Reveal's
                whileInView uses `amount: 0.2`, evaluated against the element's
                own box, so ~400px of this aside would have to be on screen
                before it fades in, and `once: true` means a missed trigger
                never retries. The failure mode is the phone number and address
                stuck near opacity 0. The old Jotform iframe made this worse by
                growing after mount; the form does not grow, but the column is
                still far too tall for the threshold to be safe. */}
            <aside>
              <div className="lg:sticky lg:top-32">
                <h2 className="font-serif text-3xl text-foreground">
                  Reach us directly
                </h2>
                <dl className="mt-8 flex flex-col gap-6 border-t border-border pt-8">
                  {DETAILS.map((detail) => (
                    <div key={detail.label}>
                      <dt className="text-sm uppercase tracking-[0.15em] text-muted">
                        {detail.label}
                      </dt>
                      <dd className="mt-2 flex flex-col gap-1 text-base">
                        {detail.lines.map((line) =>
                          line.href ? (
                            <a
                              key={line.text}
                              href={line.href}
                              className={`text-foreground transition-colors duration-200 ease-out hover:text-accent-strong ${
                                line.mono ? "font-mono" : ""
                              }`}
                            >
                              {line.text}
                            </a>
                          ) : (
                            <span
                              key={line.text}
                              className="text-muted-foreground"
                            >
                              {line.text}
                            </span>
                          )
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
