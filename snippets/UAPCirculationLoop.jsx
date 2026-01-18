export const UAPCirculationLoop = () => {
  const [currentStep, setCurrentStep] = React.useState(0); // 0..5
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

  const arrowLabels = [
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
    const W = 960;
    const H = 600;

    const nodeW = 210;
    const nodeH = 58;

    // Fixed horseshoe positions tuned for node size and label clearance
    const P = [
      { cx: 310, cy: 185 }, // Gameplay Activity
      { cx: 505, cy: 125 }, // Reward Generation
      { cx: 675, cy: 220 }, // Player Wallet
      { cx: 640, cy: 370 }, // Token Sinks
      { cx: 420, cy: 385 }, // Burn and Game Treasury
      { cx: 730, cy: 440 }, // UAP Scarcity (terminal, detached)
    ].map((p, i) => ({
      i,
      ...p,
      x: p.cx - nodeW / 2,
      y: p.cy - nodeH / 2,
      w: nodeW,
      h: nodeH,
    }));

    // Routed connectors (no “full circle”, no intersecting geometry)
    const paths = [
      // 0 -> 1
      {
        d: `M ${P[0].cx + 105} ${P[0].cy - 8} Q ${P[0].cx + 150} ${
          P[0].cy - 70
        } ${P[1].cx - 105} ${P[1].cy + 4}`,
        label: { x: 410, y: 120 },
      },
      // 1 -> 2
      {
        d: `M ${P[1].cx + 90} ${P[1].cy + 14} Q ${P[1].cx + 170} ${
          P[1].cy + 70
        } ${P[2].cx - 105} ${P[2].cy - 6}`,
        label: { x: 615, y: 165 },
      },
      // 2 -> 3
      {
        d: `M ${P[2].cx - 25} ${P[2].cy + 36} Q ${P[2].cx - 10} ${
          P[2].cy + 120
        } ${P[3].cx + 70} ${P[3].cy - 34}`,
        label: { x: 700, y: 315 },
      },
      // 3 -> 4
      {
        d: `M ${P[3].cx - 105} ${P[3].cy + 12} Q ${P[3].cx - 190} ${
          P[3].cy + 70
        } ${P[4].cx + 90} ${P[4].cy + 12}`,
        label: { x: 520, y: 435 },
      },
      // 4 -> 5 (terminal lane)
      {
        d: `M ${P[4].cx + 110} ${P[4].cy + 8} Q ${P[4].cx + 210} ${
          P[4].cy + 55
        } ${P[5].cx - 115} ${P[5].cy - 10}`,
        label: { x: 700, y: 500 }, // handled as chip near terminal
      },
    ];

    return { W, H, P, paths };
  }, []);

  const baseNodeOpacity = 0.46;
  const baseArrowOpacity = 0.30;

  const activeArrowIndex = Math.min(currentStep, 4);

  return (
    <div className="not-prose w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-slate-100">UAP Circulation Loop</div>
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

              <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(226,232,240,0.9)" />
              </marker>
            </defs>

            {/* Connectors */}
            {geo.paths.map((p, i) => {
              const active = i === activeArrowIndex;
              const opacity = active ? 1 : baseArrowOpacity;

              return (
                <g key={`path-${i}`} opacity={opacity}>
                  <path
                    d={p.d}
                    fill="none"
                    stroke={active ? "rgba(226,232,240,0.95)" : "rgba(226,232,240,0.35)"}
                    strokeWidth={active ? 3.2 : 2}
                    strokeLinecap="round"
                    markerEnd="url(#arrowHead)"
                    style={{ transition: "stroke 180ms ease, stroke-width 180ms ease, opacity 180ms ease" }}
                  />

                  {/* Standard labels as compact text */}
                  {i < 4 ? (
                    <text
                      x={p.label.x}
                      y={p.label.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fill={active ? "rgba(226,232,240,0.90)" : "rgba(226,232,240,0.60)"}
                      style={{ transition: "fill 180ms ease" }}
                    >
                      {arrowLabels[i]}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {/* Terminal label chip for the long final text */}
            <g opacity={activeArrowIndex === 4 ? 1 : baseArrowOpacity}>
              <rect
                x={560}
                y={492}
                width={360}
                height={28}
                rx={999}
                fill="rgba(0,0,0,0.28)"
                stroke="rgba(255,255,255,0.10)"
              />
              <text
                x={740}
                y={506}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill={activeArrowIndex === 4 ? "rgba(226,232,240,0.90)" : "rgba(226,232,240,0.70)"}
              >
                {arrowLabels[4]}
              </text>
            </g>

            {/* Nodes */}
            {geo.P.map((n) => {
              const active = n.i === currentStep;
              const opacity = active ? 1 : baseNodeOpacity;

              const isScarcity = n.i === 5;

              const scale = active && pulseOn ? 1.02 : 1.0;

              const stroke = active
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
                  style={{ cursor: "pointer", opacity, transition: "opacity 180ms ease" }}
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
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      style={{ transition: "fill 180ms ease, stroke 180ms ease, stroke-width 180ms ease" }}
                    />
                    <foreignObject x={n.x} y={n.y} width={n.w} height={n.h}>
                      <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-100 text-center px-3">
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
