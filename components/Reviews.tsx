"use client";
import React from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// =============================================
// TYPES
// =============================================
export type Review = {
  id: string;
  authorName: string;
  profilePhotoUrl?: string | null;
  rating: number; // 0..5 (supports halves)
  text: string;
  relativeTimeDescription?: string;
  createdAt?: string; // ISO
};

// =============================================
// CONTEXT + PROVIDER (single source of truth)
// =============================================

type ReviewsContextValue = {
  reviews: Review[];
  isLoading: boolean;
  error?: Error | null;
  endpoint: string;
  refresh: () => Promise<void>;
};

const ReviewsContext = React.createContext<ReviewsContextValue | null>(null);

export function ReviewsProvider({
  children,
  endpoint = "/api/reviews",
  initialData,
}: {
  children: React.ReactNode;
  endpoint?: string;
  initialData?: Review[];
}) {
  const [reviews, setReviews] = React.useState<Review[]>(() =>
    initialData ? normalize(initialData) : []
  );
  const [isLoading, setLoading] = React.useState(!initialData);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchReviews = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error("Impossibile caricare le recensioni");
      const data: Review[] = await res.json();
      setReviews(normalize(data));
      setError(null);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const value: ReviewsContextValue = React.useMemo(
    () => ({ reviews, isLoading, error, endpoint, refresh: fetchReviews }),
    [reviews, isLoading, error, endpoint, fetchReviews]
  );

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = React.useContext(ReviewsContext);
  if (!ctx)
    throw new Error("useReviews deve essere usato dentro <ReviewsProvider/>");
  return ctx;
}

// =============================================
// HELPERS
// =============================================

function normalize(list: Review[]): Review[] {
  return list.filter(Boolean).map((r, i) => ({
    id: r.id ?? `rev-${i}`,
    authorName: r.authorName?.trim() || "Utente",
    profilePhotoUrl: r.profilePhotoUrl || null,
    rating: Math.max(0, Math.min(5, Number(r.rating ?? 0))),
    text: (r.text || "").trim(),
    relativeTimeDescription: r.relativeTimeDescription || undefined,
    createdAt: r.createdAt || undefined,
  }));
}

function cn(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

function aggregate(list: Review[]) {
  if (!list.length) return { avg: 0, count: 0 };
  const sum = list.reduce((acc, r) => acc + (r.rating || 0), 0);
  const avg = Math.round((sum / list.length) * 10) / 10;
  return { avg, count: list.length };
}

// =============================================
// STARS (supports halves) + RATING INPUT A11Y
// =============================================

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 .7l3.6 7.3 8 1.2-5.8 5.7 1.4 8.0L12 18.7 4.8 22.9l1.4-8L.5 9.2l8-1.2z" />
    </svg>
  );
}

export function Stars({
  value,
  size = "sm",
  labelledById,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  labelledById?: string;
}) {
  const roundedHalf = Math.round(value * 2) / 2;
  const full = Math.floor(roundedHalf);
  const half = roundedHalf - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const base =
    size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div
      className="flex items-center gap-1 text-yellow-500"
      aria-labelledby={labelledById}
      aria-label={`${value} su 5`}
    >
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`f-${i}`} className={cn(base, "fill-current")} />
      ))}
      {half && (
        <div className="relative" key="half">
          <StarIcon className={cn(base, "text-yellow-500/40 fill-current")} />
          <StarIcon
            className={cn(
              base,
              "absolute inset-0 fill-current [clip-path:inset(0_50%_0_0)]"
            )}
          />
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <StarIcon
          key={`e-${i}`}
          className={cn(base, "text-yellow-500/40 fill-current")}
        />
      ))}
    </div>
  );
}

export function RatingInput({
  value,
  onChange,
  size = "md",
  id,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "md" | "lg";
  id?: string;
}) {
  // keyboard-friendly radio-based rating (halves)
  const options = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  return (
    <div
      role="radiogroup"
      aria-labelledby={id}
      className="flex items-center gap-2"
    >
      {options.map((v) => (
        <button
          type="button"
          key={v}
          aria-checked={value === v}
          role="radio"
          onClick={() => onChange(v)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp")
              onChange(Math.min(5, value + 0.5));
            if (e.key === "ArrowLeft" || e.key === "ArrowDown")
              onChange(Math.max(1, value - 0.5));
          }}
          className={cn(
            "rounded-md p-1 outline-none ring-offset-2 focus:ring-2 focus:ring-sky-500",
            value >= v ? "text-yellow-500" : "text-yellow-500/40"
          )}
        >
          <Stars value={v} size={size} />
        </button>
      ))}
    </div>
  );
}

// =============================================
// CARD with interactive glow/tilt
// =============================================

