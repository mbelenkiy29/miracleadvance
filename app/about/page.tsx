import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import {
  Testimonials,
  type Testimonial,
} from "@/components/sections/Testimonials";
import { VisualBreak } from "@/components/sections/VisualBreak";
import { Reveal } from "@/components/ui/reveal";
import { SITE_IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Miracle Advance is a New York based provider of fast, flexible business cash advances. Transparent terms, funding within 24 hours, and repayment aligned to your cash flow.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About Miracle Advance | New York Business Cash Advances",
    description:
      "A New York based funding partner built on transparency, speed, flexibility, and personalized service.",
  },
};

const DIFFERENTIATORS = [
  {
    label: "Transparency",
    body: "We believe in keeping everything clear and upfront. No hidden fees or complicated terms, just straightforward financial solutions.",
  },
  {
    label: "Flexibility",
    body: "Every business is unique, so we offer flexible repayment options tailored to fit your specific cash flow needs.",
  },
  {
    label: "Customer Focus",
    body: "We prioritize our clients' success and are committed to providing the support you need, whenever you need it.",
  },
  {
    label: "Quick and Easy Process",
    body: "With our simple application and fast approval times, you can get the funding you need within 24 hours.",
  },
];

const VALUES = [
  {
    label: "Integrity",
    body: "We uphold the highest standards of honesty and transparency in everything we do.",
  },
  {
    label: "Commitment",
    body: "We are dedicated to providing reliable financial support and building long-term relationships with our clients.",
  },
  {
    label: "Growth",
    body: "We believe in the power of small businesses and are passionate about helping them grow and succeed.",
  },
];

// Client-supplied testimonials. Photography is matched to each borrower's
// industry from the existing site registry.
const BORROWER_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "As a construction company, we often need quick access to working capital for materials and labor before client payments come through. I was hesitant at first, but after applying for a loan, I was impressed with how smooth the whole process was. The team was responsive and transparent, and we had the money we needed to keep projects moving. The repayment terms were fair and aligned with our cash flow, so there was no stress. It was a game-changer for our business.",
    author: "Orla Fenwick",
    title: "CFO at Delux Homes Co.",
    image: SITE_IMAGES.worksiteOverhead,
  },
  {
    quote:
      "When one of our largest clients delayed a big payment, we had to find a quick solution to keep our supply chain running. We applied for a cash advance, and the entire process was quick and seamless. The funds arrived right when we needed them, and the repayment terms were structured in a way that fit with our revenue cycles. This service has become a reliable partner for our business growth.",
    author: "Dorian Calloway",
    title: "CEO at Invista Seven",
    image: SITE_IMAGES.warehouseAisle,
  },
  {
    quote:
      "Running a startup means we often face tight cash flow between investment rounds. A business loan was exactly what we needed to bridge that gap. The approval was fast, and the funds were in our account within a day. It allowed us to hire additional developers and push out a key update without worrying about cash shortages. I was impressed with how easy and flexible the process was.",
    author: "Thaddeus Vireo",
    title: "Director of Operations at Regna.ai",
    image: SITE_IMAGES.counterConversation,
  },
];

