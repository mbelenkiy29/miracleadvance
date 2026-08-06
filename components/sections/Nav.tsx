"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.png";

// Homepage anchors are absolute (/#products) so they resolve from any route,
// not just the homepage.
const LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/#products" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll and allow Escape to dismiss while the mobile sheet is open.
  React.useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-200 ease-out",
        // The spec's "solid background, foreground at 4%" is layered over the
        // page background here. A bare 4% tint left the wordmark unreadable
        // where the nav passes over the dark CTA band.
        menuOpen && "bg-background",
        !menuOpen &&
          (scrolled
            ? "border-b border-border bg-background/92 backdrop-blur-md"
            : "border-b border-transparent bg-transparent")
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 md:px-8"
      >
        <Link
          href="/"
          aria-label="Miracle Advance, home"
          className="transition-opacity duration-200 ease-out hover:opacity-80"
        >
          {/* Static import so Next emits intrinsic dimensions. The reserved
              box prevents any layout shift in the fixed 80px header. */}
          <Image
            src={logo}
            alt="Miracle Advance"
            priority
            sizes="120px"
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href="tel:+17869022025"
            className="font-mono text-sm text-foreground transition-colors duration-200 ease-out hover:text-accent-strong"
          >
            (786) 902-2025
          </a>
          <ButtonLink href="/contact" size="sm">
            Get a same-day quote
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-foreground lg:hidden"
        >
          {menuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 top-20 z-40 overflow-y-auto bg-background lg:hidden"
          >
            <div className="flex min-h-[calc(100vh-5rem)] flex-col justify-between px-6 pb-10 pt-8">
              <ul className="flex flex-col">
                {LINKS.map((link) => (
                  <li key={link.label} className="border-b border-border">
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-5 font-serif text-2xl text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-4">
                <a
                  href="tel:+17869022025"
                  className="font-mono text-sm text-muted-foreground"
                >
                  (786) 902-2025
                </a>
                <ButtonLink
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="w-full"
                >
                  Get a same-day quote
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
