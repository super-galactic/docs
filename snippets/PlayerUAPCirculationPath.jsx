export const PlayerUAPCirculationPath = ({ showCaption = false }) => {
  const wrapRef = React.useRef(null);
  const timerRef = React.useRef(null);

  const [activeStep, setActiveStep] = React.useState(-1); // -1 idle, 0..4
  const [isPlaying, setIsPlaying] = React.useState(false);

  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    chipText: "rgba(255,255,255,0.86)",
    chipBg: "rgba(0,0,0,0.18)",
    line: "rgba(255,255,255,0.18)",
    lineStrong: "rgba(255,255,255,0.24)",

    layerTop: "rgba(4, 14, 34, 0.78)",
    layerBottom: "rgba(0, 0, 0, 0.28)",
    layerRadialA: "rgba(37, 99, 235, 0.10)",
    layerRadialB: "rgba(15, 23, 42, 0.18)",

    ctaText: "rgba(255,255,255,0.78)",
    ctaBg: "rgba(0,0,0,0.20)",
  };

  const data = {
    title: "Player-facing UAP circulation path",
    subtitle: "Gameplay → Rewards → Wallet → Sinks → Burn",
    nodes: [
      { step: "1", title: "Gameplay Activity", sub: "Outcome generation" },
      { step: "2", title: "Reward Generation", sub: "Reward calculation" },
      { step: "3", title: "Player Wallet", sub: "Claimed balance" },
      { step: "4", title: "Token Sinks", sub: "Progression spend" },
      { step: "5", title: "Burn", sub: "Irreversible supply reduction", terminal: true },
    ],
    labels: ["Reward issuance (capped)", "Claimable rewards", "Voluntary spend", "Automated burn execution"],
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => clearTimer();
  }, []);

  const play = () => {
    clearTimer();
    setIsPlaying(true);
    setActiveStep(0);

    timerRef.current = setInterval(() => {
      setActiveStep((s) => {
        const next = s + 1;
        if (next >= 5) {
          clearTimer();
          setIsPlaying(false);
          return 4; // stop on Burn
        }
        return next;
      });
    }, 820);
  };

  const jumpTo = (idx) => {
    clearTimer();
    setIsPlaying(false);
    setActiveStep(idx);
  };

  const dimIfNeeded = (isActive) => {
    if (activeStep === -1) return 1;
    return isActive ? 1 : 0.42;
  };

  const glowIfActive = (isActive) =>
    isActive ? "0 0 0 1px rgba(34,197,94,0.22), 0 0 18px rgba(34,197,94,0.18)" : "none";

  const StepBadge = ({ step, terminal, isActive }) => (
    <div
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
        boxShadow: glowIfActive(isActive),
        transform: isActive ? "scale(1.02)" : "scale(1)",
        transition: "box-shadow 200ms ease, transform 200ms ease, opacity 200ms ease",
        opacity: dimIfNeeded(isActive),
        flex: "0 0 auto",
      }}
    >
      {step}
    </div>
  );

  const Chip = ({ text, terminal, isActive }) => (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        color: terminal ? "rgba(34,197,94,0.92)" : colors.chipText,
        border: `1px solid ${terminal ? "rgba(34,197,94,0.26)" : colors.border}`,
        background: "rgba(0,0,0,0.22)",
        padding: "6px 10px",
        borderRadius: 12,
        whiteSpace: "nowrap",
        boxShadow: glowIfActive(isActive),
        transition: "box-shadow 200ms ease, opacity 200ms ease",
        opacity: dimIfNeeded(isActive),
      }}
    >
      {text}
    </div>
  );

  const NodeCard = ({ idx, title, sub, step, terminal, rightTag }) => {
    const isActive = activeStep === idx;

    return (
      <button
        type="button"
        onClick={() => jumpTo(idx)}
        aria-label={`Jump to step ${step}: ${title}`}
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
          opacity: dimIfNeeded(isActive),
          boxShadow: glowIfActive(isActive),
          transform: isActive ? "scale(1.01)" : "scale(1)",
          transition: "opacity 200ms ease, box-shadow 200ms ease, transform 200ms ease",
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
            <StepBadge step={step} terminal={terminal} isActive={isActive} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{title}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>{sub}</div>
            </div>
          </div>

          {rightTag ? (
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: terminal ? "rgba(34,197,94,0.92)" : "rgba(255,255,255,0.76)",
                border: `1px solid ${terminal ? "rgba(34,197,94,0.26)" : colors.border}`,
                background: "rgba(0,0,0,0.20)",
                padding: "6px 10px",
                borderRadius: 12,
                whiteSpace: "nowrap",
                opacity: dimIfNeeded(isActive),
                transition: "opacity 200ms ease",
              }}
            >
              {rightTag}
            </div>
          ) : null}
        </div>
      </button>
    );
  };

  const VerticalConnector = ({ label, activeIdx }) => {
    const isActive = activeStep === activeIdx;

    return (
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
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 6,
              bottom: 6,
              width: 2,
              background: isActive ? "rgba(34,197,94,0.22)" : colors.line,
              borderRadius: 999,
              boxShadow: glowIfActive(isActive),
              opacity: dimIfNeeded(isActive),
              transition: "background 200ms ease, box-shadow 200ms ease, opacity 200ms ease",
            }}
          />
          <div
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
              opacity: dimIfNeeded(isActive),
              filter: isActive ? "drop-shadow(0 0 10px rgba(34,197,94,0.18))" : "none",
              transition: "opacity 200ms ease, filter 200ms ease",
            }}
          />
        </div>

        <div />

        <div style={{ justifySelf: "center" }}>
          <Chip text={label} isActive={isActive} />
        </div>
      </div>
    );
  };

  const BurnBlock = () => {
    const burnActive = activeStep === 4;
    const burnConnectorActive = activeStep === 4; // final step highlights incoming connector + burn

    return (
      <div className="grid gap-10 md:grid-cols-[1fr,1.55fr] md:items-start">
        <div />

        <div style={{ position: "relative" }}>
          {/* Centered chip above Burn (fixes the hanging green label) */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <Chip text={data.labels[3]} terminal isActive={burnConnectorActive} />
          </div>

          {/* Elbow connector (md+) */}
          <div
            className="hidden md:block"
            style={{
              position: "absolute",
              left: -210,
              top: 46,
              width: 210,
              height: 150,
              pointerEvents: "none",
            }}
          >
            <svg width="210" height="150" viewBox="0 0 210 150" style={{ overflow: "visible" }}>
              <path
                d="M 0 34 L 118 34 L 118 112 L 210 112"
                fill="none"
                stroke={burnConnectorActive ? "rgba(34,197,94,0.22)" : colors.lineStrong}
                strokeWidth="2.6"
                strokeLinecap="round"
                style={{
                  opacity: dimIfNeeded(burnConnectorActive),
                  filter: burnConnectorActive ? "drop-shadow(0 0 10px rgba(34,197,94,0.18))" : "none",
                  transition: "opacity 200ms ease, filter 200ms ease, stroke 200ms ease",
                }}
              />
              <path
                d="M 210 112 L 196 104 L 196 120 Z"
                fill="rgba(226,232,240,0.92)"
                style={{
                  opacity: dimIfNeeded(burnConnectorActive),
                  transition: "opacity 200ms ease",
                }}
              />
            </svg>
          </div>

          {/* Vertical arrow into Burn (requested) */}
          <div style={{ marginBottom: 10 }}>
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
                <div
                  style={{
                    position: "absolute",
                    left: 34,
                    top: 6,
                    bottom: 6,
                    width: 2,
                    background: burnConnectorActive ? "rgba(34,197,94,0.22)" : colors.line,
                    borderRadius: 999,
                    boxShadow: glowIfActive(burnConnectorActive),
                    opacity: dimIfNeeded(burnConnectorActive),
                    transition: "background 200ms ease, box-shadow 200ms ease, opacity 200ms ease",
                  }}
                />
                <div
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
                    opacity: dimIfNeeded(burnConnectorActive),
                    filter: burnConnectorActive ? "drop-shadow(0 0 10px rgba(34,197,94,0.18))" : "none",
                    transition: "opacity 200ms ease, filter 200ms ease",
                  }}
                />
              </div>
            </div>
          </div>

          <NodeCard
            idx={4}
            step={data.nodes[4].step}
            title={data.nodes[4].title}
            sub={data.nodes[4].sub}
            terminal
            rightTag="Terminal"
          />
        </div>
      </div>
    );
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
            onClick={play}
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
              <NodeCard idx={0} {...data.nodes[0]} />
              <VerticalConnector label={data.labels[0]} activeIdx={0} />

              <NodeCard idx={1} {...data.nodes[1]} />
              <VerticalConnector label={data.labels[1]} activeIdx={1} />

              <NodeCard idx={2} {...data.nodes[2]} />
              <VerticalConnector label={data.labels[2]} activeIdx={2} />

              <NodeCard idx={3} {...data.nodes[3]} />

              <div style={{ marginTop: 14 }}>
                <BurnBlock />
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
