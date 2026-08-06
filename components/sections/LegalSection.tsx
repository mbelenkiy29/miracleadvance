import { Reveal } from "@/components/ui/reveal";

/**
 * Shared building blocks for the Privacy Policy and Terms of Service pages.
 * Both render the same shape, so the heading rhythm and bullet treatment are
 * defined once here rather than duplicated per page.
 */

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className="border-b border-border py-10 first:pt-0">
      <h2 className="font-serif text-2xl text-foreground">{heading}</h2>
      <div className="mt-4 flex flex-col gap-4 text-base text-muted-foreground">
        {children}
      </div>
    </Reveal>
  );
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-accent-strong"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
