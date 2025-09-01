import React from "react";
import Link from "next/link";
import type { Metadata, Route } from "next";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

export const metadata: Metadata = {
  title: "Informativa Privacy | Studio Gregorig",
  description:
    "Informativa sul trattamento dei dati personali ai sensi del GDPR e del Codice Privacy. Trasparenza, finalità, basi giuridiche, diritti e contatti.",
};

const sections = [
  { id: "intro", label: "1. Introduzione e definizioni" },
  { id: "titolare", label: "2. Titolare e contatti" },
  { id: "tipi-dati", label: "3. Dati trattati" },
  { id: "finalita-basi", label: "4. Finalità e basi giuridiche" },
  { id: "origine-dati", label: "5. Origine dei dati" },
  { id: "conservazione", label: "6. Tempi di conservazione" },
  { id: "destinatari", label: "7. Destinatari e responsabili" },
  { id: "trasferimenti", label: "8. Trasferimenti extra-UE" },
  { id: "cookie", label: "9. Cookie e tecnologie simili" },
  { id: "sicurezza", label: "10. Misure di sicurezza" },
  { id: "minori", label: "11. Trattamento dati di minori" },
  { id: "diritti", label: "12. Diritti degli interessati" },
  { id: "reclami", label: "13. Reclami all’Autorità di controllo" },
  { id: "modifiche", label: "14. Aggiornamenti dell’informativa" },
];

const COOKIE_ROUTE: Route = "/cookie-policy";
const LAST_UPDATE = "01/09/2025";

