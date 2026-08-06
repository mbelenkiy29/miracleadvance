"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  /** Accessible name for the thumb — Radix puts role="slider" on the thumb. */
  thumbLabel: string;
  /** Human-readable rendering of the current value for screen readers. */
  thumbValueText?: string;
};

function Slider({
  className,
  thumbLabel,
  thumbValueText,
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center py-2",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-px w-full grow bg-foreground/20">
        <SliderPrimitive.Range className="absolute h-px bg-accent-strong" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={thumbLabel}
        aria-valuetext={thumbValueText}
        className="block h-4 w-4 rounded-full border border-accent-strong bg-background transition-transform duration-200 ease-out hover:scale-110"
      />
    </SliderPrimitive.Root>
  );
}

export { Slider };
