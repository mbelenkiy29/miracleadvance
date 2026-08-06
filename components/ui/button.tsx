import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: near-black navy fill, warm off-white label.
        primary: "bg-foreground text-background hover:bg-foreground/88",
        // Ghost: hairline border, fills lightly on hover.
        ghost:
          "border border-foreground/25 text-foreground hover:border-foreground/60 hover:bg-foreground/[0.04]",
        // Inverse pair — used on the dark CTA band.
        inverse: "bg-background text-foreground hover:bg-background/88",
        inverseGhost:
          "border border-background/30 text-background hover:border-background/70 hover:bg-background/10",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentPropsWithoutRef<"a"> &
  VariantProps<typeof buttonVariants>;

/** Anchor styled as a button. Every CTA on this page is a link, not a submit. */
function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return (
    <a
      className={cn(buttonVariants({ variant, size }), "group", className)}
      {...props}
    />
  );
}

export { Button, ButtonLink, buttonVariants };
