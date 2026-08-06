import Image from "next/image";

import type { SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type EditorialImageProps = {
  image: SiteImage;
  /** Passed straight to next/image. Required — get it right per section. */
  sizes: string;
  /** Only the hero image should set this. Everything else lazy-loads. */
  priority?: boolean;
  /** Applied to the frame, e.g. aspect ratio and radius. */
  className?: string;
  /** Applied to the <img>, e.g. object-position overrides. */
  imageClassName?: string;
  quality?: number;
  /**
   * Atmosphere rather than content — drops the image from the accessibility
   * tree and empties its alt. Used for the hero backdrop, which sits at 40%
   * opacity behind the headline and would only add noise to a screen reader.
   */
  decorative?: boolean;
};

/**
 * The single entry point for site photography.
 *
 * Owns the shared grade (see `.editorial-image-frame` in globals.css), the
 * blur-up placeholder, and the border ring, so no section styles a photo
 * directly. The frame sizes the image; the image always fills the frame with
 * object-cover, which is why callers set an aspect ratio or height in
 * `className` rather than passing dimensions.
 */
export function EditorialImage({
  image,
  sizes,
  priority = false,
  className,
  imageClassName,
  quality = 85,
  decorative = false,
}: EditorialImageProps) {
  return (
    <div
      className={cn("editorial-image-frame", className)}
      aria-hidden={decorative || undefined}
    >
      <Image
        src={image.src}
        alt={decorative ? "" : image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    </div>
  );
}
