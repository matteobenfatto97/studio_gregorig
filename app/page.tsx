"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import LiveChat from "@/components/Chatbot";
import Hero from "@/components/ui/hero";
import ServicesSection from "@/components/lists/ServicesSection";
import ReviewList from "@/components/lists/ReviewList";
import CallUsBanner from "@/components/ui/callUs";
import { motion } from "framer-motion";
import {
  PhoneCall,
  CalendarDays,
  ShieldCheck,
  Star,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Decorative page background */}
      <PageDecor />

      {/* Site header */}
      <Header />

      <main className="relative pb-28 sm:pb-0">
        {/* Hero */}
        <Section className="pt-6 sm:pt-10 lg:pt-12">
          <Hero />

          {/* Trust bar / KPI */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <Kpi
              label="Recensioni 5★"
              value="1.200+"
              icon={<Star className="h-4 w-4" />}
            />
            <Kpi
              label="Anni di esperienza"
              value="20+"
              icon={<ShieldCheck className="h-4 w-4" />}
            />
            <Kpi
              label="Pazienti soddisfatti"
              value="10k+"
              icon={<SmileDot />}
            />
            <Kpi
              label="Tecnologie digitali"
              value="100%"
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          </motion.div>
        </Section>

        <DividerWave />

        {/* Servizi */}
        <Section id="servizi">
          <SectionHeader
            title="Trattamenti d'avanguardia"
            subtitle="Dall'igiene professionale all'estetica dentale: precisione, comfort e risultati duraturi."
          />
          <ServicesSection />
        </Section>

        {/* CTA rapida: Prenota / Chiama */}
        <Section>
          <QuickCTA />
        </Section>

        <DividerWave invert />

        {/* Recensioni */}
        <Section id="recensioni">
          <SectionHeader
            title="Cosa dicono di noi"
            subtitle="Storie vere di pazienti soddisfatti"
          />
          <ReviewList />
          <ReviewBoost />
        </Section>

        {/* Banner Chiama (già esistente) */}
        <Section>
          <CallUsBanner />
        </Section>

        {/* CTA finale */}
        <Section>
          <FinalCTA />
        </Section>

        {/* Chatbot */}
        <LiveChat />
      </main>

      {/* Site footer */}
      <Footer />

      {/* Floating action buttons */}
      <FloatingCtas />
    </div>
  );
}

/* ———————————————————————————————————————————————————————————— */
/* UI Building Blocks (local to this page)                                         */
/* ———————————————————————————————————————————————————————————— */

function Section({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-8 text-center"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-300">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function DividerWave({ invert = false }: { invert?: boolean }) {
  return (
    <div aria-hidden className="relative my-12 sm:my-16">
      <svg
        className={`mx-auto block h-10 w-full max-w-7xl ${invert ? "rotate-180" : ""}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.7,22,103.76,29.25,158,23,70.36-8.22,136.33-35.5,206.8-43.86,73.43-8.75,147.07,6.44,218.49,24.93,69.37,18,138.92,40.4,209.4,44.3,63.7,3.51,127.42-10.21,187.91-33.3V0Z"
          opacity=".25"
        ></path>
        <path
          d="M0,0V15.81C47.42,36.86,103.5,48.43,158,47.79c70.36-.82,136.3-20.66,206.78-27.68,73.43-7.33,147.06,1.38,218.49,12.85,69.37,11.38,138.92,26.1,209.4,28.67,63.7,2.3,127.42-6.67,187.91-21.74V0Z"
          opacity=".5"
        ></path>
        <path d="M0,0V5.63C47.7,22.49,103.76,31.5,158,29.66c70.36-2.37,136.33-16.92,206.8-22.47C438.23,1.22,511.87,3,583.29,6.16c69.37,3.11,138.92,7.13,209.4,8.11,63.7.9,127.42-.58,187.91-4.62V0Z"></path>
      </svg>
    </div>
  );
}

function Kpi({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition hover:bg-white/10">
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
      <span className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-tr from-cyan-400/20 to-violet-500/20 blur-lg" />
    </div>
  );
}

function QuickCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-md"
    >
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <h3 className="text-xl font-semibold text-white">
            Prenota una visita in pochi click
          </h3>
          <p className="mt-1 text-sm text-slate-300">
            Seleziona giorno e orario, scegli il medico e conferma: semplice,
            veloce, senza attese.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/prenota"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 font-medium text-slate-900 hover:opacity-90"
            >
              <CalendarDays className="h-4 w-4" /> Prenota ora
            </Link>
            <a
              href="tel:+390000000000"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white hover:bg-white/10"
            >
              <PhoneCall className="h-4 w-4" /> Chiama
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <ul className="grid w-full grid-cols-2 gap-3 text-sm">
            <li className="rounded-xl bg-white/5 p-3 text-center text-slate-300">
              Promemoria automatici
            </li>
            <li className="rounded-xl bg-white/5 p-3 text-center text-slate-300">
              Check-in digitale
            </li>
            <li className="rounded-xl bg-white/5 p-3 text-center text-slate-300">
              Pagamenti smart
            </li>
            <li className="rounded-xl bg-white/5 p-3 text-center text-slate-300">
              Zero burocrazia
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function FinalCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 p-[1px]"
    >
      <div className="rounded-2xl bg-slate-950/80 p-6 backdrop-blur-md">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400/15 via-transparent to-violet-500/15" />
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm uppercase tracking-[0.15em] text-slate-300">
            Pronti quando lo sei tu
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold text-white">
            Il tuo nuovo sorriso comincia qui
          </h3>
          <p className="max-w-2xl text-slate-300">
            Prenota la prima visita di valutazione: sapremo consigliarti il
            percorso più adatto, senza impegno.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/prenota"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 font-medium text-slate-900 hover:opacity-90"
            >
              Inizia ora <ChevronRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+390000000000"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-white hover:bg-white/10"
            >
              Parla con noi
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewBoost() {
  return (
    <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-center">
      <p className="text-sm text-slate-300">
        Hai visitato lo studio? Il tuo feedback aiuta altre persone a scegliere
        con serenità.
      </p>
      <div className="mt-3 flex justify-center gap-3">
        <Link
          href="/lascia-recensione"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-medium text-slate-900 hover:opacity-90"
        >
          Lascia una recensione
        </Link>
        <Link
          href="/recensioni"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Tutte le recensioni
        </Link>
      </div>
    </div>
  );
}

function FloatingCtas() {
  return (
    <div className="fixed bottom-6 left-4 z-40 flex flex-col gap-3 sm:left-6">
      <a
        href="tel:+390000000000"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-white backdrop-blur-md hover:bg-slate-900"
      >
        <PhoneCall className="h-4 w-4" /> Chiama
      </a>
      <Link
        href="/prenota"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-medium text-slate-900 hover:opacity-90"
      >
        <CalendarDays className="h-4 w-4" /> Prenota
      </Link>
    </div>
  );
}

function PageDecor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* radial blobs */}
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(900px_400px_at_10%_-10%,rgba(56,189,248,0.18),transparent),radial-gradient(700px_320px_at_90%_-10%,rgba(168,85,247,0.16),transparent),radial-gradient(1000px_600px_at_50%_120%,rgba(16,185,129,0.08),transparent)] dark:opacity-100" />
      {/* grid */}
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.06),transparent)]" />
    </div>
  );
}

function SmileDot() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
    </svg>
  );
}
