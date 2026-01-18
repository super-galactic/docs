export const PlayerUAPCirculationPath = ({ showCaption = true }) => {
  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",
    panelInnerTop: "rgba(4, 14, 34, 0.72)",
    panelInnerBottom: "rgba(0, 0, 0, 0.22)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    line: "rgba(255,255,255,0.22)",
    lineSoft: "rgba(255,255,255,0.14)",
    chipBg: "rgba(0,0,0,0.18)",
    chipText: "rgba(255,255,255,0.84)",
  };

  const nodes = [
    { step: "1", title: "Gameplay Activity", sub: "Outcome generation" },
    { step: "2", title: "Reward Generation", sub: "Reward calculation" },
    { step: "3", title: "Player Wallet", sub: "Claimed balance" },
    { step: "4", title: "Token Sinks", sub: "Progression spend" },
    { step: "5", title: "Burn", sub: "Irreversible supply reduction", terminal: true },
  ];

  const edgeChips = [
    "Reward issuance (capped)",
    "Claimable rewards",
    "Voluntary spend",
    "Automated burn execution",
  ];

  const geo = React.useMemo(() => {
    const W = 980;
    const H = 620;

    const nodeW = 320;
    const nodeH = 74;

    const spineX = 420;
    const topY = 120;
    const gap = 108;

    const spine = [0, 1, 2, 3].map((i) => {
      const cx = spineX;
      const cy = topY + gap * i;
      return { i, cx, cy, x: cx - nodeW / 2, y: cy - nodeH / 2, w: nodeW, h: nodeH };
    });

    // Burn terminal to the right, aligned with Token Sinks level + downward offset
    const burn = {
      i: 4,
      cx: spineX + 360,
      cy: spine[3].cy + 92,
    };

    const burnNode = { ...burn, x: burn.cx - nodeW / 2, y: burn.cy - nodeH / 2, w: nodeW, h: nodeH };

    const bottomOf = (n) => ({ x: n.cx, y: n.y + n.h });
    const topOf = (n) => ({ x: n.cx, y: n.y });
    const rightMid = (n) => ({ x: n.x + n.w, y: n.cy });
    const leftMid = (n) => ({ x: n.x, y: n.cy });

    const v = [
      {
        d: `M ${bottomOf(spine[0]).x} ${bottomOf(spine[0]).y} L ${topOf(spine[1]).x} ${topOf(spine[1]).y}`,
        chip: { x: spineX, y: (spine[0].cy + spine[1].cy) / 2 },
      },
      {
        d: `M ${bottomOf(spine[1]).x} ${bottomOf(spine[1]).y} L ${topOf(spine[2]).x} ${topOf(spine[2]).y}`,
        chip: { x: spineX, y: (spine[1].cy + spine[2].cy) / 2 },
      },
      {
        d: `M ${bottomOf(spine[2]).x} ${bottomOf(spine[2]).y} L ${topOf(spine[3]).x} ${topOf(spine[3]).y}`,
        chip: { x: spineX, y: (spine[2].cy + spine[3].cy) / 2 },
      },
    ];

    const elbowX = spineX + 170;
    const start = rightMid(spine[3]);
    const end = leftMid(burnNode);

    const branch = {
      d: `M ${start.x} ${start.y} L ${elbowX} ${start.y} L ${elbowX} ${end.y} L ${end.x} ${end.y}`,
      chip: { x: elbowX + 150, y: end.y + 18 },
    };

    return { W, H, spine, burnNode, v, branch, nodeW, nodeH, spineX };
  }, []);

  const Pill = ({ x, y, text, w = 230, accent = false }) => (
    <g>
      <rect
        x={x - w / 2}
        y={y - 13}
        width={w}
        height={26}
        rx={999}
        fill={colors.chipBg}
        stroke={accent ? "rgba(34,197,94,0.22)" : colors.border}
      />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={colors.chipText}>
        {text}
      </text>
    </g>
  );

  const NodeCard = ({ n }) => {
    const glow = n.terminal ? "0 0 0 1px rgba(255,255,255,0.10), 0 0 22px rgba(0,0,0,0.35)" : "0 10px 28px rgba(0,0,0,0.35)";
    const rightChip = n.terminal ? "Terminal" : `Step ${n.step}`;

    return (
      <g>
        <rect
          x={n.x}
          y={n.y}
          width={n.w}
          height={n.h}
          rx="18"
          fill={`url(#panelGrad)`}
          stroke={colors.border}
          strokeWidth="1.4"
        />
        <rect
          x={n.x}
          y={n.y}
          width={n.w}
          height={n.h}
          rx="18"
          fill="transparent"
          style={{ filter: "url(#softShadow)" }}
        />

        {/* step rail */}
        <rect x={n.x + 14} y={n.y + 16} width={28} height={28} rx={999} fill="rgba(0,0,0,0.22)" stroke={colors.border} />
        <text x={n.x + 28} y={n.y + 30} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={colors.text}>
          {n.step}
        </text>

        {/* title + sub */}
        <text x={n.x + 56} y={n.y + 30} fontSize="14" fill={colors.text} style={{ fontWeight: 800 }}>
          {n.title}
        </text>
        <text x={n.x + 56} y={n.y + 50} fontSize="12" fill={colors.subtext}>
          {n.sub}
        </text>

        {/* right chip */}
        <rect
          x={n.x + n.w - 108}
          y={n.y + 18}
          width={90}
          height={26}
          rx={999}
          fill="rgba(0,0,0,0.20)"
          stroke={n.terminal ? "rgba(34,197,94,0.22)" : colors.border}
        />
        <text x={n.x + n.w - 63} y={n.y + 31} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill={n.terminal ? "rgba(34,197,94,0.88)" : "rgba(255,255,255,0.76)"}>
          {rightChip}
        </text>
      </g>
    );
  };

  // Build node objects aligned to geo for SVG rendering
  const svgNodes = React.useMemo(() => {
    const out = [];
    geo.spine.forEach((p, idx) => {
      out.push({ ...p, ...nodes[idx] });
    });
    out.push({ ...geo.burnNode, ...nodes[4] });
    return out;
  }, [geo, nodes]);

  return (
    <div className="not-prose w-full">
      <div
        style={{
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          background: colors.panelOuter,
          padding: 16,
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10" style={{ background: "rgba(2,6,23,0.55)" }}>
          <svg viewBox={`0 0 ${geo.W} ${geo.H}`} className="w-full" role="img" aria-label="Player-facing UAP circulation path diagram">
            <defs>
              <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.panelInnerTop} />
                <stop offset="100%" stopColor={colors.panelInnerBottom} />
              </linearGradient>

              <marker id="puapArrowHead2" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(226,232,240,0.9)" />
              </marker>

              <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="b" />
                <feColorMatrix
                  in="b"
                  type="matrix"
                  values="
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.35 0"
                />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* connectors */}
            {geo.v.map((p, idx) => (
              <g key={`v-${idx}`}>
                <path
                  d={p.d}
                  fill="none"
                  stroke={colors.line}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  markerEnd="url(#puapArrowHead2)"
                />
                <Pill x={p.chip.x} y={p.chip.y} text={edgeChips[idx]} w={240} />
              </g>
            ))}

            <path
              d={geo.branch.d}
              fill="none"
              stroke={colors.line}
              strokeWidth="2.4"
              strokeLinecap="round"
              markerEnd="url(#puapArrowHead2)"
            />
            <Pill x={geo.branch.chip.x} y={geo.branch.chip.y} text={edgeChips[3]} w={260} accent />

            {/* nodes */}
            {svgNodes.map((n) => (
              <NodeCard key={`card-${n.i}`} n={n} />
            ))}
          </svg>
        </div>

        {showCaption ? (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            Player-facing UAP circulation path.
          </div>
        ) : null}
      </div>
    </div>
  );
};
