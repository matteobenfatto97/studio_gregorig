// components/lists/TeamMembersList.tsx
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
import type { StaticImageData } from "next/image";
// ✅ import relativo: niente più TS2307
import { teamMembers } from "@/data/teamMembers";
import TeamMembersCard from "../TeamMemberCard";

interface Member {
  imageUrl: string | StaticImageData;
  name: string;
  role: string;
  description?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const normAngle = (deg: number) => ((deg + 540) % 360) - 180;

export default function TeamMembersList({
  compact = false,
  windowSize = 7,
}: {
  compact?: boolean;
  windowSize?: number;
}) {
  const members = teamMembers as Member[];

  const [active, setActive] = useState(0);

  // ⬇️ card più piccole
  const [itemWidth, setItemWidth] = useState(280);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Geometry
  const baseDeg = Math.max(36, 360 / Math.max(6, members.length));
  const radius = Math.min(itemWidth * 1.25, 420);

  // Tilt (center card only)
  const mvTiltX = useMotionValue(0);
  const mvTiltY = useMotionValue(0);
  const tiltX = useSpring(mvTiltX, { stiffness: 140, damping: 18, mass: 0.6 });
  const tiltY = useSpring(mvTiltY, { stiffness: 140, damping: 18, mass: 0.6 });

  const resetTilt = () => {
    mvTiltX.stop();
    mvTiltY.stop();
    mvTiltX.set(0);
    mvTiltY.set(0);
  };

  // Resize → calcolo larghezza card (più conservativo)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      const ideal = w / (compact ? 3.6 : 3.8);
      setItemWidth(clamp(ideal, compact ? 180 : 200, compact ? 280 : 320));
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

  // Drag inertia
  const dragRef = useRef<{ x: number; at: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-nodrag]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, at: performance.now() };
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dt = Math.max(1, performance.now() - dragRef.current.at);
    const v = dx / dt; // px/ms
    dragRef.current = null;
    const step = Math.round(dx / 160 + v * 6);
    if (step === 0) return;
    setActive(
      (i) => (i - (step % members.length) + members.length) % members.length
    );
    resetTilt();
  };

  const items = useMemo(() => members.map((m, i) => ({ ...m, i })), [members]);

  // Virtualization window
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

  const stepDistance = (from: number, to: number, len: number) => {
    const raw = Math.abs(from - to);
    return Math.min(raw, len - raw);
  };

  // Tilt pointer move
  const onPointerMoveCenter = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion) return;
    const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
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
        className={`${
          compact
            ? "h-[clamp(300px,40svh,460px)]"
            : "h-[clamp(360px,50svh,540px)]"
        } relative mx-auto flex items-center justify-center overflow-visible`}
        style={{ perspective: "1700px", transformStyle: "preserve-3d" as any }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* BACKDROP */}
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
        </div>

        {/* CARDS */}
        {virtualIndices.map((idx) => {
          const m = items[idx];
          const angDeg = (idx - active) * baseDeg;
          const angNorm = normAngle(angDeg);
          const depth = (Math.cos(toRad(angNorm)) + 1) / 2; // 0..1
          const isCenter = idx === active;

          // ⬇️ scale più sobria
          const scale = isCenter
            ? compact
              ? 1.06
              : 1.08
            : 0.86 + depth * 0.16;
          const zi = Math.round(10 + depth * 90);
          const zBoost = Math.max(0, 28 - Math.abs(angNorm) * 1.0);
          const extraX = Math.sign(angNorm) * Math.pow(1 - depth, 1.12) * 44;

          const baseTransform = `translate(-50%, -50%) translateX(${extraX}px) rotateY(${angNorm}deg) translateZ(${radius + zBoost}px) scale(${scale})`;

          const commonStyle: React.CSSProperties = {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: itemWidth,
            transformStyle: "preserve-3d",
            zIndex: zi,
            visibility: "visible",
            pointerEvents: "auto",
            willChange: "transform, opacity",
            transform: baseTransform,
            transition: reduceMotion
              ? undefined
              : "transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 240ms ease-out",
            contain: "layout paint style",
            backfaceVisibility: "hidden",
          };

          const dist = stepDistance(idx, active, members.length);
          const eager = dist <= half;

          if (isCenter) {
            return (
              <div key={idx} style={commonStyle}>
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
                      transform: "scale(1.1)",
                    }}
                  />
                  <button
                    aria-label={`${m.name}, card attiva`}
                    onPointerMove={onPointerMoveCenter}
                    onPointerLeave={resetTilt}
                    onClick={() => go("next")}
                    className="group relative block rounded-2xl border border-white/10 bg-transparent p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ring-1 ring-white/10 shadow-[0_28px_120px_-24px_rgba(56,189,248,0.45)]"
                  >
                    <div
                      className="w-[--w]"
                      style={{ ["--w" as any]: `${itemWidth - 8}px` }}
                    >
                      {/* CARD CENTRALE */}
                      <MemoTeamMembersCard
                        imageUrl={m.imageUrl as any}
                        name={m.name}
                        role={m.role}
                        description={m.description ?? ""}
                        interactive
                        muted={false}
                      />
                    </div>
                  </button>
                </motion.div>
              </div>
            );
          }

          // Lateral cards
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
                  transform: "scale(0.9)",
                }}
              />
              <button
                aria-label={`Vai a ${m.name}`}
                onClick={() => setActive(idx)}
                className="relative block rounded-2xl border border-white/10 bg-transparent p-1 opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <div
                  className="w-[--w]"
                  style={{ ["--w" as any]: `${itemWidth - 8}px` }}
                >
                  {/* CARTE LATERALI */}
                  <MemoTeamMembersCard
                    imageUrl={m.imageUrl as any}
                    name={m.name}
                    role={m.role}
                    description={m.description ?? ""}
                    interactive={false}
                    muted
                  />
                </div>
              </button>
            </div>
          );
        })}

        {/* FRECCE */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 right-0 z-[200] flex items-center justify-between px-2"
          data-nodrag
        >
          <button
            aria-label="Precedente"
            className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-white shadow-[0_16px_60px_rgba(0,0,0,0.65)] ring-1 ring-white/20 backdrop-blur-xl transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            onClick={() => go("prev")}
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={3} />
          </button>
          <button
            aria-label="Successivo"
            className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-white shadow-[0_16px_60px_rgba(0,0,0,0.65)] ring-1 ring-white/20 backdrop-blur-xl transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            onClick={() => go("next")}
          >
            <ChevronRight className="h-6 w-6" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* THUMB RAIL */}
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
    <div className="mt-6 flex w-full items-center justify-center" data-nodrag>
      <div className="flex max-w-3xl flex-wrap items-center justify-center gap-3 px-2">
        {members.map((m, i) => {
          const is = i === active;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/20 transition ${
                is
                  ? "scale-110 ring-cyan-300/60 shadow-[0_0_30px_-6px_rgba(34,211,238,0.55)]"
                  : "opacity-80 hover:opacity-100"
              }`}
              aria-label={`Vai a ${m.name}`}
              aria-current={is}
              title={m.name}
            >
              <span
                className={`absolute inset-0 bg-cover bg-center ${
                  is ? "saturate-125 contrast-110" : "grayscale"
                }`}
                style={{
                  backgroundImage:
                    typeof m.imageUrl === "string"
                      ? `url(${m.imageUrl})`
                      : `url(${(m.imageUrl as any).src})`,
                }}
              />
              <span
                className={`absolute inset-0 ${
                  is ? "bg-black/0" : "bg-black/5"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MemoThumbRail = memo(ThumbRail);
