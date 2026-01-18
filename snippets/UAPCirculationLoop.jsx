export const UAPCirculationLoop = () => {
  const [currentStep, setCurrentStep] = React.useState(0); // 0..5 (node-focused)
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [pulseOn, setPulseOn] = React.useState(false);
  const timerRef = React.useRef(null);

  const stepDurationMs = 820;

  const nodes = [
    "Gameplay Activity",
    "Reward Generation",
    "Player Wallet",
    "Token Sinks",
    "Burn and Game Treasury",
    "UAP Scarcity",
  ];

  const arrows = [
    "Reward issuance (capped)",
    "Claimable rewards",
    "Voluntary spend",
    "Supply reduction and routing",
    "Reduced circulating supply increases UAP scarcity",
  ];

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const triggerPulse = () => {
    setPulseOn(false);
    setTimeout(() => setPulseOn(true), 30);
    setTimeout(() => setPulseOn(false), 900);
  };

  React.useEffect(() => {
    clearTimer();
    return () => clearTimer();
  }, []);

  React.useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= nodes.length - 1) {
      setIsPlaying(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, nodes.length - 1));
      triggerPulse();
    }, stepDurationMs);

    return () => clearTimer();
  }, [isPlaying, currentStep]);

  const onPlay = () => {
    clearTimer();
    setCurrentStep(0);
    setIsPlaying(true);
    triggerPulse();
  };

  const onNodeClick = (idx) => {
    setCurrentStep(idx);
    triggerPulse();
  };

  const geo = React.useMemo(() => {
    // Broken arc layout: first five nodes on a 260 degree arc, Scarcity detached below-right.
    const W = 940;
    const H = 600;

    const cx = 460;
    const cy = 285;
    const R = 210;

    const nodeW = 210;
    const nodeH = 58;

    const arcCount = 5;
    const startDeg = -140;
    const sweepDeg = 260;

    const arcNodes = Array.from({ length: arcCount }).map((_, i) => {
      const deg = startDeg + (sweepDeg * i) / (arcCount - 1);
      const angle = (deg * Math.PI) / 180;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      return { i, angle, cx: x, cy: y };
    });

    const scarcity = {
      i: 5,
      // detached terminal node
      cx: cx + 210,
      cy: cy + 220,
      angle: 0,
    };

    const positions = [
      ...arcNodes.map((p) => ({
        ...p,
        x: p.cx - nodeW / 2,
        y: p.cy - nodeH / 2,
        w: nodeW,
        h: nodeH,
      })),
      {
        ...scarcity,
        x: scarcity.cx - nodeW / 2,
        y: scarcity.cy - nodeH / 2,
        w: nodeW,
        h: nodeH,
      },
    ];

    const quadPoint = (p0, p1, pc, t) => {
      const x =
        (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * pc.x + t * t * p1.x;
      const y =
        (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * pc.y + t * t * p1.y;
      return { x, y };
    };

    const makeArrow = (from, to, mode) => {
      // mode controls curvature direction: "outer" follows arc, "down" routes to terminal
      const p0 = { x: from.cx, y: from.cy };
      const p1 = { x: to.cx, y: to.cy };

      let control;
      if (mode === "outer") {
        // control point slightly outside the arc for readability
        const mid = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
        const vX = mid.x - cx;
        const vY = mid.y - cy;
        const vLen = Math.max(1, Math.hypot(vX, vY));
        control = { x: mid.x + (vX / vLen) * 46, y: mid.y + (vY / vLen) * 46 };
      } else {
        // route downward to Scarcity, keep it clearly terminal
        const mid = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
        control = { x: mid.x + 28, y: mid.y + 68 };
      }

      const d = `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} Q ${control.x.toFixed(
        2
      )} ${control.y.toFixed(2)} ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;

      const labelPt = quadPoint(p0, p1, control, 0.5);

      // label offset away from node centers
      const vX = labelPt.x - cx;
      const vY = labelPt.y - cy;
      const vLen = Math.max(1, Math.hypot(vX, vY));
      const label = {
        x: labelPt.x + (vX / vLen) * 14,
        y: labelPt.y + (vY / vLen) * 14,
      };

      return { d, label };
    };

    const arrowsGeo = [
      makeArrow(positions[0], positions[1], "outer"),
      makeArrow(positions[1], positions[2], "outer"),
      makeArrow(positions[2], positions[3], "outer"),
      makeArrow(positions[3], positions[4], "outer"),
      makeArrow(positions[4], positions[5], "down"),
    ];

    // A subtle baseline guide for the arc only (not a full ring)
    const guideArc = (() => {
      const a0 = positions[0];
      const a4 = positions[4];
      const p0 = { x: a0.cx, y: a0.cy };
      const p1 = { x: a4.cx, y: a4.cy };
      const mid = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
      const vX = mid.x - cx;
      const vY = mid.y - cy;
      const vLen = Math.max(1, Math.hypot(vX, vY));
      const control = { x: mid.x + (vX / vLen) * 92, y: mid.y + (vY / vLen) * 92 };
      return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} Q ${control.x.toFixed(
        2
      )} ${control.y.toFixed(2)} ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
    })();

    return { W, H, positions, arrowsGeo, guideArc };
  }, []);

  const baseNodeOpacity = 0.44;
  const baseArrowOpacity = 0.28;

  const activeArrowIndex = Math.min(currentStep, 4); // step 5 highlights arrow 5 (index 4)

  return (
    <div className="not-prose w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-slate-100 select-none">
            UAP Circulation Loop
          </div>

          <button
            type="button"
            aria-label="Play UAP circulation loop"
            onClick={onPlay}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/10 active:bg-white/15"
          >
            Play
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
          <svg
            className="h-auto w-full"
            viewBox={`0 0 ${geo.W} ${geo.H}`}
            role="img"
            aria-label="UAP Circulation Loop diagram"
          >
            <defs>
              <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.65 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <marker
                id="arrowHead"
                markerWidth="10"
                markerHeight="10"
                refX="8.5"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(226,232,240,0.9)" />
              </marker>
            </defs>

            {/* Broken arc guide (subtle) */}
            <path
              d={geo.guideArc}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
            />

            {/* Arrows (5 total) */}
            {geo.arrowsGeo.map((a, i) => {
              const active = i === activeArrowIndex;
              const opacity = active ? 1 : baseArrowOpacity;

              const stroke = active
                ? "rgba(226,232,240,0.95)"
                : "rgba(226,232,240,0.35)";
              const strokeWidth = active ? 3.2 : 2;

              // label handling: keep final label readable by giving it a small backing chip
              const label = arrows[i];
              const isFinal = i === 4;

              return (
                <g key={`arrow-${i}`}>
                  <path
                    d={a.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    markerEnd="url(#arrowHead)"
                    strokeLinecap="round"
                    style={{ transition: "stroke 180ms ease, stroke-width 180ms ease, opacity 180ms ease" }}
                  />

                  {isFinal ? (
                    <g opacity={opacity}>
                      <rect
                        x={a.label.x - 150}
                        y={a.label.y - 13}
                        width={300}
                        height={26}
                        rx={999}
                        fill="rgba(0,0,0,0.28)"
                        stroke="rgba(255,255,255,0.10)"
                      />
                      <text
                        x={a.label.x}
                        y={a.label.y + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="12"
                        fill={active ? "rgba(226,232,240,0.92)" : "rgba(226,232,240,0.70)"}
                      >
                        {label}
                      </text>
                    </g>
                  ) : (
                    <text
                      x={a.label.x}
                      y={a.label.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      opacity={opacity}
                      fill={active ? "rgba(226,232,240,0.90)" : "rgba(226,232,240,0.60)"}
                      style={{ transition: "opacity 180ms ease, fill 180ms ease" }}
                    >
                      {label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {geo.positions.map((n) => {
              const active = n.i === currentStep;
              const opacity = active ? 1 : baseNodeOpacity;

              const isScarcity = n.i === 5;

              const scale = active && pulseOn ? 1.02 : 1.0;

              const border = active
                ? "rgba(226,232,240,0.86)"
                : isScarcity
                ? "rgba(226,232,240,0.34)"
                : "rgba(226,232,240,0.26)";

              const strokeWidth = active ? 2.2 : isScarcity ? 1.8 : 1.4;

              const fill = active
                ? "rgba(30,41,59,0.92)"
                : isScarcity
                ? "rgba(20, 30, 46, 0.78)"
                : "rgba(15,23,42,0.84)";

              return (
                <g
                  key={`node-${n.i}`}
                  onClick={() => onNodeClick(n.i)}
                  style={{
                    cursor: "pointer",
                    opacity,
                    transition: "opacity 180ms ease",
                  }}
                >
                  <g
                    transform={`translate(${n.cx} ${n.cy}) scale(${scale}) translate(${-n.cx} ${-n.cy})`}
                    style={{
                      transition: "transform 260ms ease",
                      filter: active ? "url(#softGlow)" : "none",
                    }}
                  >
                    <rect
                      x={n.x}
                      y={n.y}
                      width={n.w}
                      height={n.h}
                      rx="14"
                      ry="14"
                      fill={fill}
                      stroke={border}
                      strokeWidth={strokeWidth}
                      style={{
                        transition: "fill 180ms ease, stroke 180ms ease, stroke-width 180ms ease",
                      }}
                    />
                    <foreignObject x={n.x} y={n.y} width={n.w} height={n.h}>
                      <div
                        className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-100 text-center px-3"
                        style={{ lineHeight: 1.15 }}
                      >
                        {nodes[n.i]}
                      </div>
                    </foreignObject>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
          Illustrates UAP movement through gameplay rewards, sinks, and supply reduction.
        </div>
      </div>
    </div>
  );
};
