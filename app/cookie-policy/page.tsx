"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

type CookieEntry = {
  name: string;
  provider: string;
  purpose: string;
  category: "Tecnici" | "Funzionali" | "Analitici" | "Profilazione/Marketing";
  duration: string;
  type: "prima parte" | "terza parte";
  policyUrl?: string;
  defaultState: "attivi" | "disattivi";
};

const LAST_UPDATE = "01/09/2025";
const PRIVACY_ROUTE = "/privacy-policy" as const;

/**
 * TODO: PERSONALIZZA QUESTA LISTA IN BASE AI COOKIE REALI.
 * - Aggiungi/rimuovi righe secondo la scansione del tuo CMP.
 * - 'defaultState' deve essere "disattivi" per cookie non tecnici (attivi solo dopo consenso).
 */
const cookieInventory: CookieEntry[] = [
  // Tecnici (necessari) – installati senza consenso
  {
    name: "cookie_consent",
    provider: "Studio Gregorig (CMP)",
    purpose:
      "Memorizza le preferenze di consenso espresse dall’utente tramite il banner/cmp.",
    category: "Tecnici",
    duration: "12 mesi",
    type: "prima parte",
    defaultState: "attivi",
  },
  {
    name: "__cf_bm",
    provider: "Cloudflare, Inc.",
    purpose:
      "Mitigazione bot e protezione del sito; garantisce disponibilità e sicurezza.",
    category: "Tecnici",
    duration: "30 minuti",
    type: "terza parte",
    policyUrl: "https://www.cloudflare.com/privacypolicy/",
    defaultState: "attivi",
  },

  // Funzionali – attivi solo se acconsentiti
  {
    name: "preferred_language",
    provider: "Studio Gregorig",
    purpose:
      "Ricorda la lingua/locale selezionata per migliorare l’esperienza di navigazione.",
    category: "Funzionali",
    duration: "6 mesi",
    type: "prima parte",
    defaultState: "disattivi",
  },

  // Analitici (esempio GA4) – attivi solo se acconsentiti
  {
    name: "_ga",
    provider: "Google LLC (Google Analytics 4)",
    purpose:
      "Misurazione anonima/aggregata delle visite. Utilizzato per generare statistiche sull’uso del sito.",
    category: "Analitici",
    duration: "2 anni",
    type: "prima parte",
    policyUrl: "https://policies.google.com/technologies/cookies",
    defaultState: "disattivi",
  },
  {
    name: "_ga_*",
    provider: "Google LLC (GA4)",
    purpose:
      "Mantiene lo stato della sessione per le analitiche anonime/aggregate.",
    category: "Analitici",
    duration: "2 anni",
    type: "prima parte",
    policyUrl: "https://policies.google.com/technologies/cookies",
    defaultState: "disattivi",
  },

  // Marketing (esempio, se usi campagne) – attivi solo se acconsentiti
  {
    name: "IDE",
    provider: "Google Ireland/Google LLC (DoubleClick)",
    purpose:
      "Eroga annunci pertinenti e limita la ripetizione degli spot; misurazione campagne.",
    category: "Profilazione/Marketing",
    duration: "13 mesi",
    type: "terza parte",
    policyUrl: "https://policies.google.com/technologies/ads",
    defaultState: "disattivi",
  },
];

const sections = [
  { id: "intro", label: "1. Cos’è questa informativa" },
  { id: "definizioni", label: "2. Cosa sono i cookie e strumenti simili" },
  { id: "basi", label: "3. Base giuridica e ambito di applicazione" },
  { id: "tipi", label: "4. Tipologie di cookie utilizzati" },
  { id: "tabella", label: "5. Elenco dei cookie (inventario)" },
  { id: "consenso", label: "6. Gestione, modifica e revoca del consenso" },
  { id: "browser", label: "7. Gestione tramite browser" },
  { id: "terze", label: "8. Cookie di terze parti e trasferimenti extra-SEE" },
  { id: "diritti", label: "9. Diritti degli interessati" },
  { id: "titolare", label: "10. Titolare e contatti" },
  { id: "modifiche", label: "11. Aggiornamenti della policy" },
];

