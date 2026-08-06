import { ButtonLink } from "@/components/ui/button";
import { EditorialImage } from "@/components/ui/editorial-image";
import { Reveal } from "@/components/ui/reveal";
import { SITE_IMAGES } from "@/lib/images";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden pt-20"
    >
      {/* Photographic backdrop on the right edge.
          Hidden below lg: at tablet and phone widths the column is too narrow
          to read as anything but texture, and it crowds the headline.
          The mask does the real work — the image is fully transparent at its
          left edge and only reaches full strength past the halfway point, so
          it never sits directly behind the h1. Ring suppressed via
          [&::after]:hidden because a bleed image should have no frame. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,1) 72%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,1) 72%)",
        }}
      >
        <EditorialImage
          image={SITE_IMAGES.heroWorkplace}
          sizes="(min-width: 1024px) 42vw, 0px"
          priority
          decorative
          className="h-full w-full opacity-40 [&::after]:hidden"
        />
      </div>

      {/* Subtle accent wash in the top-right corner, kept from the type-only
          version — it warms the seam where the photograph fades out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/4 -top-1/4 h-[900px] w-[900px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(184,147,90,0.04) 0%, rgba(184,147,90,0) 65%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <div className="max-w-3xl">
          <Reveal>
            <h1 className="font-serif text-5xl leading-[1.04] text-foreground sm:text-[4rem] lg:text-6xl">
              Capital that moves at the speed of your business.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              From $5,000 to over $1 million. Same-day funding when the timing
              aligns. A financing partner built for how businesses actually
              operate.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <ButtonLink href="#qualifier">Get a same-day quote</ButtonLink>
              <ButtonLink href="#qualifier" variant="ghost">
                See what you qualify for
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
