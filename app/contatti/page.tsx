// app/contatti/page.tsx
import React from "react";
import Image from "next/image";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import LiveChat from "@/components/Chatbot";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const PHONE_DISPLAY = "+39 0435 66198";
const PHONE_TEL = "+39043566198";
const EMAIL = "gregoriggl@gmail.com";
const ADDRESS_TEXT = "Borgata Palú 88, 32047 Sappada";
const MAPS_URL =
  "https://maps.google.com/?q=Borgata+Pal%C3%BA+88,+32047+Sappada";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 shadow-sm outline-none focus:ring-2 focus:ring-cyan-300/60 focus:border-white/20";

export default function ContattiPage() {
  return (
    <div className="relative">
      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 shadow-sm backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-300" />
            Risposta rapida e presa in carico
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Contattaci
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-300 sm:text-base">
            Siamo qui per chiarire dubbi, fissare un appuntamento e seguirti nel
            percorso di cura. Scegli il canale che preferisci.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
            >
              <Phone className="h-4 w-4" />
              Chiama ora
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
              Scrivici via email
            </a>
          </div>
        </div>
      </section>

      {/* ICON STRIP */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            title="Telefono"
            content={<a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>}
          />
          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            title="Email"
            content={<a href={`mailto:${EMAIL}`}>{EMAIL}</a>}
          />
          <ContactCard
            icon={<MapPin className="h-5 w-5" />}
            title="Indirizzo"
            content={
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                {ADDRESS_TEXT} (↗ Apri Maps)
              </a>
            }
          />
          <ContactCard
            icon={<Clock className="h-5 w-5" />}
            title="Orari"
            content={
              <div className="space-y-1 text-sm">
                <p>Lun–Ven: 9:00–12:30, 14:30–18:30</p>
                <p>Sab/Dom: chiuso</p>
                <p className="text-xs text-neutral-400">
                  Reperibilità extra-orario per urgenze
                </p>
              </div>
            }
          />
        </div>
      </section>

      {/* FORM + INFO */}
      <section
        id="prenota"
        aria-label="Prenota o invia un messaggio"
        className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* FORM */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-cyan-300/20 p-2 ring-1 ring-cyan-300/30">
                <Send className="h-5 w-5 text-cyan-300" />
              </div>
              <h2 className="text-xl font-semibold sm:text-2xl">
                Invia un messaggio
              </h2>
            </div>

            <p className="mt-2 text-sm text-neutral-300">
              Ti rispondiamo entro breve. I campi contrassegnati sono
              obbligatori.
            </p>

            <form
              className="mt-6 space-y-4"
              action="#"
              method="post"
              noValidate
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nome*" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={inputClass}
                    placeholder="Mario Rossi"
                  />
                </Field>

                <Field label="Telefono" htmlFor="phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    className={inputClass}
                    placeholder="+39 ..."
                  />
                </Field>
              </div>

              <Field label="Email*" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                  placeholder="nome@esempio.it"
                />
              </Field>

              <Field label="Messaggio*" htmlFor="message">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className={`${inputClass} resize-y`}
                  placeholder="Come possiamo aiutarti?"
                />
              </Field>

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
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
              >
                <Send className="h-4 w-4" />
                Invia richiesta
              </button>

              <p className="mt-3 text-xs text-neutral-400">
                (Da collegare a un endpoint o provider form: es. API route
                Next.js, Formspree, Airtable, ecc.)
              </p>
            </form>
          </div>

          {/* INFO + MAP */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur sm:p-8">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-20">
                  <Image
                    src="/assets/icons/contattaci.png"
                    alt="Contattaci"
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold sm:text-2xl">
                    I nostri recapiti
                  </h2>
                  <p className="mt-1 text-sm text-neutral-300">
                    Siamo a disposizione per informazioni e prenotazioni.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm">
                <p>
                  <strong className="text-white/90">Email:</strong>{" "}
                  <a
                    className="underline underline-offset-4"
                    href={`mailto:${EMAIL}`}
                  >
                    {EMAIL}
                  </a>
                </p>
                <p>
                  <strong className="text-white/90">Telefono:</strong>{" "}
                  <a
                    className="underline underline-offset-4"
                    href={`tel:${PHONE_TEL}`}
                  >
                    {PHONE_DISPLAY}
                  </a>
                </p>
                <p>
                  <strong className="text-white/90">Indirizzo:</strong>{" "}
                  <a
                    className="underline underline-offset-4"
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ADDRESS_TEXT} (↗ Apri Maps)
                  </a>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-sm backdrop-blur">
              <div className="relative h-[380px] w-full overflow-hidden rounded-xl">
                <iframe
                  title="Mappa Studio Dr. Gregorig"
                  aria-label="Mappa interattiva della posizione dello studio"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2289.4827816144966!2d12.678998775523182!3d46.56562115928143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4779e8604d84725f%3A0x2c166aaedd4f4732!2sGregorig%20Dr.%20Gianluca!5e1!3m2!1sit!2sit!4v1725141634993!5m2!1sit!2sit"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="mx-auto mt-16 max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur sm:grid-cols-[auto,1fr] sm:p-8">
          <div className="relative h-16 w-24 sm:h-20 sm:w-28">
            <Image
              src="/assets/icons/posizione.png"
              alt="Posizione"
              fill
              sizes="112px"
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-sm text-neutral-200">
              Preferisci parlare subito con noi? Ti guidiamo nella scelta del
              trattamento e fissiamo una prima visita.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
              >
                <Phone className="mr-2 h-4 w-4" />
                Chiama ora
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-white/10"
              >
                <Mail className="mr-2 h-4 w-4" />
                Scrivici
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot floating */}
      <div className="fixed bottom-6 right-6 z-40">
        <LiveChat />
      </div>

      <Footer />
    </div>
  );
}

/* ——— Helpers ——— */

function ContactCard({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/15">
          <span className="text-white">{icon}</span>
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="mt-3 text-sm text-neutral-300">{content}</div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-xs font-medium text-white/80">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
