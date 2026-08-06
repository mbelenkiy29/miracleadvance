import { EditorialImage } from "@/components/ui/editorial-image";
import { Reveal } from "@/components/ui/reveal";
import { SITE_IMAGES } from "@/lib/images";

const PILLARS = [
  {
    headline: "Structured, not scripted.",
    description:
      "Every deal starts with a conversation about how the business actually operates, not a template.",
  },
  {
    headline: "A network, not a product shelf.",
    description:
      "Access to a wide range of financing sources so the structure fits the situation, not the other way around.",
  },
  {
    headline: "Built for speed.",
    description:
      "Same-day quotes and funding when the timing aligns, without cutting corners on structure.",
  },
];

export function WhyUs() {
  return (
    <section
      aria-labelledby="why-heading"
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="label-eyebrow">About</p>
          <h2 id="why-heading" className="mt-4 font-serif text-4xl text-foreground">
            Why Miracle Advance
          </h2>
        </Reveal>

        {/* The only "people" image on the page. Anchors the section before the
            pillars, which are pure type. */}
        <Reveal delay={0.1}>
          <EditorialImage
            image={SITE_IMAGES.counterConversation}
            sizes="(min-width: 1280px) 1152px, 100vw"
            className="mt-12 h-[240px] w-full sm:h-[320px] lg:h-[400px]"
          />
        </Reveal>

        <ul className="mt-14 border-t border-border">
          {PILLARS.map((pillar, index) => (
            <Reveal
              as="li"
              key={pillar.headline}
              delay={index * 0.1}
              className="border-b border-border"
            >
              <div className="grid grid-cols-1 gap-2 py-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
                <h3 className="font-serif text-2xl text-foreground">
                  {pillar.headline}
                </h3>
                <p className="max-w-xl text-base text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
