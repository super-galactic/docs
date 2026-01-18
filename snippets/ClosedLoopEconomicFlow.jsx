// ClosedLoopEconomicFlow.jsx
export const ClosedLoopEconomicFlow = () => {
  const [currentStep, setCurrentStep] = React.useState(0); // 0..5
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [runId, setRunId] = React.useState(0);
  const [pulseOn, setPulseOn] = React.useState(false);

  const timerRef = React.useRef(null);

  const stepDurationMs = 820;

  const colors = {
    border: "rgba(255,255,255,0.10)",
    panel: "rgba(255,255,255,0.03)",
    panelInner: "rgba(2, 6, 23, 0.55)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    muted: "rgba(255,255,255,0.52)",
    line: "rgba(255,255,255,0.26)",
    lineDim: "rgba(255,255,255,0.14)",
    nodeFill: "rgba(15, 23, 42, 0.78)",
    nodeFillActive: "rgba(30, 41, 59, 0.92)",
    glow: "rgba(34,197,94,0.22)",
    glowStrong: "rgba(226,232,240,0.22)",
  };

  const steps = React.useMemo(
    () => [
      "Gameplay Activity",
      "Reward Generation",
      "Player Wallet",
      "Token Sinks",
      "Burn and Game Treasury",
      "Gameplay Re entry",
    ],
    []
  );

  const arrowLabels = React.useMemo(
    () => [
      "Reward issuance (capped)",
      "Claimable rewards",
      "Voluntary spend",
      "Supply reduction and routing",
      "Progression continuity",
      "Continued participation",
    ],
    []
  );

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const triggerPulse = () => {
    setPulseOn(false);
    setTimeout(() => setPulseOn(true), 30);
    setTimeout(() => setPulseOn(false), 930);
  };

  React.useEffect(() => {
    clearTimer();
    return () => clearTimer();
  }, []);

  React.useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
      triggerPulse();
    }, stepDurationMs);

    return () => clearTimer();
  }, [isPlaying, currentStep, runId, steps.length]);

  const onPlay = () => {
    clearTimer();
    setRunId((r) => r + 1);
    setCurrentStep(0);
    setIsPlaying(true);
    triggerPulse();
  };

  const onNodeClick = (idx) => {
    setCurrentStep(idx);
    triggerPulse();
  };

  const geo = React.useMemo(() => {
    const W = 900;
    const H = 580;
    const cx = 450;
    const cy = 285;
    const R = 200;

    const nodeW = 200;
    const nodeH = 56;

    const nodes = steps.map((_, i) => {
      const angle = (-90 + i * (360 / steps.length)) * (Math.PI / 180);
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      return {
        i,
        angle,
        cx: x,
        cy: y,
        x: x - nodeW / 2,
        y: y - nodeH / 2,
        w: nodeW,
        h: nodeH,
      };
    });

    const quadPoint = (p0, p1, pc, t) => {
      const x =
        (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * pc.x + t * t * p1.x;
      const y =
        (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * pc.y + t * t * p1.y;
      return { x, y };
    };

    const arrows = nodes.map((n, i) => {
      const next = nodes[(i + 1) % nodes.length];

      const start = {
        x: n.cx + Math.cos(n.angle) * (nodeW * 0.52),
        y: n.cy + Math.sin(n.angle) * (nodeH * 0.62),
      };
      const end = {
        x: next.cx + Math.cos(next.angle) * (nodeW * 0.52),
        y: next.cy + Math.sin(next.angle) * (nodeH * 0.62),
      };

      const midAngle = (n.angle + next.angle) / 2;
      const control = {
        x: cx + (R + 66) * Math.cos(midAngle),
        y: cy + (R + 66) * Math.sin(midAngle),
      };

      const d = `M ${start.x.toFixed(2)} ${start.y.toFixed(
        2
      )} Q ${control.x.toFixed(2)} ${control.y.toFixed(2)} ${end.x.toFixed(
        2
      )} ${end.y.toFixed(2)}`;

      const labelPt = quadPoint(start, end, control, 0.5);

      const vX = labelPt.x - cx;
      const vY = labelPt.y - cy;
      const vLen = Math.max(1, Math.hypot(vX, vY));
      const label = {
        x: labelPt.x + (vX / vLen) * 14,
        y: labelPt.y + (vY / vLen) * 14,
      };

      return { i, d, label };
    });

    return { W, H, cx, cy, R, nodes, arrows };
  }, [steps]);

  const baseNodeOpacity = 0.48;
  const baseArrowOpacity = 0.35;

  const isActiveNode = (i) => i === currentStep;
  const isActiveArrow = (i) => i === currentStep;

  return (
    <div className="not-prose w-full">
      <div
        className="rounded-2xl border p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
        style={{ borderColor: colors.border, background: colors.panel }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="text-lg font-semibold text-slate-100 select-none cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={onPlay}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onPlay();
              }}
            >
              Closed Loop Economic Flow
            </div>

            <span className="text-xs text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <button
            type="button"
            aria-label="Play closed loop economic flow"
            onClick={onPlay}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/10 active:bg-white/15"
          >
            Play
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div style={{ background: colors.panelInner }}>
            <svg
              className="h-auto w-full"
              viewBox={`0 0 ${geo.W} ${geo.H}`}
              role="img"
              aria-label="Closed Loop Economic Flow diagram"
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

              <circle
                cx={geo.cx}
                cy={geo.cy}
                r={geo.R}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />

              {geo.arrows.map((a) => {
                const active = isActiveArrow(a.i);
                const opacity = active ? 1 : baseArrowOpacity;

                const stroke = active ? "rgba(226,232,240,0.95)" : colors.line;
                const strokeWidth = active ? 3.2 : 2;

                return (
                  <g key={`arrow-${a.i}`} style={{ transition: "opacity 180ms ease" }}>
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
                    <text
                      x={a.label.x}
                      y={a.label.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      opacity={opacity}
                      fill={active ? "rgba(226,232,240,0.95)" : "rgba(226,232,240,0.64)"}
                      style={{ transition: "opacity 180ms ease, fill 180ms ease" }}
                    >
                      {arrowLabels[a.i]}
                    </text>
                  </g>
                );
              })}

              {geo.nodes.map((n) => {
                const active = isActiveNode(n.i);
                const opacity = active ? 1 : baseNodeOpacity;

                const border = active ? "rgba(226,232,240,0.85)" : "rgba(226,232,240,0.28)";
                const strokeWidth = active ? 2.2 : 1.4;

                const fill = active ? colors.nodeFillActive : colors.nodeFill;

                const scale = active && pulseOn ? 1.02 : 1.0;

                const boxShadow =
                  active && pulseOn
                    ? "0 0 0 1px rgba(226,232,240,0.18), 0 0 26px rgba(226,232,240,0.10)"
                    : "none";

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
                        stroke={border}
                        strokeWidth={strokeWidth}
                        style={{
                          transition: "fill 180ms ease, stroke 180ms ease, stroke-width 180ms ease",
                        }}
                      />
                      <foreignObject x={n.x} y={n.y} width={n.w} height={n.h}>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                            color: colors.text,
                            textAlign: "center",
                            padding: "0 10px",
                            lineHeight: 1.15,
                            textShadow: boxShadow,
                          }}
                        >
                          {steps[n.i]}
                        </div>
                      </foreignObject>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-sm text-slate-200">Diagram mirrors Closed Loop Flow mechanics.</div>
          <div className="text-sm text-slate-200">No percentages. No market trading paths.</div>
        </div>
      </div>
    </div>
  );
};
