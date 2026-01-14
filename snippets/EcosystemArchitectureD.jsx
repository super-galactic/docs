export const EcosystemArchitectureD = () => {
  const [inView, setInView] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const wrapRef = React.useRef(null);

  const colors = {
    accent: "#22C55E", // green only for validated outcome + finality glow
    gameplayBgTop: "rgba(6, 10, 20, 0.70)", // neutral dark / slate blue
    gameplayBgBottom: "rgba(0, 0, 0, 0.26)",
    appBgTop: "rgba(6, 24, 68, 0.60)", // mid blue
    appBgBottom: "rgba(0, 0, 0, 0.24)",
    chainBgTop: "rgba(3, 12, 32, 0.75)", // deep blue
    chainBgBottom: "rgba(0, 0, 0, 0.26)",
    border: "rgba(255,255,255,0.10)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    chipText: "rgba(255,255,255,0.86)",
    chipBg: "rgba(0,0,0,0.18)",
    line: "rgba(255,255,255,0.18)",
  };

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) setInView(true);
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const runPulse = () => {
    setActive(false);
    setTimeout(() => setActive(true), 40);
    setTimeout(() => setActive(false), 1400);
  };

  const Layer = ({ title, subtitle, items, variant, step, delayMs, finalGlow }) => {
    const variantMap = {
      gameplay: {
        top: colors.gameplayBgTop,
        bottom: colors.gameplayBgBottom,
        a: "rgba(148, 163, 184, 0.20)",
        b: "rgba(56, 189, 248, 0.10)",
      },
      app: {
        top: colors.appBgTop,
        bottom: colors.appBgBottom,
        a: "rgba(59, 130, 246, 0.16)",
        b: "rgba(96, 165, 250, 0.10)",
      },
      chain: {
        top: colors.chainBgTop,
        bottom: colors.chainBgBottom,
        a: "rgba(37, 99, 235, 0.12)",
        b: "rgba(29, 78, 216, 0.10)",
      },
    };

    const tone = variantMap[variant] || variantMap.app;

    const show = inView;
    const baseShadow = "0 10px 30px rgba(0,0,0,0.35)";
    const glowShadow =
      finalGlow && active
        ? "0 0 0 1px rgba(34,197,94,0.30), 0 0 26px rgba(34,197,94,0.18), 0 10px 30px rgba(0,0,0,0.35)"
        : baseShadow;

    return (
      <div
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0px)" : "translateY(-10px)",
          transition: `opacity 320ms ease ${delayMs}ms, transform 320ms ease ${delayMs}ms, box-shadow 260ms ease`,
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          background: `linear-gradient(180deg, ${tone.top} 0%, ${tone.bottom} 100%)`,
          padding: 16,
          position: "relative",
          overflow: "hidden",
          boxShadow: glowShadow,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.55,
            background: `radial-gradient(80% 120% at 20% 0%, ${tone.a} 0%, rgba(0,0,0,0) 60%),
                         radial-gradient(70% 120% at 80% 0%, ${tone.b} 0%, rgba(0,0,0,0) 55%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{title}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>{subtitle}</div>
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                border: `1px solid ${colors.border}`,
                background: "rgba(0,0,0,0.20)",
                padding: "6px 10px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              {step}
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {items.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  fontWeight: 650,
                  color: colors.chipText,
                  border: `1px solid ${colors.border}`,
                  background: colors.chipBg,
                  padding: "6px 10px",
                  borderRadius: 999,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Connector = ({ label, glow }) => (
    <div style={{ position: "relative", padding: "12px 0" }}>
      <div
        style={{
          height: 1,
          background: colors.line,
          position: "absolute",
          left: 24,
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      <div
        style={{
          position: "relative",
          margin: "0 auto",
          width: "fit-content",
          padding: "6px 10px",
          borderRadius: 999,
          border: `1px solid ${colors.border}`,
          background: "rgba(0,0,0,0.24)",
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,0.78)",
          boxShadow: glow ? `0 0 0 1px rgba(34,197,94,0.22), 0 0 18px rgba(34,197,94,0.28)` : "none",
          transition: "box-shadow 220ms ease",
        }}
      >
        {label}
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 10,
          height: 10,
          borderRadius: 999,
          background: glow ? colors.accent : "rgba(255,255,255,0.22)",
          boxShadow: glow ? `0 0 16px rgba(34,197,94,0.50)` : "none",
          transition: "all 220ms ease",
        }}
      />
    </div>
  );

  return (
    <div className="not-prose" ref={wrapRef}>
      <div
        style={{
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          background: "rgba(255,255,255,0.03)",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>
              Layered Architecture
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>
              Gameplay → Coordination → Finality
            </div>
          </div>

          <button
            type="button"
            onClick={runPulse}
            style={{
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 800,
              color: "rgba(255,255,255,0.92)",
              border: `1px solid ${colors.border}`,
              background: "rgba(0,0,0,0.22)",
              padding: "10px 12px",
              borderRadius: 12,
            }}
          >
            Run validated outcome pulse
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <Layer
            variant="gameplay"
            step="Gameplay"
            title="Gameplay Layer"
            subtitle="Real-time play and outcome generation"
            items={["Combat", "Progression", "Leaderboards"]}
            delayMs={0}
          />

          <Connector label="Coordination" glow={active} />

          <Layer
            variant="app"
            step="Coordination"
            title="Application Layer (Super Galactic Hub)"
            subtitle="Coordination and orchestration"
            items={["Accounts", "Marketplace", "Asset Management"]}
            delayMs={120}
          />

          <Connector label="Finality" glow={active} />

          <Layer
            variant="chain"
            step="Finality"
            title="On-Chain Finality Layer"
            subtitle="Irreversible economic and ownership state"
            items={["NFTs", "UAP", "Finality"]}
            delayMs={240}
            finalGlow
          />

          <div
            style={{
              marginTop: 2,
              fontSize: 12,
              color: "rgba(255,255,255,0.70)",
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: colors.accent,
                boxShadow: `0 0 14px rgba(34,197,94,0.45)`,
                display: "inline-block",
              }}
            />
            <span>
              Green highlights represent a validated gameplay outcome reaching on-chain finality.
            </span>
          </div>

          <div style={{ marginTop: 4, fontSize: 11, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
            Gameplay does not mint or settle tokens. The hub coordinates intent. The finality layer is the only place where
            ownership and balances become irreversible.
          </div>
        </div>
      </div>
    </div>
  );
};
