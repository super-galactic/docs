export const EcosystemArchitectureD = () => {
  const React = require("react");
  const { useEffect, useMemo, useRef, useState } = React;
  const { motion } = require("framer-motion");

  const wrapRef = useRef(null);
  const [hasFadedIn, setHasFadedIn] = useState(false);
  const [pulseRunId, setPulseRunId] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);

  const layers = useMemo(
    () => [
      {
        key: "gameplay",
        title: "Gameplay Layer",
        subtitle: "Real-time play and outcome generation",
        tone: "bg-slate-950/70",
        border: "border-slate-400/15",
        chipTone: "bg-slate-900/70 text-slate-200 border-slate-300/10",
        chips: ["Combat", "Progression", "Leaderboards"],
        note: "Generates outcomes only. No wallets, tokens, minting, or settlement.",
      },
      {
        key: "app",
        title: "Application Layer (Super Galactic Hub)",
        subtitle: "Coordination and orchestration",
        tone: "bg-blue-950/55",
        border: "border-blue-300/15",
        chipTone: "bg-blue-950/55 text-blue-100 border-blue-200/10",
        chips: ["Accounts", "Marketplace", "Asset Management"],
        note: "Coordinates user intent. Claims and upgrade initiation happen here.",
      },
      {
        key: "finality",
        title: "On-Chain Finality Layer",
        subtitle: "Irreversible economic and ownership state",
        tone: "bg-[#071428]/70",
        border: "border-blue-200/12",
        chipTone: "bg-[#071428]/70 text-blue-100 border-blue-200/10",
        chips: ["NFTs", "UAP", "Finality"],
        note: "Ownership, balances, burns, and irreversible settlement.",
      },
    ],
    []
  );

  // Soft fade-in from top to bottom when the diagram scrolls into view
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) setHasFadedIn(true);
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const triggerPulse = () => {
    // prevent stacking pulses
    if (pulseActive) return;
    setPulseActive(true);
    setPulseRunId((x) => x + 1);
    // pulse ends after animation duration
    setTimeout(() => setPulseActive(false), 1700);
  };

  const LayerCard = ({ layer, index }) => {
    const delay = 0.12 * index;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={hasFadedIn ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: "easeOut", delay }}
        className={[
          "relative rounded-2xl border px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
          layer.tone,
          layer.border,
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-100">
              {layer.title}
            </div>
            <div className="mt-1 text-xs text-slate-300/90">
              {layer.subtitle}
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-white/10 bg-black/20 px-2 py-1 text-[10px] text-slate-200/90">
            {index === 0 ? "Gameplay" : index === 1 ? "Coordination" : "Finality"}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {layer.chips.map((chip) => (
            <span
              key={chip}
              className={[
                "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                layer.chipTone,
              ].join(" ")}
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-3 text-[11px] leading-relaxed text-slate-300/90">
          {layer.note}
        </div>

        {/* subtle edge glow (non-animated) */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]" />
      </motion.div>
    );
  };

  return (
    <div ref={wrapRef} className="w-full">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-100">
              Layered Architecture
            </div>
            <div className="mt-1 text-xs text-slate-300/90">
              Gameplay → Coordination → Finality
            </div>
          </div>

          <button
            type="button"
            onClick={triggerPulse}
            className={[
              "inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold",
              "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
              "focus:outline-none focus:ring-2 focus:ring-green-500/40",
            ].join(" ")}
          >
            Trigger validated outcome pulse
          </button>
        </div>

        {/* Diagram */}
        <div className="relative mt-5">
          {/* Vertical spine */}
          <div className="absolute left-6 top-0 h-full w-px bg-white/10" />

          {/* Pulse (only on user action) */}
          {pulseRunId > 0 && (
            <motion.div
              key={`pulse-${pulseRunId}`}
              className="absolute left-6 top-0 h-full w-px"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.01 }}
            >
              {/* traveling dot */}
              <motion.div
                className="absolute -left-[7px] top-0 h-4 w-4 rounded-full bg-green-500 shadow-[0_0_0_6px_rgba(34,197,94,0.18)]"
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: "100%", opacity: 1 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
              />
              {/* faint green trace that appears during travel */}
              <motion.div
                className="absolute left-0 top-0 h-full w-px bg-green-500/40"
                initial={{ scaleY: 0, transformOrigin: "top" }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
              />
            </motion.div>
          )}

          <div className="grid gap-4">
            <div className="relative pl-12">
              <LayerCard layer={layers[0]} index={0} />
            </div>

            <div className="relative pl-12">
              <LayerCard layer={layers[1]} index={1} />
            </div>

            <div className="relative pl-12">
              <motion.div
                initial={false}
                animate={
                  pulseActive
                    ? {
                        boxShadow:
                          "0 0 0 1px rgba(34,197,94,0.35), 0 0 28px rgba(34,197,94,0.18)",
                      }
                    : { boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
                }
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="rounded-2xl"
              >
                <LayerCard layer={layers[2]} index={2} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Discipline note */}
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-[11px] leading-relaxed text-slate-300/90">
          This diagram is intentionally scoped to system boundaries only: outcomes
          are generated in gameplay, coordinated in the hub, and finalized on-chain.
          :contentReference[oaicite:0]{index=0}
        </div>
      </div>
    </div>
  );
};
