export const EcosystemArchitectureD = () => {
  const React = require("react");
  const { useEffect, useMemo, useRef, useState } = React;

  const { motion, AnimatePresence } = require("framer-motion");
  const {
    Swords,
    BarChart3,
    Wrench,
    Activity,
    User,
    Boxes,
    BadgeCheck,
    FlaskConical,
    Store,
    Coins,
    Layers3,
    Flame,
    ShieldCheck,
    Link2,
  } = require("lucide-react");

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
        glow:
          "shadow-[0_0_0_1px_rgba(148,163,184,0.10),0_10px_30px_rgba(0,0,0,0.45)]",
        iconRow: [
          { Icon: Swords, label: "Missions and Combat" },
          { Icon: BarChart3, label: "Match Results and Stats" },
          { Icon: Wrench, label: "Progression and Upgrades" },
          { Icon: Coins, label: "Reward Earning" },
          { Icon: Activity, label: "Gameplay Activity" },
        ],
      },
      {
        key: "app",
        title: "Application Layer",
        tone: "bg-blue-950/55",
        border: "border-blue-300/15",
        glow:
          "shadow-[0_0_0_1px_rgba(59,130,246,0.10),0_10px_30px_rgba(0,0,0,0.45)]",
        iconRow: [
          { Icon: User, label: "User Account" },
          { Icon: Boxes, label: "Inventory and Assets" },
          { Icon: BadgeCheck, label: "Validation and Claims" },
          { Icon: FlaskConical, label: "Breeding" },
          { Icon: Store, label: "Marketplace Transactions" },
        ],
      },
      {
        key: "onchain",
        title: "On-Chain Settlement Layer",
        tone: "bg-blue-950/80",
        border: "border-blue-200/10",
        glow:
          "shadow-[0_0_0_1px_rgba(37,99,235,0.10),0_10px_30px_rgba(0,0,0,0.50)]",
        iconRow: [
          { Icon: Coins, label: "UAP Token" },
          { Icon: Layers3, label: "NFT Ownership" },
          { Icon: Flame, label: "Burn and Treasury Flows" },
          { Icon: ShieldCheck, label: "Supply Controls" },
          { Icon: Link2, label: "Transaction Verification" },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (!wrapRef.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inViewTriggered) {
          setInViewTriggered(true);
          triggerPulse();
        }
      },
      { threshold: 0.35 }
    );

    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, [inViewTriggered]);

  const triggerPulse = () => {
    setEndGlow(false);
    setRunId((v) => v + 1);
    setTimeout(() => setEndGlow(true), 900);
    setTimeout(() => setEndGlow(false), 1700);
  };

  const PulseTraveler = ({ runId }) => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={runId}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: 24 }}
          initial={{ opacity: 0, top: 24 }}
          animate={{ opacity: 1, top: "calc(100% - 28px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
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
  };

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
        <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.06)]" />

        <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-white/10" />

        <div className="relative grid gap-4 sm:gap-5">
          {layers.map((layer, idx) => (
            <motion.div
              key={layer.key}
              className={`relative rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 ${layer.tone} ${layer.border} ${layer.glow}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: 0.1 + idx * 0.1,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm sm:text-base font-medium text-slate-50">
                  {layer.title}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {layer.iconRow.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5
                               bg-white/5 border border-white/10 text-slate-100/90"
                  >
                    <Icon className="h-4 w-4 opacity-90" />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>

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

        <PulseTraveler runId={runId} />
      </motion.div>
    </div>
  );
};
