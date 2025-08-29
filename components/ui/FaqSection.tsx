"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Tipi
interface FAQItem {
  title: string;
  text: string;
  imageUrl: string;
}

// Contenuti (puoi anche passarli via props)
const faqContent: FAQItem[] = [
  {
    title: "Alitosi & Pulizia dei Denti",
    text: `Alitosi: La causa più frequente dipende dalla malattia parodontale; all'esordio come gengivite e, soprattutto, in caso di parodontite (piorrea nella fase acuta), che danneggia il legamento che unisce il dente all’osso. Esistono anche cause extra-orali legate all'apparato digerente.\n\nPulizia dei denti: Le sedute di igiene orale andrebbero effettuate ogni 6 mesi per tutti; per chi è stato risanato dalla malattia parodontale, la cadenza è personalizzata.`,
    imageUrl: "/assets/images/faq1.jpg",
  },
  {
    title: "Lo Spazzolino & Le Gengive",
    text: `Lo Spazzolino: scegli un manico dritto, testina compatta, setole artificiali non troppo rigide e arrotondate. Cambialo quando perde integrità.\n\nGengive sanguinanti: indicano spesso una gengivite dovuta a placca non rimossa in modo corretto: serve una revisione dell'igiene orale e un controllo.`,
    imageUrl: "/assets/images/faq2.jpg",
  },
  {
    title: "Devitalizzazione & Dolore",
    text: `Devitalizzazione: la terapia canalare rimuove la polpa dentale dai canali del dente, eliminando terminazioni nervose; spesso segue una ricostruzione/incapsulamento.\n\nDolore durante le cure: con protocolli e anestesie moderne, gli interventi sono rapidi e confortevoli.`,
    imageUrl: "/assets/images/faq3.jpg",
  },
];

// Utilità
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function FAQSection({
  items = faqContent,
}: {
  items?: FAQItem[];
}) {
  return (
    <section
      aria-labelledby="faq-title"
      className="relative mx-auto my-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      {/* Glow di sfondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(56,189,248,0.20), transparent 60%), radial-gradient(40% 40% at 85% 20%, rgba(244,114,182,0.15), transparent 60%)",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      <motion.div {...fadeUp}>
        <h2
          id="faq-title"
          className="text-center text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Facciamo chiarezza
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 dark:text-neutral-300 sm:text-base">
          Le risposte ai dubbi più frequenti, spiegate con semplicità.
        </p>
      </motion.div>

      <div className="mt-10 space-y-10">
        {items.map((item, i) => {
          const even = i % 2 === 0;
          return (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Card con bordo sfumato */}
              <div className="group relative overflow-clip rounded-3xl p-[1px]">
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "conic-gradient(from 180deg at 50% 50%, rgba(34,211,238,0.4), rgba(244,114,182,0.35), rgba(34,211,238,0.4))",
                    filter: "blur(18px)",
                  }}
                />

                <div className="relative grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-white/5 lg:grid-cols-12">
                  {/* Immagine */}
                  <div
                    className={`${even ? "lg:order-2" : "lg:order-1"} relative h-64 w-full lg:col-span-5 lg:h-auto`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, rotate: even ? -0.4 : 0.4 }}
                      transition={{
                        type: "spring",
                        stiffness: 140,
                        damping: 18,
                      }}
                      className="h-full w-full"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 480px, 100vw"
                        className="object-cover"
                        priority={i === 0}
                      />
                    </motion.div>
                    {/* riflesso soft */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(255,255,255,0.0), rgba(255,255,255,0.06) 60%, transparent)",
                      }}
                    />
                  </div>

                  {/* Testo */}
                  <div
                    className={`${even ? "lg:order-1" : "lg:order-2"} relative p-6 sm:p-8 lg:col-span-7`}
                  >
                    <div
                      className="absolute -left-8 -top-8 hidden h-40 w-40 rounded-full blur-3xl lg:block"
                      style={{
                        background: even
                          ? "radial-gradient(closest-side, rgba(34,211,238,0.18), transparent)"
                          : "radial-gradient(closest-side, rgba(244,114,182,0.18), transparent)",
                      }}
                    />

                    <h3 className="text-xl font-semibold sm:text-2xl">
                      {item.title}
                    </h3>
                    <div className="prose prose-sm mt-3 max-w-none text-neutral-800 prose-p:leading-relaxed dark:prose-invert dark:text-neutral-200">
                      {/* Mantiene i \n come interruzioni di riga */}
                      <p className="whitespace-pre-line">{item.text}</p>
                    </div>

                    {/* Micro CTA opzionale */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href="/contatti#prenota"
                        className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                        aria-label="Prenota una visita"
                      >
                        Prenota una visita
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
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