export default function PrivacyPolicyPage() {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* TOC */}
          <nav
            aria-label="Indice dell’informativa"
            className="hidden lg:block sticky top-24 self-start"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-lg">
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
            </div>
          </nav>

          {/* Content */}
          <article className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-10 shadow-2xl">
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-teal-300">
                INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI
              </h1>
              <p className="mt-2 text-sm text-slate-300 italic">
                (Artt. 12, 13 e 14 Reg. UE 2016/679 – GDPR; D.lgs 196/2003 come
                modificato dal D.lgs 101/2018)
              </p>
            </header>

            <div className="prose prose-invert prose-teal max-w-none">
              <section id="intro">
                <h2>1. Introduzione e definizioni</h2>
                <p>
                  La presente informativa descrive come{" "}
                  <strong>Studio Gregorig</strong> (il “
                  <strong>Titolare</strong>
                  ”) tratta i dati personali raccolti tramite il sito web e i
                  servizi connessi (es. moduli di contatto e prenotazione).
                </p>
              </section>

              <section id="titolare">
                <h2>2. Titolare del trattamento e contatti</h2>
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
                    <strong>Sito:</strong>{" "}
                    <a
                      href="https://www.studiogregorig.it"
                      target="_blank"
                      rel="noreferrer"
                    >
                      www.studiogregorig.it
                    </a>
                  </li>
                </ul>
                <p className="mt-3 text-sm text-slate-300">
                  <em>
                    DPO non nominato (obbligatorio solo nei casi di cui all’art.
                    37 GDPR).
                  </em>
                </p>
              </section>

              <section id="tipi-dati">
                <h2>3. Dati trattati</h2>
                <ul>
                  <li>
                    <strong>Dati di navigazione e log</strong>: IP, timestamp,
                    user-agent, eventi di sicurezza.
                  </li>
                  <li>
                    <strong>Dati conferiti tramite form</strong>: nome, cognome,
                    email, telefono, messaggi; dati necessari alla prenotazione.
                  </li>
                  <li>
                    <strong>Dati sanitari</strong> (se inseriti volontariamente
                    in campi liberi o in fase di prenotazione): rientrano nelle
                    categorie particolari ex art. 9 GDPR.
                  </li>
                  <li>
                    <strong>Dati tecnici su cookie/consensi</strong>: preferenze
                    espresse nel banner e identificativi tecnici.
                  </li>
                </ul>
              </section>

              <section id="finalita-basi">
                <h2>4. Finalità e basi giuridiche</h2>
                <div className="overflow-x-auto not-prose">
                  <table className="w-full text-sm border-separate border-spacing-y-1">
                    <thead>
                      <tr className="text-left text-slate-300">
                        <th className="py-2">Finalità</th>
                        <th className="py-2">Base giuridica</th>
                        <th className="py-2">Dati</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white/5">
                        <td className="p-3">
                          Navigazione, sicurezza del sito, prevenzione abusi
                        </td>
                        <td className="p-3">
                          <em>Legittimo interesse</em> (art. 6.1.f GDPR)
                        </td>
                        <td className="p-3">Log tecnici, IP, user-agent</td>
                      </tr>
                      <tr className="bg-white/5">
                        <td className="p-3">
                          Gestione richieste/info e prenotazioni
                        </td>
                        <td className="p-3">
                          Misure precontrattuali/contratto (art. 6.1.b)
                        </td>
                        <td className="p-3">
                          Identificativi, contatti, contenuto richieste
                        </td>
                      </tr>
                      <tr className="bg-white/5">
                        <td className="p-3">
                          Promemoria appuntamenti via SMS/e-mail
                        </td>
                        <td className="p-3">
                          <em>Legittimo interesse</em> o <em>consenso</em> (art.
                          6.1.f / 6.1.a)
                        </td>
                        <td className="p-3">
                          Nome, contatti, dettagli appuntamento
                        </td>
                      </tr>
                      <tr className="bg-white/5">
                        <td className="p-3">
                          Adempimenti legali, fiscali, sanitari
                        </td>
                        <td className="p-3">
                          Obbligo di legge (art. 6.1.c); per dati sanitari, art.
                          9.2.h
                        </td>
                        <td className="p-3">
                          Dati identificativi/amministrativi
                        </td>
                      </tr>
                      <tr className="bg-white/5">
                        <td className="p-3">Marketing diretto (newsletter)</td>
                        <td className="p-3">Consenso (art. 6.1.a)</td>
                        <td className="p-3">Contatti</td>
                      </tr>
                      <tr className="bg-white/5">
                        <td className="p-3">
                          Analitiche aggregate (previo consenso)
                        </td>
                        <td className="p-3">Consenso (art. 6.1.a)</td>
                        <td className="p-3">Cookie/ID dispositivo, eventi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  La comunicazione di alcuni dati è necessaria per fornire il
                  servizio (es. prenotazione).
                </p>
              </section>

              <section id="origine-dati">
                <h2>5. Origine dei dati</h2>
                <p>
                  I dati provengono dall’interessato, dai sistemi informatici e
                  da cookie/strumenti similari.
                </p>
              </section>

              <section id="conservazione">
                <h2>6. Tempi di conservazione</h2>
                <ul>
                  <li>
                    <strong>Log tecnici:</strong> 12 mesi salvo esigenze di
                    sicurezza.
                  </li>
                  <li>
                    <strong>Richieste via form:</strong> 24 mesi dalla chiusura
                    della pratica.
                  </li>
                  <li>
                    <strong>Prenotazioni/rapporti:</strong> per la durata del
                    rapporto e fino a 10 anni per obblighi civilistici/fiscali.
                  </li>
                  <li>
                    <strong>Marketing:</strong> fino a revoca o 24 mesi di
                    inattività.
                  </li>
                  <li>
                    <strong>Cookie/consensi:</strong> secondo scadenza tecnica e
                    durata della prova del consenso.
                  </li>
                </ul>
              </section>

              <section id="destinatari">
                <h2>7. Destinatari e responsabili</h2>
                <ul>
                  <li>
                    <strong>Hosting/Cloud e manutenzione IT</strong> –{" "}
                    <em>indicare provider effettivo</em>.
                  </li>
                  <li>
                    <strong>Piattaforme di invio comunicazioni</strong> (es.
                    Twilio/SendGrid).
                  </li>
                  <li>
                    <strong>Fornitori gestione prenotazioni</strong> –{" "}
                    <em>se utilizzati</em>.
                  </li>
                  <li>
                    <strong>Consulenti</strong> (legali, contabili).
                  </li>
                </ul>
                <p className="text-sm text-slate-300">
                  Elenco aggiornato dei responsabili su richiesta.
                </p>
              </section>

              <section id="trasferimenti">
                <h2>8. Trasferimenti fuori dallo SEE</h2>
                <p>
                  Eventuali trasferimenti (es. verso gli USA) avvengono nel
                  rispetto del Capo V GDPR, tramite Decisioni di adeguatezza
                  (es. EU-US DPF), SCC o altre garanzie adeguate.
                </p>
              </section>

              <section id="cookie">
                <h2>9. Cookie e tecnologie simili</h2>
                <p>
                  Usiamo cookie tecnici e, previo consenso, cookie/strumenti
                  analitici e di profilazione. Gestisci le preferenze nella{" "}
                  <Link href={COOKIE_ROUTE} className="underline">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </section>

              <section id="sicurezza">
                <h2>10. Misure di sicurezza</h2>
                <p>
                  Applichiamo misure tecniche e organizzative adeguate
                  (cifratura in transito, controllo accessi, minimizzazione,
                  logging e backup).
                </p>
              </section>

              <section id="minori">
                <h2>11. Trattamento dei dati di minori</h2>
                <p>
                  Per i servizi online, in Italia il consenso è valido dai{" "}
                  <strong>14 anni</strong>; altrimenti è necessario il consenso
                  di chi esercita la responsabilità genitoriale.
                </p>
              </section>

              <section id="diritti">
                <h2>12. Diritti degli interessati</h2>
                <p>
                  Diritti ex artt. 15-22 GDPR (accesso, rettifica,
                  cancellazione, limitazione, portabilità, opposizione) e revoca
                  del consenso. Scrivi a{" "}
                  <a href="mailto:gregoriggl@gmail.com">gregoriggl@gmail.com</a>
                  . Rispondiamo entro <strong>1 mese</strong>, prorogabile di 2
                  mesi in caso di complessità.
                </p>
              </section>

              <section id="reclami">
                <h2>13. Reclamo all’Autorità di controllo</h2>
                <p>
                  Hai diritto di proporre reclamo al{" "}
                  <strong>Garante per la protezione dei dati personali</strong>{" "}
                  (Piazza Venezia, 11 – 00187 Roma) tramite i canali indicati
                  sul sito istituzionale.
                </p>
              </section>

              <section id="modifiche">
                <h2>14. Modifiche e aggiornamenti</h2>
                <p>
                  Eventuali modifiche saranno pubblicate su questa pagina.{" "}
                  <strong>Ultimo aggiornamento:</strong> {LAST_UPDATE}.
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
