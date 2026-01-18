export const PlayerUAPCirculationPath = ({ showCaption = true }) => {
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
    lineStrong: "rgba(255,255,255,0.24)",

    layerTop: "rgba(4, 14, 34, 0.78)",
    layerBottom: "rgba(0, 0, 0, 0.28)",
    layerRadialA: "rgba(37, 99, 235, 0.10)",
    layerRadialB: "rgba(15, 23, 42, 0.18)",
  };

  const data = {
    title: "Player-facing UAP circulation path",
    nodes: [
      { step: "1", title: "Gameplay Activity", sub: "Outcome generation" },
      { step: "2", title: "Reward Generation", sub: "Reward calculation" },
      { step: "3", title: "Player Wallet", sub: "Claimed balance" },
      { step: "4", title: "Token Sinks", sub: "Progression spend" },
    ],
    terminal: { step: "5", title: "Burn", sub: "Irreversible supply reduction" },
    labels: [
      "Reward issuance (capped)",
      "Claimable rewards",
      "Voluntary spend",
      "Automated burn execution",
    ],
  };

  const Chip = ({ text, terminal }) => (
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
      }}
    >
      {text}
    </div>
  );

  const StepBadge = ({ step, terminal }) => (
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
        flex: "0 0 auto",
      }}
    >
      {step}
    </div>
  );

  const NodeCard = ({ step, title, sub, rightTag, terminal }) => (
    <div
      style={{
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
          <StepBadge step={step} terminal={terminal} />
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
            }}
          >
            {rightTag}
          </div>
        ) : null}
      </div>
    </div>
  );

  const VerticalConnector = ({ label }) => (
    <div
      style={{
        position: "relative",
        height: 56,
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "1fr auto",
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
            background: colors.line,
            borderRadius: 999,
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
            opacity: 0.95,
          }}
        />
      </div>

      <div style={{ justifySelf: "end" }}>
        <Chip text={label} />
      </div>
    </div>
  );

  const BranchToBurn = ({ label }) => {
    return (
      <div className="grid gap-10 md:grid-cols-[1fr,1.55fr] md:items-start">
        <div />

        <div className="md:relative">
          {/* md+ elbow connector: centered into the Burn card */}
          <div
            className="hidden md:block"
            style={{
              position: "absolute",
              left: -170,
              top: 44,
              width: 170,
              height: 160,
              pointerEvents: "none",
            }}
          >
            <svg width="170" height="160" viewBox="0 0 170 160" style={{ overflow: "visible" }}>
              <path
                d="M 0 34 L 98 34 L 98 112 L 170 112"
                fill="none"
                stroke={colors.lineStrong}
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <path d="M 170 112 L 156 104 L 156 120 Z" fill="rgba(226,232,240,0.92)" />
            </svg>

            {/* label sits above the horizontal run, away from the card */}
            <div style={{ position: "absolute", left: 8, top: -6, transform: "translateY(-100%)" }}>
              <Chip text={label} terminal />
            </div>
          </div>

          {/* <md stacked connector */}
          <div className="md:hidden" style={{ marginBottom: 10 }}>
            <VerticalConnector label={label} />
          </div>

          <NodeCard
            step={data.terminal.step}
            title={data.terminal.title}
            sub={data.terminal.sub}
            rightTag="Terminal"
            terminal
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
            <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>
              Gameplay → Rewards → Wallet → Sinks → Burn
            </div>
          </div>

          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "rgba(255,255,255,0.76)",
              border: `1px solid ${colors.border}`,
              background: "rgba(0,0,0,0.20)",
              padding: "6px 10px",
              borderRadius: 12,
              whiteSpace: "nowrap",
            }}
          >
            Player circulation
          </div>
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
              <NodeCard {...data.nodes[0]} />
              <VerticalConnector label={data.labels[0]} />

              <NodeCard {...data.nodes[1]} />
              <VerticalConnector label={data.labels[1]} />

              <NodeCard {...data.nodes[2]} />
              <VerticalConnector label={data.labels[2]} />

              <NodeCard {...data.nodes[3]} />

              <div style={{ marginTop: 14 }}>
                <BranchToBurn label={data.labels[3]} />
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
