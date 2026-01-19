export const UAPLifecycleStateChart = () => {
  const [inView, setInView] = React.useState(false);
  const [hover, setHover] = React.useState(null);
  const wrapRef = React.useRef(null);

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

  // -----------------------------
  // Canonical constants (locked)
  // -----------------------------
  const TOTAL_SUPPLY = 420_000_000_000;

  const ALLOC = [
    { key: "p2e", label: "Play to Earn Economy", pct: 0.5 },
    { key: "liq", label: "Liquidity and Listing", pct: 0.25 },
    { key: "eco", label: "Ecosystem Growth", pct: 0.15 },
    { key: "team", label: "Team and Advisors", pct: 0.05 },
    { key: "dev", label: "Development Fund", pct: 0.05 },
  ];

  // -----------------------------
  // Breeding schedule (approved)
  // -----------------------------
  const BREEDING = [
    { attempt: 1, cost: 25_000 },
    { attempt: 2, cost: 50_000 },
    { attempt: 3, cost: 100_000 },
    { attempt: 4, cost: 200_000 },
    { attempt: 5, cost: 400_000 },
    { attempt: 6, cost: 800_000 },
    { attempt: 7, cost: 1_600_000 },
  ];

  const formatInt = (n) => {
    const x = Math.round(Number(n) || 0);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // -----------------------------
  // Scenario model (parameterized)
  // Intentionally scenario-based, not time-based
  // -----------------------------
  const MODEL = React.useMemo(() => {
    // These are model inputs. You can expose them later as UI controls if you want.
    const activeGenesis = 10_000; // scenario scale
    const avgClaimedUapPerGenesis = 600; // scenario intensity
    const avgUpgradeSpendPerGenesis = 25_000; // scenario intensity
    const breedingAdoptionRate = 0.18; // fraction of genesis that breed in this scenario
    const avgBreedingAttempt = 3; // 1..7 average attempt used for spend weighting
    const dexSellRateOfClaims = 0.22; // fraction of claimed tokens sold on DEX in this scenario
    const hubMarketUapVolumeRate = 0.10; // fraction of claimed tokens cycling through hub marketplace settlement

    const points = 60;
    const xs = Array.from({ length: points }, (_, i) => i / (points - 1)); // 0..1

    const p2eReserve = TOTAL_SUPPLY * ALLOC.find((a) => a.key === "p2e").pct;

    // Helper: smoothstep for clean consultant style curves without implying unknown causality
    const smoothstep = (t) => t * t * (3 - 2 * t);

    // State series (each point is an accounting snapshot)
    // We model: circulation rises with claims, then sinks pull down, burned increases monotonically, treasury accumulates.
    const series = xs.map((t01, idx) => {
      const intensity = smoothstep(t01); // lifecycle intensity axis

      // Claims introduced from the P2E reserve into circulating supply
      const claimed = activeGenesis * avgClaimedUapPerGenesis * intensity;

      // Upgrade spend scales with intensity, bounded by circulating availability
      const upgradeSpend = activeGenesis * avgUpgradeSpendPerGenesis * intensity;

      // Breeding spend: adoption * average attempt cost, scales non-linearly with intensity
      const attemptIdx = clamp(Math.round(avgBreedingAttempt) - 1, 0, BREEDING.length - 1);
      const avgBreedCost = BREEDING[attemptIdx].cost;
      const breedingSpend = activeGenesis * breedingAdoptionRate * avgBreedCost * Math.pow(intensity, 1.1);

      const totalSpend = upgradeSpend + breedingSpend;

      // Burn and treasury split from in-game spend
      const burnFromSpend = totalSpend * 0.5;
      const treasuryFromSpend = totalSpend * 0.5;

      // Market friction
      const dexSellVolume = claimed * dexSellRateOfClaims;
      const dexSellTax = dexSellVolume * 0.10;

      const hubMarketVolume = claimed * hubMarketUapVolumeRate;
      const hubFee = hubMarketVolume * 0.025;

      // Treasury and burn are cumulative in this simple model
      const burned = burnFromSpend; // incremental at this point, for plotting rates we use this directly
      const treasury = treasuryFromSpend; // incremental

      // Circulating: claims in, sinks out, market friction out (tax and fee are treated as outflows from player side)
      const circulatingDelta = claimed - totalSpend - dexSellTax - hubFee;

      // Convert deltas to cumulative states for the stacked accounting band
      // We integrate with a simple running sum across points.
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

    // Integrate to build cumulative states
    let circ = 0;
    let burnedCum = 0;
    let treasuryCum = 0;

    const integrated = series.map((p, i) => {
      // Approximate step integration based on equal spacing
      const step = i === 0 ? 0 : (xs[i] - xs[i - 1]);
      // Scale to keep magnitudes realistic and readable in one panel
      // This is a display scaling factor, not a tokenomics change.
      const displayScale = 1.0;

      circ = clamp(circ + p.circulatingDelta * step * displayScale, 0, TOTAL_SUPPLY);
      burnedCum = clamp(burnedCum + p.burnFromSpend * step * displayScale, 0, TOTAL_SUPPLY);
      treasuryCum = clamp(treasuryCum + p.treasuryFromSpend * step * displayScale, 0, TOTAL_SUPPLY);

      // Reserved is the remaining not introduced to circulation, excluding burned and treasury and circulating
      // This is a visualization accounting remainder, not an on-chain balance claim.
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

    return {
      points,
      xs,
      integrated,
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
  // Layout helpers
  // -----------------------------
  const W = 980;
  const H_STATE = 190;
  const H_FLOW = 220;
  const PAD = 18;

  const xToPx = (t01) => PAD + t01 * (W - PAD * 2);

  const maxState = TOTAL_SUPPLY;
  const yState = (v) => PAD + (H_STATE - PAD * 2) * (1 - v / maxState);

  const maxFlow = React.useMemo(() => {
    // Use the maximum observed flow magnitude across series for consistent scaling
    let m = 1;
    for (const p of MODEL.integrated) {
      m = Math.max(
        m,
        p.claimed,
        p.totalSpend,
        p.burnFromSpend,
        p.treasuryFromSpend,
        p.dexSellTax,
        p.hubFee
      );
    }
    return m;
  }, [MODEL]);

  const yFlow = (v) => PAD + (H_FLOW - PAD * 2) * (1 - v / maxFlow);

  const buildPath = (getter, heightFn) => {
    const pts = MODEL.integrated;
    if (!pts.length) return "";
    let d = "";
    for (let i = 0; i < pts.length; i++) {
      const x = xToPx(pts[i].t01);
      const y = heightFn(getter(pts[i]));
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  };

  const buildStackedStateAreas = () => {
    // Build stacked areas for states: burned at bottom, then treasury, then circulating, then reserved
    const pts = MODEL.integrated;
    const layers = [
      { key: "burned", label: "Burned" },
      { key: "treasury", label: "Treasury controlled" },
      { key: "circulating", label: "Player circulating" },
      { key: "reserved", label: "Reserved (allocation baseline)" },
    ];

    // Compute cumulative bottoms
    const cumAt = (i, uptoKey) => {
      const s = pts[i].states;
      const order = ["burned", "treasury", "circulating", "reserved"];
      let sum = 0;
      for (const k of order) {
        sum += s[k];
        if (k === uptoKey) break;
      }
      return sum;
    };

    const areaPath = (key) => {
      let dTop = "";
      let dBot = "";

      for (let i = 0; i < pts.length; i++) {
        const x = xToPx(pts[i].t01);

        const s = pts[i].states;
        const order = ["burned", "treasury", "circulating", "reserved"];
        const idx = order.indexOf(key);

        const topSum = cumAt(i, key);
        const botSum = idx === 0 ? 0 : cumAt(i, order[idx - 1]);

        const yTop = yState(topSum);
        const yBot = yState(botSum);

        dTop += i === 0 ? `M ${x} ${yTop}` : ` L ${x} ${yTop}`;
        dBot = ` L ${x} ${yBot}` + dBot;
      }

      const xEnd = xToPx(pts[pts.length - 1].t01);
      const xStart = xToPx(pts[0].t01);

      return `${dTop} L ${xEnd} ${yState(0)}${dBot} L ${xStart} ${yState(0)} Z`;
    };

    return layers.map((l) => ({ ...l, d: areaPath(l.key) }));
  };

  const stateAreas = React.useMemo(() => buildStackedStateAreas(), [MODEL]);

  // -----------------------------
  // Hover handling
  // -----------------------------
  const onMove = (evt, panelTop, panelHeight) => {
    const box = evt.currentTarget.getBoundingClientRect();
    const px = evt.clientX - box.left;
    const t01 = clamp((px - PAD) / (W - PAD * 2), 0, 1);
    const idx = Math.round(t01 * (MODEL.points - 1));
    const p = MODEL.integrated[clamp(idx, 0, MODEL.points - 1)];
    setHover({
      idx: p.idx,
      t01: p.t01,
      xPx: xToPx(p.t01),
      // page positioning for tooltip
      clientX: evt.clientX,
      clientY: evt.clientY,
      panelTop,
      panelHeight,
      point: p,
    });
  };

  const onLeave = () => setHover(null);

  // Tooltip content for the hovered index
  const tooltip = React.useMemo(() => {
    if (!hover) return null;
    const p = hover.point;

    const circulating = p.states.circulating;
    const treasury = p.states.treasury;
    const burned = p.states.burned;

    const circulatingPct = (circulating / TOTAL_SUPPLY) * 100;

    return {
      title: `Lifecycle intensity: ${(p.intensity * 100).toFixed(0)}%`,
      lines: [
        { k: "Circulating supply", v: `${formatInt(circulating)} UAP` },
        { k: "Treasury controlled", v: `${formatInt(treasury)} UAP` },
        { k: "Burned supply", v: `${formatInt(burned)} UAP` },
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
  }, [hover]);

  // -----------------------------
  // Allocation bar helpers
  // -----------------------------
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

  const [allocHover, setAllocHover] = React.useState(null);

  const onAllocMove = (evt) => {
    const box = evt.currentTarget.getBoundingClientRect();
    const px = evt.clientX - box.left;
    const t01 = clamp((px - PAD) / (W - PAD * 2), 0, 1);
    const seg = allocSegments.find((s) => t01 >= s.start && t01 <= s.end) || null;
    setAllocHover(seg);
  };

  const onAllocLeave = () => setAllocHover(null);

  // -----------------------------
  // Styles
  // -----------------------------
  const styles = `
    .uap-lifecycle-root { position: relative; }
    .uap-card {
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: 14px;
      background: rgba(2, 6, 23, 0.55);
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    .uap-label { color: rgba(226, 232, 240, 0.85); }
    .uap-sub { color: rgba(148, 163, 184, 0.9); }
    .uap-grid line { stroke: rgba(148, 163, 184, 0.10); stroke-width: 1; }
    .uap-axis { stroke: rgba(148, 163, 184, 0.18); stroke-width: 1; }
    .uap-crosshair { stroke: rgba(226, 232, 240, 0.65); stroke-width: 1; }
    .uap-pulse {
      animation: uapPulse 1400ms ease-in-out infinite;
      transform-origin: center;
    }
    @keyframes uapPulse {
      0% { opacity: 0.40; }
      50% { opacity: 0.95; }
      100% { opacity: 0.40; }
    }
    .uap-fade-in {
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 240ms ease, transform 240ms ease;
    }
    .uap-fade-in.on {
      opacity: 1;
      transform: translateY(0px);
    }
    .uap-tooltip {
      position: fixed;
      z-index: 50;
      width: 320px;
      border-radius: 12px;
      border: 1px solid rgba(148, 163, 184, 0.18);
      background: rgba(2, 6, 23, 0.92);
      box-shadow: 0 18px 45px rgba(0,0,0,0.40);
      padding: 12px;
      pointer-events: none;
    }
    .uap-tooltip h4 {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: rgba(226, 232, 240, 0.95);
      font-weight: 600;
    }
    .uap-tooltip .row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 12px;
      line-height: 1.35;
      margin: 4px 0;
    }
    .uap-tooltip .k { color: rgba(148, 163, 184, 0.95); }
    .uap-tooltip .v { color: rgba(226, 232, 240, 0.92); font-variant-numeric: tabular-nums; }
    .uap-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
      font-size: 12px;
    }
    .uap-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      border: 1px solid rgba(226, 232, 240, 0.30);
      background: rgba(226, 232, 240, 0.20);
    }
    .uap-note {
      font-size: 12px;
      color: rgba(148, 163, 184, 0.95);
      margin-top: 10px;
    }
  `;

  // Color strategy: keep neutral, no bright palette commitments in the chart layer.
  // Use alpha-coded fills, not saturated colors, to avoid "marketing" aesthetics.
  const layerFill = {
    burned: "rgba(226, 232, 240, 0.10)",
    "Treasury controlled": "rgba(226, 232, 240, 0.08)",
    "Player circulating": "rgba(226, 232, 240, 0.14)",
    "Reserved (allocation baseline)": "rgba(226, 232, 240, 0.06)",
  };

  const lineStroke = {
    claimed: "rgba(226, 232, 240, 0.85)",
    spend: "rgba(226, 232, 240, 0.55)",
    burn: "rgba(226, 232, 240, 0.35)",
    treasury: "rgba(226, 232, 240, 0.28)",
    tax: "rgba(226, 232, 240, 0.22)",
    fee: "rgba(226, 232, 240, 0.18)",
  };

  const stateLegend = [
    { k: "Player circulating", s: layerFill["Player circulating"] },
    { k: "Treasury controlled", s: layerFill["Treasury controlled"] },
    { k: "Burned", s: layerFill["burned"] },
    { k: "Reserved", s: layerFill["Reserved (allocation baseline)"] },
  ];

  const flowLegend = [
    { k: "Claimed (model)", s: lineStroke.claimed },
    { k: "Total spend (model)", s: lineStroke.spend },
    { k: "Burn from spend (model)", s: lineStroke.burn },
    { k: "Treasury from spend (model)", s: lineStroke.treasury },
    { k: "DEX sell tax (model)", s: lineStroke.tax },
    { k: "Marketplace fee (model)", s: lineStroke.fee },
  ];

  const allocationTooltip = React.useMemo(() => {
    if (!allocHover) return null;
    return {
      title: "Supply and Allocation",
      lines: [
        { k: "Category", v: allocHover.label },
        { k: "Share", v: `${(allocHover.pct * 100).toFixed(0)}%` },
        { k: "Amount", v: `${formatInt(allocHover.amount)} UAP` },
        { k: "Total supply", v: `${formatInt(TOTAL_SUPPLY)} UAP` },
      ],
    };
  }, [allocHover]);

  // Tooltip positioning
  const tooltipStyle = React.useMemo(() => {
    if (!hover || !tooltip) return null;
    const margin = 14;
    const w = 320;
    const h = 280;
    let left = hover.clientX + margin;
    let top = hover.clientY + margin;

    // Keep inside viewport
    const vw = window.innerWidth || 1200;
    const vh = window.innerHeight || 800;

    if (left + w > vw - 8) left = hover.clientX - w - margin;
    if (top + h > vh - 8) top = hover.clientY - h - margin;

    return { left, top };
  }, [hover, tooltip]);

  const allocTooltipStyle = React.useMemo(() => {
    if (!allocHover || !allocationTooltip) return null;
    return { left: 24, top: 18 };
  }, [allocHover, allocationTooltip]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="not-prose uap-lifecycle-root" ref={wrapRef}>
      <style>{styles}</style>

      <div className={`uap-fade-in ${inView ? "on" : ""}`}>
        <div className="uap-card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <div>
              <div className="uap-label" style={{ fontSize: 14, fontWeight: 700 }}>
                UAP Lifecycle State Chart
              </div>
              <div className="uap-sub" style={{ fontSize: 12, marginTop: 4 }}>
                Scenario-based analytical view. Fixed supply accounting reconciles to {formatInt(TOTAL_SUPPLY)} UAP.
              </div>
            </div>
            <div className="uap-sub" style={{ fontSize: 12, textAlign: "right" }}>
              Burn and treasury routing: 50% / 50% on in-game spend
            </div>
          </div>

          {/* Allocation module */}
          <div style={{ marginTop: 14 }}>
            <div className="uap-label" style={{ fontSize: 12, fontWeight: 600 }}>
              Supply and Allocation (static baseline)
            </div>

            <svg
              width="100%"
              viewBox={`0 0 ${W} 86`}
              style={{ marginTop: 8, display: "block" }}
              onMouseMove={onAllocMove}
              onMouseLeave={onAllocLeave}
            >
              <g className="uap-grid">
                <line x1={PAD} y1={18} x2={W - PAD} y2={18} />
                <line x1={PAD} y1={58} x2={W - PAD} y2={58} />
              </g>

              <rect
                x={PAD}
                y={26}
                width={W - PAD * 2}
                height={24}
                rx={10}
                fill="rgba(226,232,240,0.06)"
                stroke="rgba(148,163,184,0.18)"
              />

              {allocSegments.map((s) => {
                const x = xToPx(s.start);
                const w = (W - PAD * 2) * (s.end - s.start);
                const isHot = allocHover && allocHover.key === s.key;
                return (
                  <g key={s.key}>
                    <rect
                      x={x}
                      y={26}
                      width={w}
                      height={24}
                      rx={10}
                      fill={isHot ? "rgba(226,232,240,0.22)" : "rgba(226,232,240,0.12)"}
                      stroke={isHot ? "rgba(226,232,240,0.55)" : "rgba(148,163,184,0.20)"}
                    />
                  </g>
                );
              })}

              <line className="uap-axis" x1={PAD} y1={68} x2={W - PAD} y2={68} />
              <text x={PAD} y={80} fill="rgba(148,163,184,0.95)" fontSize="11">
                0%
              </text>
              <text x={W - PAD} y={80} fill="rgba(148,163,184,0.95)" fontSize="11" textAnchor="end">
                100%
              </text>
            </svg>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              {ALLOC.map((a) => (
                <div
                  key={a.key}
                  style={{
                    border: "1px solid rgba(148, 163, 184, 0.14)",
                    borderRadius: 12,
                    padding: "10px 12px",
                    background: "rgba(2, 6, 23, 0.35)",
                  }}
                >
                  <div className="uap-label" style={{ fontSize: 12, fontWeight: 600 }}>
                    {a.label}
                  </div>
                  <div className="uap-sub" style={{ fontSize: 12, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                    <span>{(a.pct * 100).toFixed(0)}%</span>
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatInt(TOTAL_SUPPLY * a.pct)} UAP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* State module */}
          <div style={{ marginTop: 16 }}>
            <div className="uap-label" style={{ fontSize: 12, fontWeight: 600 }}>
              Lifecycle states (accounting bands, reconcile to fixed supply)
            </div>

            <svg
              width="100%"
              viewBox={`0 0 ${W} ${H_STATE}`}
              style={{ marginTop: 8, display: "block" }}
              onMouseMove={(e) => onMove(e, 0, H_STATE)}
              onMouseLeave={onLeave}
            >
              <g className="uap-grid">
                {Array.from({ length: 5 }, (_, i) => {
                  const y = PAD + (i * (H_STATE - PAD * 2)) / 4;
                  return <line key={i} x1={PAD} y1={y} x2={W - PAD} y2={y} />;
                })}
              </g>

              {stateAreas.map((a) => {
                const fillKey =
                  a.key === "burned"
                    ? "burned"
                    : a.label === "Treasury controlled"
                    ? "Treasury controlled"
                    : a.label === "Player circulating"
                    ? "Player circulating"
                    : "Reserved (allocation baseline)";

                const fill = layerFill[fillKey] || "rgba(226,232,240,0.08)";
                return (
                  <path
                    key={a.key}
                    d={a.d}
                    fill={fill}
                    stroke="rgba(148,163,184,0.18)"
                    strokeWidth="1"
                  />
                );
              })}

              <line className="uap-axis" x1={PAD} y1={H_STATE - PAD} x2={W - PAD} y2={H_STATE - PAD} />
              <text x={PAD} y={16} fill="rgba(148,163,184,0.95)" fontSize="11">
                420B
              </text>
              <text x={PAD} y={H_STATE - 6} fill="rgba(148,163,184,0.95)" fontSize="11">
                0
              </text>

              {hover ? (
                <g>
                  <line className="uap-crosshair uap-pulse" x1={hover.xPx} y1={PAD} x2={hover.xPx} y2={H_STATE - PAD} />
                  <circle className="uap-pulse" cx={hover.xPx} cy={PAD + 6} r="3.5" fill="rgba(226,232,240,0.85)" />
                </g>
              ) : null}
            </svg>

            <div className="uap-legend">
              {stateLegend.map((l) => (
                <div key={l.k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="uap-dot" style={{ background: l.s }} />
                  <span className="uap-sub">{l.k}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flow module */}
          <div style={{ marginTop: 16 }}>
            <div className="uap-label" style={{ fontSize: 12, fontWeight: 600 }}>
              Lifecycle flows (scenario rates, model-based)
            </div>

            <svg
              width="100%"
              viewBox={`0 0 ${W} ${H_FLOW}`}
              style={{ marginTop: 8, display: "block" }}
              onMouseMove={(e) => onMove(e, H_STATE + 20, H_FLOW)}
              onMouseLeave={onLeave}
            >
              <g className="uap-grid">
                {Array.from({ length: 5 }, (_, i) => {
                  const y = PAD + (i * (H_FLOW - PAD * 2)) / 4;
                  return <line key={i} x1={PAD} y1={y} x2={W - PAD} y2={y} />;
                })}
              </g>

              {/* Lines */}
              <path
                d={buildPath((p) => p.claimed, yFlow)}
                fill="none"
                stroke={lineStroke.claimed}
                strokeWidth="2"
              />
              <path
                d={buildPath((p) => p.totalSpend, yFlow)}
                fill="none"
                stroke={lineStroke.spend}
                strokeWidth="2"
              />
              <path
                d={buildPath((p) => p.burnFromSpend, yFlow)}
                fill="none"
                stroke={lineStroke.burn}
                strokeWidth="2"
              />
              <path
                d={buildPath((p) => p.treasuryFromSpend, yFlow)}
                fill="none"
                stroke={lineStroke.treasury}
                strokeWidth="2"
              />
              <path
                d={buildPath((p) => p.dexSellTax, yFlow)}
                fill="none"
                stroke={lineStroke.tax}
                strokeWidth="2"
              />
              <path
                d={buildPath((p) => p.hubFee, yFlow)}
                fill="none"
                stroke={lineStroke.fee}
                strokeWidth="2"
              />

              <line className="uap-axis" x1={PAD} y1={H_FLOW - PAD} x2={W - PAD} y2={H_FLOW - PAD} />

              {hover ? (
                <g>
                  <line className="uap-crosshair uap-pulse" x1={hover.xPx} y1={PAD} x2={hover.xPx} y2={H_FLOW - PAD} />
                  <circle className="uap-pulse" cx={hover.xPx} cy={H_FLOW - PAD - 6} r="3.5" fill="rgba(226,232,240,0.85)" />
                </g>
              ) : null}
            </svg>

            <div className="uap-legend">
              {flowLegend.map((l) => (
                <div key={l.k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="uap-dot" style={{ background: l.s }} />
                  <span className="uap-sub">{l.k}</span>
                </div>
              ))}
            </div>

            {/* Breeding schedule table (publishable) */}
            <div style={{ marginTop: 14 }}>
              <div className="uap-label" style={{ fontSize: 12, fontWeight: 600 }}>
                Breeding cost schedule (per Genesis NFT, max 7 executions)
              </div>

              <div
                style={{
                  marginTop: 8,
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(2,6,23,0.55)" }}>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: "rgba(226,232,240,0.92)" }}>
                        Attempt
                      </th>
                      <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 12, color: "rgba(226,232,240,0.92)" }}>
                        UAP Cost
                      </th>
                      <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 12, color: "rgba(226,232,240,0.92)" }}>
                        Burned (50%)
                      </th>
                      <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 12, color: "rgba(226,232,240,0.92)" }}>
                        Treasury (50%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {BREEDING.map((b, i) => {
                      const burn = b.cost * 0.5;
                      const tre = b.cost * 0.5;
                      return (
                        <tr
                          key={b.attempt}
                          style={{
                            background: i % 2 === 0 ? "rgba(2,6,23,0.32)" : "rgba(2,6,23,0.20)",
                            borderTop: "1px solid rgba(148,163,184,0.10)",
                          }}
                        >
                          <td style={{ padding: "9px 12px", fontSize: 12, color: "rgba(148,163,184,0.95)" }}>
                            Attempt {b.attempt}
                          </td>
                          <td
                            style={{
                              padding: "9px 12px",
                              fontSize: 12,
                              color: "rgba(226,232,240,0.92)",
                              textAlign: "right",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {formatInt(b.cost)}
                          </td>
                          <td
                            style={{
                              padding: "9px 12px",
                              fontSize: 12,
                              color: "rgba(226,232,240,0.92)",
                              textAlign: "right",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {formatInt(burn)}
                          </td>
                          <td
                            style={{
                              padding: "9px 12px",
                              fontSize: 12,
                              color: "rgba(226,232,240,0.92)",
                              textAlign: "right",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {formatInt(tre)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr style={{ background: "rgba(2,6,23,0.62)", borderTop: "1px solid rgba(148,163,184,0.14)" }}>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "rgba(226,232,240,0.92)", fontWeight: 600 }}>
                        Total (Attempts 1–7)
                      </td>
                      {(() => {
                        const total = BREEDING.reduce((s, b) => s + b.cost, 0);
                        const burn = total * 0.5;
                        const tre = total * 0.5;
                        return (
                          <>
                            <td style={{ padding: "10px 12px", fontSize: 12, color: "rgba(226,232,240,0.92)", textAlign: "right", fontWeight: 600 }}>
                              {formatInt(total)}
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: 12, color: "rgba(226,232,240,0.92)", textAlign: "right", fontWeight: 600 }}>
                              {formatInt(burn)}
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: 12, color: "rgba(226,232,240,0.92)", textAlign: "right", fontWeight: 600 }}>
                              {formatInt(tre)}
                            </td>
                          </>
                        );
                      })()}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="uap-note">
                Notes: This chart is scenario-based. Values marked “model” are implied outputs from the fixed rules and the displayed inputs, not an on-chain oracle feed.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover tooltip for state + flow panels */}
      {hover && tooltip ? (
        <div className="uap-tooltip" style={tooltipStyle || { left: 24, top: 24 }}>
          <h4>{tooltip.title}</h4>
          {tooltip.lines.map((r, i) => (
            <div className="row" key={i}>
              <div className="k">{r.k}</div>
              <div className="v">{r.v}</div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Allocation tooltip (top-left anchored to keep stable) */}
      {allocHover && allocationTooltip ? (
        <div className="uap-tooltip" style={allocTooltipStyle || { left: 24, top: 24 }}>
          <h4>{allocationTooltip.title}</h4>
          {allocationTooltip.lines.map((r, i) => (
            <div className="row" key={i}>
              <div className="k">{r.k}</div>
              <div className="v">{r.v}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
