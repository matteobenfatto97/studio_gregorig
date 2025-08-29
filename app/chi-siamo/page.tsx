"use-client";

// app/(site)/chi-siamo/page.tsx (optimized, no TS errors)
import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import dynamic from "next/dynamic";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

// ✅ Carosello caricato in modo dinamico e solo lato client (niente SSR/hydration pesante)
const TeamMembersList = dynamic(
  () => import("@/components/lists/TeamMembersList"),
  {
    ssr: false,
    // scheletro ultra leggero
    loading: () => <TeamMembersSkeleton />,
  }
);

// ✅ Chatbot caricato solo lato client (evita costi in SSR)
const LiveChat = dynamic(() => import("@/components/Chatbot"), {
  ssr: false,
  loading: () => null,
});

export const metadata: Metadata = {
  title: "Chi Siamo • Studio dentistico Dr. Gregorig",
  description:
    "Conosci la filosofia di cura dello Studio Gregorig: prevenzione, tecnologie d’avanguardia ed esperienza clinica oltre 20 anni. Scopri il nostro team.",
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-4 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
        {label}
      </div>
    </div>
  );
}

export default function ChiSiamoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Studio dentistico Dr. Gregorig",
    url: "https://www.esempio.it/", // TODO: aggiorna con il dominio reale
    email: "gregoriggl@gmail.com",
    telephone: "+39 0435 66198",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Borgata Palú 88",
      postalCode: "32047",
      addressLocality: "Sappada",
      addressCountry: "IT",
    },
    logo: "/assets/icons/aa.png",
  } as const;

  return (
    <>
      <Header />
      <main>
        {/* HERO TITLE */}
        <section className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Chi Siamo
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-700 dark:text-neutral-300 sm:text-base">
              Scopri la nostra filosofia di cura: prevenzione, tecnologia e un
              rapporto di fiducia continuo con ogni paziente.
            </p>
          </div>
        </section>

        {/* BIG IMAGE UNDER TITLE (LCP) */}
        <section aria-label="Immagine dello studio" className="mb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative w-full overflow-hidden rounded-3xl shadow-xl aspect-[16/9] sm:aspect-[16/9] lg:aspect-[21/9]">
              <Image
                src="/assets/team/Gruppo.png"
                alt="Lo Studio Gregorig: ambienti moderni e accoglienti"
                fill
                priority
                sizes="(min-width: 1280px) 1152px, (min-width: 1024px) 896px, (min-width: 640px) 640px, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 20%" }}
              />
            </div>
          </div>
        </section>

        {/* MISSION */}
        <section aria-label="La nostra missione" className="py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                La nostra missione
              </h2>
              <div className="prose mt-4 max-w-none text-neutral-800 prose-p:leading-relaxed dark:prose-invert dark:text-neutral-200">
                <p>
                  Lo Studio Dentistico Gregorig offre trattamenti odontoiatrici
                  di ogni specialità garantendo serietà, professionalità e
                  massima accuratezza. Il paziente è seguito per tutto il
                  percorso terapeutico e successivamente, grazie a un programma
                  di richiami periodici orientato alla prevenzione.
                </p>
                <p>
                  Con oltre 20 anni di attività, ci aggiorniamo costantemente
                  sulle tecniche più moderne e funzionali. Mettiamo ogni persona
                  a proprio agio instaurando un rapporto di fiducia con
                  l’odontoiatra, con reperibilità anche oltre l’orario di
                  apertura.
                </p>
                <p>
                  Lo Studio è dotato di apparecchiature diagnostiche e
                  terapeutiche moderne, per cure efficaci, sicure e
                  confortevoli.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES + STATS */}
        <section aria-label="Valori e indicatori" className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">
              I nostri valori
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <CardValue
                title="Prevenzione"
                text="Richiami periodici e igiene per mantenere i denti naturali nel tempo."
              />
              <CardValue
                title="Tecnologia"
                text="Strumentazione aggiornata per diagnosi e trattamenti accurati."
              />
              <CardValue
                title="Trasparenza"
                text="Piani di cura chiari, tempi definiti, comunicazione semplice."
              />
              <CardValue
                title="Accoglienza"
                text="Ambienti confortevoli e un team empatico e presente."
              />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat value="20+" label="Anni di esperienza" />
              <Stat value="H24" label="Reperibilità extra-orario" />
              <Stat value="Prevenzione" label="Richiami periodici" />
              <Stat value="Avanguardia" label="Tecnologie aggiornate" />
            </div>
          </div>
        </section>

        {/* TEAM (defer + ultra fast) */}
        <section
          aria-label="Il nostro team"
          className="py-16"
          // Evita lavoro di layout/paint finché offscreen, mantiene dimensioni intrinseche per evitare CLS
          style={{
            contentVisibility: "auto",
            containIntrinsicSize: "660px 1000px",
            contain: "layout paint style" as any,
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">
              Il nostro Team
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-700 dark:text-neutral-300">
              Professionisti esperti, formazione continua e un unico obiettivo:
              il tuo sorriso.
            </p>
            <div className="py-16 mt-6">
              {/* Carosello: versione 2D super-performante, finestra ristretta */}
              <TeamMembersList windowSize={5} />
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section aria-label="Contatti" className="pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur sm:grid-cols-[auto,1fr] sm:p-8 dark:border-white/10 dark:bg-white/5">
              <div className="relative h-20 w-28 sm:h-24 sm:w-32">
                <Image
                  src="/assets/icons/contattaci.png"
                  alt="Contattaci"
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-800 dark:text-neutral-200">
                  Siamo qui per rispondere a domande e preoccupazioni.
                  Contattaci per informazioni o prenotazioni.
                </p>
                <div className="mt-4 grid gap-2 text-sm">
                  <a
                    href="mailto:gregoriggl@gmail.com"
                    className="underline underline-offset-4"
                  >
                    gregoriggl@gmail.com
                  </a>
                  <a
                    href="tel:+39043566198"
                    className="underline underline-offset-4"
                  >
                    +39 0435 66198
                  </a>
                  <a
                    href="https://maps.google.com/?q=Borgata+Pal%C3%BA+88,+32047+Sappada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    Borgata Palú 88, 32047 Sappada (↗ Apri Maps)
                  </a>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/contatti#prenota"
                    className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    Prenota ora
                  </a>
                  <a
                    href="/servizi"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm text-neutral-900 shadow-sm transition hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Scopri i servizi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chatbot floating: caricato lato client, non blocca la pagina */}
        <div
          className="fixed bottom-6 right-6 z-40"
          style={{
            contentVisibility: "auto",
            contain: "layout paint style" as any,
          }}
        >
          <LiveChat />
        </div>
      </main>
      <Footer />
      {/* JSON-LD structured data */}
      <Script
        id="org-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}

function CardValue({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
        {text}
      </p>
    </div>
  );
}

function TeamMembersSkeleton() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="relative mx-auto flex h-[560px] sm:h-[620px] md:h-[660px] items-center justify-center overflow-hidden">
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[360px] w-[260px] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-200/60 to-slate-100/30 shadow-sm dark:from-slate-700/30 dark:to-slate-800/30 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