export function ReviewCard({ review }: { review: Review }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionTemplate`${(y as any).to((v: number) => (v - 0.5) * 6)}deg`;
  const rotateY = useMotionTemplate`${(x as any).to((v: number) => (0.5 - v) * 6)}deg`;

  return (
    <motion.article
      role="article"
      initial={{ y: 12, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      onPointerMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width);
        y.set((e.clientY - rect.top) / rect.height);
      }}
      style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
      className="group relative rounded-2xl border border-zinc-200/60 bg-white/80 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/70"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="absolute -inset-16 -z-10 bg-[radial-gradient(40%_40%_at_var(--mx)_var(--my),theme(colors.sky.400/.20),transparent_70%)]"
          style={{
            // @ts-ignore
            "--mx": x.to((v) => `${Math.round(v * 100)}%`),
            // @ts-ignore
            "--my": y.to((v) => `${Math.round(v * 100)}%`),
          }}
        />
      </div>

      <div className="flex items-start gap-4">
        <Avatar src={review.profilePhotoUrl} name={review.authorName} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-base font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
              {review.authorName}
            </h3>
            <Stars value={review.rating} size="md" />
            {review.relativeTimeDescription && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {review.relativeTimeDescription}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {review.text}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function Avatar({ src, name }: { src?: string | null; name: string }) {
  const initials = React.useMemo(
    () =>
      name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [name]
  );
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white dark:ring-zinc-800">
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-bold text-white">
          {initials}
        </div>
      )}
    </div>
  );
}

// =============================================
// GRID (page & sections)
// =============================================

