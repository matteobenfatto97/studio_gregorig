"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
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

export default function TeamMembersList({
  compact = false,
}: {
  compact?: boolean;
}) {
  const members = teamMembers as Member[];

  const [active, setActive] = useState(0);
  const [itemWidth, setItemWidth] = useState(320);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({
    rx: 0,
    ry: 0,
  });

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

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

  // Pause autoplay when off-screen
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setPaused(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      if (e.key === " ") setPaused((p) => !p);
      if (e.key === "Home") setActive(0);
      if (e.key === "End") setActive(members.length - 1);
    },
    [go, members.length]
  );

  // Autoplay
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setInterval(() => go("next"), 4500);
    return () => clearInterval(id);
  }, [paused, reduceMotion, go]);

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
  const press = useRef<{ x: number; at: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    press.current = { x: e.clientX, at: performance.now() };
    setPaused(true);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!press.current) return;
    const dx = e.clientX - press.current.x;
    const dt = Math.max(1, performance.now() - press.current.at);
    const v = dx / dt; // px/ms
    press.current = null;
    setPaused(false);
    const step = Math.round(dx / 160 + v * 6);
    if (step === 0) return;
    setActive(
      (i) => (i - (step % members.length) + members.length) % members.length
    );
    resetTilt();
  };

  const items = useMemo(() => members.map((m, i) => ({ ...m, i })), [members]);

  // Cylinder params
  const baseDeg = Math.max(36, 360 / Math.max(6, members.length));
  const radius = Math.min(itemWidth * 1.42, 460);
  const VISIBLE = 0.02;

  const onPointerMoveCenter = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; // 0..1
    const y = (e.clientY - r.top) / r.height; // 0..1
    setTilt({ ry: lerp(-8, 8, x), rx: lerp(6, -6, y) });
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
        className={`relative mx-auto flex items-center justify-center overflow-visible ${compact ? "h-[420px] sm:h-[460px] md:h-[500px]" : "h-[560px] sm:h-[620px] md:h-[660px]"}`}
        style={{ perspective: "1700px", transformStyle: "preserve-3d" as any }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
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
            transform: `translateZ(${-radius * 0.95}px)`,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[78%] w-[min(86vw,940px)] -translate-x-1/2 -translate-y-1/2 rounded-[80px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.09))",
              maskImage:
                "radial-gradient(120% 100% at 50% 50%, black 35%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(120% 100% at 50% 50%, black 35%, transparent 70%)",
              boxShadow: "inset 0 0 40px rgba(255,255,255,0.06)",
            }}
          />
          <motion.div
            className={`absolute left-1/2 top-1/2 ${compact ? "h-64 w-64" : "h-80 w-80"} -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl`}
            style={{
              background:
                "radial-gradient(closest-side, rgba(56,189,248,0.35), transparent)",
            }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 3.6, repeat: Infinity }}
          />
        </div>

        {/* CARDS */}
        {items.map((m, idx) => {
          const angDeg = (idx - active) * baseDeg;
          const angNorm = normAngle(angDeg);
          const depth = (Math.cos(toRad(angNorm)) + 1) / 2; // 0..1
          const visible = depth > VISIBLE;
          const isCenter = Math.abs(angNorm) <= baseDeg * 0.5;

          const scale = isCenter ? (compact ? 1.1 : 1.18) : 0.9 + depth * 0.18;
          const zi = Math.round(10 + depth * 90);
          const opacity = visible ? (isCenter ? 1 : 0.92) : 0;
          const zBoost = Math.max(0, 34 - Math.abs(angNorm) * 1.0);
          const extraX = Math.sign(angNorm) * Math.pow(1 - depth, 1.12) * 64;

          return (
            <motion.div
              key={idx}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: itemWidth,
                transformStyle: "preserve-3d",
                zIndex: zi,
                visibility: visible ? "visible" : "hidden",
                pointerEvents: isCenter ? "auto" : "none",
                willChange: "transform",
              }}
              animate={{
                rotateY: angNorm,
                rotateX: isCenter ? tilt.rx : 0,
                scale,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 18,
                mass: 0.7,
              }}
              transformTemplate={({ rotateX, rotateY, scale }) =>
                `translate(-50%, -50%) translateX(${extraX}px) rotateY(${rotateY}) translateZ(${radius + zBoost}px) rotateX(${rotateX}) scale(${scale})`
              }
            >
              {/* Ombra */}
              {visible && (
                <div
                  aria-hidden
                  className="absolute left-1/2 top-[calc(100%+10px)] -z-10 h-10 w-44 -translate-x-1/2 rounded-full"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(0,0,0,0.45), transparent)",
                    filter: "blur(16px)",
                    opacity: isCenter ? 0.85 : 0.45,
                    transform: `scale(${isCenter ? 1.25 : 0.95})`,
                  }}
                />
              )}

              {/* Card */}
              <button
                aria-label={
                  isCenter ? `${m.name}, card attiva` : `Vai a ${m.name}`
                }
                onClick={() => setActive(idx)}
                onPointerMove={isCenter ? onPointerMoveCenter : undefined}
                onPointerLeave={isCenter ? resetTilt : undefined}
                className={`${isCenter ? "group" : ""} relative block rounded-2xl border border-white/10 bg-transparent p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${isCenter ? "ring-1 ring-white/10 shadow-[0_36px_180px_-24px_rgba(56,189,248,0.55)]" : "opacity-95"}`}
              >
                <div
                  className="w-[--w]"
                  style={{ ["--w" as any]: `${itemWidth - 8}px` }}
                >
                  <TeamMembersCard
                    imageUrl={m.imageUrl}
                    name={m.name}
                    role={m.role}
                    description={m.description ?? ""}
                    interactive={isCenter}
                    muted={!isCenter}
                  />
                </div>
              </button>
            </motion.div>
          );
        })}

        {/* FRECCE */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-50 flex items-center justify-between px-2">
          <motion.button
            aria-label="Precedente"
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-white shadow-[0_16px_60px_rgba(0,0,0,0.65)] ring-1 ring-white/20 backdrop-blur-xl transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            whileHover={{ x: -2 }}
            onClick={() => go("prev")}
          >
            <ChevronLeft className="h-7 w-7" strokeWidth={3} />
          </motion.button>
          <motion.button
            aria-label="Successivo"
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-white shadow-[0_16px_60px_rgba(0,0,0,0.65)] ring-1 ring-white/20 backdrop-blur-xl transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            whileHover={{ x: 2 }}
            onClick={() => go("next")}
          >
            <ChevronRight className="h-7 w-7" strokeWidth={3} />
          </motion.button>
        </div>
      </div>

      {/* THUMB RAIL */}
      <ThumbRail
        members={members}
        active={active}
        onSelect={(i) => {
          setActive(i);
          resetTilt();
        }}
        paused={paused || !!reduceMotion}
      />
    </section>
  );
}

function ThumbRail({
  members,
  active,
  onSelect,
  paused,
}: {
  members: Member[];
  active: number;
  onSelect: (i: number) => void;
  paused: boolean;
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
              {is && (
                <span
                  key={`${i}-${paused ? "paused" : "play"}`}
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-cyan-300 to-fuchsia-400"
                  style={{
                    animation: paused ? "none" : "rail 4.5s linear forwards",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes rail {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
