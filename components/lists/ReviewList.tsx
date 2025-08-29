"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ReviewCard,
  ReviewsProvider,
  useReviews,
  type Review,
} from "@/components/reviews/ReviewsSuite";

// ✅ Fallback: se l'API è vuota, partiamo da questi (metti le immagini in /public)
const FALLBACK: Review[] = [
  {
    id: "static-1",
    authorName: "Giacomo Massarotto",
    profilePhotoUrl: "/assets/images/giacomo.png",
    rating: 5,
    text: "Se potessi mettere 6 stelline le metterei! Un vero Dottore con la D maiuscola: pronto nel momento del bisogno e di buon cuore. Lo ringrazio molto per la sua professionalità e per l’aiuto medico ricevuto",
    relativeTimeDescription: "2 settimane fa",
  },
  {
    id: "static-2",
    authorName: "Enzo Giuliattini",
    profilePhotoUrl: "/assets/images/enzo.png",
    rating: 5,
    text: "Con un ambiente pulito e accogliente, staff amichevole e un dottore competente e gentile che spiega chiaramente tutte le procedure, mi sono sentito subito a mio agio. Le cure dentali sono state le più indolori che abbia mai provato, rendendo l'esperienza complessivamente eccellente. Lo consiglio a tutti senza esitazioni.",
    relativeTimeDescription: "1 anno fa",
  },
  {
    id: "static-3",
    authorName: "Sofia B.",
    profilePhotoUrl: null,
    rating: 4.5,
    text: "Studio tecnologico e super reattivo. Mi sono sentita ascoltata e coccolata in ogni fase della visita.",
    relativeTimeDescription: "3 mesi fa",
  },
  {
    id: "static-4",
    authorName: "Chiara Rinaldi",
    profilePhotoUrl: "/assets/images/chiara.png",
    rating: 5,
    text: "Sbiancamento e igiene impeccabili. Personale dolcissimo e spiegazioni chiare. Il risultato si vede!",
    relativeTimeDescription: "1 mese fa",
  },
  {
    id: "static-5",
    authorName: "Luca Pavan",
    profilePhotoUrl: null,
    rating: 4.5,
    text: "Impianto dentale eseguito in maniera perfetta. Zero dolore e follow-up puntuale. Consigliatissimo.",
    relativeTimeDescription: "6 mesi fa",
  },
  {
    id: "static-6",
    authorName: "Martina De Luca",
    profilePhotoUrl: "/assets/images/martina.png",
    rating: 5,
    text: "Avevo paura del dentista, ma qui mi sono rilassata subito. Studio bellissimo e attenzione ai dettagli.",
    relativeTimeDescription: "1 settimana fa",
  },
  {
    id: "static-7",
    authorName: "Alessandro Conti",
    profilePhotoUrl: null,
    rating: 4.5,
    text: "Trasparenti sui costi, piani di cura personalizzati e spiegati bene. Professionalità rara.",
    relativeTimeDescription: "2 anni fa",
  },
  {
    id: "static-8",
    authorName: "Francesca Serra",
    profilePhotoUrl: "/assets/images/francesca.png",
    rating: 5,
    text: "Appuntamento urgente gestito in tempi record. Cura indolore e risultato top. Grazie di cuore!",
    relativeTimeDescription: "2 giorni fa",
  },
  {
    id: "static-9",
    authorName: "Davide Rossetti",
    profilePhotoUrl: null,
    rating: 5,
    text: "Ottimo con i bambini: mio figlio finalmente va dal dentista sereno. Ambiente accogliente e giocoso.",
    relativeTimeDescription: "4 mesi fa",
  },
  {
    id: "static-10",
    authorName: "Elena Moro",
    profilePhotoUrl: "/assets/images/elena.png",
    rating: 4.5,
    text: "Percorso con apparecchio invisibile: progressi visibili già dopo poche settimane. Super soddisfatta.",
    relativeTimeDescription: "8 mesi fa",
  },
  {
    id: "static-11",
    authorName: "Barbara V.",
    profilePhotoUrl: null,
    rating: 5,
    text: "Igiene e profilassi fatte con cura maniacale. Consigli utili e personalizzati per la routine a casa.",
    relativeTimeDescription: "3 settimane fa",
  },
];

export default function ReviewList() {
  return (
    <section className="relative overflow-hidden py-16">
      {/* Background deluxe */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -inset-24 bg-[radial-gradient(1200px_600px_at_50%_-10%,theme(colors.sky.200/.30),transparent)] dark:bg-[radial-gradient(1200px_600px_at_50%_-10%,theme(colors.sky.900/.25),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,theme(colors.white/.6))] dark:bg-[linear-gradient(180deg,transparent,theme(colors.zinc.950/.6))]" />
        {/* subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.zinc.200/.35)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.200/.35)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,theme(colors.zinc.800/.5)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.800/.5)_1px,transparent_1px)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Image
            src="/assets/icons/dicono.png"
            alt="Dicono di noi"
            width={200}
            height={150}
            className="h-auto w-40 sm:w-52"
            priority
          />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Cosa dicono i nostri pazienti
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Esperienze reali, risultati concreti. Qualità clinica, tecnologia e
            cura della relazione.
          </p>
        </div>

        {/* Contenuto dinamico con fallback */}
        <ReviewsProvider initialData={FALLBACK}>
          <MarqueeShowcase />
        </ReviewsProvider>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/lascia-recensione"
            className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[.99]"
          >
            Lascia una recensione
          </Link>
          <Link
            href="/recensioni"
            className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Tutte le recensioni
          </Link>
        </div>
      </div>
    </section>
  );
}

function MarqueeShowcase() {
  const { reviews, isLoading } = useReviews();
  if (isLoading) return <SkeletonRows />;

  // Se non ci sono dati dall'API, usiamo il fallback già iniettato dal Provider
  const data = reviews.length ? reviews : FALLBACK;

  // Due righe in contro-movimento
  const rowA = data.filter((_, i) => i % 2 === 0);
  const rowB = data.filter((_, i) => i % 2 === 1);
  // Duplico per loop continuo
  const loopA = [...rowA, ...rowA];
  const loopB = [...rowB, ...rowB];

  return (
    <div className="relative">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-zinc-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-zinc-950" />

      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8rem,black_calc(100%-8rem),transparent)]">
        {/* Row 1 */}
        <div
          className="flex min-w-full gap-4 pb-4"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {loopA.map((r, i) => (
            <div key={`${r.id}-A-${i}`} className="w-[360px] shrink-0">
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
        {/* Row 2 (reverse) */}
        <div
          className="flex min-w-full gap-4 pt-2"
          style={{ animation: "marquee-rev 32s linear infinite" }}
        >
          {loopB.map((r, i) => (
            <div key={`${r.id}-B-${i}`} className="w-[360px] shrink-0">
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-rev {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, ri) => (
        <div key={ri} className="flex min-w-full gap-4">
          {Array.from({ length: 4 }).map((__, i) => (
            <div
              key={i}
              className="h-40 w-[360px] shrink-0 animate-pulse rounded-2xl border border-zinc-200/60 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/50"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