export function ReviewsGrid({
  limit,
  className,
  emptyState = "Ancora nessuna recensione. Sii il primo a raccontare la tua esperienza! 🦷",
}: {
  limit?: number;
  className?: string;
  emptyState?: string;
}) {
  const { reviews, isLoading, error } = useReviews();
  const list = React.useMemo(
    () => (limit ? reviews.slice(0, limit) : reviews),
    [reviews, limit]
  );

  if (isLoading) return <SkeletonGrid />;
  if (error)
    return (
      <div className="text-sm text-red-600">
        Errore nel caricamento delle recensioni.
      </div>
    );
  if (!list.length)
    return <p className="text-sm text-zinc-500">{emptyState}</p>;

  return (
    <section
      className={cn("relative", className)}
      aria-label="Recensioni dei pazienti"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {list.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-zinc-200/60 bg-white/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================
// TICKER (homepage): silky marquee with edge-fade
// =============================================

export function ReviewsTicker({
  speed = 28,
  pauseOnHover = true,
  height = 180,
}: {
  speed?: number;
  pauseOnHover?: boolean;
  height?: number;
}) {
  const { reviews, isLoading } = useReviews();
  if (isLoading || reviews.length === 0) return null;
  const marquee = [...reviews, ...reviews];

  return (
    <section
      aria-label="Cosa dicono di noi"
      className="relative mx-auto my-8 max-w-7xl overflow-hidden px-4"
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dicono di noi
        </h2>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="sr-only">Valutazione media</span>
          <TickerAggregateBadge />
        </div>
      </header>

      <div
        className={cn(
          "group relative w-full select-none",
          pauseOnHover && "hover:[&>div]:[animation-play-state:paused]"
        )}
        style={{ height }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-zinc-950" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-zinc-950" />

        <div
          className="absolute flex min-w-full gap-4"
          style={{ animation: `marquee ${speed}s linear infinite` }}
        >
          {marquee.map((r, i) => (
            <div key={`${r.id}-${i}`} className="w-[360px] shrink-0">
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
      `}</style>
    </section>
  );
}

function TickerAggregateBadge() {
  const { reviews } = useReviews();
  const { avg, count } = aggregate(reviews);
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900/60 dark:text-zinc-300">
      <Stars value={avg} size="sm" />
      <span>
        {avg.toFixed(1)} / 5 · {count} recensioni
      </span>
    </div>
  );
}

// =============================================
// SEO JSON‑LD
// =============================================

export function ReviewsSeo({
  businessName = "Studio Dentistico",
}: {
  businessName?: string;
}) {
  const { reviews } = useReviews();
  const { avg, count } = aggregate(reviews);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: businessName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg || 0,
      ratingCount: count || 0,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 20).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.authorName },
      reviewBody: r.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      datePublished: r.createdAt || undefined,
    })),
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// =============================================
// DROP‑IN SECTIONS
// =============================================

export function HomepageReviewsSection() {
  return (
    <ReviewsProvider>
      <section className="relative py-10">
        <div className="mx-auto max-w-7xl px-4">
          <ReviewsTicker />
        </div>
      </section>
    </ReviewsProvider>
  );
}

export function ReviewsPageSection() {
  return (
    <ReviewsProvider>
      <section className="relative py-12">
        <div className="mx-auto max-w-7xl px-4">
          <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Recensioni
              </h1>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                Esperienze reali dei nostri pazienti: trasparenza, cura,
                risultati.
              </p>
            </div>
            <TickerAggregateBadge />
          </header>

          <ReviewsGrid />
          <ReviewsSeo businessName="Studio Dentistico Gregorig" />
        </div>
      </section>
    </ReviewsProvider>
  );
}

// =============================================
// LEAVE REVIEW FORM (page‑ready component)
// =============================================

export function LeaveReviewPage({
  endpoint = "/api/reviews",
}: {
  endpoint?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Lascia una recensione
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Condividi la tua esperienza: aiuterai altri pazienti a scegliere con
            serenità.
          </p>
        </header>
        <ReviewForm endpoint={endpoint} />
      </div>
    </div>
  );
}

function ReviewForm({ endpoint }: { endpoint: string }) {
  const [name, setName] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const remaining = 600 - text.length;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    setErr(null);
    if (!agree) {
      setErr("Devi accettare l'informativa privacy.");
      return;
    }
    if (!text || text.length < 10) {
      setErr("Racconta qualcosa di più (min 10 caratteri).");
      return;
    }

    setLoading(true);
    try {
      const body = { authorName: name || "Anonimo", rating, text };
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
      setRating(5);
      setText("");
      setAgree(false);
    } catch (e: any) {
      setErr(e?.message || "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70"
    >
      {/* Ambient gradient ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-cyan-400/20 blur-2xl"
      />

      <div className="relative grid gap-6">
        <div className="grid gap-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Nome (opzionale)
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Es. Giulia R."
            className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none ring-offset-2 placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        <div className="grid gap-2">
          <label
            id="rating-label"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Valutazione
          </label>
          <RatingInput
            id="rating-label"
            value={rating}
            onChange={setRating}
            size="md"
          />
        </div>

        <div className="grid gap-2">
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
            >
              {remaining} caratteri
            </span>
          </div>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            maxLength={700}
            placeholder="Raccontaci cosa ti è piaciuto, come ti sei sentito/a, cosa abbiamo risolto…"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-900 outline-none ring-offset-2 placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

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

        {err && <p className="text-sm text-red-600">{err}</p>}
        {ok && <p className="text-sm text-emerald-600">{ok}</p>}

        <div className="flex items-center justify-end gap-3">
          <button
            type="reset"
            onClick={() => {
              setName("");
              setRating(5);
              setText("");
              setAgree(false);
            }}
            className="h-11 rounded-xl border border-zinc-300 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Annulla
          </button>
          <button
            disabled={loading}
            type="submit"
            className="h-11 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition active:scale-[.99] disabled:opacity-60"
          >
            {loading ? "Invio…" : "Invia recensione"}
          </button>
        </div>
      </div>
    </form>
  );
}

// =============================================
// QUICK DEMO (optional): Drop this anywhere to preview
// =============================================

export default function ReviewsShowcaseDemo() {
  const demo: Review[] = [
    {
      id: "1",
      authorName: "Giacomo Massarotto",
      profilePhotoUrl: "/assets/images/giacomo.png",
      rating: 5,
      text: "Se potessi mettere 6 stelline le metterei! Un vero Dottore con la D maiuscola: pronto nel momento del bisogno e di buon cuore.",
      relativeTimeDescription: "2 settimane fa",
    },
    {
      id: "2",
      authorName: "Enzo Giuliattini",
      profilePhotoUrl: "/assets/images/enzo.png",
      rating: 5,
      text: "Ambiente pulito e accogliente, staff amichevole e spiegazioni chiare. Cure indolori: esperienza eccellente!",
      relativeTimeDescription: "1 anno fa",
    },
    {
      id: "3",
      authorName: "Sofia B.",
      rating: 4.5,
      text: "Studio tecnologico e super reattivo. Mi sono sentita ascoltata e coccolata.",
      relativeTimeDescription: "3 mesi fa",
    },
  ];

  return (
    <div className="bg-[radial-gradient(1200px_600px_at_50%_-10%,theme(colors.sky.200/.25),transparent)] dark:bg-[radial-gradient(1200px_600px_at_50%_-10%,theme(colors.sky.800/.15),transparent)] py-16">
      <ReviewsProvider initialData={demo}>
        <div className="mx-auto max-w-7xl px-4">
          <ReviewsTicker />
          <div className="mt-10" />
          <ReviewsGrid />
          <div className="mt-12" />
          <LeaveReviewPage />
        </div>
      </ReviewsProvider>
    </div>
  );
}

// =============================================
// API NOTE (App Router)
// ---------------------------------------------
// Create app/api/reviews/route.ts like:
// import { NextRequest } from "next/server";
// const db: Review[] = []; // replace with Prisma/DB
// export async function GET() { return Response.json(db.sort((a,b)=> (b.createdAt||"").localeCompare(a.createdAt||""))); }
// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const item: Review = {
//     id: crypto.randomUUID(),
//     authorName: String(body.authorName || "Anonimo"),
//     rating: Math.max(1, Math.min(5, Number(body.rating || 5))),
//     text: String(body.text || "").slice(0, 700),
//     createdAt: new Date().toISOString(),
//     profilePhotoUrl: null,
//   };
//   // TODO: validate + persist (Prisma)
//   db.push(item);
//   return new Response(null, { status: 201 });
// }
