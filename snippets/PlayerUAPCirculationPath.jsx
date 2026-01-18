export const PlayerUAPCirculationPath = ({ showCaption = true }) => {
  const colors = {
    border: "rgba(255,255,255,0.10)",
    panel: "rgba(255,255,255,0.03)",
    panelInner: "rgba(2, 6, 23, 0.55)",
    nodeFill: "rgba(15,23,42,0.86)",
    nodeFillTerminal: "rgba(20, 30, 46, 0.82)",
    text: "rgba(255,255,255,0.92)",
    textSoft: "rgba(226,232,240,0.72)",
    line: "rgba(226,232,240,0.42)",
    chipBg: "rgba(0,0,0,0.30)",
    chipBorder: "rgba(255,255,255,0.10)",
  };

  const nodes = [
    "Gameplay Activity",
    "Reward Generation",
    "Player Wallet",
    "Token Sinks",
    "Burn",
  ];

  const labels = {
    a01: "Reward issuance (capped)",
    a12: "Claimable rewards",
    a23: "Voluntary spend",
    a34: "Automated burn execution",
    caption: "Player-facing UAP circulation path.",
  };

  const geo = React.useMemo(() => {
    const W = 900;
    const H = 640;

    const nodeW = 250;
    const nodeH = 58;

    const spineX = 420;
    const topY = 140;
    const gap = 118;

    const spine = [
      { i: 0, cx: spineX, cy: topY + gap * 0 },
      { i: 1, cx: spineX, cy: topY + gap * 1 },
      { i: 2, cx: spineX, cy: topY + gap * 2 },
      { i: 3, cx: spineX, cy: topY + gap * 3 },
    ].map((n) => ({
      ...n,
      x: n.cx - nodeW / 2,
      y: n.cy - nodeH / 2,
      w: nodeW,
      h: nodeH,
    }));

    const burn = {
      i: 4,
      cx: spineX + 300,
      cy: spine[3].cy + 88,
    };

    const burnNode = {
      ...burn,
      x: burn.cx - nodeW / 2,
      y: burn.cy - nodeH / 2,
      w: nodeW,
      h: nodeH,
    };

    const topOf = (n) => ({ x: n.cx, y: n.y });
    const bottomOf = (n) => ({ x: n.cx, y: n.y + n.h });
    const rightMid = (n) => ({ x: n.x + n.w, y: n.cy });

    // Vertical arrows (clean and consistent)
    const vPaths = [
      {
        d: `M ${bottomOf(spine[0]).x} ${bottomOf(spine[0]).y} L ${topOf(spine[1]).x} ${topOf(spine[1]).y}`,
        chip: { x: spineX, y: (spine[0].cy + spine[1].cy) / 2 },
        text: labels.a01,
      },
      {
        d: `M ${bottomOf(spine[1]).x} ${bottomOf(spine[1]).y} L ${topOf(spine[2]).x} ${topOf(spine[2]).y}`,
        chip: { x: spineX, y: (spine[1].cy + spine[2].cy) / 2 },
        text: labels.a12,
      },
      {
        d: `M ${bottomOf(spine[2]).x} ${bottomOf(spine[2]).y} L ${topOf(spine[3]).x} ${topOf(spine[3]).y}`,
        chip: { x: spineX, y: (spine[2].cy + spine[3].cy) / 2 },
        text: labels.a23,
      },
    ];

    // Right-angle branch to Burn
    const elbowX = spineX + 140;
    const start = rightMid(spine[3]);
    const end = { x: burnNode.x, y: burnNode.cy };

    const branch = {
      d: `M ${start.x} ${start.y} L ${elbowX} ${start.y} L ${elbowX} ${end.y} L ${end.x} ${end.y}`,
      chip: { x: elbowX + 120, y: end.y + 18 },
      text: labels.a34,
    };

    return { W, H, nodeW, nodeH, spine, burnNode, vPaths, branch, spineX };
  }, []);

  const Chip = ({ x, y, text, w = 220 }) => (
    <g>
      <rect
        x={x - w / 2}
        y={y - 13}
        width={w}
        height={26}
        rx={999}
        fill={colors.chipBg}
        stroke={colors.chipBorder}
      />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={colors.textSoft}
      >
        {text}
      </text>
    </g>
  );

  const Node = ({ x, y, w, h, label, terminal }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="14"
        ry="14"
        fill={terminal ? colors.nodeFillTerminal : colors.nodeFill}
        stroke={terminal ? "rgba(226,232,240,0.40)" : "rgba(226,232,240,0.28)"}
        strokeWidth={terminal ? 1.9 : 1.4}
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="13"
        fill={colors.text}
      >
        {label}
      </text>
    </g>
  );

  return (
    <div className="not-prose w-full">
      <div
        className="rounded-2xl border p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
        style={{ borderColor: colors.border, background: colors.panel }}
      >
        <div
          className="overflow-hidden rounded-2xl border border-white/10"
          style={{ background: colors.panelInner }}
        >
          <svg
            viewBox={`0 0 ${geo.W} ${geo.H}`}
            className="w-full"
            role="img"
            aria-label="Player-facing UAP circulation path diagram"
          >
            <defs>
              <marker
                id="puapArrowHead"
                markerWidth="10"
                markerHeight="10"
                refX="8.5"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(226,232,240,0.9)" />
              </marker>
            </defs>

            {/* arrows */}
            {geo.vPaths.map((p, idx) => (
              <g key={`v-${idx}`}>
                <path
                  d={p.d}
                  fill="none"
                  stroke={colors.line}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  markerEnd="url(#puapArrowHead)"
                />
                <Chip x={p.chip.x} y={p.chip.y} text={p.text} w={240} />
              </g>
            ))}

            <path
              d={geo.branch.d}
              fill="none"
              stroke={colors.line}
              strokeWidth="2.4"
              strokeLinecap="round"
              markerEnd="url(#puapArrowHead)"
            />
            <Chip x={geo.branch.chip.x} y={geo.branch.chip.y} text={geo.branch.text} w={260} />

            {/* nodes */}
            {geo.spine.map((n) => (
              <Node key={`n-${n.i}`} x={n.x} y={n.y} w={n.w} h={n.h} label={nodes[n.i]} />
            ))}
            <Node
              x={geo.burnNode.x}
              y={geo.burnNode.y}
              w={geo.burnNode.w}
              h={geo.burnNode.h}
              label={nodes[4]}
              terminal
            />
          </svg>
        </div>

        {showCaption ? (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            {labels.caption}
          </div>
        ) : null}
      </div>
    </div>
  );
};