function CardGrid({
  items,
  columns,
}: {
  items: { label: string; body: string }[];
  columns: "two" | "three";
}) {
  return (
    <ul
      className={`mt-10 grid grid-cols-1 gap-px border border-border bg-border ${
        columns === "two" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {items.map((item, index) => (
        <Reveal as="li" key={item.label} delay={index * 0.05}>
          <div className="flex h-full flex-col bg-surface p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-foreground">
              {item.label}
            </h3>
            <p className="mt-3 text-base text-muted-foreground">{item.body}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

function Section({
  id,
  eyebrow,
  heading,
  children,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="label-eyebrow">{eyebrow}</p>
          <h2 id={id} className="mt-4 font-serif text-4xl text-foreground">
            {heading}
          </h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Meet Miracle Advance..."
        lead="Welcome to Miracle Advance, your trusted partner for fast, flexible, and customized cash advance solutions in New York. As a leading provider of funding for businesses across the city, we specialize in offering financial support that empowers companies to thrive and grow, no matter the challenges they may face. With a deep understanding of the New York market and its unique opportunities, we're here to provide the capital you need to keep your business moving forward."
      />

      <div className="mx-auto max-w-6xl px-6 pb-16 md:px-8 md:pb-24">
        <Reveal>
          <p className="max-w-3xl text-lg text-muted-foreground">
            At Miracle Advance, we focus on making funding simple, accessible,
            and stress-free. We know that every business has its own needs,
            which is why we offer flexible and tailored cash advance solutions
            to support you at every stage of your journey. Whether you&rsquo;re
            a new business looking for initial capital, a growing enterprise
            seeking expansion funding, or an established company managing
            unforeseen expenses, we&rsquo;ve got you covered.
          </p>
        </Reveal>
      </div>

      <VisualBreak />

      <Section id="why-us-heading" eyebrow="Why us" heading="Why Miracle Advance?">
        <div className="mt-10 flex max-w-3xl flex-col gap-6 text-base text-muted-foreground">
          <Reveal>
            <p>
              Navigating the world of business finance can often be
              overwhelming, but we&rsquo;re here to make it easier for you. At
              Miracle Advance, we believe in transparency, speed, and
              personalized service. We take the time to understand your unique
              business needs and provide a solution that works for you. Our
              application process is quick and simple, our approvals are fast,
              and our repayment options are flexible, designed to align with
              your business&rsquo;s cash flow and growth potential.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p>
              Our goal is not just to provide funding but to build lasting
              relationships. We see ourselves as more than just a lender;
              we&rsquo;re your financial partner, dedicated to helping your
              business succeed and reach its full potential in the competitive
              New York market. We pride ourselves on our commitment to customer
              satisfaction, offering the support and guidance you need to
              overcome challenges and seize new opportunities.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section
        id="our-services-heading"
        eyebrow="Services"
        heading="Our Services"
      >
        <Reveal>
          <p className="mt-10 max-w-3xl text-base text-muted-foreground">
            At Miracle Advance, we offer a variety of cash advance solutions
            designed to meet the diverse needs of businesses across New York.
            Whether you need to cover operational costs, expand your operations,
            invest in new equipment, or handle unexpected financial setbacks,
            we&rsquo;re here to provide the capital you need to move forward.
            Our personalized repayment plans ensure that you&rsquo;re never
            overwhelmed, allowing you to manage your finances with confidence
            and ease.
          </p>
        </Reveal>
      </Section>

      <Section
        id="differentiators-heading"
        eyebrow="Difference"
        heading="What Sets Us Apart?"
      >
        <CardGrid items={DIFFERENTIATORS} columns="two" />
      </Section>

      <Section id="values-heading" eyebrow="Values" heading="Our Values">
        <CardGrid items={VALUES} columns="three" />
      </Section>

      <Testimonials
        testimonials={BORROWER_TESTIMONIALS}
        eyebrow="Testimonials"
        heading="What Our Borrowers Are Saying"
        headingId="borrower-testimonials-heading"
      />

      <Section
        id="join-heading"
        eyebrow="Partnership"
        heading="Join the Miracle Advance Family"
      >
        <Reveal>
          <p className="mt-10 max-w-3xl text-base text-muted-foreground">
            At Miracle Advance, we are more than just a cash advance provider,
            we are your financial partner, working alongside you to ensure your
            business has the resources it needs to thrive. With a deep
            understanding of the unique challenges and opportunities that come
            with doing business in New York, we&rsquo;re here to provide the
            financial backing you need to succeed.
          </p>
        </Reveal>
      </Section>

      <CtaBand
        heading="Let's talk about your business."
        body="Tell us how your business runs and we will structure funding around it. Approvals are fast and funding can land within 24 hours."
        primaryHref="/contact"
        primaryLabel="Contact us"
        headingId="about-cta-heading"
      />
    </>
  );
}
