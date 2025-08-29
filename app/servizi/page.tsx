// app/servizi/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import ServicesInteractiveSection from "@/components/lists/ServicesInteractiveSection";
import FaqSection from "@/components/ui/FaqSection";
import LiveChat from "@/components/Chatbot";
import {
  CalendarClock,
  CheckCircle2,
  ShieldCheck,
  Smile,
  Stethoscope,
  Brush,
  Scan,
  Syringe,
  Wrench,
  Wand2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Servizi • Studio dentistico Dr. Gregorig",
  description:
    "Prenota una visita, scopri i nostri servizi di igiene, implantologia ed estetica dentale. Tecnologie d’avanguardia e team dedicato.",
};

function FeatureCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-neutral-200 backdrop-blur transition hover:bg-white/10">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-300">
        {children}
      </p>
    </div>
  );
}

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">
      <span className="text-white">{icon}</span>
      {label}
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-neutral-300">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" />
      <span>{children}</span>
    </li>
  );
}

export default function ServiziPage() {
  return (
    <>
      <Header />

      {/* rimosso bg pieno per far vedere il background del layout */}
      <main className="text-white">
        {/* HERO / PRENOTA */}
        <section
          id="prenota"
          className="mx-auto grid min-h-[62vh] max-w-7xl grid-cols-1 lg:grid-cols-2"
        >
          {/* Visual side — torna la foto “onboarding” */}
          <div className="relative order-1 min-h-[44vh] overflow-hidden lg:order-2 lg:min-h-[70vh]">
            <Image
              src="/assets/images/onboarding.jpeg"
              alt="Paziente durante una visita in studio"
              fill
              priority
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/0 to-transparent"
            />
            {/* Glow morbido */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 [background:radial-gradient(500px_240px_at_75%_20%,rgba(34,211,238,.18),transparent),radial-gradient(400px_220px_at_15%_25%,rgba(168,85,247,.12),transparent)]"
            />
          </div>

          {/* Booking side */}
          <div className="order-2 flex items-center justify-center p-6 lg:order-1 lg:p-12">
            {/* fix: w_full -> w-full */}
            <div className="w-full max-w-md">
              <div className="flex items-center gap-2">
                <StatPill
                  icon={<ShieldCheck className="h-3.5 w-3.5" />}
                  label="Tecnologie d’avanguardia"
                />
                <StatPill
                  icon={<CalendarClock className="h-3.5 w-3.5" />}
                  label="Appuntamenti rapidi"
                />
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Prenota una prima visita
              </h1>
              <p className="mt-2 text-sm text-neutral-300">
                Ti ricontattiamo in breve per fissare l’orario migliore e darti
                tutte le indicazioni.
              </p>

              <form
                className="mt-6 space-y-4"
                action="#"
                method="post"
                noValidate
              >
                <label htmlFor="name" className="block">
                  <span className="block text-xs text-white/80">
                    Nome e Cognome*
                  </span>
                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Mario Rossi"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 shadow-sm outline-none focus:ring-2 focus:ring-cyan-300/60"
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label htmlFor="phone" className="block">
                    <span className="block text-xs text-white/80">
                      Telefono
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="+39 ..."
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 shadow-sm outline-none focus:ring-2 focus:ring-cyan-300/60"
                    />
                  </label>
                  <label htmlFor="email" className="block">
                    <span className="block text-xs text-white/80">Email*</span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="nome@esempio.it"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 shadow-sm outline-none focus:ring-2 focus:ring-cyan-300/60"
                    />
                  </label>
                </div>

                <label htmlFor="service" className="block">
                  <span className="block text-xs text-white/80">
                    Servizio di interesse
                  </span>
                  <select
                    id="service"
                    name="service"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white shadow-sm outline-none focus:ring-2 focus:ring-cyan-300/60"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-neutral-900">
                      Seleziona un servizio
                    </option>
                    <option value="igiene" className="bg-neutral-900">
                      Igiene & Prevenzione
                    </option>
                    <option value="implantologia" className="bg-neutral-900">
                      Implantologia
                    </option>
                    <option value="estetica" className="bg-neutral-900">
                      Estetica dentale
                    </option>
                    <option value="altro" className="bg-neutral-900">
                      Altro
                    </option>
                  </select>
                </label>

                <label htmlFor="message" className="block">
                  <span className="block text-xs text-white/80">
                    Messaggio*
                  </span>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Come possiamo aiutarti?"
                    className="mt-1 w-full resize-y rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 shadow-sm outline-none focus:ring-2 focus:ring-cyan-300/60"
                  />
                </label>

                <div className="flex items-start gap-3">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-cyan-300 focus:ring-cyan-300"
                  />
                  <label
                    htmlFor="privacy"
                    className="text-xs leading-relaxed text-neutral-300"
                  >
                    Dichiaro di aver letto l’informativa privacy e acconsento al
                    trattamento dei dati ai fini di ricontatto.
                  </label>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
                >
                  Prenota ora
                </button>

                <p className="text-xs text-neutral-400">
                  (Da collegare a un provider form o API route)
                </p>
              </form>

              {/* Punti rapidi */}
              <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-neutral-300 sm:grid-cols-2">
                <Bullet>
                  Prima visita accurata e piano di cura trasparente
                </Bullet>
                <Bullet>Richiami periodici di prevenzione</Bullet>
                <Bullet>Tecnologie aggiornate per diagnosi precise</Bullet>
                <Bullet>Ambienti confortevoli e team empatico</Bullet>
              </ul>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section aria-label="Perché scegliere noi" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">
              Perché scegliere noi?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-300">
              Uniamo esperienza clinica, prevenzione e tecnologie d’avanguardia
              per offrirti cure efficaci e confortevoli.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard title="Esperienza e Tecnologia">
                Garantiamo il servizio che vorremmo ricevere noi per primi, con
                tecniche aggiornate e strumentazione moderna.
              </FeatureCard>
              <FeatureCard title="Prevenzione al centro">
                I denti naturali non ricrescono: visite periodiche e igiene
                orale sono essenziali per mantenerli sani.
              </FeatureCard>
              <FeatureCard title="Trasparenza e Comfort">
                Piani di cura chiari, tempi certi e ambienti accoglienti per
                un’esperienza senza stress.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* SERVIZI – quick overview */}
        <section aria-label="Panoramica servizi" className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ServiceTile
                icon={<Brush className="h-5 w-5" />}
                title="Igiene & Prevenzione"
                bullets={[
                  "Sedute periodiche personalizzate",
                  "Istruzioni di igiene domiciliare",
                  "Trattamento gengivale mirato",
                ]}
              />
              <ServiceTile
                icon={<Stethoscope className="h-5 w-5" />}
                title="Conservativa & Endodonzia"
                bullets={[
                  "Otturazioni estetiche",
                  "Cura canalare con ingrandimenti",
                  "Ricostruzioni minimamente invasive",
                ]}
              />
              <ServiceTile
                icon={<Syringe className="h-5 w-5" />}
                title="Chirurgia & Implantologia"
                bullets={[
                  "Impianti e rigenerazione ossea",
                  "Estrazioni complesse e microchirurgia",
                  "Pianificazione 3D guidata",
                ]}
              />
              <ServiceTile
                icon={<Wand2 className="h-5 w-5" />}
                title="Estetica dentale"
                bullets={[
                  "Faccette e sbiancamento professionale",
                  "Restauri invisibili",
                  "Valutazione del sorriso digitale",
                ]}
              />
              <ServiceTile
                icon={<Scan className="h-5 w-5" />}
                title="Diagnostica digitale"
                bullets={[
                  "Scanner intraorale",
                  "RX digitale a bassa dose",
                  "Fotografia clinica",
                ]}
              />
              <ServiceTile
                icon={<Wrench className="h-5 w-5" />}
                title="Protesi & Riabilitazioni"
                bullets={[
                  "Protesi fissa e mobile",
                  "CAD/CAM e materiali avanzati",
                  "Follow-up e manutenzione",
                ]}
              />
            </div>
          </div>
        </section>

        {/* BLOCCO INTERATTIVO */}
        <section aria-label="Servizi in dettaglio" className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ServicesInteractiveSection />
          </div>
        </section>

        {/* PERCORSO DI CURA */}
        <section aria-label="Percorso di cura" className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">
              Il tuo percorso, passo dopo passo
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StepCard
                step="01"
                title="Prima visita"
                text="Raccolta dati, anamnesi e diagnostica digitale per un quadro completo."
                icon={<Scan className="h-5 w-5" />}
              />
              <StepCard
                step="02"
                title="Piano di cura"
                text="Spieghiamo le opzioni, i tempi e i costi con trasparenza assoluta."
                icon={<ShieldCheck className="h-5 w-5" />}
              />
              <StepCard
                step="03"
                title="Trattamento"
                text="Cure efficaci e confortevoli, con richiami periodici di prevenzione."
                icon={<Smile className="h-5 w-5" />}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-label="Domande frequenti" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FaqSection />
          </div>
        </section>

        {/* CTA FINALE */}
        <section className="mx-auto mb-20 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur sm:grid-cols-[auto,1fr] sm:p-8">
            <div className="rounded-xl bg-cyan-300/20 p-3 ring-1 ring-cyan-300/40">
              <Smile className="h-8 w-8 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                Pronti a ricominciare col sorriso?
              </h3>
              <p className="mt-1 text-sm text-neutral-300">
                Prenota la tua prima visita e ricevi un piano di cura chiaro e
                personalizzato.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#prenota"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
                >
                  Prenota ora
                </a>
                <a
                  href="/contatti"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-white/10"
                >
                  Parla con noi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Chatbot floating */}
        <div className="fixed bottom-6 right-6 z-40">
          <LiveChat />
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ——— Subcomponents ——— */

function ServiceTile({
  icon,
  title,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/15">
          {icon}
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-1.5">
        {bullets.map((b, i) => (
          <Bullet key={i}>{b}</Bullet>
        ))}
      </ul>
    </div>
  );
}

function StepCard({
  step,
  title,
  text,
  icon,
}: {
  step: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/15">
          {icon}
        </div>
        <span className="text-xs text-white/70">Step {step}</span>
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-300">{text}</p>
    </div>
  );
}
