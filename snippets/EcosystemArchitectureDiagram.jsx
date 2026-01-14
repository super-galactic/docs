export const EcosystemArchitectureDiagram = () => {
  const [active, setActive] = React.useState(false);

  const colors = {
    accent: "#22C55E",
    blue1: "#2EA8FF",
    blue2: "#3B82F6",
    blue3: "#0B5ED7",
    border: "rgba(255,255,255,0.10)",
    panel: "rgba(255,255,255,0.05)",
    panel2: "rgba(0,0,0,0.22)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    line: "rgba(255,255,255,0.18)",
  };

  const Layer = ({ title, subtitle, items, tone = "blue" }) => {
    const toneMap = {
      gameplay: ["#0EA5E9", colors.blue1],
      app: [colors.blue2, "#60A5FA"],
      chain: [colors.blue3, "#1D4ED8"],
    };
    const [from, to] = toneMap[tone] || [colors.blue2, colors.blue1];

    return (
      <div
        style={{
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
          background: `linear-gradient(180deg, ${colors.panel} 0%, ${colors.panel2} 100%)`,
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
            background: `radial-gradient(80% 120% at 20% 0%, ${from} 0%, rgba(0,0,0,0) 60%),
                         radial-gradient(70% 120% at 80% 0%, ${to} 0%, rgba(0,0,0,0) 55%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{title}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>{subtitle}</div>
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.75)",
                border: `1px solid ${colors.border}`,
                background: "rgba(0,0,0,0.20)",
                padding: "6px 10px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              Layer
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {items.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.85)",
                  border: `1px solid ${colors.border}`,
                  background: "rgba(0,0,0,0.18)",
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

  const Connector = ({ label, glow = false }) => (
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
          color: "rgba(255,255,255,0.78)",
          boxShadow: glow ? `0 0 0 1px rgba(34,197,94,0.25), 0 0 18px rgba(34,197,94,0.35)` : "none",
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
          boxShadow: glow ? `0 0 16px rgba(34,197,94,0.55)` : "none",
          transition: "all 220ms ease",
        }}
      />
    </div>
  );

  return (
    <div className="not-prose">
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
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>Layered System Design</div>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>
              Gameplay stays real-time. Validated outcomes flow to on-chain settlement.
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActive(false);
              setTimeout(() => setActive(true), 40);
              setTimeout(() => setActive(false), 1200);
            }}
            style={{
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
              border: `1px solid ${colors.border}`,
              background: "rgba(0,0,0,0.22)",
              padding: "10px 12px",
              borderRadius: 12,
            }}
          >
            Run validation flow
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <Layer
            tone="gameplay"
            title="Gameplay Layer"
            subtitle="Real-time gameplay execution (no blockchain calls during play)"
            items={["Combat", "Missions", "Movement", "Performance Tracking"]}
          />

          <Connector label="Validated outcomes" glow={active} />

          <Layer
            tone="app"
            title="Application Layer"
            subtitle="Account state, progression tracking, reward eligibility, and synchronization"
            items={["Account State", "Inventory", "Progression", "Reward Validation"]}
          />

          <Connector label="Settlement-ready actions" glow={active} />

          <Layer
            tone="chain"
            title="On-Chain Settlement Layer"
            subtitle="Ownership, verification, and economic finality"
            items={["UAP", "NFT Ownership", "Burns", "Verification", "Supply Controls"]}
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
            <span>Green highlights represent validated flows that are settled on chain.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
