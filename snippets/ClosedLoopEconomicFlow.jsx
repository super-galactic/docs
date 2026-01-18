export const ClosedLoopEconomicFlow = () => {
  const React = require("react");
  const { useEffect, useMemo, useState } = React;
  const { motion } = require("framer-motion");

  const steps = useMemo(
    () => [
      { title: "Gameplay Activity" },
      { title: "Reward Generation" },
      { title: "Player Wallet" },
      { title: "Token Sinks" },
      { title: "Burn and Game Treasury" },
      { title: "Gameplay Re entry" },
    ],
    []
  );

  const arrowLabels = useMemo(
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

  const [currentStep, setCurrentStep] = useState(0); // 0..5
  const [isPlaying, setIsPlaying] = useState(false);
  const [runId, setRunId] = useState(0);

  const stepDurationMs = 800;

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= steps.length - 1) {
      // Stop on final step
      setIsPlaying(false);
      return;
    }

    const t = setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }, stepDurationMs);

    return () => clearTimeout(t);
  }, [isPlaying, currentStep, runId, steps.length]);

  const onPlay = () => {
    setRunId((r) => r + 1);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const onNodeClick = (idx) => {
    setCurrentStep(idx);
  };

  // Geometry helpers for SVG layout
  const geo = useMemo(() => {
    const W = 800;
    const H = 520;
    const cx = 400;
    const cy = 255;
    const R = 175;

    const nodeW = 178;
    const nodeH = 50;

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

      // Start/end points: slightly outside node rect toward the ring direction
      const start = {
        x: n.cx + Math.cos(n.angle) * (nodeW * 0.52),
        y: n.cy + Math.sin(n.angle) * (nodeH * 0.62),
      };
      const end = {
        x: next.cx + Math.cos(next.angle) * (nodeW * 0.52),
        y: next.cy + Math.sin(next.angle) * (nodeH * 0.62),
      };

      // Control point: pull curve outward a bit so it reads as a ring
      const midAngle = (n.angle + next.angle) / 2;
      const control = {
        x: cx + (R + 58) * Math.cos(midAngle),
        y: cy + (R + 58) * Math.sin(midAngle),
      };

      const d = `M ${start.x.toFixed(2)} ${start.y.toFixed(
        2
      )} Q ${control.x.toFixed(2)} ${control.y.toFixed(2)} ${end.x.toFixed(
        2
      )} ${end.y.toFixed(2)}`;

      const labelPt = quadPoint(start, end, control, 0.5);

      // Slight label offset outward from center
      const vX = labelPt.x - cx;
      const vY = labelPt.y - cy;
      const vLen = Math.max(1, Math.hypot(vX, vY));
      const label = {
        x: labelPt.x + (vX / vLen) * 12,
        y: labelPt.y + (vY / vLen) * 12,
      };

      return { i, d, label };
    });

    return { W, H, cx, cy, R, nodes, arrows };
  }, [steps]);

  const isActiveNode = (i) => i === currentStep;
  const isActiveArrow = (i) => i === currentStep; // outgoing arrow for current step

  const nodePulse = {
    scale: [1, 1.02, 1],
    transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
  };

  const baseNodeOpacity = 0.48;
  const baseArrowOpacity = 0.35;

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h3
              className="text-lg font-semibold text-slate-100"
              role="button"
              tabIndex={0}
              onClick={onPlay}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onPlay();
              }}
            >
              Closed Loop Economic Flow
            </h3>
            <span className="text-xs text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <button
            type="button"
            aria-label="Play closed loop flow animation"
            onClick={onPlay}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/10 active:bg-white/15"
          >
            Play
          </button>
        </div>

        <div className="mt-4 w-full">
          <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
            <svg
              className="h-auto w-full"
              viewBox={`0 0 ${geo.W} ${geo.H}`}
              role="img"
              aria-label="Closed Loop Economic Flow diagram"
            >
              <defs>
                <filter
                  id="softGlow"
                  x="-40%"
                  y="-40%"
                  width="180%"
                  height="180%"
                >
                  <feGaussianBlur stdDeviation="3.2" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="
                      1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.6 0"
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

              {/* Ring guide (subtle) */}
              <circle
                cx={geo.cx}
                cy={geo.cy}
                r={geo.R}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />

              {/* Arrows */}
              {geo.arrows.map((a) => {
                const active = isActiveArrow(a.i);
                const opacity = active ? 1 : baseArrowOpacity;
                const stroke = active
                  ? "rgba(226,232,240,0.95)"
                  : "rgba(226,232,240,0.45)";
                const strokeWidth = active ? 3.2 : 2;

                return (
                  <g key={`arrow-${a.i}`}>
                    <path
                      d={a.d}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      opacity={opacity}
                      markerEnd="url(#arrowHead)"
                      strokeLinecap="round"
                    />
                    <text
                      x={a.label.x}
                      y={a.label.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      opacity={opacity}
                      fill={
                        active
                          ? "rgba(226,232,240,0.95)"
                          : "rgba(226,232,240,0.60)"
                      }
                    >
                      {arrowLabels[a.i]}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {geo.nodes.map((n) => {
                const active = isActiveNode(n.i);
                const opacity = active ? 1 : baseNodeOpacity;

                const border = active
                  ? "rgba(226,232,240,0.85)"
                  : "rgba(226,232,240,0.28)";
                const strokeWidth = active ? 2.2 : 1.4;

                const fill = active
                  ? "rgba(30,41,59,0.92)"
                  : "rgba(15,23,42,0.86)";

                return (
                  <motion.g
                    key={`node-${n.i}`}
                    style={{ cursor: "pointer", opacity }}
                    onClick={() => onNodeClick(n.i)}
                    animate={active ? nodePulse : { scale: 1 }}
                    transformOrigin={`${n.cx}px ${n.cy}px`}
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
                      filter={active ? "url(#softGlow)" : undefined}
                    />
                    <text
                      x={n.cx}
                      y={n.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="14"
                      fill="rgba(241,245,249,0.92)"
                    >
                      {steps[n.i].title}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-sm text-slate-200">
              Diagram mirrors Closed Loop Flow mechanics.
            </p>
            <p className="text-sm text-slate-200">
              No percentages. No market trading paths.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
