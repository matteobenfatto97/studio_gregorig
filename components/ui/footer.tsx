"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import type { Route } from "next";

type NavLink = { href: Route; label: string };

const NAV_LINKS: readonly NavLink[] = [
  { href: "/" as Route, label: "Home" },
  { href: "/chi-siamo" as Route, label: "Chi Siamo" },
  { href: "/servizi" as Route, label: "Servizi" },
  { href: "/contatti" as Route, label: "Contatti" },
  { href: "/informativa-privacy" as Route, label: "Informativa Privacy" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-white/10 bg-neutral-950 text-neutral-300"
      itemScope
      itemType="https://schema.org/Dentist"
    >
      <meta itemProp="name" content="Studio dentistico Dr. Gregorig" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand + address */}
          <div>
            <Link href={"/" as Route} aria-label="Vai alla home">
              <Image
                src="/assets/icons/aa.png"
                alt="Logo Studio dentistico Dr. Gregorig"
                width={180}
                height={48}
                className="h-auto w-44"
                priority
              />
            </Link>

            <address
              className="not-italic mt-4 space-y-1 text-sm"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <span className="block" itemProp="streetAddress">
                Borgata Palú 88
              </span>
              <span className="block">
                <span itemProp="postalCode">32047</span>{" "}
                <span itemProp="addressLocality">Sappada</span>
              </span>
            </address>

            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <a
                  href="mailto:gregoriggl@gmail.com"
                  className="transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                  itemProp="email"
                >
                  gregoriggl@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+39043566198"
                  className="transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                  itemProp="telephone"
                >
                  +39 0435 66198
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Borgata+Pal%C3%BA+88,+32047+Sappada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline"
                >
                  Apri in Google Maps
                  <span aria-hidden>↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Link di navigazione"
            className="md:justify-self-center"
          >
            <h2 className="text-sm font-semibold tracking-wider text-white">
              Navigazione
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social + CTA */}
          <div className="md:justify-self-end">
            <h2 className="text-sm font-semibold tracking-wider text-white">
              Seguici
            </h2>
            <div className="mt-4 flex items-center gap-4 text-xl">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-1"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter/X"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-1"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-1"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-1"
              >
                <FaLinkedin />
              </a>
            </div>

            <div className="mt-6">
              {/* Usa UrlObject per gestire hash + typedRoutes */}
              <Link
                href={{ pathname: "/contatti", hash: "prenota" }}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Prenota una visita
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p className="text-center sm:text-left">
            Matteo Benfatto © {year} Studio dentistico Dr. Gregorig — Tutti i
            diritti riservati.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={"/informativa-privacy" as Route}
              className="hover:underline underline-offset-4"
            >
              Privacy
            </Link>
            <Link
              href={"/cookie-policy" as Route}
              className="hover:underline underline-offset-4"
            >
              Cookie
            </Link>
            <a href="#top" className="hover:underline underline-offset-4">
              Torna su
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
