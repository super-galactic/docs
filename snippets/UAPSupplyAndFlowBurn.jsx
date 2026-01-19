export const UAPSupplyAndFlowBurn = () => {
  const [inView, setInView] = React.useState(false);
  const [activeStage, setActiveStage] = React.useState(-1);
  const [runId, setRunId] = React.useState(0);
  const wrapRef = React.useRef(null);
  const timersRef = React.useRef([]);

  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    line: "rgba(255,255,255,0.14)",
    grid: "rgba(255,255,255,0.07)",
    ctaText: "rgba(34,197,94,0.88)",
    ctaTextHover: "rgba(34,197,94,1)",
    ctaBg: "rgba(0,0,0,0.22)",

    bandA: "rgba(34,197,94,0.20)",   // circulating highlight tone
    bandB: "rgba(59,130,246,0.16)",  // treasury tone
    bandC: "rgba(168,85,247,0.14)",  // burned tone
    bandD: "rgba(255,255,255,0.08)", // undistributed tone
  };

  const stages = [
    { key: "entry", label: "Entry gate", note: "Eligible PvE only" },
    { key: "checks", label: "Checks", note: "Caps and rules" },
    { key: "claim", label: "Claim", note: "Hub request" },
    { key: "settle", label: "Settlement", note: "Wallet approval" },
    { key: "circulate", label: "Circulation", note: "Balance updated" },
    { key: "consume", label: "Consumption", note: "Spend actions" },
    { key: "route", label: "Routing", note: "Burn and treasury" },
    { key: "account", label: "Accounting", note: "State updated" },
  ];

  // Buckets are displayed as bands. These are conceptual, not time series.
  const buckets = [
    { key: "undistributed", label: "Remaining undistributed", tone: colors.bandD },
    { key: "circulating", label: "Circulating supply", tone: colors.bandA },
    { key: "treasury", label: "Game treasury", tone: colors.bandB },
    { key: "burned", label: "Burned total", tone: colors.bandC },
  ];

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

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const schedule = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  const startRun = () => {
    clearTimers();
    setActiveStage(-1);
    setRunId((x) => x + 1);

    const stepMs = 520;
    stages.forEach((_, i) => {
      schedule(() => setActiveStage(i), i * stepMs);
    });
    schedule(() => setActiveStage(-1), stages.length * stepMs + 40);
  };

  // Which bucket should glow at each stage
  const bucketFocusByStage = (i) => {
    if (i === 0 || i === 1) return "undistributed";
    if (i === 2 || i === 3) return "undistributed";
    if (i === 4) return "circulating";
    if (i === 5) return "circulating";
    if (i === 6) return "burned";
    if (i === 7) return "burned";
    return null;
  };

  const focusBucket = bucketFocusByStage(activeStage);

  const CardShell = ({ children }) => (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${colors.border}`,
        background: colors.panelOuter,
        padding: 16,
      }}
    >
      {children}
    </div>
  );

  const Badge = ({ text }) => (
    <span
      style={{
        fontSize: 11,
        fontWeight: 800,
        color: "rgba(255,255,255,0.78)",
        border: `1px solid ${colors.border}`,
        background: "rgba(0,0,0,0.20)",
        padding: "6px 10px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );

  const focusX = activeStage >= 0 ? (activeStage / (stages.length - 1)) * 100 : 0;

  return (
    <div className="not-prose" ref={wrapRef}>
      <CardShell>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>UAP Supply and Flow</div>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>
              Fixed supply distribution with gated entry and enforced routing.
            </div>
          </div>

          <button
            type="button"
            onClick={startRun}
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
          >
            Show enforcement flow
          </button>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {/* Legend */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {buckets.map((b) => (
              <div
                key={b.key}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${colors.border}`,
                  background: "rgba(0,0,0,0.20)",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: b.tone,
                    outline: `1px solid ${colors.border}`,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.82)" }}>{b.label}</span>
              </div>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <Badge text="No minting" />
              <Badge text="Rule-based" />
              <Badge text="Not a forecast" />
            </div>
          </div>

          {/* Chart board */}
          <div
            style={{
              position: "relative",
              borderRadius: 18,
              border: `1px solid ${colors.border}`,
              background: "rgba(0,0,0,0.18)",
              overflow: "hidden",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0px)" : "translateY(-8px)",
              transition: "opacity 320ms ease, transform 320ms ease",
            }}
          >
            {/* Grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                  linear-gradient(to right, ${colors.grid} 1px, rgba(0,0,0,0) 1px),
                  linear-gradient(to bottom, ${colors.grid} 1px, rgba(0,0,0,0) 1px)
                `,
                backgroundSize: "14.285% 25%",
                opacity: 0.55,
                pointerEvents: "none",
              }}
            />

            {/* Focus band (jumps per stage, no smooth motion implied) */}
            <div
              key={runId}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `calc(${focusX}% - 7.1%)`,
                width: "14.285%",
                background: activeStage >= 0 ? "rgba(34,197,94,0.08)" : "rgba(0,0,
