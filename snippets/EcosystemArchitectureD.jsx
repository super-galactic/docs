export const EcosystemArchitectureD = () => {
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Trophy,
  Wrench,
  User,
  Store,
  Bell,
  Layers3,
  Link2,
  Coins,
  ShieldCheck,
} from "lucide-react";

/**
 * LayeredArchitectureDiagram
 * - Vertical layered stack
 * - Soft fade-in from top to bottom on load
 * - On scroll into view OR on click: a single "validated outcome" pulse travels downward
 * - Ends in the On-Chain layer with a green glow
 * - No constant animation, no dashed lines, no looping
 *
 * Tailwind required.
 * framer-motion + lucide-react required.
 */
export default function LayeredArchitectureDiagram() {
  const wrapRef = useRef(null);
  const [runId, setRunId] = useState(0);
  const [inViewTriggered, setInViewTriggered] = useState(false);
  const [endGlow, setEndGlow] = useState(false);

  const layers = useMemo(
    () => [
      {
        key: "gameplay",
        title: "Gameplay Layer",
        tone: "bg-slate-950/70",
        border: "border-slate-400/15",
        glow: "shadow-[0_0_0_1px_rgba(148,163,184,0.10),0_10px_30px_rgba(0,0,0,0.45)]",
        chip: "bg-slate-400/10 text-slate-200",
        iconRow: [
          { Icon: Gamepad2, label: "Combat" },
          { Icon: Trophy, label: "Leaderboards" },
          { Icon: Wrench, label: "Upgrades" },
        ],
      },
      {
        key: "app",
        title: "Application Layer",
        tone: "bg-blue-950/55",
        border: "border-blue-300/15",
        glow: "shadow-[0_0_0_1px_rgba(59,130,246,0.10),0_10px_30px_rgba(0,0,0,0.45)]",
        chip: "bg-blue-400/10 text-blue-50",
        iconRow: [
          { Icon: User, label: "Accounts" },
          { Icon: Store, label: "Marketplace" },
          { Icon: Bell, label: "Notifications" },
        ],
      },
      {
        key: "onchain",
        title: "On-Chain Settlement Layer",
        tone: "bg-blue-950/80",
        border: "border-blue-200/10",
        glow: "shadow-[0_0_0_1px_rgba(37,99,235,0.10),0_10px_30px_rgba(0,0,0,0.50)]",
        chip: "bg-blue-300/10 text-blue-50",
        iconRow: [
          { Icon: Layers3, label: "NFTs" },
          { Icon: Coins, label: "UAP" },
          { Icon: Link2, label: "Settlement" },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (!wrapRef.current) return;

    const el = wrapRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !inViewTriggered) {
          setInViewTriggered(true);
          triggerPulse();
        }
      },
      { threshold: 0.35 }
    );

    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewTriggered]);

  function triggerPulse() {
    setEndGlow(false);
    setRunId((v) => v + 1);

    // Turn on final green glow near the end of the travel
    window.setTimeout(() => setEndGlow(true), 900);
    // Fade that glow back out
    window.setTimeout(() => setEndGlow(false), 1700);
  }

  return (
    <div className="w-full" ref={wrapRef}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-sm text-slate-200/80">
          Layered system boundaries with single-step settlement confirmation.
        </div>
        <button
          type="button"
          onClick={triggerPulse}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm
                     bg-white/5 hover:bg-white/8 border border-white/10
                     text-slate-100 transition"
          aria-label="Replay validated outcome pulse"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Validate outcome
        </button>
      </div>

      <motion.div
        className="relative rounded-3xl p-4 sm:p-5 bg-black/30 border border-white/10 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Subtle border glow */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.06)]" />

        {/* Travel lane */}
        <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-white/10" />
        <div className="absolute left-1/2 top-6 bottom-6 w-[14px] -translate-x-1/2 rounded-full bg-white/[0.03]" />

        {/* Layers */}
        <div className="relative grid gap-4 sm:gap-5">
          {layers.map((layer, idx) => (
            <motion.div
              key={layer.key}
              className={[
                "relative rounded-2xl border px-4 py-4 sm:px-5 sm:py-5",
                layer.tone,
                layer.border,
                layer.glow,
              ].join(" ")}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: 0.10 + idx * 0.10,
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm sm:text-base font-medium text-slate-50">
                  {layer.title}
                </div>

                <div
                  className={[
                    "rounded-full px-2.5 py-1 text-[11px] sm:text-xs border border-white/10",
                    layer.chip,
                  ].join(" ")}
                >
                  {layer.key === "gameplay" ? "Real time" : layer.key === "app" ? "Coordination" : "Finality"}
                </div>
              </div>

              {/* Minimal icon row */}
              <div className="mt-3 flex flex-wrap gap-2">
                {layer.iconRow.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5
                               bg-white/5 border border-white/10 text-slate-100/90"
                    title={label}
                  >
                    <Icon className="h-4 w-4 opacity-90" />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>

              {/* Connector dots */}
              <div className="absolute left-1/2 -bottom-3 -translate-x-1/2">
                {idx < layers.length - 1 ? (
                  <div className="h-6 w-6 rounded-full bg-black/50 border border-white/10 grid place-items-center">
                    <div className="h-2 w-2 rounded-full bg-white/25" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-black/50 border border-white/10 grid place-items-center">
                    <div className="h-2 w-2 rounded-full bg-emerald-400/40" />
                  </div>
                )}
              </div>

              {/* Final layer green glow on validated outcome */}
              {layer.key === "onchain" && (
                <AnimatePresence>
                  {endGlow && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        boxShadow:
                          "0 0 0 1px rgba(16,185,129,0.30), 0 0 40px rgba(16,185,129,0.18)",
                      }}
                    />
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          ))}
        </div>

        {/* Single pulse traveler */}
        <PulseTraveler runId={runId} />
      </motion.div>

      <div className="mt-2 text-xs text-slate-200/60">
        Tip: scroll into view or click “Validate outcome” to replay the settlement confirmation.
      </div>
    </div>
  );
}

/**
 * PulseTraveler
 * A single pulse that travels downward once per trigger.
 * No looping.
 */
function PulseTraveler({ runId }) {
  // Lane geometry tuned for the container padding and 3-card stack.
  // Travel from near top to near bottom.
  const startY = 18;
  const endY = 430;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={runId}
        className="absolute left-1/2 top-6 -translate-x-1/2"
        initial={{ opacity: 0, y: startY }}
        animate={{ opacity: 1, y: endY }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Pulse body */}
        <div
          className="h-4 w-4 rounded-full"
          style={{
            background: "rgba(16,185,129,0.85)",
            boxShadow:
              "0 0 0 6px rgba(16,185,129,0.12), 0 0 22px rgba(16,185,129,0.32)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
