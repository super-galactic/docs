export const PlayerUAPCirculationPath = ({ showCaption = false }) => {
  const { motion } = require("framer-motion");

  const [activeStep, setActiveStep] = React.useState(-1); // 0..4
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timerRef = React.useRef(null);
  const wrapRef = React.useRef(null);

  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    chipText: "rgba(255,255,255,0.86)",
    chipBg: "rgba(0,0,0,0.18)",
    line: "rgba(255,255,255,0.18)",
    lineStrong: "rgba(255,255,255,0.30)",

    layerTop: "rgba(4, 14, 34, 0.78)",
    layerBottom: "rgba(0, 0, 0, 0.28)",
    layerRadialA: "rgba(37, 99, 235, 0.10)",
    layerRadialB: "rgba(15, 23, 42, 0.18)",

    ctaText: "rgba(255,255,255,0.78)",
    ctaBg: "rgba(0,0,0,0.20)",

    activeGlow: "0 0 0 1px rgba(34,197,94,0.22), 0 0 18px rgba(34,197,94,0.18)",
  };

  const data = {
    title: "Player-facing UAP circulation path",
    subtitle: "Gameplay → Rewards → Wallet → Sinks → Burn",
    nodes: [
      { step: "1", title: "Gameplay Activity", sub: "Outcome generation" },
      { step: "2", title: "Reward Generation", sub: "Reward calculation" },
      { step: "3", title: "Player Wallet", sub: "Claimed balance" },
      { step: "4", title: "Token Sinks", sub: "Progression spend" },
    ],
    terminal: { step: "5", title: "Burn", sub: "Irreversible supply reduction" },
    labels: ["Reward issuance (capped)", "Claimable rewards", "Voluntary spend", "Automated burn execution"],
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startPlay = () => {
    clearTimer();
    setIsPlaying(true);
    setActiveStep(0);

    timerRef.current = setInterval(() => {
      setActiveStep((s) => {
        const next = s + 1;
        if (next >= 5) {
          clearTimer();
          setIsPlaying(false);
          return 4; // stop on final
        }
        return next;
      });
    }, 820);
  };

  React.useEffect(() => {
    return () => clearTimer();
  }, []);

  const isNodeActive = (idx) => activeStep === idx;
  const isConnectorActive = (idx) => activeStep === idx; // connector idx matches outgoing from node idx

  const Chip = ({ text, terminal, active }) => (
    <motion.div
      animate={{
        boxShadow: active ? colors.activeGlow : "none",
        borderColor: terminal ? (active ? "rgba(34,197,94,0.40)" : "rgba(34,197,94,0.26)") : colors.border,
        opacity: activeStep === -1 ? 1 : active ? 1 : 0.45,
      }}
      transition={{ duration: 0.22 }}
      style={{
        fontSize: 11,
        fontWeight: 800,
        color: terminal ? "rgba(34,197,94,0.92)" : colors.chipText,
        border: `1px solid ${terminal ? "rgba(34,197,94,0.26)" : colors.border}`,
        background: "rgba(0,0,0,0.22)",
        padding: "6px 10px",
        borderRadius: 12,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </motion.div>
  );

  const StepBadge = ({ step, terminal, active }) => (
    <motion.div
      animate={{
        boxShadow: active ? colors.activeGlow : "none",
        opacity: activeStep === -1 ? 1 : active ? 1 : 0.45,
        scale: active ? 1.02 : 1,
      }}
      transition={{ duration: 0.22 }}
      style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        display: "grid",
        placeItems: "center",
        fontSize: 12,
        fontWeight: 900,
        color: terminal ? "rgba(34,197,94,0.92)" : colors.text,
        border: `1px solid ${terminal ? "rgba(34,197,94,0.26)" : colors.border}`,
        background: terminal ? "rgba(34,197,94,0.10)" : "rgba(0,0,0,0.22)",
        flex: "0 0 auto",
      }}
    >
      {step}
    </motion.div>
  );

  const NodeCard = ({ step, title, sub, rightTag, terminal, active, onClick }) => (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Jump to step ${step}: ${title}`}
      animate={{
        opacity: activeStep === -1 ? 1 : active ? 1 : 0.42,
        boxShadow: active ? colors.activeGlow : "none",
        scale: active ? 1.01 : 1,
      }}
      transition={{ duration: 0.22 }}
      style={{
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        borderRadius: 18,
        border: `1px solid ${terminal ? "rgba(34,197,94,0.22)" : colors.border}`,
        background: `linear-gradient(180deg, ${colors.layerTop} 0%, ${colors.layerBottom} 100%)`,
        padding: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.55,
          background: `radial-gradient(80% 120% at 20% 0%, ${colors.layerRadialA} 0%, rgba(0,0,0,0) 60%),
                       radial-gradient(70% 120% at 80% 0%, ${colors.layerRadialB} 0%, rgba(0,0,0,0) 55%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <StepBadge step={step} terminal={terminal} active={active} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{title}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>{sub}</div>
          </div>
        </div>

        {rightTag ? (
          <motion.div
            animate={{
              opacity: activeStep === -1 ? 1 : active ? 1 : 0.45,
              boxShadow: active ? colors.activeGlow : "none",
            }}
            transition={{ duration: 0.22 }}
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: terminal ? "rgba(34,197,94,0.92)" : "rgba(255,255,255,0.76)",
              border: `1px solid ${terminal ? "rgba(34,197,94,0.26)" : colors.border}`,
              background: "rgba(0,0,0,0.20)",
              padding: "6px 10px",
              borderRadius: 12,
              whiteSpace: "nowrap",
            }}
          >
            {rightTag}
          </motion.div>
        ) : null}
      </div>
    </motion.button>
  );

  const VerticalConnector = ({ label, active }) => (
    <div
      style={{
        position: "relative",
        height: 56,
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "78px 1fr 280px",
        gap: 14,
      }}
    >
      <div style={{ position: "relative", height: 56 }}>
        <motion.div
          animate={{
            background: active ? "rgba(34,197,94,0.22)" : colors.line,
            boxShadow: active ? colors.activeGlow : "none",
            opacity: activeStep === -1 ? 1 : active ? 1 : 0.35,
          }}
          transition={{ duration: 0.22 }}
          style={{
            position: "absolute",
            left: 34,
            top: 6,
            bottom: 6,
            width: 2,
            borderRadius: 999,
          }}
        />
        <motion.div
          animate={{
            opacity: activeStep === -1 ? 1 : active ? 1 : 0.35,
            filter: active ? "drop-shadow(0 0 10px rgba(34,197,94,0.18))" : "none",
          }}
          transition={{ duration: 0.22 }}
          style={{
            position: "absolute",
            left: 27,
            top: "50%",
            transform: "translateY(-30%)",
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: `14px solid rgba(226,232,240,0.92)`,
          }}
        />
      </div>

      <div />

      <div style={{ justifySelf: "center" }}>
        <Chip text={label} active={active} />
      </div>
    </div>
  );

  const BurnConnector = ({ label, active }) => {
    return (
      <div className="md:relative">
        <div className="hidden md:block" style={{ position: "absolute", left: -210, top: 22, width: 210, height: 150, pointerEvents: "none" }}>
          <svg width="210" height="150" viewBox="0 0 210 150" style={{ overflow: "visible" }}>
            <motion.path
              d="M 0 34 L 118 34 L 118 112 L 210 112"
              fill="none"
              stroke={active ? "rgba(34,197,94,0.22)" : colors.lineStrong}
              strokeWidth="2.6"
              strokeLinecap="round"
              animate={{
                opacity: activeStep === -1 ? 1 : active ? 1 : 0.32,
                filter: active ? "drop-shadow(0 0 10px rgba(34,197,94,0.18))" : "none",
              }}
              transition={{ duration: 0.22 }}
            />
            <motion.path
              d="M 210 112 L 196 104 L 196 120 Z"
              fill="rgba(226,232,240,0.92)"
              animate={{ opacity: activeStep === -1 ? 1 : active ? 1 : 0.32 }}
              transition={{ duration: 0.22 }}
            />
          </svg>
        </div>

        <div className="hidden md:flex" style={{ justifyContent: "center", marginBottom: 10 }}>
          <Chip text={label} terminal active={active} />
        </div>

        <div className="md:hidden" style={{ marginBottom: 10 }}>
          <VerticalConnector label={label} active={active} />
        </div>
      </div>
    );
  };

  const jumpTo = (stepIdx) => {
    clearTimer();
    setIsPlaying(false);
    setActiveStep(stepIdx);
  };

  const playOrRestart = () => {
    startPlay();
  };

  return (
    <div className="not-prose" ref={wrapRef}>
      <div
        style={{
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          background: colors.panelOuter,
          padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{data.title}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>{data.subtitle}</div>
          </div>

          <button
            type="button"
            onClick={playOrRestart}
            aria-label="Play player circulation sequence"
            style={{
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 800,
              color: colors.ctaText,
              border: `1px solid ${colors.border}`,
              background: colors.ctaBg,
              padding: "8px 10px",
              borderRadius: 12,
              whiteSpace: "nowrap",
            }}
          >
            Player circulation
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <div
            style={{
              borderRadius: 18,
              border: `1px solid ${colors.border}`,
              background: `linear-gradient(180deg, ${colors.layerTop} 0%, ${colors.layerBottom} 100%)`,
              padding: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.55,
                background: `radial-gradient(80% 120% at 20% 0%, ${colors.layerRadialA} 0%, rgba(0,0,0,0) 60%),
                             radial-gradient(70% 120% at 80% 0%, ${colors.layerRadialB} 0%, rgba(0,0,0,0) 55%)`,
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
              <NodeCard
                {...data.nodes[0]}
                active={isNodeActive(0)}
                onClick={() => jumpTo(0)}
              />
              <VerticalConnector label={data.labels[0]} active={isConnectorActive(0)} />

              <NodeCard
                {...data.nodes[1]}
                active={isNodeActive(1)}
                onClick={() => jumpTo(1)}
              />
              <VerticalConnector label={data.labels[1]} active={isConnectorActive(1)} />

              <NodeCard
                {...data.nodes[2]}
                active={isNodeActive(2)}
                onClick={() => jumpTo(2)}
              />
              <VerticalConnector label={data.labels[2]} active={isConnectorActive(2)} />

              <NodeCard
                {...data.nodes[3]}
                active={isNodeActive(3)}
                onClick={() => jumpTo(3)}
              />

              <div style={{ marginTop: 14 }} className="grid gap-10 md:grid-cols-[1fr,1.55fr] md:items-start">
                <div />

                <div>
                  <BurnConnector label={data.labels[3]} active={isConnectorActive(4)} />

                  {/* Add a vertical arrow into Burn (always visible on md+, and already present on mobile) */}
                  <div className="hidden md:block" style={{ marginTop: 8, marginBottom: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "78px 1fr 280px", alignItems: "center" }}>
                      <div style={{ position: "relative", height: 56 }}>
                        <motion.div
                          animate={{
                            background: isConnectorActive(4) ? "rgba(34,197,94,0.22)" : colors.line,
                            boxShadow: isConnectorActive(4) ? colors.activeGlow : "none",
                            opacity: activeStep === -1 ? 1 : isConnectorActive(4) ? 1 : 0.35,
                          }}
                          transition={{ duration: 0.22 }}
                          style={{
                            position: "absolute",
                            left: 34,
                            top: 6,
                            bottom: 6,
                            width: 2,
                            borderRadius: 999,
                          }}
                        />
                        <motion.div
                          animate={{
                            opacity: activeStep === -1 ? 1 : isConnectorActive(4) ? 1 : 0.35,
                            filter: isConnectorActive(4) ? "drop-shadow(0 0 10px rgba(34,197,94,0.18))" : "none",
                          }}
                          transition={{ duration: 0.22 }}
                          style={{
                            position: "absolute",
                            left: 27,
                            top: "50%",
                            transform: "translateY(-30%)",
                            width: 0,
                            height: 0,
                            borderLeft: "9px solid transparent",
                            borderRight: "9px solid transparent",
                            borderTop: `14px solid rgba(226,232,240,0.92)`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <NodeCard
                    step={data.terminal.step}
                    title={data.terminal.title}
                    sub={data.terminal.sub}
                    rightTag="Terminal"
                    terminal
                    active={isNodeActive(4)}
                    onClick={() => jumpTo(4)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showCaption ? (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            Player-facing UAP circulation path.
          </div>
        ) : null}
      </div>
    </div>
  );
};
