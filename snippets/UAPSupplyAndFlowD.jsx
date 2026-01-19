export const UAPSupplyAndFlowD = () => {
  const [inView, setInView] = React.useState(false);
  const [runId, setRunId] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(-1);
  const wrapRef = React.useRef(null);
  const timersRef = React.useRef([]);

  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    chipText: "rgba(255,255,255,0.86)",
    chipBg: "rgba(0,0,0,0.18)",
    line: "rgba(255,255,255,0.18)",

    layerTop: "rgba(4, 14, 34, 0.78)",
    layerBottom: "rgba(0, 0, 0, 0.28)",
    layerRadialA: "rgba(37, 99, 235, 0.10)",
    layerRadialB: "rgba(15, 23, 42, 0.18)",

    ctaText: "rgba(34,197,94,0.88)",
    ctaTextHover: "rgba(34,197,94,1)",
    ctaBg: "rgba(0,0,0,0.22)",
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
    setActiveStep(-1);
    setRunId((x) => x + 1);

    // Discrete, deterministic sequence. One active step at a time.
    const stepMs = 520;
    const stepsCount = 9;

    for (let i = 0; i < stepsCount; i += 1) {
      schedule(() => setActiveStep(i), i * stepMs);
    }
    schedule(() => setActiveStep(-1), stepsCount * stepMs + 40);
  };

  const StepCard = ({ idx, title, subtitle, chips }) => {
    const show = inView;
    const isActive = activeStep === idx;

    const baseShadow = "0 10px 30px rgba(0,0,0,0.35)";
    const glowShadow = isActive
      ? "0 0 0 1px rgba(34,197,94,0.30), 0 0 26px rgba(34,197,94,0.18), 0 10px 30px rgba(0,0,0,0.35)"
      : baseShadow;

    return (
      <div
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0px)" : "translateY(-10px)",
          transition: `opacity 320ms ease, transform 320ms ease, box-shadow 220ms ease`,
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          background: `linear-gradient(180deg, ${colors.layerTop} 0%, ${colors.layerBottom} 100%)`,
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
            background: `radial-gradient(80% 120% at 20% 0%, ${colors.layerRadialA} 0%, rgba(0,0,0,0) 60%),
                         radial-gradient(70% 120% at 80% 0%, ${colors.layerRadialB} 0%, rgba(0,0,0,0) 55%)`,
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
                fontWeight: 800,
                color: isActive ? "rgba(34,197,94,0.92)" : "rgba(255,255,255,0.76)",
                border: `1px solid ${isActive ? "rgba(34,197,94,0.25)" : colors.border}`,
                background: "rgba(0,0,0,0.20)",
                padding: "6px 10px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                boxShadow: isActive ? "0 0 14px rgba(34,197,94,0.18)" : "none",
                transition: "all 220ms ease",
              }}
            >
              {isActive ? "Active" : `Step ${idx + 1}`}
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {chips.map((t) => (
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

  const Connector = ({ idx, label }) => {
    const glow = activeStep === idx;
    return (
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
            fontWeight: 800,
            color: "rgba(255,255,255,0.78)",
            boxShadow: glow ? "0 0 0 1px rgba(34,197,94,0.22), 0 0 18px rgba(34,197,94,0.28)" : "none",
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
            boxShadow: glow ? "0 0 16px rgba(34,197,94,0.50)" : "none",
            transition: "all 220ms ease",
          }}
        />
      </div>
    );
  };

  // Step indices:
  // 0 Eligible PvE completion
  // 1 Eligibility checks (caps and gating)
  // 2 Claim initiated via Hub
  // 3 On-chain settlement (approval)
  // 4 UAP distribution from fixed supply pool (no mint)
  // 5 Player balance updated
  // 6 Spend actions (upgrade approval, breeding, marketplace)
  // 7 Spend routing (burn and game treasury)
  // 8 Supply accounting update (state counters)

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
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>UAP Supply and Flow</div>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>
              Reward entry is gated. Supply is fixed. Settlement is explicit.
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

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <StepCard
            idx={0}
            title="Eligible PvE completion (off-chain)"
            subtitle="Reward entry begins only from eligible mission outcomes"
            chips={["PvE eligibility", "Off-chain execution", "Outcome produced"]}
          />
          <Connector idx={0} label="Gate 1" />

          <StepCard
            idx={1}
            title="Eligibility checks"
            subtitle="Caps and constraints applied before any claim is accepted"
            chips={["Daily limits", "Extraction caps", "Rule enforcement"]}
          />
          <Connector idx={1} label="Claim intent" />

          <StepCard
            idx={2}
            title="Claim initiated via Hub"
            subtitle="Player requests settlement through the Hub interface"
            chips={["Hub surface", "User intent", "No gameplay execution"]}
          />
          <Connector idx={2} label="User approval" />

          <StepCard
            idx={3}
            title="On-chain settlement"
            subtitle="Wallet-approved settlement becomes verifiable on-chain"
            chips={["Transaction approval", "Settlement execution", "Public auditability"]}
          />
          <Connector idx={3} label="Distribution" />

          <StepCard
            idx={4}
            title="UAP distributed from fixed supply"
            subtitle="No minting. Distribution draws from the defined supply pool"
            chips={["Fixed cap", "No inflation by mint", "Pool accounting"]}
          />
          <Connector idx={4} label="Balance update" />

          <StepCard
            idx={5}
            title="Player balance updated"
            subtitle="UAP becomes available only after confirmed settlement"
            chips={["On-chain finality", "Wallet balance", "Claim complete"]}
          />
          <Connector idx={5} label="Consumption" />

          <StepCard
            idx={6}
            title="Spend actions"
            subtitle="UAP is consumed through approved actions that require settlement"
            chips={["Upgrade spend approval", "Breeding execution", "Marketplace settlement"]}
          />
          <Connector idx={6} label="Routing split" />

          <StepCard
            idx={7}
            title="Spend routing enforced"
            subtitle="Spend settlement routes to burn and game treasury under fixed rules"
            chips={["Burn execution", "Game treasury routing", "Deterministic split"]}
          />
          <Connector idx={7} label="Accounting" />

          <StepCard
            idx={8}
            title="Supply accounting updated"
            subtitle="State counters update after settlement and routing"
            chips={["Burned total increases", "Treasury balance updates", "Circulating supply changes"]}
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
                boxShadow: "0 0 14px rgba(34,197,94,0.45)",
                display: "inline-block",
              }}
            />
            <span>Green highlights show a single settlement step. This is rule-based flow, not a forecast.</span>
          </div>

          <div style={{ marginTop: 4, fontSize: 11, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
            This visual describes gated reward entry, fixed supply distribution, and spend routing enforcement. It does not
            represent projected emissions, price behaviour, or future supply outcomes.
          </div>
        </div>
      </div>
    </div>
  );
};
