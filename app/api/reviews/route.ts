// app/api/reviews/route.ts
import { NextRequest } from "next/server";

type Review = {
  id: string;
  authorName: string;
  profilePhotoUrl: string | null; // <-- non opzionale: evitiamo undefined
  rating: number; // 1..5 (supporta mezze)
  text: string;
  relativeTimeDescription?: string;
  createdAt?: string; // ISO
};

// Store in-memory (svanisce al riavvio/HMR)
const store: Review[] = [];

// Evita cache su questa route
export const dynamic = "force-dynamic";

export async function GET() {
  // Ordina per data (desc)
  const data = [...store].sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );
  return Response.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // --- Validazioni
    const rawName =
      typeof body.authorName === "string" ? body.authorName.trim() : "";
    if (rawName.length < 2) {
      return new Response(
        JSON.stringify({ error: "Nome obbligatorio (min 2 caratteri)." }),
        {
          status: 400,
        }
      );
    }

    const rawRating = Number(body.rating);
    const rating = Math.max(
      1,
      Math.min(5, Number.isFinite(rawRating) ? rawRating : 5)
    ); // supporta 4.5, ecc.

    const rawText = typeof body.text === "string" ? body.text.trim() : "";
    if (rawText.length < 10) {
      return new Response(
        JSON.stringify({ error: "Testo troppo corto (min 10 caratteri)." }),
        {
          status: 400,
        }
      );
    }
    const text = rawText.slice(0, 300); // <-- limite a 300

    // --- Foto profilo: preferisci dataURL se presente, altrimenti URL
    let profilePhotoUrl: string | null = null;
    const dataUrl: unknown = body.profilePhotoData;
    const urlFromClient: unknown = body.profilePhotoUrl;

    if (typeof dataUrl === "string" && dataUrl.startsWith("data:image/")) {
      // TODO: In produzione carica su S3/Cloudinary e salva l’URL risultante
      profilePhotoUrl = dataUrl; // Next/Image gestisce anche dataURL
    } else if (typeof urlFromClient === "string" && urlFromClient.length > 0) {
      profilePhotoUrl = urlFromClient;
    } // else rimane null

    const item: Review = {
      id: crypto.randomUUID(),
      authorName: rawName.slice(0, 80),
      rating,
      text,
      createdAt: new Date().toISOString(),
      profilePhotoUrl,
      relativeTimeDescription: undefined, // opzionale lato client
    };

    store.unshift(item);
    // Restituisco l’oggetto creato (utile per ottimizzare l’UI)
    return Response.json(item, { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Payload non valido" }), {
      status: 400,
    });
  }
}
