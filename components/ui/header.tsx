"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { Menu, X, Phone } from "lucide-react";

type NavItem = { href: Route; label: string };

const NAV_LINKS: readonly NavItem[] = [
  { href: "/" as Route, label: "Home" },
  { href: "/chi-siamo" as Route, label: "Chi Siamo" },
  { href: "/servizi" as Route, label: "Servizi" },
  { href: "/contatti" as Route, label: "Contatti" },
] as const;

function NavLink({ href, label }: { href: Route; label: string }) {
  const pathname = usePathname();
  const hrefStr = href as string;
  const isActive =
    hrefStr === "/" ? pathname === "/" : pathname.startsWith(hrefStr);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={
        "relative rounded-xl px-3 py-2 text-sm font-medium transition " +
        (isActive
          ? "text-white"
          : "text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50")
      }
    >
      {/* underline indicator */}
      <span className="peer">{label}</span>
      <span
        className={
          "pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-white/80 transition peer-hover:scale-x-100 " +
          (isActive ? "scale-x-100" : "")
        }
        aria-hidden
      />
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Chiudi il menu mobile quando cambia rotta
  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link
            href={"/" as Route}
            aria-label="Vai alla Home"
            className="flex items-center gap-3"
          >
            <Image
              src="/assets/icons/aa.png"
              alt="Logo Studio dentistico Dr. Gregorig"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav
          aria-label="Principale"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} />
          ))}
        </nav>

        {/* CTA area */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href="tel:+39043566198"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <Phone className="size-4" aria-hidden />
            Chiama
          </a>
          <Link
            href={{ pathname: "/contatti", hash: "prenota" }}
            className="inline-flex items-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Prenota ora
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2 text-neutral-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 md:hidden"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      <div id="mobile-nav" hidden={!open} className="md:hidden">
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <nav aria-label="Mobile" className="grid gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 text-sm text-neutral-200 hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex gap-2">
            <a
              href="tel:+39043566198"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur transition hover:bg-white/10"
            >
              <Phone className="size-4" aria-hidden />
              Chiama
            </a>
            <Link
              href={{ pathname: "/contatti", hash: "prenota" }}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
            >
              Prenota ora
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
