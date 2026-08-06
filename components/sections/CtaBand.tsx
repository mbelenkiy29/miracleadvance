import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

type CtaBandProps = {
  heading?: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  /** Unique per page so multiple bands never share a heading id. */
  headingId?: string;
};

export function CtaBand({
  heading = "Ready when you are.",
  body = "Get a same-day quote. No credit pull to see what you qualify for.",
  primaryHref = "#qualifier",
  primaryLabel = "Get a same-day quote",
  headingId = "cta-heading",
}: CtaBandProps = {}) {
  return (
    <section
      aria-labelledby={headingId}
      className="bg-foreground py-16 text-background md:py-24"
    >
      <Reveal className="mx-auto max-w-6xl px-6 text-center md:px-8">
        <h2 id={headingId} className="font-serif text-4xl text-background">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-background/70">
          {body}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <ButtonLink href={primaryHref} variant="inverse">
            {primaryLabel}
          </ButtonLink>
          <ButtonLink href="tel:+17869022025" variant="inverseGhost">
            Call (786) 902-2025
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
