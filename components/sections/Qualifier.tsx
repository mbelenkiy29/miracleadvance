"use client";

import * as React from "react";

import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const CREDIT_TIERS = [
  { label: "Fair", multiplier: 0.8 },
  { label: "Good", multiplier: 1.2 },
  { label: "Great", multiplier: 1.6 },
  { label: "Excellent", multiplier: 2.0 },
] as const;

const MIN_REVENUE = 5_000;
const MAX_REVENUE = 500_000;
const REVENUE_STEP = 5_000;

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

export function Qualifier() {
  // Default to "Good" / $50K so the result panel is never empty on load.
  const [tierIndex, setTierIndex] = React.useState(1);
  const [revenue, setRevenue] = React.useState(50_000);

  const estimate =
    Math.round((revenue * CREDIT_TIERS[tierIndex].multiplier) / 1000) * 1000;

  return (
    <section
      id="qualifier"
      aria-labelledby="qualifier-heading"
      className="scroll-mt-20 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="label-eyebrow">Qualification</p>
              <h2
                id="qualifier-heading"
                className="mt-4 font-serif text-4xl text-foreground"
              >
                See what you qualify for
              </h2>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Two questions. No credit pull. Instant estimate.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-border bg-surface p-6 sm:p-8">
              <fieldset className="border-0 p-0">
                <legend className="text-sm font-medium text-foreground">
                  Business credit profile
                </legend>
                <div className="mt-4 grid grid-cols-2 border border-border sm:grid-cols-4">
                  {CREDIT_TIERS.map((tier, index) => {
                    const selected = index === tierIndex;
                    return (
                      <label
                        key={tier.label}
                        className={cn(
                          "flex h-12 cursor-pointer items-center justify-center text-sm transition-colors duration-200 ease-out",
                          "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-accent-strong",
                          // Mobile 2x2 grid: right rule on the left column,
                          // bottom rule on the top row. Desktop 1x4: right rule
                          // on everything but the last cell.
                          index % 2 === 0 && "border-r border-border",
                          index < 2 && "border-b border-border",
                          "sm:border-b-0",
                          index < CREDIT_TIERS.length - 1
                            ? "sm:border-r sm:border-border"
                            : "sm:border-r-0",
                          selected
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                        )}
                      >
                        <input
                          type="radio"
                          name="credit-profile"
                          value={tier.label}
                          checked={selected}
                          onChange={() => setTierIndex(index)}
                          className="sr-only"
                        />
                        {tier.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-8">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Monthly revenue
                  </span>
                  <span className="font-mono text-lg tabular-nums text-foreground">
                    {formatCurrency(revenue)}
                    {revenue === MAX_REVENUE ? "+" : ""}
                  </span>
                </div>

                <Slider
                  className="mt-5"
                  min={MIN_REVENUE}
                  max={MAX_REVENUE}
                  step={REVENUE_STEP}
                  value={[revenue]}
                  onValueChange={([next]) => setRevenue(next)}
                  thumbLabel="Monthly revenue"
                  thumbValueText={`${formatCurrency(revenue)} per month`}
                />

                <div className="mt-3 flex justify-between font-mono text-xs text-muted">
                  <span>$5K</span>
                  <span>$500K</span>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-8">
                <p className="text-sm text-muted">Estimated qualification</p>
                <p
                  aria-live="polite"
                  className="mt-2 font-serif text-4xl tabular-nums text-foreground"
                >
                  {formatCurrency(estimate)}
                </p>
                <p className="mt-4 max-w-md text-xs text-muted">
                  Results shown are for illustration only. Actual offers depend
                  on business financials and approval.
                </p>
                {/* Form endpoint is TBD — CTA routes to the sales line for now. */}
                <ButtonLink href="tel:+17869022025" className="mt-6 w-full">
                  Get a same-day quote
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
