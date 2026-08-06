import { ArrowUpRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

function MetaPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right font-mono text-sm text-foreground">{value}</dd>
    </div>
  );
}

function ProductRow({
  product,
  index,
  href,
  hideMeta,
}: {
  product: Product;
  index: number;
  href: string;
  hideMeta: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <li className="border-b border-border">
      <a
        href={href}
        className={cn(
          "group grid grid-cols-1 gap-4 px-2 py-8 transition-colors duration-200 ease-out",
          "hover:bg-foreground/[0.03]",
          hideMeta
            ? "lg:grid-cols-[80px_1fr_40px] lg:items-start lg:gap-6"
            : "lg:grid-cols-[80px_1fr_320px_40px] lg:items-start lg:gap-6"
        )}
      >
        <div className="flex items-baseline gap-4 lg:contents">
          <span className="font-sans text-3xl font-light text-muted lg:col-start-1">
            {number}
          </span>
          <div className="lg:col-start-2">
            <h4 className="font-serif text-2xl tracking-[-0.02em] text-foreground transition-colors duration-200 ease-out group-hover:text-accent-strong">
              {product.name}
            </h4>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>

        {!hideMeta && (
          <dl className="flex flex-col gap-2 lg:col-start-3 lg:pt-1">
            <MetaPair label="Range" value={product.range} />
            <MetaPair label="Speed" value={product.speed} />
            <MetaPair label="Term" value={product.term} />
          </dl>
        )}

        <span
          aria-hidden="true"
          className={cn(
            "hidden self-start pt-2 text-muted opacity-0 transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:text-accent-strong group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100 lg:block",
            hideMeta ? "lg:col-start-3" : "lg:col-start-4"
          )}
        >
          <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
        </span>
      </a>
    </li>
  );
}

type ProductsProps = {
  /**
   * Suppresses the range, speed, and term column. Used on /services, where
   * figures are handled in conversation rather than published on the page.
   */
  hideMeta?: boolean;
  /** Where every product row and the closing button point. */
  ctaHref?: string;
};

export function Products({
  hideMeta = false,
  ctaHref = "#qualifier",
}: ProductsProps = {}) {
  let counter = 0;

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="scroll-mt-20 border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="label-eyebrow">Products</p>
          <h2
            id="products-heading"
            className="mt-4 font-serif text-4xl text-foreground"
          >
            Capital for every stage
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            {hideMeta
              ? "Every product below is available to New York businesses. Amounts, timing, and repayment are set once we understand how your business runs."
              : "Funding and working capital opportunities from $5,000 to $1M+, structured around your business. Same-day funding available when the timing aligns."}
          </p>
        </Reveal>

        <div className="mt-14">
          {PRODUCT_CATEGORIES.map(({ category, products }, categoryIndex) => (
            <div key={category}>
              <Reveal>
                <h3
                  className={cn(
                    "label-eyebrow mb-4",
                    categoryIndex > 0 && "mt-16"
                  )}
                >
                  {category}
                </h3>
              </Reveal>
              <ul className="border-t border-border">
                {products.map((product) => {
                  const index = counter++;
                  return (
                    <ProductRow
                      key={product.name}
                      product={product}
                      index={index}
                      href={ctaHref}
                      hideMeta={hideMeta}
                    />
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 max-w-3xl text-xs text-muted">
            {hideMeta
              ? "Actual offers depend on business financials, credit profile, and approval. Miracle Advance LLC connects businesses with funding and working capital opportunities across a network of financing sources."
              : "Rates, terms, and funding speeds shown are typical ranges. Actual offers depend on business financials, credit profile, and approval. Miracle Advance LLC connects businesses with funding and working capital opportunities across a network of financing sources."}
          </p>
        </Reveal>
      </div>

      <Reveal className="flex justify-center px-6 py-16 md:px-8">
        <ButtonLink href={ctaHref}>
          Get a same-day quote
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </ButtonLink>
      </Reveal>
    </section>
  );
}
