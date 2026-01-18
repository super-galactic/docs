export const PlayerUAPCirculationPath = () => {
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
    line: "rgba(255,255,255,0.18)",

    layerTop: "rgba(4, 14, 34, 0.78)",
    layerBottom: "rgba(0, 0, 0, 0.28)",
    layerRadialA: "rgba(37, 99, 235, 0.10)",
    layerRadialB: "rgba(15, 23, 42, 0.18)",

    ctaText: "rgba(34,197,94,0.88)",
    ctaTextHover: "rgba(34,197,94,1)",
    ctaBg: "rgba(0,0,0,0.22)",
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

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startSequence = () => {
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

  const dim = (isActive) => {
    if (activeStep === -1) return 1;
    return isActive ? 1 : 0.42;
  };

  const glow = (isActive) =>
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
        boxShadow: glow(isActive),
        transform: isActive ? "scale(1.02)" : "scale(1)",
        transition: "box-shadow 200ms ease, transform 200ms ease, opacity 200ms ease",
        opacity: dim(isActive),
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
        boxShadow: glow(isActive),
        transition: "box-shadow 200ms ease, opacity 200ms ease",
        opacity: dim(isActive),
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
          opacity: dim(isActive),
          boxShadow: glow(isActive),
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
                opacity: dim(isActive),
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
              boxShadow: glow(isActive),
              opacity: dim(isActive),
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
              opacity: dim(isActive),
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

    return (
      <div className="grid gap-10 md:grid-cols-[1fr,1.55fr] md:items-start">
        <div />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Chip text={data.labels[3]} terminal isActive={burnActive} />
          </div>

          <div style={{ marginBottom: 12 }}>
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
                    background: burnActive ? "rgba(34,197,94,0.22)" : colors.line,
                    borderRadius: 999,
                    boxShadow: glow(burnActive),
                    opacity: dim(burnActive),
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
                    opacity: dim(burnActive),
                    filter: burnActive ? "drop-shadow(0 0 10px rgba(34,197,94,0.18))" : "none",
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
    <div className="not-prose">
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
            onClick={startSequence}
            aria-label="Run circulation sequence"
            style={{
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 850,
              color: colors.ctaText,
              border: `1px solid ${colors.border}`,
              background: colors.ctaBg,
              padding: "10px 12px",
              borderRadius: 12,
              transition: "color 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
              boxShadow: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.ctaTextHover;
              e.currentTarget.style.borderColor = "rgba(34,197,94,0.22)";
              e.currentTarget.style.boxShadow = "0 0 0 1px rgba(34,197,94,0.18), 0 0 16px rgba(34,197,94,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.ctaText;
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = "none";
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(34,197,94,0.26)";
              e.currentTarget.style.boxShadow = "0 0 0 2px rgba(34,197,94,0.18), 0 0 18px rgba(34,197,94,0.10)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Run circulation sequence
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "rgba(255,255,255,0.70)",
                border: `1px solid ${colors.border}`,
                background: "rgba(0,0,0,0.18)",
                padding: "4px 8px",
                borderRadius: 999,
              }}
            >
              {isPlaying ? "Playing" : activeStep >= 0 ? `Step ${Math.min(activeStep + 1, 5)} of 5` : "Idle"}
            </span>
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

              <div style={{ marginTop: 30 }}>
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