function openConsentPreferences() {
  // Riapre il pannello consensi del CMP se presente (auto-detect dei provider più comuni)
  try {
    // Iubenda
    // @ts-ignore
    if (
      typeof window !== "undefined" &&
      (window as any)?._iub?.cs?.api?.openPreferences
    ) {
      // @ts-ignore
      (window as any)._iub.cs.api.openPreferences();
      return;
    }
    // OneTrust
    // @ts-ignore
    if ((window as any)?.OneTrust?.ToggleInfoDisplay) {
      // @ts-ignore
      (window as any).OneTrust.ToggleInfoDisplay();
      return;
    }
    // Cookiebot
    // @ts-ignore
    if ((window as any)?.Cookiebot?.renew) {
      // @ts-ignore
      (window as any).Cookiebot.renew();
      return;
    }
    // TCF v2 (es. Quantcast Choice)
    // @ts-ignore
    if ((window as any)?.__tcfapi) {
      // @ts-ignore
      (window as any).__tcfapi("displayConsentUi", 2, () => {});
      return;
    }
    // Didomi
    // @ts-ignore
    if ((window as any)?.Didomi?.preferences?.show) {
      // @ts-ignore
      (window as any).Didomi.preferences.show();
      return;
    }
    // Generic __cmp
    // @ts-ignore
    if ((window as any)?.__cmp) {
      // @ts-ignore
      (window as any).__cmp("showConsentModal", null, () => {});
      return;
    }

    alert(
      "Non ho trovato un pannello consensi integrato. Puoi gestire i cookie dal banner al prossimo accesso o dalle impostazioni del browser."
    );
  } catch {
    alert(
      "Impossibile aprire il pannello consensi in questa pagina. Riprova o usa le impostazioni del browser."
    );
  }
}

