// components/Chatbot.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoMdSend } from "react-icons/io";
import {
  IoMic,
  IoMicOff,
  IoCopy,
  IoThumbsUpOutline,
  IoThumbsDownOutline,
  IoVolumeHigh,
  IoVolumeMute,
  IoClose,
  IoTrash,
  IoDownload,
  IoCall,
  IoMail,
  IoMap,
  IoRocket,
} from "react-icons/io5";

// ---------------------------------------------
// Types
// ---------------------------------------------
export interface Message {
  role: "user" | "assistant";
  content: string;
  mapEmbed?: boolean;
}

interface QuickIntent {
  label: string;
  prompt: string;
  icon?: React.ReactNode;
}

interface BookingData {
  nome: string;
  telefono: string;
  email?: string;
  servizio: string;
  medico?: string;
  data: string; // YYYY-MM-DD
  fascia: string; // Mattina/Pomeriggio/Sabato
  note?: string;
}

// ---------------------------------------------
// Static FAQ (fast answers w/ Fuse)
// ---------------------------------------------
const faqData = [
  {
    question: "Quali sono gli orari?",
    answer:
      "Il nostro orario di apertura è:\nLunedì: Chiuso\nMartedì: Chiuso\nMercoledì: 08:00 - 13:00 / 14:00 - 20:00\nGiovedì: 08:00 - 13:00 / 14:00 - 20:00\nVenerdì: 08:00 - 13:00 / 14:00 - 20:00\nSabato: 08:00 - 18:00 (due sabati al mese)\nDomenica: Chiuso",
  },
  {
    question: "Come posso contattare lo studio?",
    answer:
      "Puoi scriverci a gregoriggl@libero.it o chiamare +39 0435 66198. In urgenza, indica 'urgenza' all'inizio del messaggio.",
  },
  {
    question: "Quali servizi offrite?",
    answer:
      "Offriamo implantologia, chirurgia orale, odontoiatria conservativa, igiene dentale, medicina orale e parodontologia.",
  },
  {
    question: "Dove si trova lo studio?",
    answer: "Ci trovi in Borgata Palú 88, nel cuore di Sappada:",
    mapEmbed: true,
  },
];

const fuse = new Fuse(faqData, {
  keys: ["question"],
  threshold: 0.3,
  distance: 100,
});

const servizi = [
  "Prima visita",
  "Igiene e prevenzione",
  "Conservativa",
  "Implantologia",
  "Chirurgia orale",
  "Parodontologia",
  "Medicina orale",
];

// ---------------------------------------------
// Helpers
// ---------------------------------------------
const LS_KEY_HISTORY = "denty_chat_history_ultra_v1";
const LS_KEY_OPEN = "denty_chat_open_ultra_v1";
const LS_KEY_TTS = "denty_chat_tts_ultra_v1";
const LS_KEY_DIM = "denty_chat_dim_ultra_v1"; // persist size

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

function useSpeech() {
  const [enabled, setEnabled] = useLocalStorage<boolean>(LS_KEY_TTS, false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined")
      synthRef.current = window.speechSynthesis;
  }, []);
  const speak = useCallback(
    (text: string) => {
      if (!enabled || !synthRef.current) return;
      synthRef.current.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "it-IT";
      utter.rate = 1.02;
      synthRef.current.speak(utter);
    },
    [enabled]
  );
  const stop = useCallback(() => synthRef.current?.cancel(), []);
  return { enabled, setEnabled, speak, stop };
}

function useSTT() {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR: any =
      (globalThis as any).webkitSpeechRecognition ||
      (globalThis as any).SpeechRecognition;
    if (SR) {
      setSupported(true);
      const rec = new SR();
      rec.lang = "it-IT";
      rec.interimResults = true;
      rec.continuous = false;
      recognitionRef.current = rec;
    }
  }, []);

  const start = useCallback((onResult: (text: string) => void) => {
    if (!recognitionRef.current) return;
    setRecording(true);
    let final = "";
    recognitionRef.current.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const tr = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += tr;
        else interim += tr;
      }
      onResult((final + " " + interim).trim());
    };
    recognitionRef.current.onend = () => setRecording(false);
    recognitionRef.current.onerror = () => setRecording(false);
    recognitionRef.current.start();
  }, []);

  const stop = useCallback(() => recognitionRef.current?.stop(), []);

  return { supported, recording, start, stop };
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const isUrgent = (t: string) =>
  /urgenza|dolore|sanguin|gonfiore|ascesso|trauma/i.test(t);
const isBookingIntent = (t: string) =>
  /\b(prenot|appunt|visita|booking|prenotazione)\b/i.test(t);

