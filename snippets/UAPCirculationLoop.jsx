export const UAPCirculationLoop = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
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
    const W = 900;
    const H = 560;
    const cx = 450;
    const cy = 270;
    const R = 190;

    const nodeW = 200;
    const nodeH = 56;

    const positions = nodes.map((_, i) => {
      const angle = (-90 + i * (360 / nodes.length)) * (Math.PI / 180);
      const radius = i === nodes.length - 1 ? R + 36 : R;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      return {
        i,
        cx: x,
        cy: y,
        x: x - nodeW / 2,
        y: y - nodeH / 2,
        w: nodeW,
        h: nodeH,
        angle,
      };
    });

    const arrowsGeo = positions.slice(0, -1).map((p, i) => {
      const next = positions[i + 1];
      const control = {
        x: cx + (R + 60) * Math.cos((p.angle + next.angle) / 2),
        y: cy + (R + 60) * Math.sin((p.angle + next.angle) / 2),
      };

      const d = `M ${p.cx} ${p.cy} Q ${control.x} ${control.y} ${next.cx} ${next.cy}`;

      return {
        d,
        labelX: (p.cx + next.cx) / 2,
        labelY: (p.cy + next.cy) / 2,
      };
    });

    return { W, H, positions, arrowsGeo, cx, cy, R };
  }, []);

  return (
    <div className="not-prose w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-100">
            UAP Circulation Loop
          </div>
          <button
            type="button"
            aria-label="Play UAP circulation loop"
            onClick={onPlay}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 hover:bg-white/10"
          >
            Play
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <svg
            viewBox={`0 0 ${geo.W} ${geo.H}`}
            className="w-full"
            role="img"
            aria-label="UAP Circulation Loop diagram"
          >
            <circle
              cx={geo.cx}
              cy={geo.cy}
              r={geo.R}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
            />

            {geo.arrowsGeo.map((a, i) => {
              const active = i === currentStep;
              return (
                <g key={i} opacity={active ? 1 : 0.35}>
                  <path
                    d={a.d}
                    fill="none"
                    stroke={active ? "rgba(226,232,240,0.95)" : "rgba(255,255,255,0.28)"}
                    strokeWidth={active ? 3 : 2}
                  />
                  <text
                    x={a.labelX}
                    y={a.labelY}
                    fontSize="12"
                    fill="rgba(226,232,240,0.75)"
                    textAnchor="middle"
                  >
                    {arrows[i]}
                  </text>
                </g>
              );
            })}

            {geo.positions.map((n) => {
              const active = n.i === currentStep;
              const scale = active && pulseOn ? 1.02 : 1;
              return (
                <g
                  key={n.i}
                  onClick={() => onNodeClick(n.i)}
                  style={{ cursor: "pointer", opacity: active ? 1 : 0.45 }}
                  transform={`translate(${n.cx} ${n.cy}) scale(${scale}) translate(${-n.cx} ${-n.cy})`}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    rx="14"
                    fill={active ? "rgba(30,41,59,0.95)" : "rgba(15,23,42,0.85)"}
                    stroke="rgba(226,232,240,0.35)"
                    strokeWidth={active ? 2 : 1.2}
                  />
                  <foreignObject x={n.x} y={n.y} width={n.w} height={n.h}>
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-100 text-center px-2">
                      {nodes[n.i]}
                    </div>
                  </foreignObject>
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
