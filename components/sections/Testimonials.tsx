import { EditorialImage } from "@/components/ui/editorial-image";
import { Reveal } from "@/components/ui/reveal";
import { SITE_IMAGES, type SiteImage } from "@/lib/images";

export type Testimonial = {
  quote: string;
  author: string;
  title: string;
  image: SiteImage;
};

// TODO: replace with client-approved testimonials
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Miracle Advance structured a working capital line that scaled with our seasonal swings. First lender who actually asked how our business runs before writing a term sheet.",
    author: "Owner",
    title: "Multi-unit restaurant group",
    image: SITE_IMAGES.restaurantService,
  },
  {
    quote:
      "We closed on a second location in under two weeks. The SBA process felt fast for the first time in my career.",
    author: "Founder",
    title: "Retail expansion",
    image: SITE_IMAGES.retailFloor,
  },
  {
    quote:
      "Fast, transparent, and no runaround. They found us a structure two other lenders said didn't exist.",
    author: "CFO",
    title: "Logistics company",
    image: SITE_IMAGES.warehouseAisle,
  },
];

type TestimonialsProps = {
  testimonials?: Testimonial[];
  eyebrow?: string;
  heading?: string;
  /** The homepage owns the h2; /about passes its own so both stay unique. */
  headingId?: string;
};

export function Testimonials({
  testimonials = DEFAULT_TESTIMONIALS,
  eyebrow = "Clients",
  heading = "What clients say",
  headingId = "testimonials-heading",
}: TestimonialsProps = {}) {
  return (
    <section
      aria-labelledby={headingId}
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="label-eyebrow">{eyebrow}</p>
          <h2
            id={headingId}
            className="mt-4 font-serif text-4xl text-foreground"
          >
            {heading}
          </h2>
        </Reveal>

        {/* One row per testimonial, image and quote side by side, sides
            alternating so it reads as a spread rather than a card grid.
            Mobile stacks image-above-quote at 3:2; desktop switches the image
            to a 4:5 portrait. */}
        <ul className="mt-14 flex flex-col gap-16 md:gap-20">
          {testimonials.map((testimonial, index) => {
            const imageOnRight = index % 2 === 1;

            return (
              <Reveal as="li" key={testimonial.quote}>
                <figure className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                  <EditorialImage
                    image={testimonial.image}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className={`aspect-[3/2] w-full md:aspect-[4/5] ${
                      // order-* only applies once the grid has two columns.
                      imageOnRight ? "md:order-2" : "md:order-1"
                    }`}
                  />

                  <div className={imageOnRight ? "md:order-1" : "md:order-2"}>
                    <blockquote className="font-serif text-2xl leading-snug text-foreground lg:text-3xl">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 text-sm text-muted">
                      <span className="text-foreground">
                        {testimonial.author}
                      </span>
                      <span aria-hidden="true">, </span>
                      {testimonial.title}
                    </figcaption>
                  </div>
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
