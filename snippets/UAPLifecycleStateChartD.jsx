export const UAPLifecycleStateChartD = () => {
  const [inView, setInView] = React.useState(false);
  const [activeCol, setActiveCol] = React.useState(-1);
  const wrapRef = React.useRef(null);
  const timersRef = React.useRef([]);

  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panel: "rgba(255,255,255,0.03)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.70)",
    faint: "rgba(255,255,255,0.55)",
    grid: "rgba(255,255,255,0.10)",
    gridActive: "rgba(34,197,94,0.22)",
    bandA: "rgba(0,0,0,0.14)",
    bandB: "rgba(0,0,0,0.08)",
    ctaText: "rgba(34,197,94,0.88)",
    ctaTextHover: "rgba(34,197,94,1)",
    ctaBg: "rgba(0,0,0,0.22)",
  };

  const stages = [
    { key: "eligibility", label: "Eligibility" },
    { key: "claim", label: "Claim" },
    { key: "settlement", label: "Settlement" },
    { key: "distribution", label: "Distribution" },
    { key: "spend", label: "Spend" },
    { key: "routing", label: "Routing" },
    { key: "accounting", label: "Accounting" },
  ];

  const buckets = [
    { key: "pool", label: "Fixed Supply Pool (Undistributed)" },
    { key: "circulation", label: "Player Circulation" },
    { key: "treasury", label: "Game Treasury" },
    { key: "burned", label: "Burned Total" },
  ];

  // Touchpoints are state interactions, not quantities.
  // Each marker indicates that a bucket is touched in that lifecycle stage.
  const touchpoints = [
    { bucket: "circulation", stage: "eligibility" },
    { bucket: "circulation", stage: "claim" },
    { bucket: "circulation", stage: "settlement" },

    { bucket: "pool", stage: "distribution" },
    { bucket: "circulation", stage: "distribution" },

    { bucket: "circulation", stage: "spend" },

    { bucket: "burned", stage: "routing" },
    { bucket: "treasury", stage: "routing" },

    { bucket: "pool", stage: "accounting" },
    { bucket: "circulation", stage: "accounting" },
    { bucket: "treasury", stage: "accounting" },
    { bucket: "burned", stage: "accounting" },
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
    setActiveCol(-1);

    const stepMs = 560;
    for (let i = 0; i < stages.length; i += 1) {
      schedule(() => setActiveCol(i), i * stepMs);
    }
    schedule(() => setActiveCol(-1), stages.length * stepMs + 60);
  };

  const activeStageKey = activeCol >= 0 ? stages[activeCol].key : null;

  const hasTouchpoint = (bucketKey, stageKey) =>
    touchpoints.some((t) => t.bucket === bucketKey && t.stage === stageKey);

  const Marker = ({ active }) => (
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: active ? 12 : 10,
        height: active ? 12 : 10,
        borderRadius: 999,
        background: active ? colors.accent : "rgba(255,255,255,0.26)",
        boxShadow: active ? "0 0 18px rgba(34,197,94,0.48)" : "none",
        transition: "all 180ms ease",
      }}
    />
  );

  const Metric = ({ label, value, pulse }) => (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${pulse ? "rgba(34,197,94,0.22)" : colors.border}`,
        background: "rgba(0,0,0,0.18)",
        padding: 12,
        transition: "box-shadow 220ms ease, border-color 220ms ease",
        boxShadow: pulse ? "0 0 0 1px rgba(34,197,94,0.14), 0 0 18px rgba(34,197,94,0.12)" : "none",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, color: colors.faint }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 14, fontWeight: 900, color: colors.text }}>{value}</div>
    </div>
  );

  const pulseAccounting = activeStageKey === "accounting";

  const colTemplate = `260px repeat(${stages.length}, minmax(92px, 1fr))`;

  return (
    <div className="not-prose" ref={wrapRef}>
      <div
        style={{
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          background: colors.panel,
          padding: 16,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0px)" : "translateY(-8px)",
          transition: "opacity 320ms ease, transform 320ms ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: colors.text }}>UAP Lifecycle State Chart</div>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>
              Analytical view of state touchpoints. No projections.
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
            Run stage scan
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}>
          {/* Chart plane */}
          <div
            style={{
              borderRadius: 16,
              border: `1px solid ${colors.border}`,
              background: "rgba(0,0,0,0.10)",
              overflow: "hidden",
            }}
          >
            {/* Stage header row */}
            <div style={{ display: "grid", gridTemplateColumns: colTemplate }}>
              <div style={{ padding: "12px 12px", fontSize: 11, fontWeight: 900, color: colors.faint }}>
                Supply buckets (Y)
              </div>

              {stages.map((s, i) => {
                const isActive = activeCol === i;
                return (
                  <div
                    key={s.key}
                    style={{
                      padding: "12px 10px",
                      textAlign: "center",
                      fontSize: 11,
                      fontWeight: 900,
                      color: isActive ? "rgba(34,197,94,0.92)" : colors.faint,
                      borderLeft: `1px solid ${isActive ? colors.gridActive : colors.grid}`,
                      background: isActive ? "rgba(34,197,94,0.06)" : "transparent",
                      transition: "all 200ms ease",
                    }}
                  >
                    {s.label}
                  </div>
                );
              })}
            </div>

            {/* Bands */}
            <div style={{ display: "grid", gap: 0 }}>
              {buckets.map((b, bi) => (
                <div
                  key={b.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: colTemplate,
                    alignItems: "stretch",
                    background: bi % 2 === 0 ? colors.bandA : colors.bandB,
                    borderTop: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ padding: "14px 12px", display: "flex", alignItems: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 850, color: colors.text }}>{b.label}</div>
                  </div>

                  {stages.map((s, si) => {
                    const isActiveCol = activeCol === si;
                    const touched = hasTouchpoint(b.key, s.key);
                    const markerIsActive = isActiveCol && touched;

                    return (
                      <div
                        key={`${b.key}-${s.key}`}
                        style={{
                          position: "relative",
                          minHeight: 56,
                          borderLeft: `1px solid ${isActiveCol ? colors.gridActive : colors.grid}`,
                          background: isActiveCol ? "rgba(34,197,94,0.03)" : "transparent",
                          transition: "all 200ms ease",
                        }}
                      >
                        {touched ? <Marker active={markerIsActive} /> : null}

                        {/* Active column glow sweep as a soft band, not an arrow */}
                        {isActiveCol ? (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                "radial-gradient(80% 70% at 50% 50%, rgba(34,197,94,0.08) 0%, rgba(0,0,0,0) 70%)",
                              pointerEvents: "none",
                            }}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* X label row */}
            <div
              style={{
                borderTop: `1px solid ${colors.border}`,
                padding: "10px 12px",
                fontSize: 11,
                color: "rgba(255,255,255,0.62)",
              }}
            >
              Lifecycle stages (X) progress left to right. Markers indicate which buckets are touched at each stage.
            </div>
          </div>

          {/* Accounting panel */}
          <div
            style={{
              borderRadius: 16,
              border: `1px solid ${colors.border}`,
              background: "rgba(0,0,0,0.12)",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 900, color: colors.text }}>Supply Accounting</div>
            <div style={{ marginTop: 4, fontSize: 11, color: colors.subtext }}>
              Snapshot labels only. Values are not projected here.
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <Metric label="Total Supply" value="Fixed cap" pulse={false} />
              <Metric label="Undistributed Pool" value="Supply pool balance" pulse={pulseAccounting} />
              <Metric label="Circulating Supply" value="Player-held balance" pulse={pulseAccounting} />
              <Metric label="Burned Total" value="Cumulative burns" pulse={pulseAccounting} />
              <Metric label="Game Treasury" value="Treasury balance" pulse={pulseAccounting} />
            </div>

            <div style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
              This chart describes gated reward entry, fixed supply distribution, and deterministic routing touchpoints. It
              does not represent projected emissions, price behaviour, or future supply outcomes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
