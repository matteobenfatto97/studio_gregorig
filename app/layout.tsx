// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import Image from "next/image";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://studiogregorig.it";

// ——— Fonts
const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// ——— Metadata
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Studio Dr. Gregorig",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "dentista",
    "odontoiatria",
    "igiene dentale",
    "estetica dentale",
    "sbiancamento",
    "studio dentistico",
  ],
  authors: [{ name: "Studio Dr. Gregorig" }],
  creator: "Studio Dr. Gregorig",
  title: {
    default: "Studio Dr. Gregorig",
    template: "%s | Studio Dr. Gregorig",
  },
  description:
    "Professionisti del sorriso — tecnologie d'avanguardia e comfort assoluto.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/assets/icons/favicon.ico",
    shortcut: "/assets/icons/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "Studio Dr. Gregorig",
    title: "Studio Dr. Gregorig",
    description:
      "Professionisti del sorriso — tecnologie d'avanguardia e comfort assoluto.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Studio Dr. Gregorig",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Dr. Gregorig",
    description:
      "Professionisti del sorriso — tecnologie d'avanguardia e comfort assoluto.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },
  category: "healthcare",
};

// ——— Viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Studio Dr. Gregorig",
    url: SITE_URL,
    logo: "/assets/icons/favicon.ico",
  };

  return (
    <html
      lang="it"
      dir="ltr"
      suppressHydrationWarning
      className="scroll-smooth"
    >
      <body
        className={cn(
          "min-h-dvh font-sans antialiased text-slate-100 selection:bg-cyan-300/30 selection:text-white",
          fontSans.variable
        )}
      >
        {/* JSON-LD in body per evitare hydration issues */}
        <script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />

        {/* Background layers — elegante, tech, leggero */}
        <BackgroundDecor
          variant="hybrid"
          imageUrl="/assets/bg/bg.png"
          overlay={0.55}
        />

        {/* Skip link per accessibilità */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only fixed left-4 top-4 z-[100] rounded-lg bg-slate-900/90 px-3 py-2 text-sm text-white shadow-lg"
        >
          Salta al contenuto
        </a>

        {/* Theme Provider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main id="content" className="relative isolate">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

// ——— Decorative background component (funzione locale, NO styled-jsx)
function BackgroundDecor({
  variant = "hybrid",
  imageUrl = "/assets/images/clinic-hero.jpg", // <-- sostituisci con la tua
  overlay = 0.55, // 0..1 intensità scurente sopra l'immagine per leggibilità
}: {
  variant?: "gradient" | "image" | "hybrid";
  imageUrl?: string;
  overlay?: number;
}) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      {/* IMMAGINE DI SFONDO (solo per image/hybrid) */}
      {(variant === "image" || variant === "hybrid") && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt="Background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* overlay scuro per far risaltare il testo chiaro */}
          <div
            className="absolute inset-0"
            style={{ background: `rgba(6,11,22,${overlay})` }}
          />
        </div>
      )}

      {/* GRADIENTE MEDICALE (sempre presente; in hybrid funge da glow sopra l'immagine) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            // Palette fredda/professionale: navy → teal → ciano
            "radial-gradient(1200px_700px_at_50%_-10%, rgba(34,211,238,0.24), transparent 60%)," +
            "radial-gradient(800px_460px_at_10%_10%, rgba(14,165,233,0.18), transparent 70%)," +
            "radial-gradient(900px_520px_at_90%_8%, rgba(20,184,166,0.16), transparent 70%)," +
            // base scura leggermente blu per evitare il “nero piatto”
            "linear-gradient(180deg, #0b1220 0%, #0d1726 40%, #0c1a2b 100%)",
        }}
      />

      {/* GRIGLIA SOTTILE (molto tenue) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      {/* VIGNETTE per concentrare lo sguardo */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.06),transparent)]" />

      {/* ANIMAZIONE LIEVE DEL GRADIENTE (keyframes in globals.css) */}
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(1200px_600px_at_50%_-10%,black,transparent)] animate-[bg-pan_26s_linear_infinite]"
        style={{
          background:
            "radial-gradient(600px_300px_at_70%_20%, rgba(34,211,238,0.08), transparent 60%)," +
            "radial-gradient(600px_300px_at_30%_30%, rgba(14,165,233,0.07), transparent 60%)",
        }}
      />
    </div>
  );
}
