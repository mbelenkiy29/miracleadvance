import { EditorialImage } from "@/components/ui/editorial-image";
import { Reveal } from "@/components/ui/reveal";
import { SITE_IMAGES } from "@/lib/images";

/**
 * Full-bleed photograph between the trust bar and the qualifier.
 *
 * Deliberately has no heading, eyebrow or overlay — it exists to give the eye
 * somewhere to rest between two dense type-only sections. Not wrapped in
 * <section> with a label because there is no content to label; it is a
 * <figure> so the photograph is announced once, on its own terms.
 */
export function VisualBreak() {
  return (
    <Reveal as="figure" className="border-t border-border">
      <EditorialImage
        image={SITE_IMAGES.worksiteOverhead}
        sizes="100vw"
        className="h-[280px] w-full sm:h-[380px] lg:h-[480px]"
        imageClassName="object-center"
      />
    </Reveal>
  );
}
