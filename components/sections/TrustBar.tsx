"use client";

import * as React from "react";
import {
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";

const STATS = [
  { value: 2650, prefix: "", suffix: "+", label: "Partners funded" },
  { value: 450, prefix: "$", suffix: "M+", label: "Capital deployed" },
  { value: 3865, prefix: "", suffix: "+", label: "Businesses served" },
  // A year shouldn't tick up from zero — it reads like a bug. Rendered static.
  { value: 2014, prefix: "", suffix: "", label: "In business since", static: true },
] as const;

function StatValue({
  value,
  prefix,
  suffix,
  animated,
}: {
  value: number;
  prefix: string;
  suffix: string;
  animated: boolean;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();
  // Years must not get a thousands separator ("2014", not "2,014").
  const formatted = animated ? value.toLocaleString("en-US") : String(value);

  // Reset to zero before first paint so there is no flash of the final value,
  // while SSR still emits the real number for no-JS and crawlers.
  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node || !animated || shouldReduceMotion) return;
    node.textContent = "0";
  }, [animated, shouldReduceMotion]);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!animated || shouldReduceMotion || !inView) return;

    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = Math.round(latest).toLocaleString("en-US");
      },
    });
    return () => controls.stop();
  }, [animated, inView, shouldReduceMotion, value]);

  return (
    <span className="font-serif text-4xl text-foreground tabular-nums sm:text-[3rem]">
      {prefix}
      <span ref={ref}>{formatted}</span>
      {suffix}
    </span>
  );
}

export function TrustBar() {
  return (
    <section aria-label="Miracle Advance by the numbers" className="border-y border-border">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <dl className="grid grid-cols-2 gap-y-10 py-14 md:grid-cols-4 md:py-16">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-3">
              <dd className="order-1">
                <StatValue
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  animated={!("static" in stat && stat.static)}
                />
              </dd>
              <dt className="order-2 text-sm uppercase tracking-[0.12em] text-muted">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
