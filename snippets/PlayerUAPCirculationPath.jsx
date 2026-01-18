export const PlayerUAPCirculationPath = () => {
  const labels = {
    title: "Player-facing UAP circulation path",
    caption: "Player-facing UAP circulation path.",
    nodes: ["Gameplay Activity", "Reward Generation", "Player Wallet", "Token Sinks", "Burn"],
    edges: [
      { from: 0, to: 1, text: "Reward issuance (capped)" },
      { from: 1, to: 2, text: "Claimable rewards" },
      { from: 2, to: 3, text: "Voluntary spend" },
      { from: 3, to: 4, text: "Automated burn execution" }, // branch
    ],
  };

  const colors = {
    border: "rgba(255,255,255,0.10)",
    panel: "rgba(255,255,255,0.03)",
    panelInner: "rgba(2, 6, 23, 0.55)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    line: "rgba(226,232,240,0.35)",
    lineActive: "rgba(226,232,240,0.90)",
    nodeFill: "rgba(15,23,42,0.84)",
    nodeFillStrong: "rgba(20, 30, 46, 0.78)",
  };

  const geo = React.useMemo(() => {
    const W = 860;
    const H = 640;

    const nodeW = 240;
    const nodeH = 56;

    const cx = 430;

    // vertical spine nodes
    const y0 = 130;
    const gap = 105;

    const nodes = [
      { i: 0, cx, cy: y0 + gap * 0 },
      { i: 1, cx, cy: y0 + gap * 1 },
      { i: 2, cx, cy: y0 + gap * 2 },
      { i: 3, cx, cy: y0 + gap * 3 },
      // Burn terminal node is offset down-right
      { i: 4, cx: cx + 210, cy: y0 + gap * 4 - 6 },
    ].map((n) => ({
      ...n,
      x: n.cx - nodeW / 2,
      y: n.cy - nodeH / 2,
      w: nodeW,
      h: nodeH,
    }));

    // connector anchor points
    const topOf = (n) => ({ x: n.cx, y: n.y });
    const bottomOf = (n) => ({ x: n.cx, y: n.y + n.h });

    const p = nodes;

    // paths
    const paths = [
      // 0 -> 1
      {
        d: `M ${bottomOf(p[0]).x} ${bottomOf(p[0]).y} L ${topOf(p[1]).x} ${topOf(p[1]).y}`,
        label: { x: cx, y: (p[0].cy + p[1].cy) / 2 },
      },
      // 1 -> 2
      {
        d: `M ${bottomOf(p[1]).x} ${bottomOf(p[1]).y} L ${topOf(p[2]).x} ${topOf(p[2]).y}`,
        label: { x: cx, y: (p[1].cy + p[2].cy) / 2 },
      },
      // 2 -> 3
      {
        d: `M ${bottomOf(p[2]).x} ${bottomOf(p[2]).y} L ${topOf(p[3]).x} ${topOf(p[3]).y}`,
        label: { x: cx, y: (p[2].cy + p[3].cy) / 2 },
      },
      // 3 -> 4 branch
      {
        d: `M ${p[3].cx + 20} ${p[3].cy + 26} Q ${p[3].cx + 130} ${p[3].cy + 80} ${p[4].cx - 120} ${
          p[4].cy - 10
        }`,
        label: { x: cx + 210, y: p[3].cy + 92 },
      },
    ];

    return { W, H, nodeW, nodeH, nodes, paths, cx };
  }, []);

  return (
    <div className="not-prose w-full">
      <div
        className="rounded-2xl border p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
        style={{ borderColor: colors.border, background: colors.panel }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-slate-100">{labels.title}</div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10" style={{ background: colors.panelInner }}>
          <svg viewBox={`0 0 ${geo.W} ${geo.H}`} className="w-full" role="img" aria-label="Player-facing UAP circulation path diagram">
            <defs>
              <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(226,232,240,0.9)" />
              </marker>

              <filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.0" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.55 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* connectors + labels */}
            {geo.paths.map((p, idx) => (
              <g key={`p-${idx}`}>
                <path
                  d={p.d}
                  fill="none"
                  stroke={colors.line}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  markerEnd="url(#arrowHead)"
                />
                <text
                  x={p.label.x}
                  y={p.label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="rgba(226,232,240,0.68)"
                >
                  {labels.edges[idx].text}
                </text>
              </g>
            ))}

            {/* nodes */}
            {geo.nodes.map((n) => {
              const isBurn = n.i === 4;
              return (
                <g key={`n-${n.i}`} filter="url(#nodeGlow)">
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    rx="14"
                    ry="14"
                    fill={isBurn ? colors.nodeFillStrong : colors.nodeFill}
                    stroke={isBurn ? "rgba(226,232,240,0.40)" : "rgba(226,232,240,0.28)"}
                    strokeWidth={isBurn ? 1.9 : 1.4}
                  />
                  <foreignObject x={n.x} y={n.y} width={n.w} height={n.h}>
                    <div
                      className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-100 text-center px-3"
                      style={{ lineHeight: 1.15 }}
                    >
                      {labels.nodes[n.i]}
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* subtle terminal cue line */}
            <line
              x1={geo.cx - 150}
              y1={geo.nodes[3].cy + 75}
              x2={geo.cx + 150}
              y2={geo.nodes[3].cy + 75}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
          {labels.caption}
        </div>
      </div>
    </div>
  );
};
