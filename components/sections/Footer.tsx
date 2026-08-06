import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/#products" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          <div>
            <Image
              src={logo}
              alt="Miracle Advance"
              sizes="140px"
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Capital that moves at the speed of your business.
            </p>
            <address className="mt-6 text-sm not-italic text-muted">
              75 Wall Street
              <br />
              New York, NY 10005
            </address>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm uppercase tracking-[0.15em] text-muted">
              Explore
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground transition-colors duration-200 ease-out hover:text-accent-strong"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm uppercase tracking-[0.15em] text-muted">
              Contact
            </h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="tel:+17869022025"
                  className="font-mono text-foreground transition-colors duration-200 ease-out hover:text-accent-strong"
                >
                  (786) 902-2025
                </a>
              </li>
              <li>
                <a
                  href="mailto:deals@miracleadvancellc.com"
                  className="text-foreground transition-colors duration-200 ease-out hover:text-accent-strong"
                >
                  deals@miracleadvancellc.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              © 2026 Miracle Advance LLC. All rights reserved.
            </p>
            <ul className="flex gap-6">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors duration-200 ease-out hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 max-w-3xl text-xs text-muted">
            Miracle Advance LLC connects businesses with funding and working
            capital opportunities across a network of financing sources. All
            applications subject to approval.
          </p>
        </div>
      </div>
    </footer>
  );
}
