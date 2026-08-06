import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    headline: "Apply in minutes.",
    description: "A short form, no bank runaround.",
  },
  {
    number: "02",
    headline: "Get a same-day quote.",
    description: "Real numbers structured to your business.",
  },
  {
    number: "03",
    headline: "Fund and go.",
    description: "Capital in your account, often within 24 hours.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="scroll-mt-20 border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="label-eyebrow">Process</p>
          {/* No headline was specified for this section. Added one so the
              heading hierarchy stays valid and the rhythm matches its
              neighbours — safe to delete if you want the eyebrow alone. */}
          <h2
            id="process-heading"
            className="mt-4 font-serif text-4xl text-foreground"
          >
            Three steps, start to funded
          </h2>
        </Reveal>

        <ol className="mt-14 grid grid-cols-1 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              key={step.number}
              delay={index * 0.1}
              className={cn(
                "py-8 md:py-0",
                index > 0 && "border-t border-border md:border-l md:border-t-0",
                index > 0 && "md:pl-8 lg:pl-10",
                index < STEPS.length - 1 && "md:pr-8 lg:pr-10"
              )}
            >
              <span className="font-serif text-4xl text-accent-strong">
                {step.number}
              </span>
              <h3 className="mt-4 font-serif text-2xl text-foreground">
                {step.headline}
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                {step.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