function groupBy<T, K extends string | number>(
  arr: T[],
  by: (item: T) => K
): Record<K, T[]> {
  return arr.reduce(
    (acc, item) => {
      const key = by(item);
      (acc[key] ||= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
}

export default function CookiePolicyPage() {
  const grouped = groupBy(cookieInventory, (c) => c.category);

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* TOC */}
          <aside className="hidden lg:block sticky top-24 self-start">
            <nav
              aria-label="Indice Cookie Policy"
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-lg"
            >
              <h2 className="text-sm font-semibold tracking-wider text-teal-400 mb-3">
                INDICE
              </h2>
              <ol className="space-y-2 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="hover:text-teal-300 transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Content */}
          <article className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-10 shadow-2xl">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-teal-300">
                Cookie Policy
              </h1>
              <p className="mt-2 text-slate-300">
                Questa informativa spiega l’uso di cookie e strumenti simili sul
                sito di <strong>Studio Gregorig</strong> e come gestire le tue
                preferenze.
              </p>
            </header>

            <div className="prose prose-invert prose-teal max-w-none">
              <section id="intro">
                <h2>1. Cos’è questa informativa</h2>
                <p>
                  La presente cookie policy è redatta ai sensi della Direttiva
                  ePrivacy (2002/58/CE come modificata dalla 2009/136/CE) e
                  delle <em>Linee guida del Garante</em> del 10 giugno 2021 in
                  materia di cookie e altri strumenti di tracciamento, nonché
                  del GDPR per gli aspetti relativi alla validità del consenso.
                </p>
              </section>

              <section id="definizioni">
                <h2>2. Cosa sono i cookie e strumenti simili</h2>
                <p>
                  I cookie sono piccoli file di testo che il sito invia al tuo
                  dispositivo, dove vengono memorizzati per essere poi
                  ritrasmessi al successivo accesso. Con il termine “strumenti
                  simili” rientrano tecnologie come pixel, SDK, local storage e
                  fingerprinting.
                </p>
              </section>

              <section id="basi">
                <h2>3. Base giuridica e ambito di applicazione</h2>
                <ul>
                  <li>
                    <strong>Cookie tecnici (necessari):</strong> non richiedono
                    consenso e sono trattati per <em>legittimo interesse</em>{" "}
                    e/o <em>esecuzione del servizio richiesto</em>.
                  </li>
                  <li>
                    <strong>
                      Cookie non tecnici (funzionali, analitici non
                      anonimizzati, profilazione/marketing):
                    </strong>{" "}
                    installati solo previo <em>consenso</em> libero, specifico,
                    informato e documentabile.
                  </li>
                </ul>
                <p className="text-slate-300 text-sm">
                  Lo <em>scrolling</em>, l’<em>inazione</em> o la chiusura del
                  banner senza scelta non costituiscono consenso valido; i{" "}
                  <em>cookie wall</em> sono ammessi solo se è offerta
                  un’alternativa equivalente e senza tracciamento.
                </p>
              </section>

              <section id="tipi">
                <h2>4. Tipologie di cookie utilizzati</h2>
                <ul>
                  <li>
                    <strong>Tecnici:</strong> garantiscono il funzionamento del
                    sito (es. sicurezza, gestione consensi, bilanciamento
                    carico).
                  </li>
                  <li>
                    <strong>Funzionali:</strong> migliorano l’esperienza
                    salvando preferenze (es. lingua).
                  </li>
                  <li>
                    <strong>Analitici:</strong> misurazione performance/uso del
                    sito. Se non pienamente anonimizzati, richiedono consenso.
                  </li>
                  <li>
                    <strong>Profilazione/Marketing:</strong> personalizzazione
                    contenuti, annunci e misurazione campagne.
                  </li>
                </ul>
              </section>

              <section id="tabella">
                <h2>5. Elenco dei cookie (inventario)</h2>
                <p>
                  L’elenco seguente indica i cookie rilevati/previsti sul sito.
                  La presenza può variare nel tempo per aggiornamenti tecnici o
                  modifiche ai fornitori.
                </p>

                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="not-prose mt-6">
                    <h3 className="text-lg font-semibold text-teal-300 mb-2">
                      {category}
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-sm">
                        <thead className="bg-white/5">
                          <tr className="text-left">
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">Fornitore</th>
                            <th className="px-4 py-3">Finalità</th>
                            <th className="px-4 py-3">Durata</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Stato predef.</th>
                            <th className="px-4 py-3">Policy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((c, i) => (
                            <tr
                              key={`${c.name}-${i}`}
                              className="odd:bg-white/0 even:bg-white/[0.03] align-top"
                            >
                              <td className="px-4 py-3 font-mono">{c.name}</td>
                              <td className="px-4 py-3">{c.provider}</td>
                              <td className="px-4 py-3">{c.purpose}</td>
                              <td className="px-4 py-3">{c.duration}</td>
                              <td className="px-4 py-3">{c.type}</td>
                              <td className="px-4 py-3">{c.defaultState}</td>
                              <td className="px-4 py-3">
                                {c.policyUrl ? (
                                  <a
                                    href={c.policyUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline"
                                  >
                                    Info
                                  </a>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </section>

              <section id="consenso">
                <h2>6. Gestione, modifica e revoca del consenso</h2>
                <p>
                  Puoi in qualsiasi momento modificare o revocare le tue scelte
                  sui cookie non tecnici attraverso il pannello preferenze.
                </p>
                <button
                  type="button"
                  onClick={openConsentPreferences}
                  className="mt-2 rounded-full border border-teal-400/40 px-4 py-2 hover:bg-teal-400/10 transition"
                >
                  Gestisci preferenze cookie
                </button>
                <p className="mt-3 text-sm text-slate-300">
                  In assenza di consenso, i cookie non tecnici restano
                  disattivati. La revoca non pregiudica la liceità del
                  trattamento basata sul consenso prima della revoca.
                </p>
              </section>

              <section id="browser">
                <h2>7. Gestione tramite browser</h2>
                <p>
                  Puoi anche cancellare o bloccare i cookie attraverso le
                  impostazioni del browser (dispositivo per dispositivo). La
                  disabilitazione dei cookie tecnici può compromettere alcune
                  funzionalità del sito.
                </p>
              </section>

              <section id="terze">
                <h2>8. Cookie di terze parti e trasferimenti extra-SEE</h2>
                <p>
                  I cookie di terze parti sono gestiti dai rispettivi fornitori;
                  per maggiori informazioni consulta le loro privacy/cookie
                  policy tramite i link nell’inventario. Qualora vi fossero
                  trasferimenti di dati fuori dallo Spazio Economico Europeo,
                  questi avvengono nel rispetto del Capo V GDPR (Decisioni di
                  adeguatezza, SCC o garanzie adeguate).
                </p>
              </section>

              <section id="diritti">
                <h2>9. Diritti degli interessati</h2>
                <p>
                  Puoi esercitare i diritti previsti dagli artt. 15-22 GDPR
                  (accesso, rettifica, cancellazione, limitazione, portabilità,
                  opposizione) e revocare i consensi in qualsiasi momento,
                  scrivendo ai contatti del Titolare indicati qui sotto. Hai
                  inoltre diritto di proporre reclamo al Garante per la
                  protezione dei dati personali.
                </p>
              </section>

              <section id="titolare">
                <h2>10. Titolare e contatti</h2>
                <ul>
                  <li>
                    <strong>Titolare:</strong> Studio Gregorig
                  </li>
                  <li>
                    <strong>Sede:</strong> Borgata Palú 88, 32047 Sappada (UD)
                  </li>
                  <li>
                    <strong>Telefono:</strong> +39 0435 66198
                  </li>
                  <li>
                    <strong>E-mail (privacy):</strong>{" "}
                    <a href="mailto:gregoriggl@gmail.com">
                      gregoriggl@gmail.com
                    </a>
                  </li>
                  <li>
                    <strong>Privacy Policy:</strong>{" "}
                    <Link
                      href={{ pathname: PRIVACY_ROUTE }}
                      className="underline"
                    >
                      leggi qui
                    </Link>
                  </li>
                </ul>
              </section>

              <section id="modifiche">
                <h2>11. Aggiornamenti della policy</h2>
                <p>
                  Potremmo aggiornare questa informativa per adeguamenti
                  normativi o evoluzioni tecniche. Le modifiche saranno
                  pubblicate su questa pagina. Ultimo aggiornamento:{" "}
                  <strong>{LAST_UPDATE}</strong>.
                </p>
              </section>
            </div>

            <footer className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-sm text-slate-300">
              <span>
                <strong>Ultimo aggiornamento:</strong> {LAST_UPDATE}
              </span>
              <a
                href="#intro"
                className="rounded-full border border-teal-400/30 px-3 py-1.5 hover:bg-teal-400/10 transition"
              >
                Torna su ↑
              </a>
            </footer>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
}
