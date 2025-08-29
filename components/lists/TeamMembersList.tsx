"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { teamMembers } from "@/lib/actions/teamMembers";
import TeamMembersCard from "../TeamMemberCard";

interface Member {
  imageUrl: string;
  name: string;
  role: string;
  description?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const normAngle = (deg: number) => ((deg + 540) % 360) - 180; // -> [-180,180)

// ---- PERF HINTS ----
// 1) No autoplay. Purely user-driven (arrows, wheel, drag, thumbs).
// 2) Virtualize: render only a small window of neighbors around the active slide (default 7).
// 3) Avoid per-item Framer Motion; only the center card uses motion values for tilt (no React re-render on pointer move).
// 4) Lighter effects: reduced heavy blurs; CSS keyframes instead of motion where possible.
// 5) Niente content-visibility sulle card: interferiva con il lazy loading.

export default function TeamMembersList({
  compact = false,
  windowSize = 7,
}: {
  compact?: boolean;
  windowSize?: number;
}) {
  const members = teamMembers as Member[];

  const [active, setActive] = useState(0);
  const [itemWidth, setItemWidth] = useState(320);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Geometry
  const baseDeg = Math.max(36, 360 / Math.max(6, members.length));
  const radius = Math.min(itemWidth * 1.42, 460);

  // Tilt (center card only) via motion values (no React state updates on move)
  const mvTiltX = useMotionValue(0); // rotateX
  const mvTiltY = useMotionValue(0); // rotateY micro-tilt
  const tiltX = useSpring(mvTiltX, { stiffness: 140, damping: 18, mass: 0.6 });
  const tiltY = useSpring(mvTiltY, { stiffness: 140, damping: 18, mass: 0.6 });

  const resetTilt = () => {
    mvTiltX.stop();
    mvTiltY.stop();
    mvTiltX.set(0);
    mvTiltY.set(0);
  };

  // Resize -> recompute card width
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      const ideal = w / (compact ? 3.25 : 3.1);
      setItemWidth(clamp(ideal, compact ? 220 : 240, compact ? 320 : 380));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [compact]);

  const go = useCallback(
    (dir: "prev" | "next") => {
      setActive((i) =>
        dir === "prev"
          ? (i - 1 + members.length) % members.length
          : (i + 1) % members.length
      );
      resetTilt();
    },
    [members.length]
  );