// Lightweight toast shim (console)
const toast = (o: { title: string; description?: string }) => {
  if (typeof window !== "undefined")
    console.log(`[Toast] ${o.title}: ${o.description ?? ""}`);
};

// ---------------------------------------------
// Component
// ---------------------------------------------
export default function Chatbot() {
  const [open, setOpen] = useLocalStorage<boolean>(LS_KEY_OPEN, false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useLocalStorage<Message[]>(
    LS_KEY_HISTORY,
    []
  );
  const [botTyping, setBotTyping] = useState(false);
  const [optimisticAssistant, setOptimisticAssistant] = useState("");
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    enabled: ttsEnabled,
    setEnabled: setTtsEnabled,
    speak,
    stop: stopTTS,
  } = useSpeech();
  const stt = useSTT();
  const [width, setWidth] = useLocalStorage<number>(LS_KEY_DIM + "_w", 380);
  const [height, setHeight] = useLocalStorage<number>(LS_KEY_DIM + "_h", 560);
  const resizingRef = useRef<null | {
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  }>(null);

  // Quick intents
  const intents: QuickIntent[] = useMemo(
    () => [
      {
        label: "Prenota una visita",
        prompt: "Vorrei prenotare una visita",
        icon: <IoRocket className="h-4 w-4" />,
      },
      { label: "Orari", prompt: "Quali sono gli orari?" },
      {
        label: "Contatti",
        prompt: "Come posso contattare lo studio?",
        icon: <IoMail className="h-4 w-4" />,
      },
      {
        label: "Come arrivare",
        prompt: "Dove si trova lo studio?",
        icon: <IoMap className="h-4 w-4" />,
      },
    ],
    []
  );

  // Welcome message when opening the chat (only if history empty)
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Ciao, sono Denty 🦷 — assistente virtuale dello Studio Gregorig. Posso aiutarti a prenotare, capire i costi, gli orari o come arrivare.",
        },
      ]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatWindowRef.current)
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messages, botTyping, optimisticAssistant]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ---------------------------------------------
  // Networking
  // ---------------------------------------------
  async function sendToServer(history: Message[]): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    if (!res.ok) throw new Error("Errore risposta AI");
    try {
      const data = await res.json();
      return (data.text as string) || "";
    } catch {
      const data = await res.text();
      return data || "";
    }
  }

  async function sendToServerStreaming(history: Message[]): Promise<string> {
    setOptimisticAssistant("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history, stream: true }),
    });

    if (!res.body || !res.ok) {
      return sendToServer(history);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      full += chunk;
      setOptimisticAssistant((prev) => (prev + chunk).slice(-8000));
    }
    return full;
  }

  // ---------------------------------------------
  // Brain: FAQ, Urgency, Booking
  // ---------------------------------------------
  const fuseAnswer = (text: string) => {
    const match = fuse.search(text)[0]?.item as
      | (typeof faqData)[number]
      | undefined;
    if (!match) return undefined;
    return {
      role: "assistant" as const,
      content: match.answer,
      mapEmbed: (match as any).mapEmbed || false,
    };
  };

  // Export conversation
  const exportConversation = useCallback(() => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `denty_chat_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  // Resize handlers
  const onResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    resizingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: width,
      startH: height,
    };
    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const dx = ev.clientX - resizingRef.current.startX;
      const dy = ev.clientY - resizingRef.current.startY;
      setWidth(clamp(resizingRef.current.startW + dx, 320, 540));
      setHeight(clamp(resizingRef.current.startH + dy, 460, 820));
    };
    const onUp = () => {
      resizingRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Booking form bubble
  const BookingBubble: React.FC = () => {
    const [form, setForm] = useState<BookingData>({
      nome: "",
      telefono: "",
      email: "",
      servizio: servizi[0],
      medico: "",
      data: "",
      fascia: "Mattina",
      note: "",
    });

    const valid =
      form.nome.trim() &&
      (form.telefono.trim() || form.email?.trim()) &&
      form.data;

    const update = (k: keyof BookingData, v: string) =>
      setForm((f) => ({ ...f, [k]: v }));

    const downloadICS = () => {
      const dt = form.data?.replaceAll("-", "");
      if (!dt) return;
      const start = `${dt}T090000`;
      const end = `${dt}T093000`;
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Studio Gregorig//Denty//IT",
        "BEGIN:VEVENT",
        `UID:denty-${Date.now()}@studiogregorig`,
        `DTSTAMP:${new Date()
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\..+/, "Z")}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        "SUMMARY:Richiesta visita – Studio Gregorig",
        `DESCRIPTION:${form.servizio} – ${form.nome} (${form.telefono}${
          form.email ? ", " + form.email : ""
        })`,
        "LOCATION:Borgata Palú 88, Sappada",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\n");
      const blob = new Blob([ics], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Prenotazione-${form.nome}-${form.data}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const submit = async () => {
      if (!valid) return;
      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Endpoint non disponibile");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Richiesta inviata ✅ Ti ricontatteremo per confermare data e orario. Grazie!",
          },
        ]);
        downloadICS();
      } catch {
        const body = `Richiesta prenotazione%0D%0A%0D%0ANome: ${encodeURIComponent(
          form.nome
        )}%0D%0ATelefono: ${encodeURIComponent(
          form.telefono
        )}%0D%0AEmail: ${encodeURIComponent(
          form.email || ""
        )}%0D%0AServizio: ${encodeURIComponent(
          form.servizio
        )}%0D%0AMedico preferito: ${encodeURIComponent(
          form.medico || ""
        )}%0D%0AData preferita: ${encodeURIComponent(
          form.data
        )}%0D%0AFascia: ${encodeURIComponent(
          form.fascia
        )}%0D%0ANote: ${encodeURIComponent(form.note || "")}`;
        window.location.href = `mailto:gregoriggl@libero.it?subject=Richiesta%20prenotazione&body=${body}`;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Ti ho aperto l&#39;email precompilata 📧: inviala per completare la richiesta. In alternativa puoi chiamarci al +39 0435 66198.",
          },
        ]);
      }
    };

    return (
      <div className="mb-3 flex items-start justify-start">
        <Image
          src="/assets/icons/denty.png"
          alt="Denty"
          width={28}
          height={28}
          className="mr-2"
        />
        <div className="w-[300px] rounded-2xl bg-white p-3 text-sm text-neutral-900 shadow">
          <p className="mb-2 font-medium">Modulo prenotazione</p>
          <div className="grid grid-cols-1 gap-2">
            <input
              className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none"
              value={form.nome}
              onChange={(e) => update("nome", e.target.value)}
              placeholder="Nome e cognome *"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none"
                value={form.telefono}
                onChange={(e) => update("telefono", e.target.value)}
                placeholder="Telefono *"
              />
              <input
                className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Email"
                type="email"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none"
                value={form.servizio}
                onChange={(e) => update("servizio", e.target.value)}
              >
                {servizi.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none"
                value={form.medico}
                onChange={(e) => update("medico", e.target.value)}
                placeholder="Medico (opzionale)"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none"
                type="date"
                value={form.data}
                onChange={(e) => update("data", e.target.value)}
              />
              <select
                className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none"
                value={form.fascia}
                onChange={(e) => update("fascia", e.target.value)}
              >
                <option>Mattina</option>
                <option>Pomeriggio</option>
                <option>Sabato</option>
              </select>
            </div>
            <textarea
              className="min-h-[70px] rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm focus:outline-none"
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="Note (dolori, protesi, preferenze…)"
            />
            <div className="mt-1 flex items-center justify-between">
              <button
                className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-white disabled:opacity-50"
                onClick={submit}
                disabled={!valid}
              >
                Invia richiesta
              </button>
              <button
                className="rounded-md bg-neutral-100 px-3 py-2"
                onClick={() =>
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      content:
                        "Ok, prenotazione annullata. Posso aiutarti in altro?",
                    },
                  ])
                }
              >
                Annulla
              </button>
            </div>
            <p className="mt-1 text-[11px] text-neutral-600">
              Dopo l&#39;invio riceverai conferma via telefono o email. Puoi
              anche chiamarci subito:{" "}
              <a className="underline" href="tel:+39043566198">
                0435 66198
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------------------------
  // Actions
  // ---------------------------------------------
  const handleSend = useCallback(
    async (userText?: string) => {
      const text = (userText ?? input).trim();
      if (!text || botTyping) return;

      const userMsg: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setBotTyping(true);

      // URGENCY
      if (isUrgent(text)) {
        const urgentMsg: Message = {
          role: "assistant",
          content:
            "⚠️ Sembra un'urgenza. Chiama subito +39 0435 66198 oppure recati in studio. Nel prossimo messaggio descrivi sintomi e da quanto durano.",
        };
        setMessages((prev) => [...prev, urgentMsg]);
        setBotTyping(false);
        if (ttsEnabled) speak(urgentMsg.content);
        return;
      }

      // BOOKING
      if (isBookingIntent(text)) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Perfetto, ti aiuto a prenotare la visita. Compila i campi qui sotto e invieremo la richiesta allo studio.",
          },
        ]);
        setBotTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "__BOOKING_BUBBLE__" },
        ]);
        return;
      }

      // FAQ
      const faq = fuseAnswer(text);
      if (faq) {
        setMessages((prev) => [...prev, faq]);
        setBotTyping(false);
        if (ttsEnabled) speak(faq.content);
        return;
      }

      // AI PATH
      try {
        const history = [...messages, userMsg];
        const reply = await sendToServerStreaming(history);
        const botMsg: Message = {
          role: "assistant",
          content: reply || "Mi dispiace, non ho trovato una risposta utile.",
        };
        setMessages((prev) => [...prev, botMsg]);
        if (ttsEnabled) speak(botMsg.content);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Mi dispiace, al momento non riesco a rispondere. Riprova tra poco o contattaci via telefono/email.",
          },
        ]);
      } finally {
        setOptimisticAssistant("");
        setBotTyping(false);
      }
    },
    [input, botTyping, messages, ttsEnabled, speak, sendToServerStreaming]
  );

  // ---------------------------------------------
  // UI Subcomponents
  // ---------------------------------------------
  const QuickOptions: React.FC = () => (
    <div className="flex flex-wrap gap-2 p-2" aria-label="Opzioni rapide">
      {intents.map((f, i) => (
        <button
          key={i}
          className="rounded-xl bg-white/80 px-3 py-2 text-sm text-neutral-900 shadow hover:bg-white"
          onClick={() => handleSend(f.prompt)}
        >
          <span className="inline-flex items-center gap-2">
            {f.icon}
            {f.label}
          </span>
        </button>
      ))}
    </div>
  );

  const MsgActions: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    return (
      <div className="mt-1 flex items-center gap-1 opacity-70">
        <button
          className="rounded p-1 hover:bg-black/5"
          aria-label="Copia messaggio"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }}
        >
          <IoCopy className="h-4 w-4" />
        </button>
        {copied && <span className="text-[11px]">Copiato!</span>}
        <button className="rounded p-1 hover:bg-black/5" aria-label="Utile">
          <IoThumbsUpOutline className="h-4 w-4" />
        </button>
        <button className="rounded p-1 hover:bg-black/5" aria-label="Non utile">
          <IoThumbsDownOutline className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const renderAssistantContent = (m: Message) => {
    if (m.content === "__BOOKING_BUBBLE__") return <BookingBubble />;
    if (m.mapEmbed) {
      return (
        <div>
          <p className="whitespace-pre-line">{m.content}</p>
          <div className="mt-2">
            <iframe
              title="Mappa Studio Gregorig"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2289.482781614495!2d12.67899877552318!3d46.56562115928143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4779e8604d84725f%3A0x2c166aaedd4f4732!2sGregorig%20Dr.%20Gianluca!5e1!3m2!1sit!2sit!4v1726127640342!5m2!1sit!2sit"
              width="300"
              height="200"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            />
          </div>
          <MsgActions text={m.content} />
        </div>
      );
    }
    return (
      <div>
        <div className="prose prose-sm max-w-none prose-headings:mt-0 prose-p:my-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
        </div>
        <MsgActions text={m.content} />
      </div>
    );
  };

  const Bubble: React.FC<{ m: Message }> = ({ m }) => (
    <div
      className={`mb-3 flex ${
        m.role === "user" ? "justify-end" : "justify-start"
      } items-end`}
    >
      {m.role === "assistant" && (
        <Image
          src="/assets/icons/denty.png"
          alt="Denty"
          width={28}
          height={28}
          className="mr-2"
        />
      )}
      <div
        className={`max-w-xs rounded-2xl p-3 text-sm shadow ${
          m.role === "user"
            ? "bg-blue-500 text-white"
            : "bg-white text-neutral-900"
        }`}
        role="status"
        aria-live="polite"
      >
        {m.role === "user" ? m.content : renderAssistantContent(m)}
      </div>
      {m.role === "user" && (
        <Image
          src="/assets/icons/user.png"
          alt="Utente"
          width={28}
          height={28}
          className="ml-2 rounded-full"
        />
      )}
    </div>
  );

  // ---------------------------------------------
  // Render
  // ---------------------------------------------
  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Overlay for soft open/close */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "tween",
              duration: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{
              type: "tween",
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-50 flex h-[72vh] w-[90vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-label="Chat con Denty"
            aria-modal
            style={{ width, height, transformOrigin: "bottom right" }}
          >
            {/* Header */}
            <div className="bg-blueGreenGradient flex items-center justify-between p-3 text-white">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/denty.png"
                  alt="Denty"
                  width={28}
                  height={28}
                  className="rounded"
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold">
                    Studio Dentistico Dr. Gregorig
                  </p>
                  <div className="flex items-center gap-2 text-[11px] opacity-90">
                    <span>Assistente virtuale</span>
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Voce on/off"
                  className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                >
                  {ttsEnabled ? <IoVolumeHigh /> : <IoVolumeMute />}
                </button>
                <button
                  className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                  onClick={exportConversation}
                  aria-label="Esporta"
                >
                  <IoDownload />
                </button>
                <button
                  className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                  onClick={() => {
                    setMessages([]);
                    toast({ title: "Conversazione svuotata" });
                  }}
                  aria-label="Svuota"
                >
                  <IoTrash />
                </button>
                <button
                  className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                  aria-label="Chiudi"
                  onClick={() => setOpen(false)}
                >
                  <IoClose />
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto p-3"
              ref={chatWindowRef}
              role="log"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}

              {/* Streaming ghost */}
              {botTyping && optimisticAssistant && (
                <div className="mb-3 flex items-end">
                  <Image
                    src="/assets/icons/denty.png"
                    alt="Denty"
                    width={28}
                    height={28}
                    className="mr-2"
                  />
                  <div className="max-w-xs rounded-2xl bg-white p-3 text-sm text-neutral-900 shadow">
                    <div className="prose prose-sm max-w-none prose-headings:mt-0 prose-p:my-2">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {optimisticAssistant}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {botTyping && !optimisticAssistant && (
                <div className="mb-3 flex items-center gap-2 text-xs text-neutral-700">
                  <Image
                    src="/assets/icons/denty.png"
                    alt="Denty"
                    width={20}
                    height={20}
                  />
                  sta scrivendo…
                </div>
              )}

              {messages.length > 0 &&
                messages[messages.length - 1].role === "assistant" && (
                  <QuickOptions />
                )}

              <p className="mt-4 px-2 text-[11px] text-neutral-700">
                *Le informazioni fornite da Denty non sostituiscono il parere
                del medico. Per urgenze chiama subito.
              </p>
            </div>

            {/* CTA Bar */}
            <div className="flex items-center justify-between border-t border-white/30 bg-white/30 px-3 py-2 text-xs text-neutral-800">
              <div className="flex items-center gap-3">
                <a
                  href="tel:+39043566198"
                  className="group inline-flex items-center gap-1 hover:underline"
                >
                  <IoCall /> Chiama
                </a>
                <a
                  href="mailto:gregoriggl@libero.it"
                  className="group inline-flex items-center gap-1 hover:underline"
                >
                  <IoMail /> Email
                </a>
                <a
                  href="https://maps.google.com/?q=Borgata%20Pal%C3%BA%2088%2C%20Sappada"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1 hover:underline"
                >
                  <IoMap /> Indicazioni
                </a>
              </div>
              <div className="flex items-center gap-2">
                {stt.supported && (
                  <button
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
                      stt.recording ? "bg-red-500 text-white" : "bg-white/80"
                    }`}
                    aria-pressed={stt.recording}
                    onClick={() => {
                      if (stt.recording) stt.stop();
                      else stt.start((t) => setInput(t));
                    }}
                  >
                    {stt.recording ? <IoMicOff /> : <IoMic />}{" "}
                    {stt.recording ? "Stop" : "Detta"}
                  </button>
                )}
              </div>
            </div>

            {/* Input */}
            <form
              className="flex items-center gap-2 border-t border-white/30 bg-white/20 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                aria-label="Scrivi un messaggio"
                className="flex-1 rounded-xl bg-white/90 p-2 text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Scrivi un messaggio… (Ctrl/⌘+K per aprire)"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-500 px-3 py-2 text-white disabled:opacity-50"
                disabled={!input.trim() || botTyping}
                aria-label="Invia"
              >
                <IoMdSend className="text-xl" />
              </button>
            </form>

            {/* Resize handle */}
            <div
              className="group relative flex h-3 w-full cursor-ns-resize items-center justify-center bg-transparent"
              onMouseDown={onResizeMouseDown}
              aria-label="Ridimensiona finestra"
              role="separator"
            >
              <div className="h-1 w-12 rounded-full bg-neutral-300/70 group-hover:bg-neutral-400" />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            className="chat-icon rounded-full border-4 border-white bg-blueGreenGradient p-4 shadow-lg"
            onClick={() => setOpen(true)}
            aria-label="Apri chat Denty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Image
              src="/assets/icons/denty.png"
              alt="Denty"
              width={50}
              height={50}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
