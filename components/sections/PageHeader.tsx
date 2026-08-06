import { Reveal } from "@/components/ui/reveal";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Rendered under the lead. Used for the legal pages' effective date. */
  meta?: string;
};

/**
 * Interior page masthead. Same accent wash and type ramp as the homepage
 * hero, without the photographic backdrop, so subpages open with a lighter
 * version of the same gesture instead of a second design language.
 */
export function PageHeader({ eyebrow, title, lead, meta }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/4 -top-1/4 h-[900px] w-[900px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(184,147,90,0.04) 0%, rgba(184,147,90,0) 65%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
        <Reveal>
          <p className="label-eyebrow">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.04] text-foreground sm:text-[4rem]">
            {title}
          </h1>
        </Reveal>

        {lead ? (
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {lead}
            </p>
          </Reveal>
        ) : null}

        {meta ? (
          <Reveal delay={0.15}>
            <p className="mt-6 font-mono text-sm text-muted">{meta}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