  // Keyboard
  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") go("prev");
      if (e.key === "ArrowRight") go("next");
      if (e.key === "Home") setActive(0);
      if (e.key === "End") setActive(members.length - 1);
    },
    [go, members.length]
  );

  // Wheel throttle
  const lastWheelRef = useRef(0);
  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelRef.current < 380) return;
    lastWheelRef.current = now;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    delta > 0 ? go("next") : go("prev");
  };

  // Drag inertia (unchanged, but without autoplay interactions)
  const press = useRef<{ x: number; at: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    press.current = { x: e.clientX, at: performance.now() };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!press.current) return;
    const dx = e.clientX - press.current.x;
    const dt = Math.max(1, performance.now() - press.current.at);
    const v = dx / dt; // px/ms
    press.current = null;
    const step = Math.round(dx / 160 + v * 6);
    if (step === 0) return;
    setActive(
      (i) => (i - (step % members.length) + members.length) % members.length
    );
    resetTilt();
  };

  const items = useMemo(() => members.map((m, i) => ({ ...m, i })), [members]);

  // Virtualize indices around `active` within windowSize (must be odd)
  const half = Math.max(1, Math.floor(windowSize / 2));
  const virtualIndices = useMemo(() => {
    const arr: number[] = [];
    for (let off = -half; off <= half; off++) {
      arr.push(
        (((active + off) % members.length) + members.length) % members.length
      );
    }
    return arr;
  }, [active, members.length, half]);

  // Distance in steps on a circular list → per preload hints
  const stepDistance = (from: number, to: number, len: number) => {
    const raw = Math.abs(from - to);
    return Math.min(raw, len - raw);
  };

  // Pointer tilt for center card only (no state updates)
  const onPointerMoveCenter = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion) return;
    const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; // 0..1
    const y = (e.clientY - r.top) / r.height; // 0..1
    mvTiltY.set(lerp(-8, 8, x));
    mvTiltX.set(lerp(6, -6, y));
  };

  return (
    <section
      aria-label="Il nostro team"
      className="relative mx-auto w-full max-w-7xl select-none overflow-x-clip px-4"
      onKeyDown={onKey}
      tabIndex={0}
    >
      <div
        ref={viewportRef}
        className={`${compact ? "h-[420px] sm:h-[460px] md:h-[500px]" : "h-[560px] sm:h-[620px] md:h-[660px]"} relative mx-auto flex items-center justify-center overflow-visible`}
        style={{ perspective: "1700px", transformStyle: "preserve-3d" as any }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* BACKDROP (lighter) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${-radius * 0.9}px)`,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[78%] w-[min(86vw,940px)] -translate-x-1/2 -translate-y-1/2 rounded-[64px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.07))",
              maskImage:
                "radial-gradient(120% 100% at 50% 50%, black 35%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(120% 100% at 50% 50%, black 35%, transparent 70%)",
              boxShadow: "inset 0 0 36px rgba(255,255,255,0.05)",
            }}
          />
          <div
            className={`${compact ? "h-64 w-64" : "h-80 w-80"} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-floatPulse`}
            style={{
              background:
                "radial-gradient(closest-side, rgba(56,189,248,0.28), transparent)",
            }}
          />
        </div>

        {/* CARDS (virtualized) */}
        {virtualIndices.map((idx) => {
          const m = items[idx];
          const angDeg = (idx - active) * baseDeg;
          const angNorm = normAngle(angDeg);
          const depth = (Math.cos(toRad(angNorm)) + 1) / 2; // 0..1
          const isCenter = idx === active;

          const scale = isCenter ? (compact ? 1.1 : 1.18) : 0.9 + depth * 0.18;
          const zi = Math.round(10 + depth * 90);
          const opacity = isCenter ? 1 : 0.92;
          const zBoost = Math.max(0, 34 - Math.abs(angNorm) * 1.0);
          const extraX = Math.sign(angNorm) * Math.pow(1 - depth, 1.12) * 64;

          const baseTransform = `translate(-50%, -50%) translateX(${extraX}px) rotateY(${angNorm}deg) translateZ(${radius + zBoost}px) scale(${scale})`;

          const commonStyle: React.CSSProperties = {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: itemWidth,
            transformStyle: "preserve-3d",
            zIndex: zi,
            visibility: "visible",
            pointerEvents: isCenter ? "auto" : "none",
            willChange: "transform, opacity",
            transform: baseTransform,
            transition: reduceMotion
              ? undefined
              : "transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 240ms ease-out",
            contain: "layout paint style",
            // Help the GPU
            backfaceVisibility: "hidden",
          };

          // preload centrale e vicini ±1
          const dist = stepDistance(idx, active, members.length);
          const preload = dist <= 1;
          const highPrio = isCenter;

          if (isCenter) {
            return (
              <div key={idx} style={commonStyle}>
                {/* Preload vicini */}
                {preload && (
                  <>
                    {members.length > 1 && (
                      <link
                        rel="preload"
                        as="image"
                        href={members[(active + 1) % members.length].imageUrl}
                      />
                    )}
                    {members.length > 2 && (
                      <link
                        rel="preload"
                        as="image"
                        href={
                          members[
                            (active - 1 + members.length) % members.length
                          ].imageUrl
                        }
                      />
                    )}
                  </>
                )}

                {/* Inner wrapper applies tilt without reflows */}
                <motion.div style={{ rotateX: tiltX, rotateY: tiltY }}>
                  {/* Ombra */}
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-[calc(100%+10px)] -z-10 h-10 w-44 -translate-x-1/2 rounded-full"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(0,0,0,0.4), transparent)",
                      filter: "blur(14px)",
                      opacity: 0.85,
                      transform: "scale(1.2)",
                    }}
                  />

                  <button
                    aria-label={`${m.name}, card attiva`}
                    onPointerMove={onPointerMoveCenter}
                    onPointerLeave={resetTilt}
                    onClick={() => setActive(idx)}
                    className={`group relative block rounded-2xl border border-white/10 bg-transparent p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ring-1 ring-white/10 shadow-[0_28px_120px_-24px_rgba(56,189,248,0.45)]`}
                  >
                    <div
                      className="w-[--w]"
                      style={{ ["--w" as any]: `${itemWidth - 8}px` }}
                    >
                      <MemoTeamMembersCard
                        imageUrl={m.imageUrl}
                        name={m.name}
                        role={m.role}
                        description={m.description ?? ""}
                        interactive
                        muted={false}
                        // 👇 hint caricamento immagine
                        priority={highPrio}
                        loading={preload ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </div>
                  </button>
                </motion.div>
              </div>
            );
          }

          return (
            <div key={idx} style={commonStyle}>
              {/* Ombra */}
              <div
                aria-hidden
                className="absolute left-1/2 top-[calc(100%+10px)] -z-10 h-10 w-44 -translate-x-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(0,0,0,0.35), transparent)",
                  filter: "blur(14px)",
                  opacity: 0.45,
                  transform: "scale(0.95)",
                }}
              />
              <button
                aria-label={`Vai a ${m.name}`}
                onClick={() => setActive(idx)}
                className={`relative block rounded-2xl border border-white/10 bg-transparent p-1 opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60`}
              >
                <div
                  className="w-[--w]"
                  style={{ ["--w" as any]: `${itemWidth - 8}px` }}
                >
                  <MemoTeamMembersCard
                    imageUrl={m.imageUrl}
                    name={m.name}
                    role={m.role}
                    description={m.description ?? ""}
                    interactive={false}
                    muted
                    // 👇 hint caricamento immagine
                    priority={highPrio}
                    loading={preload ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              </button>
            </div>
          );
        })}

        {/* FRECCE */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-50 flex items-center justify-between px-2">
          <button
            aria-label="Precedente"
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-white shadow-[0_16px_60px_rgba(0,0,0,0.65)] ring-1 ring-white/20 backdrop-blur-xl transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            onClick={() => go("prev")}
          >
            <ChevronLeft className="h-7 w-7" strokeWidth={3} />
          </button>
          <button
            aria-label="Successivo"
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-white shadow-[0_16px_60px_rgba(0,0,0,0.65)] ring-1 ring-white/20 backdrop-blur-xl transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            onClick={() => go("next")}
          >
            <ChevronRight className="h-7 w-7" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* THUMB RAIL (no progress bar, memoized) */}
      <MemoThumbRail
        members={members}
        active={active}
        onSelect={(i) => {
          setActive(i);
          resetTilt();
        }}
      />

      <style jsx>{`
        @keyframes floatPulse {
          0% {
            transform: scale(0.96);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.04);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.96);
            opacity: 0.45;
          }
        }
        .animate-floatPulse {
          animation: floatPulse 3.6s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}

const MemoTeamMembersCard = memo(TeamMembersCard as React.FC<any>);

function ThumbRail({
  members,
  active,
  onSelect,
}: {
  members: Member[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="mt-6 flex w-full items-center justify-center">
      <div className="flex max-w-3xl flex-wrap items-center justify-center gap-3 px-2">
        {members.map((m, i) => {
          const is = i === active;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-white/20 transition ${is ? "scale-110 ring-cyan-300/60 shadow-[0_0_30px_-6px_rgba(34,211,238,0.55)]" : "opacity-80 hover:opacity-100"}`}
              aria-label={`Vai a ${m.name}`}
              aria-current={is}
              title={m.name}
            >
              <span
                className={`absolute inset-0 bg-cover bg-center ${is ? "saturate-125 contrast-110" : "grayscale"}`}
                style={{ backgroundImage: `url(${m.imageUrl})` }}
              />
              <span
                className={`absolute inset-0 ${is ? "bg-black/0" : "bg-black/5"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MemoThumbRail = memo(ThumbRail);
