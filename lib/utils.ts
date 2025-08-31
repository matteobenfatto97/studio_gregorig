// lib/utils.ts

/** Merge classi tailwind in modo semplice (senza dipendenze) */
export function cn(
  ...inputs: Array<
    | string
    | number
    | null
    | undefined
    | false
    | Record<string, boolean | null | undefined>
  >
) {
  const out: string[] = [];
  for (const i of inputs) {
    if (!i) continue;
    if (typeof i === "string" || typeof i === "number") out.push(String(i));
    else if (typeof i === "object") {
      for (const [k, v] of Object.entries(i)) if (v) out.push(k);
    }
  }
  return out.join(" ");
}

/** Crea un object URL per preview (solo browser). Se già stringa, la ritorna. */
export function convertFileToUrl(file: File | Blob | string): string {
  if (typeof file === "string") return file;
  if (typeof window === "undefined") return ""; // SSR safety
  const urlAPI = window.URL || (window as any).webkitURL;
  if (urlAPI?.createObjectURL) {
    try {
      return urlAPI.createObjectURL(file);
    } catch {
      return "";
    }
  }
  return "";
}

/** Facoltativo: revoca l’object URL quando hai finito la preview */
export function revokeObjectUrl(url?: string) {
  if (!url || typeof window === "undefined") return;
  const urlAPI = window.URL || (window as any).webkitURL;
  urlAPI?.revokeObjectURL?.(url);
}
