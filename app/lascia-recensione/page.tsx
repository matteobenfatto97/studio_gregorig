"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ReviewCard,
  Stars,
  useReviews,
  ReviewsProvider,
  type Review,
} from "@/components/reviews/ReviewsSuite";

// mini utility per le classi
function cn(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

// ===============================
// PAGINA — SUPER MODERNA
// ===============================
export default function Page() {
  return (
    <ReviewsProvider>
      <LeaveReviewPage />
    </ReviewsProvider>
  );
}

export function LeaveReviewPage({
  endpoint = "/api/reviews",
}: {
  endpoint?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 py-16">
      {/* Background decorativo soft (clippato) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,theme(colors.sky.200/.25),transparent)] dark:bg-[radial-gradient(1200px_600px_at_50%_-10%,theme(colors.sky.900/.15),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {/* HERO */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8 flex flex-col gap-4 sm:items-start"
        >
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Lascia una recensione
          </h1>
          <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
            Condividi la tua esperienza: aiuterai altri pazienti a scegliere con
            serenità.
          </p>
          <StatsBar />
        </motion.header>

        {/* 2 colonne: form + preview sticky */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="min-w-0">
            <ReviewForm endpoint={endpoint} />
          </div>
          <div className="min-w-0">
            <LivePreviewPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

// ===============================
// STATS BAR (social proof)
// ===============================
function StatsBar() {
  const { reviews } = useReviews();
  const count = reviews.length;
  const avg =
    count === 0
      ? 5
      : Math.round(
          (reviews.reduce((a, r) => a + (r.rating || 0), 0) / count +
            Number.EPSILON) *
            10
        ) / 10;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900/60 dark:text-zinc-300">
        <Stars value={avg} size="sm" />
        <span>
          {avg.toFixed(1)} / 5 · {count} recensioni
        </span>
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/30 dark:text-emerald-200">
        ✅ Verificata dai pazienti
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/60 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-700/60 dark:bg-sky-900/30 dark:text-sky-200">
        ⚡ Risposta in giornata
      </span>
    </div>
  );
}

// ===============================
// RATING INTERATTIVO (hover + click, mezze stelle, a11y + animazioni)
// ===============================

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 .7l3.6 7.3 8 1.2-5.8 5.7 1.4 8L12 18.7 4.8 22.9l1.4-8L.5 9.2l8-1.2z" />
    </svg>
  );
}

function InteractiveRating({
  value,
  onChange,
  size = "lg",
  id,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "md" | "lg";
  id?: string;
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  const effective = hover ?? value;
  const base =
    size === "lg" ? "h-9 w-9" : size === "md" ? "h-7 w-7" : "h-6 w-6";

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(5, Math.round((value + 0.5) * 2) / 2));
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(1, Math.round((value - 0.5) * 2) / 2));
    }
  }

  const label =
    effective >= 4.5
      ? "Eccellente"
      : effective >= 4
        ? "Ottimo"
        : effective >= 3
          ? "Buono"
          : effective >= 2
            ? "Sufficiente"
            : "Da migliorare";

  return (
    <div className="grid gap-1">
      <div
        role="radiogroup"
        aria-labelledby={id}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseLeave={() => setHover(null)}
        className="inline-flex items-center gap-1"
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const starIndex = i + 1;
          const fill =
            effective >= starIndex
              ? 100
              : effective >= starIndex - 0.5
                ? 50
                : 0;

          return (
            <div key={starIndex} className="relative">
              {/* stella vuota */}
              <StarIcon className={`${base} text-yellow-500/25 fill-current`} />
              {/* overlay riempito a percentuale */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill}%` }}
                aria-hidden
              >
                <StarIcon
                  className={`${base} text-yellow-500 fill-current drop-shadow`}
                />
              </div>

              {/* metà sinistra */}
              <motion.button
                type="button"
                aria-label={`${(starIndex - 0.5).toString().replace(".", ",")} su 5`}
                aria-checked={value === starIndex - 0.5}
                role="radio"
                onMouseEnter={() => setHover(starIndex - 0.5)}
                onFocus={() => setHover(starIndex - 0.5)}
                onClick={() => onChange(starIndex - 0.5)}
                whileHover={{ scale: 1.05 }}
                className="absolute inset-y-0 left-0 w-1/2 rounded-l outline-none ring-offset-2 focus:ring-2 focus:ring-sky-500"
              />
              {/* metà destra */}
              <motion.button
                type="button"
                aria-label={`${starIndex} su 5`}
                aria-checked={value === starIndex}
                role="radio"
                onMouseEnter={() => setHover(starIndex)}
                onFocus={() => setHover(starIndex)}
                onClick={() => onChange(starIndex)}
                whileHover={{ scale: 1.05 }}
                className="absolute inset-y-0 right-0 w-1/2 rounded-r outline-none ring-offset-2 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          );
        })}
      </div>
      <div className="text-xs text-zinc-500">
        {label} · {effective.toFixed(1)} / 5
      </div>
    </div>
  );
}

function ReviewForm({ endpoint }: { endpoint: string }) {
  const [name, setName] = React.useState("");
  const [photoData, setPhotoData] = React.useState<string | null>(null); // dataURL
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [seconds, setSeconds] = React.useState(0);
  const [honeypot, setHoneypot] = React.useState(""); // anti-bot

  const DRAFT_KEY = "reviewDraft";
  const MIN_SECONDS = 3;
  const MAX = 300; // <-- 300 caratteri
  const remaining = MAX - text.length;
  const progress = Math.min((text.length / MAX) * 100, 100);

  // Chips utili
  const chips = [
    "Zero dolore",
    "Spiegazioni chiarissime",
    "Tempi rapidi",
    "Staff gentilissimo",
    "Studio moderno",
    "Ottimo rapporto qualità/prezzo",
    "Tecnologia avanzata",
    "Mi sono sentito/a a mio agio",
  ];
  const addChip = (c: string) =>
    setText((t) => (t ? t.trimEnd() + (t.endsWith(".") ? " " : " ") + c : c));

  // Autosave + timer
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setName(d.name ?? "");
        setPhotoData(d.photoData ?? null);
        setRating(d.rating ?? 5);
        setText(d.text ?? "");
      }
    } catch {}
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ name, photoData, rating, text })
      );
    } catch {}
  }, [name, photoData, rating, text]);

  const ratingLabel =
    rating >= 4.5
      ? "Eccellente"
      : rating >= 4
        ? "Ottimo"
        : rating >= 3
          ? "Buono"
          : rating >= 2
            ? "Sufficiente"
            : "Da migliorare";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    setErr(null);

    if (seconds < MIN_SECONDS) {
      setErr("Attendi un attimo prima di inviare (anti-spam).");
      return;
    }
    if (honeypot) {
      setErr("Rilevato campo non previsto.");
      return;
    }
    // Nome obbligatorio
    if (!name || name.trim().length < 2) {
      setErr("Inserisci il tuo nome (min 2 caratteri).");
      return;
    }
    if (!agree) {
      setErr("Devi accettare l'informativa privacy.");
      return;
    }
    if (!text || text.trim().length < 10) {
      setErr("Racconta qualcosa di più (min 10 caratteri).");
      return;
    }

    setLoading(true);
    try {
      const body = {
        authorName: name.trim(),
        rating,
        text: text.trim(),
        profilePhotoData: photoData || undefined, // dataURL (server la gestirà)
        website: honeypot || undefined,
      };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Invio non riuscito");

      setOk(
        "Grazie! La tua recensione è stata inviata e sarà visibile dopo la moderazione."
      );
      setName("");
      setPhotoData(null);
      setRating(5);
      setText("");
      setAgree(false);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
    } catch (e: any) {
      setErr(e?.message || "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    !loading &&
    agree &&
    name.trim().length >= 2 &&
    text.trim().length >= 10 &&
    seconds >= MIN_SECONDS;

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-cyan-400/15 blur-2xl"
      />

      {/* Honeypot nascosto */}
      <input
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
        className="hidden"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />

      <div className="relative grid gap-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <li className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900">
            1. Valuta
          </li>
          <li className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900">
            2. Racconta
          </li>
          <li className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900">
            3. Invia
          </li>
        </ol>

        {/* Rating */}
        <div className="grid gap-2">
          <label
            id="rating-label"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Valutazione{" "}
            <span className="ml-1 text-xs text-zinc-500">({ratingLabel})</span>
          </label>
          <InteractiveRating
            id="rating-label"
            value={rating}
            onChange={setRating}
            size="lg"
          />
        </div>

        {/* Nome obbligatorio + foto da dispositivo */}
        <div className="grid grid-cols-1 gap-6">
          <div className="grid gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Nome <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Giulia Rossi"
              className={cn(
                "h-11 rounded-xl border px-4 text-sm text-zinc-900 outline-none ring-offset-2 placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-500 dark:bg-zinc-950 dark:text-zinc-100",
                name.trim().length < 2
                  ? "border-red-300 dark:border-red-700"
                  : "border-zinc-200 dark:border-zinc-700"
              )}
            />
            <p className="text-xs text-zinc-500">
              Indica il tuo nome (min 2 caratteri).
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Immagine profilo (opzionale)
            </label>
            <ImagePicker value={photoData} onChange={setPhotoData} />
          </div>
        </div>

        {/* Testo + progress + chips */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="text"
              className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              La tua esperienza
            </label>
            <span
              className={cn(
                "text-xs",
                remaining < 0 ? "text-red-600" : "text-zinc-500"
              )}
              aria-live="polite"
            >
              {remaining} caratteri
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => addChip(c)}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 active:scale-[.98] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {c}
              </button>
            ))}
          </div>

          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            maxLength={MAX} // <-- 300
            placeholder="Raccontaci cosa ti è piaciuto, come ti sei sentito/a, cosa abbiamo risolto…"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-900 outline-none ring-offset-2 placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <FormHints />
        </div>

        {/* Consenso */}
        <label className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 size-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500 dark:border-zinc-600"
          />
          <span>
            Ho letto e accetto l'informativa privacy e autorizzo la
            pubblicazione della mia recensione.
          </span>
        </label>

        {/* Messaggi */}
        {err && <p className="text-sm text-red-600">{err}</p>}
        {ok && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-emerald-300/50 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-200"
          >
            {ok}{" "}
            <Link href="/recensioni" className="underline underline-offset-4">
              Vai alle recensioni
            </Link>
            .
          </motion.div>
        )}

        {/* Azioni desktop */}
        <div className="hidden items-center justify-between gap-3 sm:flex">
          <p className="text-xs text-zinc-500">
            Per protezione anti-spam, l’invio si abilita dopo {MIN_SECONDS}s.
            {seconds < MIN_SECONDS ? ` (${MIN_SECONDS - seconds}s…)` : ""}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="reset"
              onClick={() => {
                setName("");
                setPhotoData(null);
                setRating(5);
                setText("");
                setAgree(false);
                setErr(null);
                setOk(null);
                try {
                  localStorage.removeItem(DRAFT_KEY);
                } catch {}
              }}
              className="h-11 rounded-xl border border-zinc-300 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Annulla
            </button>
            <button
              disabled={!canSubmit}
              type="submit"
              className="h-11 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition active:scale-[.99] disabled:opacity-60"
            >
              {loading ? "Invio…" : "Invia recensione"}
            </button>
          </div>
        </div>
      </div>

      {/* Floating submit bar — mobile only */}
      <div className="sm:hidden">
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white/90 to-transparent dark:from-zinc-950/90" />
        <div className="fixed inset-x-0 bottom-3 z-30 px-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-2 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
            <span className="px-2 text-xs text-zinc-500">
              {Math.max(0, 10 - text.trim().length)} caratteri al minimo
            </span>
            <button
              disabled={!canSubmit}
              onClick={(e) =>
                (
                  e.currentTarget.closest("form") as HTMLFormElement | null
                )?.requestSubmit()
              }
              className="pointer-events-auto h-11 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition active:scale-[.99] disabled:opacity-60"
            >
              {loading ? "Invio…" : "Invia recensione"}
            </button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}

// ===============================
// PREVIEW STICKY (invoglia alla qualità)
// ===============================
function LivePreviewPanel() {
  const [name, setName] = React.useState("Anonimo");
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState(
    "La mia esperienza allo Studio è stata eccellente: gentilezza, chiarezza e zero dolore."
  );

  // Sync con bozza
  // dentro LivePreviewPanel(), leggi anche photoData dalla bozza
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("reviewDraft");
      if (raw) {
        const d = JSON.parse(raw);
        setName(d.name || "Anonimo");
        setPhoto(d.photoData || null); // <-- cambia qui
        setRating(d.rating || 5);
        setText(d.text || "");
      }
    } catch {}
  }, []);

  const sample: Review = {
    id: "preview",
    authorName: name || "Anonimo",
    profilePhotoUrl: photo,
    rating,
    text: text || "Scrivi la tua esperienza…",
    relativeTimeDescription: "ora",
  };

  return (
    <div className="lg:sticky lg:top-16">
      <div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-5 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Anteprima
        </h3>
        <ReviewCard review={sample} />
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200/60 bg-white/70 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <h4 className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Consigli per una recensione utile
        </h4>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Indica il trattamento (es. igiene, sbiancamento, impianto).</li>
          <li>Racconta come ti sei sentito/a durante la visita.</li>
          <li>
            Menziona tempi d’attesa, chiarezza delle spiegazioni e comfort.
          </li>
          <li>Evita dati sensibili: la recensione è pubblica.</li>
        </ul>
      </div>
    </div>
  );
}

// ===============================
// IMAGE PICKER — upload locale con anteprima + validazioni
// ===============================
function ImagePicker({
  value,
  onChange,
  maxSizeMB = 3,
}: {
  value: string | null; // dataURL o null
  onChange: (dataUrl: string | null) => void;
  maxSizeMB?: number;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Formato non supportato (usa JPG, PNG o WEBP).");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Immagine troppo grande (max ${maxSizeMB}MB).`);
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    onChange(dataUrl);
  }

  return (
    <div className="flex items-center gap-4">
      {/* preview circolare */}
      <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Anteprima"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
            Foto
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-10 rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Carica immagine
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="h-10 rounded-lg border border-zinc-300 px-3 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Rimuovi
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {!error && (
          <p className="text-xs text-zinc-500">
            JPG/PNG/WEBP, max {maxSizeMB}MB.
          </p>
        )}
      </div>
    </div>
  );
}

// ===============================
// PICCOLI AIUTI UI
// ===============================
function FormHints() {
  return (
    <div className="text-xs text-zinc-500 dark:text-zinc-400">
      Suggerimento: i dettagli pratici aiutano chi legge (tempi, dolore,
      gentilezza, risultati).
    </div>
  );
}
