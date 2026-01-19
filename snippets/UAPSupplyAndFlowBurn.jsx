export const UAPSupplyAndFlowBurn = () => {
  const [inView, setInView] = React.useState(false);
  const [activeCol, setActiveCol] = React.useState(-1);
  const wrapRef = React.useRef(null);
  const timersRef = React.useRef([]);

  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.70)",
    faint: "rgba(255,255,255,0.55)",
    chipBg: "rgba(0,0,0,0.18)",
    line: "rgba(255,255,255,0.16)",
    grid: "rgba(255,255,255,0.10)",
    gridActive: "rgba(34,197,94,0.22)",
    rowBg: "rgba(0,0,0,0.18)",
    rowBg2: "rgba(0,0,0,0.10)",
    ctaText: "rgba(34,197,94,0.88)",
    ctaTextHover: "rgba(34,197,94,1)",
    ctaBg: "rgba(0,0,0,0.22)",
  };

  const cols = [
    { key: "eligibility", label: "Eligibility" },
    { key: "claim", label: "Claim" },
    { key: "settlement", label: "Settlement" },
    { key: "distribution", label: "Distribution" },
    { key: "spend", label: "Spend" },
    { key: "routing", label: "Routing" },
    { key: "accounting", label: "Accounting" },
  ];

  const rows = [
    { key: "pool", label: "Fixed Supply Pool (Undistributed)" },
    { key: "circulation", label: "Player Circulation" },
    { key: "treasury", label: "Game Treasury" },
    { key: "burned", label: "Burned Total" },
  ];

  // Markers show which buckets are relevant at each stage.
  // These are not quantities. They are state touchpoints.
  const markers = [
    { row: "circulation", col: "eligibility", note: "Off-chain eligibility gate" },
    { row: "circulation", col: "claim", note: "Claim intent via Hub" },
    { row: "circulation", col: "settlement", note: "Wallet-approved settlement" },

    { row: "pool", col: "distribution", note: "Distribution from fixed pool" },
    { row: "circulation", col: "distribution", note: "Balance visibility update" },

    { row: "circulation", col: "spend", note: "Spend actions consume UAP" },
    { row: "burned", col: "routing", note: "Burn routing executed" },
    { row: "treasury", col: "routing", note: "Treasury routing executed" },

    { row: "pool", col: "accounting", note: "Undistributed pool updates" },
    { row: "circulation", col: "accounting", note: "Circulating state updates" },
    { row: "burned", col: "accounting", note: "Burned total updates" },
    { row: "treasury", col: "accounting", note: "Treasury balance updates" },
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
    cols.forEach((_, i) => {
      schedule(() => setActiveCol(i), i * stepMs);
    });
    schedule(() => setActiveCol(-1), cols.length * stepMs + 40);
  };

  const activeColKey = activeCol >= 0 ? cols[activeCol].key : null;

  const markerActive = (m) => activeColKey && m.col === activeColKey;

  const Panel = ({ title, subtitle, children }) => (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${colors.border}`,
        background: colors.panelOuter,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{title}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
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

  const pulseAccounting = activeColKey === "accounting";

  return (
    <div className="not-prose" ref={wrapRef}>
      <div
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0px)" : "translateY(-8px)",
          transition: "opacity 320ms ease, transform 320ms ease",
        }}
      >
        <Panel
          title="UAP Supply and Flow"
          subtitle="State-based lifecycle tracks. No projections."
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontSize: 12, color: colors.subtext }}>
              Click to highlight each lifecycle stage. Markers indicate which supply buckets are touched at each stage.
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
              Show enforcement flow
            </button>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              gap: 12,
            }}
          >
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
            </div>

            <div
              style={{
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
                background: "rgba(0,0,0,0.10)",
                padding: 12,
                overflow: "hidden",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: `260px repeat(${cols.length}, minmax(86px, 1fr))` }}>
                <div style={{ padding: "10px 10px 12px 10px", fontSize: 11, fontWeight: 900, color: colors.faint }}>
                  Buckets
                </div>

                {cols.map((c, i) => {
                  const isActive = activeCol === i;
                  return (
                    <div
                      key={c.key}
                      style={{
                        padding: "10px 10px 12px 10px",
                        fontSize: 11,
                        fontWeight: 900,
                        color: isActive ? "rgba(34,197,94,0.92)" : colors.faint,
                        borderLeft: `1px solid ${isActive ? colors.gridActive : colors.grid}`,
                        background: isActive ? "rgba(34,197,94,0.06)" : "transparent",
                        transition: "all 200ms ease",
                        textAlign: "center",
                      }}
                    >
                      {c.label}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 2, display: "grid", gap: 8 }}>
                {rows.map((r, rowIndex) => (
                  <div
                    key={r.key}
                    style={{
                      borderRadius: 14,
                      border: `1px solid ${colors.border}`,
                      background: rowIndex % 2 === 0 ? colors.rowBg : colors.rowBg2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `260px repeat(${cols.length}, minmax(86px, 1fr))`,
                        alignItems: "stretch",
                      }}
                    >
                      <div style={{ padding: "12px 10px", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 850, color: colors.text }}>{r.label}</div>
                      </div>

                      {cols.map((c, colIndex) => {
                        const isActive = activeCol === colIndex;
                        const hasMarker = markers.some((m) => m.row === r.key && m.col === c.key);

                        const pulse = isActive && hasMarker;
                        const cellBg = isActive ? "rgba(34,197,94,0.04)" : "transparent";
                        const colBorder = isActive ? colors.gridActive : colors.grid;

                        return (
                          <div
                            key={`${r.key}-${c.key}`}
                            style={{
                              position: "relative",
                              padding: "12px 10px",
                              borderLeft: `1px solid ${colBorder}`,
                              background: cellBg,
                              transition: "all 200ms ease",
                              minHeight: 46,
                            }}
                          >
                            {hasMarker && (
                              <div
                                title={`${r.label} • ${c.label}`}
                                style={{
                                  position: "absolute",
                                  left: "50%",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: pulse ? 12 : 10,
                                  height: pulse ? 12 : 10,
                                  borderRadius: 999,
                                  background: pulse ? colors.accent : "rgba(255,255,255,0.28)",
                                  boxShadow: pulse ? "0 0 18px rgba(34,197,94,0.48)" : "none",
                                  transition: "all 180ms ease",
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
                Markers indicate which buckets are touched at each lifecycle stage. This visual describes gated entry,
                fixed supply distribution, and deterministic routing. It does not represent projected emissions, price
                behaviour, or future supply outcomes.
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};
