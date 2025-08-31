// lib/utils.ts

/** Merge classi Tailwind semplice */
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
    else for (const [k, v] of Object.entries(i)) if (v) out.push(k);
  }
  return out.join(" ");
}

/** Crea un object URL per preview (solo browser) */
export function convertFileToUrl(file: File | Blob | string): string {
  if (typeof file === "string") return file;
  if (typeof window === "undefined") return "";
  const urlAPI = window.URL || (window as any).webkitURL;
  try {
    return urlAPI?.createObjectURL?.(file) ?? "";
  } catch {
    return "";
  }
}

/** Revoca un object URL quando non serve più */
export function revokeObjectUrl(url?: string) {
  if (!url || typeof window === "undefined") return;
  const urlAPI = window.URL || (window as any).webkitURL;
  urlAPI?.revokeObjectURL?.(url);
}

/* ----------------- Crypto helpers (AES-GCM con PBKDF2) ----------------- */

function encText(s: string) {
  return new TextEncoder().encode(s);
}
function decText(b: ArrayBuffer) {
  return new TextDecoder().decode(b);
}

function b64encode(bytes: Uint8Array): string {
  // @ts-ignore Buffer potrebbe non esistere in browser
  if (typeof Buffer !== "undefined")
    return Buffer.from(bytes).toString("base64");
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64decode(b64: string): Uint8Array {
  // @ts-ignore Buffer potrebbe non esistere in browser
  if (typeof Buffer !== "undefined") {
    // @ts-ignore
    return new Uint8Array(Buffer.from(b64, "base64"));
  }
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function getSubtle(): SubtleCrypto {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("WebCrypto SubtleCrypto non disponibile");
  return subtle;
}

function getRandBytes(len: number): Uint8Array {
  const a = new Uint8Array(len);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(a);
    return a;
  }
  // fallback (rarissimo)
  for (let i = 0; i < len; i++) a[i] = Math.floor(Math.random() * 256);
  return a;
}

/** Garantisce un ArrayBuffer (non ArrayBufferLike) dalla vista */
function toArrayBuffer(view: ArrayBufferView): ArrayBuffer {
  const buf = view.buffer as ArrayBuffer; // casta a ArrayBuffer "puro"
  if (view.byteOffset === 0 && view.byteLength === buf.byteLength) return buf;
  return buf.slice(view.byteOffset, view.byteOffset + view.byteLength);
}

async function deriveKey(secret: string, saltAB: ArrayBuffer) {
  const subtle = getSubtle();
  const keyMaterial = await subtle.importKey(
    "raw",
    encText(secret),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltAB, // ArrayBuffer
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Cifra una stringa con una passphrase.
 * Output: base64( salt(16) | iv(12) | ciphertext )
 */
export async function encryptKey(
  plaintext: string,
  secret: string
): Promise<string> {
  const subtle = getSubtle();
  const salt = getRandBytes(16);
  const iv = getRandBytes(12);

  const key = await deriveKey(secret, toArrayBuffer(salt));
  const enc = await subtle.encrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    encText(plaintext)
  );

  const encBytes = new Uint8Array(enc);
  const data = new Uint8Array(salt.length + iv.length + encBytes.length);
  data.set(salt, 0);
  data.set(iv, salt.length);
  data.set(encBytes, salt.length + iv.length);

  return b64encode(data);
}

/**
 * Decifra l'output di encryptKey (base64). Ritorna stringa in chiaro.
 */
export async function decryptKey(
  payloadB64: string,
  secret: string
): Promise<string> {
  const subtle = getSubtle();
  const raw = b64decode(payloadB64);
  if (raw.length < 16 + 12 + 1) throw new Error("Ciphertext troppo corto");

  const salt = raw.slice(0, 16);
  const iv = raw.slice(16, 28);
  const ct = raw.slice(28);

  const key = await deriveKey(secret, toArrayBuffer(salt));
  const dec = await subtle.decrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(ct)
  );

  return decText(dec);
}
