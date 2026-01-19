export const UAPLifecycleStateChart = () => {
  const [inView, setInView] = React.useState(false);
  const [hover, setHover] = React.useState(null);
  const [allocHover, setAllocHover] = React.useState(null);

  const wrapRef = React.useRef(null);
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

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

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const formatInt = (n) => {
    const x = Math.round(Number(n) || 0);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // -----------------------------
  // Canonical constants
  // -----------------------------
  const TOTAL_SUPPLY = 420_000_000_000;

  const ALLOC = [
    { key: "p2e", label: "Play to Earn Economy", pct: 0.5 },
    { key: "liq", label: "Liquidity and Listing", pct: 0.25 },
    { key: "eco", label: "Ecosystem Growth", pct: 0.15 },
    { key: "team", label: "Team and Advisors", pct: 0.05 },
    { key: "dev", label: "Development Fund", pct: 0.05 },
  ];

  const BREEDING = [
    { attempt: 1, cost: 25_000 },
    { attempt: 2, cost: 50_000 },
    { attempt: 3, cost: 100_000 },
    { attempt: 4, cost: 200_000 },
    { attempt: 5, cost: 400_000 },
    { attempt: 6, cost: 800_000 },
    { attempt: 7, cost: 1_600_000 },
  ];

  // -----------------------------
  // Scenario model (parameterized)
  // -----------------------------
  const MODEL = React.useMemo(() => {
    const activeGenesis = 10_000;
    const avgClaimedUapPerGenesis = 600;
    const avgUpgradeSpendPerGenesis = 25_000;
    const breedingAdoptionRate = 0.18;
    const avgBreedingAttempt = 3;
    const dexSellRateOfClaims = 0.22;
    const hubMarketUapVolumeRate = 0.10;

    const points = 60;
    const xs = Array.from({ length: points }, (_, i) => i / (points - 1));

    const smoothstep = (t) => t * t * (3 - 2 * t);

    const series = xs.map((t01, idx) => {
      const intensity = smoothstep(t01);

      const claimed = activeGenesis * avgClaimedUapPerGenesis * intensity;

      const upgradeSpend = activeGenesis * avgUpgradeSpendPerGenesis * intensity;

      const attemptIdx = clamp(Math.round(avgBreedingAttempt) - 1, 0, BREEDING.length - 1);
      const avgBreedCost = BREEDING[attemptIdx].cost;
      const breedingSpend =
        activeGenesis * breedingAdoptionRate * avgBreedCost * Math.pow(intensity, 1.1);

      const totalSpend = upgradeSpend + breedingSpend;

      const burnFromSpend = totalSpend * 0.5;
      const treasuryFromSpend = totalSpend * 0.5;

      const dexSellVolume = claimed * dexSellRateOfClaims;
      const dexSellTax = dexSellVolume * 0.1;

      const hubMarketVolume = claimed * hubMarketUapVolumeRate;
      const hubFee = hubMarketVolume * 0.025;

      const circulatingDelta = claimed - totalSpend - dexSellTax - hubFee;

      return {
        idx,
        t01,
        intensity,
        claimed,
        upgradeSpend,
        breedingSpend,
        totalSpend,
        burnFromSpend,
        treasuryFromSpend,
        dexSellTax,
        hubFee,
        circulatingDelta,
      };
    });

    let circ = 0;
    let burnedCum = 0;
    let treasuryCum = 0;

    const integrated = series.map((p, i) => {
      const step = i === 0 ? 0 : xs[i] - xs[i - 1];

      circ = clamp(circ + p.circulatingDelta * step, 0, TOTAL_SUPPLY);
      burnedCum = clamp(burnedCum + p.burnFromSpend * step, 0, TOTAL_SUPPLY);
      treasuryCum = clamp(treasuryCum + p.treasuryFromSpend * step, 0, TOTAL_SUPPLY);

      const reserved = clamp(TOTAL_SUPPLY - circ - burnedCum - treasuryCum, 0, TOTAL_SUPPLY);

      return {
        ...p,
        states: {
          reserved,
          circulating: circ,
          treasury: treasuryCum,
          burned: burnedCum,
        },
      };
    });

    // flow max for scaling
    let maxFlow = 1;
    for (const p of integrated) {
      maxFlow = Math.max(
        maxFlow,
        p.claimed,
        p.totalSpend,
        p.burnFromSpend,
        p.treasuryFromSpend,
        p.dexSellTax,
        p.hubFee
      );
    }

    return {
      points,
      xs,
      integrated,
      maxFlow,
      inputs: {
        activeGenesis,
        avgClaimedUapPerGenesis,
        avgUpgradeSpendPerGenesis,
        breedingAdoptionRate,
        avgBreedingAttempt,
        dexSellRateOfClaims,
        hubMarketUapVolumeRate,
      },
    };
  }, []);

  // -----------------------------
  // Geometry
  // -----------------------------
  const W = 980;
  const PAD = 18;
  const H_ALLOC = 86;
  const H_STATE = 190;
  const H_FLOW = 220;

  const xToPx = (t01) => PAD + t01 * (W - PAD * 2);

  const yState = (v) => {
    const max = TOTAL_SUPPLY;
    return PAD + (H_STATE - PAD * 2) * (1 - v / max);
  };

  const yFlow = (v) => {
    const max = MODEL.maxFlow || 1;
    return PAD + (H_FLOW - PAD * 2) * (1 - v / max);
  };

  const buildPath = (getter, yFn) => {
    const pts = MODEL.integrated;
    if (!pts.length) return "";
    let d = "";
    for (let i = 0; i < pts.length; i++) {
      const x = xToPx(pts[i].t01);
      const y = yFn(getter(pts[i]));
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  };

  const stateAreas = React.useMemo(() => {
    const pts = MODEL.integrated;
    const order = ["burned", "treasury", "circulating", "reserved"];

    const cumAt = (i, uptoIdx) => {
      let sum = 0;
      for (let k = 0; k <= uptoIdx; k++) sum += pts[i].states[order[k]];
      return sum;
    };

    const areaPath = (idx) => {
      let top = "";
      let bot = "";

      for (let i = 0; i < pts.length; i++) {
        const x = xToPx(pts[i].t01);
        const yTop = yState(cumAt(i, idx));
        const yBot = yState(idx === 0 ? 0 : cumAt(i, idx - 1));

        top += i === 0 ? `M ${x} ${yTop}` : ` L ${x} ${yTop}`;
        bot = ` L ${x} ${yBot}` + bot;
      }

      const xEnd = xToPx(pts[pts.length - 1].t01);
      const xStart = xToPx(pts[0].t01);

      return `${top} L ${xEnd} ${yState(0)}${bot} L ${xStart} ${yState(0)} Z`;
    };

    return [
      { key: "burned", label: "Burned", d: areaPath(0) },
      { key: "treasury", label: "Treasury controlled", d: areaPath(1) },
      { key: "circulating", label: "Player circulating", d: areaPath(2) },
      { key: "reserved", label: "Reserved (allocation baseline)", d: areaPath(3) },
    ];
  }, [MODEL]);

  const allocSegments = React.useMemo(() => {
    let acc = 0;
    return ALLOC.map((a) => {
      const start = acc;
      acc += a.pct;
      return {
        ...a,
        start,
        end: acc,
        amount: TOTAL_SUPPLY * a.pct,
      };
    });
  }, []);

  // -----------------------------
  // Hover logic (container-relative, no window)
  // -----------------------------
  const getCardCoords = () => {
    const el = cardRef.current;
    if (!el) return { left: 0, top: 0, width: 0, height: 0 };
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  };

  const setHoverFromEvent = (evt, panelOffsetY, panelHeight) => {
    const box = evt.currentTarget.getBoundingClientRect();
    const px = evt.clientX - box.left;
    const t01 = clamp((px - PAD) / (W - PAD * 2), 0, 1);
    const idx = Math.round(t01 * (MODEL.points - 1));
    const p = MODEL.integrated[clamp(idx, 0, MODEL.points - 1)];

    const card = getCardCoords();
    const localX = evt.clientX - card.left;
    const localY = evt.clientY - card.top;

    setHover({
      idx: p.idx,
      t01: p.t01,
      xPx: xToPx(p.t01),
      localX,
      localY,
      panelOffsetY,
      panelHeight,
      point: p,
    });
  };

  const clearHover = () => setHover(null);

  const onAllocMove = (evt) => {
    const box = evt.currentTarget.getBoundingClientRect();
    const px = evt.clientX - box.left;
    const t01 = clamp((px - PAD) / (W - PAD * 2), 0, 1);
    const seg = allocSegments.find((s) => t01 >= s.start && t01 <= s.end) || null;
    setAllocHover(seg);

    const card = getCardCoords();
    setHover((h) =>
      h
        ? h
        : {
            idx: -1,
            t01,
            xPx: xToPx(t01),
            localX: evt.clientX - card.left,
            localY: evt.clientY - card.top,
            panelOffsetY: 0,
            panelHeight: H_ALLOC,
            point: null,
          }
    );
  };

  const onAllocLeave = () => {
    setAllocHover(null);
    clearHover();
  };

  const tooltip = React.useMemo(() => {
    if (!hover) return null;

    if (allocHover) {
      return {
        title: "Supply and Allocation",
        lines: [
          { k: "Category", v: allocHover.label },
          { k: "Share", v: `${(allocHover.pct * 100).toFixed(0)}%` },
          { k: "Amount", v: `${formatInt(allocHover.amount)} UAP` },
          { k: "Total supply", v: `${formatInt(TOTAL_SUPPLY)} UAP` },
        ],
      };
    }

    if (!hover.point) return null;
    const p = hover.point;

    const circulatingPct = (p.states.circulating / TOTAL_SUPPLY) * 100;

    return {
      title: `Lifecycle intensity: ${(p.intensity * 100).toFixed(0)}%`,
      lines: [
        { k: "Circulating supply", v: `${formatInt(p.states.circulating)} UAP` },
        { k: "Treasury controlled", v: `${formatInt(p.states.treasury)} UAP` },
        { k: "Burned supply", v: `${formatInt(p.states.burned)} UAP` },
        { k: "Circulating share", v: `${circulatingPct.toFixed(2)}% of total` },
        { k: "Claimed (model)", v: `${formatInt(p.claimed)} UAP` },
        { k: "Upgrade spend (model)", v: `${formatInt(p.upgradeSpend)} UAP` },
        { k: "Breeding spend (model)", v: `${formatInt(p.breedingSpend)} UAP` },
        { k: "Burn from spend (model)", v: `${formatInt(p.burnFromSpend)} UAP` },
        { k: "Treasury from spend (model)", v: `${formatInt(p.treasuryFromSpend)} UAP` },
        { k: "DEX sell tax (model)", v: `${formatInt(p.dexSellTax)} UAP` },
        { k: "Marketplace fee (model)", v: `${formatInt(p.hubFee)} UAP` },
      ],
    };
  }, [hover, allocHover]);

  const tooltipStyle = React.useMemo(() => {
    if (!hover || !tooltip) return null;

    // position inside the card, clamp to safe bounds, no window calls
    const w = 320;
    const h = 280;
    const margin = 14;

    const left = clamp(hover.localX + margin, 10, 980 - w - 10);
    const top = clamp(hover.localY + margin, 10, 9999);

    return { left, top, width: w };
  }, [hover, tooltip]);

  // -----------------------------
  // Styling (same runtime-safe approach as your working snippet)
  // -----------------------------
  const colors = {
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    grid: "rgba(255,255,255,0.08)",
    axis: "rgba(255,255,255,0.14)",
    crosshair: "rgba(255,255,255,0.55)",
  };

  const layerFill = {
    burned: "rgba(255,255,255,0.08)",
    treasury: "rgba(255,255,255,0.06)",
    circulating: "rgba(255,255,255,0.12)",
    reserved: "rgba(255,255,255,0.05)",
  };

  const lineStroke = {
    claimed: "rgba(255,255,255,0.78)",
    spend: "rgba(255,255,255,0.52)",
    burn: "rgba(255,255,255,0.34)",
    treasury: "rgba(255,255,255,0.26)",
    tax: "rgba(255,255,255,0.20)",
    fee: "rgba(255,255,255,0.16)",
  };

  const LegendRow = ({ label, swatch }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          border: `1px solid ${colors.border}`,
          background: swatch,
          display: "inline-block",
        }}
      />
      <span style={{ fontSize: 12, color: colors.subtext }}>{label}</span>
    </div>
  );

  return (
    <div className="not-prose" ref={wrapRef}>
      <div
        ref={cardRef}
        style={{
          position: "relative",
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          background: colors.panelOuter,
          padding: 16,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0px)" : "translateY(8px)",
          transition: "opacity 240ms ease, transform 240ms ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>
              UAP Lifecycle State Chart
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext }}>
              Scenario-based analytical view. Accounting reconciles to {formatInt(TOTAL_SUPPLY)} UAP.
            </div>
          </div>
          <div style={{ fontSize: 12, color: colors.subtext, textAlign: "right" }}>
            In-game spend routing: 50% burn, 50% treasury
          </div>
        </div>

        {/* Allocation */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>
            Supply and Allocation
          </div>

          <svg
            width="100%"
            viewBox={`0 0 ${W} ${H_ALLOC}`}
            style={{ marginTop: 8, display: "block", minHeight: H_ALLOC }}
            onMouseMove={onAllocMove}
            onMouseLeave={onAllocLeave}
          >
            <g>
              <line x1={PAD} y1={18} x2={W - PAD} y2={18} stroke={colors.grid} />
              <line x1={PAD} y1={58} x2={W - PAD} y2={58} stroke={colors.grid} />
            </g>

            <rect
              x={PAD}
              y={26}
              width={W - PAD * 2}
              height={24}
              rx={10}
              fill="rgba(0,0,0,0.18)"
              stroke={colors.axis}
            />

            {allocSegments.map((s) => {
              const x = xToPx(s.start);
              const w = (W - PAD * 2) * (s.end - s.start);
              const hot = allocHover && allocHover.key === s.key;
              return (
                <rect
                  key={s.key}
                  x={x}
                  y={26}
                  width={w}
                  height={24}
                  rx={10}
                  fill={hot ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)"}
                  stroke={hot ? "rgba(255,255,255,0.42)" : colors.axis}
                />
              );
            })}

            <line x1={PAD} y1={68} x2={W - PAD} y2={68} stroke={colors.axis} />
            <text x={PAD} y={80} fill={colors.subtext} fontSize="11">
              0%
            </text>
            <text x={W - PAD} y={80} fill={colors.subtext} fontSize="11" textAnchor="end">
              100%
            </text>

            {hover ? (
              <line
                x1={hover.xPx}
                y1={18}
                x2={hover.xPx}
                y2={H_ALLOC - 10}
                stroke={colors.crosshair}
              />
            ) : null}
          </svg>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            {ALLOC.map((a) => (
              <div
                key={a.key}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{a.label}</div>
                <div style={{ marginTop: 4, fontSize: 12, color: colors.subtext, display: "flex", justifyContent: "space-between" }}>
                  <span>{(a.pct * 100).toFixed(0)}%</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatInt(TOTAL_SUPPLY * a.pct)} UAP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* States */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>
            Lifecycle states
          </div>

          <svg
            width="100%"
            viewBox={`0 0 ${W} ${H_STATE}`}
            style={{ marginTop: 8, display: "block", minHeight: H_STATE }}
            onMouseMove={(e) => setHoverFromEvent(e, H_ALLOC + 14, H_STATE)}
            onMouseLeave={clearHover}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = PAD + (i * (H_STATE - PAD * 2)) / 4;
              return <line key={i} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke={colors.grid} />;
            })}

            {stateAreas.map((a) => {
              const fill =
                a.key === "burned"
                  ? layerFill.burned
                  : a.key === "treasury"
                  ? layerFill.treasury
                  : a.key === "circulating"
                  ? layerFill.circulating
                  : layerFill.reserved;

              return <path key={a.key} d={a.d} fill={fill} stroke={colors.axis} strokeWidth="1" />;
            })}

            <line x1={PAD} y1={H_STATE - PAD} x2={W - PAD} y2={H_STATE - PAD} stroke={colors.axis} />
            <text x={PAD} y={16} fill={colors.subtext} fontSize="11">
              420B
            </text>
            <text x={PAD} y={H_STATE - 6} fill={colors.subtext} fontSize="11">
              0
            </text>

            {hover ? (
              <line x1={hover.xPx} y1={PAD} x2={hover.xPx} y2={H_STATE - PAD} stroke={colors.crosshair} />
            ) : null}
          </svg>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            <LegendRow label="Player circulating" swatch={layerFill.circulating} />
            <LegendRow label="Treasury controlled" swatch={layerFill.treasury} />
            <LegendRow label="Burned" swatch={layerFill.burned} />
            <LegendRow label="Reserved" swatch={layerFill.reserved} />
          </div>
        </div>

        {/* Flows */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>
            Lifecycle flows (model)
          </div>

          <svg
            width="100%"
            viewBox={`0 0 ${W} ${H_FLOW}`}
            style={{ marginTop: 8, display: "block", minHeight: H_FLOW }}
            onMouseMove={(e) => setHoverFromEvent(e, H_ALLOC + H_STATE + 26, H_FLOW)}
            onMouseLeave={clearHover}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = PAD + (i * (H_FLOW - PAD * 2)) / 4;
              return <line key={i} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke={colors.grid} />;
            })}

            <path d={buildPath((p) => p.claimed, yFlow)} fill="none" stroke={lineStroke.claimed} strokeWidth="2" />
            <path d={buildPath((p) => p.totalSpend, yFlow)} fill="none" stroke={lineStroke.spend} strokeWidth="2" />
            <path d={buildPath((p) => p.burnFromSpend, yFlow)} fill="none" stroke={lineStroke.burn} strokeWidth="2" />
            <path d={buildPath((p) => p.treasuryFromSpend, yFlow)} fill="none" stroke={lineStroke.treasury} strokeWidth="2" />
            <path d={buildPath((p) => p.dexSellTax, yFlow)} fill="none" stroke={lineStroke.tax} strokeWidth="2" />
            <path d={buildPath((p) => p.hubFee, yFlow)} fill="none" stroke={lineStroke.fee} strokeWidth="2" />

            <line x1={PAD} y1={H_FLOW - PAD} x2={W - PAD} y2={H_FLOW - PAD} stroke={colors.axis} />

            {hover ? (
              <line x1={hover.xPx} y1={PAD} x2={hover.xPx} y2={H_FLOW - PAD} stroke={colors.crosshair} />
            ) : null}
          </svg>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            <LegendRow label="Claimed (model)" swatch={lineStroke.claimed} />
            <LegendRow label="Total spend (model)" swatch={lineStroke.spend} />
            <LegendRow label="Burn from spend (model)" swatch={lineStroke.burn} />
            <LegendRow label="Treasury from spend (model)" swatch={lineStroke.treasury} />
            <LegendRow label="DEX sell tax (model)" swatch={lineStroke.tax} />
            <LegendRow label="Marketplace fee (model)" swatch={lineStroke.fee} />
          </div>

          {/* Breeding schedule table */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>
              Breeding cost schedule (per Genesis NFT)
            </div>

            <div style={{ marginTop: 8, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.18)" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: colors.text }}>Attempt</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 12, color: colors.text }}>UAP Cost</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 12, color: colors.text }}>Burned (50%)</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 12, color: colors.text }}>Treasury (50%)</th>
                  </tr>
                </thead>
                <tbody>
                  {BREEDING.map((b, i) => {
                    const burn = b.cost * 0.5;
                    const tre = b.cost * 0.5;
                    return (
                      <tr key={b.attempt} style={{ background: i % 2 === 0 ? "rgba(0,0,0,0.10)" : "rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "9px 12px", fontSize: 12, color: colors.subtext }}>Attempt {b.attempt}</td>
                        <td style={{ padding: "9px 12px", fontSize: 12, color: colors.text, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                          {formatInt(b.cost)}
                        </td>
                        <td style={{ padding: "9px 12px", fontSize: 12, color: colors.text, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                          {formatInt(burn)}
                        </td>
                        <td style={{ padding: "9px 12px", fontSize: 12, color: colors.text, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                          {formatInt(tre)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: "rgba(0,0,0,0.18)" }}>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: colors.text, fontWeight: 700 }}>Total (1–7)</td>
                    {(() => {
                      const total = BREEDING.reduce((s, b) => s + b.cost, 0);
                      const burn = total * 0.5;
                      const tre = total * 0.5;
                      return (
                        <>
                          <td style={{ padding: "10px 12px", fontSize: 12, color: colors.text, textAlign: "right", fontWeight: 700 }}>
                            {formatInt(total)}
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: 12, color: colors.text, textAlign: "right", fontWeight: 700 }}>
                            {formatInt(burn)}
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: 12, color: colors.text, textAlign: "right", fontWeight: 700 }}>
                            {formatInt(tre)}
                          </td>
                        </>
                      );
                    })()}
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 10, fontSize: 11, color: colors.subtext, lineHeight: 1.55 }}>
              Notes: Values marked “model” are implied outputs from fixed rules and scenario inputs. This is not an on-chain feed.
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {hover && tooltip ? (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              background: "rgba(0,0,0,0.70)",
              boxShadow: "0 18px 45px rgba(0,0,0,0.40)",
              padding: 12,
              pointerEvents: "none",
              ...(tooltipStyle || { left: 12, top: 12, width: 320 }),
            }}
          >
            <div style={{ margin: "0 0 8px 0", fontSize: 13, color: colors.text, fontWeight: 700 }}>
              {tooltip.title}
            </div>
            {tooltip.lines.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12, margin: "4px 0" }}>
                <div style={{ color: colors.subtext }}>{r.k}</div>
                <div style={{ color: colors.text, fontVariantNumeric: "tabular-nums" }}>{r.v}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
