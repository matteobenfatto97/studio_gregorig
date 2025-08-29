// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Qualcosa è andato storto
          </h2>
          <p className="text-sm opacity-80 mb-6">
            {process.env.NODE_ENV === "development"
              ? error?.message
              : "Si è verificato un errore inatteso. Riprova."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl border"
          >
            Riprova
          </button>
        </div>
      </body>
    </html>
  );
}
