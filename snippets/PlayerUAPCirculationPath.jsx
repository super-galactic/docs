// PlayerUAPCirculationPath.jsx
export const PlayerUAPCirculationPath = ({ showCaption = true }) => {
  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",

    // inner panel
    innerBgTop: "rgba(4, 14, 34, 0.78)",
    innerBgBottom: "rgba(0, 0, 0, 0.26)",
    radialA: "rgba(37, 99, 235, 0.10)",
    radialB: "rgba(15, 23, 42, 0.18)",

    // nodes
    nodeStroke: "rgba(255,255,255,0.14)",
    nodeStrokeStrong: "rgba(255,255,255,0.22)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",

    // connectors
    line: "rgba(255,255,255,0.22)",
    lineStrong: "rgba(255,255,255,0.32)",
    arrowHead: "rgba(226,232,240,0.90)",

    // chips (more grey, higher contrast)
    chipBg: "rgba(255,255,255,0.06)",
    chipBgStrong: "rgba(255,255,255,0.08)",
    chipBorder: "rgba(255,255,255,0.14)",
    chipText: "rgba(255,255,255,0.82)",
    chipAccentBorder: "rgba(34,197,94,0.26)",
    chipAccentText: "rgba(34,197,94,0.92)",
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
    const W = 1040;
    const H = 680;

    const nodeW = 360;
    const nodeH = 82;

    // move spine upward to use the empty top area
    const spineX = 430;
    const topY = 108;
    const gap = 132;

    const spine = [0, 1, 2, 3].map((i) => {
      const cx = spineX;
      const cy = topY + gap * i;
      return { i, cx, cy, x: cx - nodeW / 2, y: cy - nodeH / 2, w: nodeW, h: nodeH };
    });

    const burn = {
      i: 4,
      cx: spineX + 420,
      cy: spine[3].cy + 108,
    };

    const burnNode = { ...burn, x: burn.cx - nodeW / 2, y: burn.cy - nodeH / 2, w: nodeW, h: nodeH };

    const bottomOf = (n) => ({ x: n.cx, y: n.y + n.h });
    const topOf = (n) => ({ x: n.cx, y: n.y });
    const rightMid = (n) => ({ x: n.x + n.w, y: n.cy });
    const leftMid = (n) => ({ x: n.x, y: n.cy });

    const v = [
      {
        d: `M ${bottomOf(spine[0]).x} ${bottomOf(spine[0]).y} L ${topOf(spine[1]).x} ${topOf(spine[1]).y}`,
        // push chip left so it never overlaps the arrow head
        chip: { x: spineX - 190, y: (spine[0].cy + spine[1].cy) / 2 },
      },
      {
        d: `M ${bottomOf(spine[1]).x} ${bottomOf(spine[1]).y} L ${topOf(spine[2]).x} ${topOf(spine[2]).y}`,
        chip: { x: spineX - 190, y: (spine[1].cy + spine[2].cy) / 2 },
      },
      {
        d: `M ${bottomOf(spine[2]).x} ${bottomOf(spine[2]).y} L ${topOf(spine[3]).x} ${topOf(spine[3]).y}`,
        chip: { x: spineX - 190, y: (spine[2].cy + spine[3].cy) / 2 },
      },
    ];

    const elbowX = spineX + 205;
    const start = rightMid(spine[3]);
    const end = leftMid(burnNode);

    const branch = {
      d: `M ${start.x} ${start.y} L ${elbowX} ${start.y} L ${elbowX} ${end.y} L ${end.x} ${end.y}`,
      chip: { x: elbowX + 185, y: end.y + 24 },
    };

    return { W, H, spine, burnNode, v, branch, nodeW, nodeH };
  }, []);

  const Chip = ({ x, y, text, w = 240, accent = false }) => (
    <g>
      <rect
        x={x - w / 2}
        y={y - 13}
        width={w}
        height={26}
        rx={999}
        fill={accent ? colors.chipBgStrong : colors.chipBg}
        stroke={accent ? colors.chipAccentBorder : colors.chipBorder}
      />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={accent ? colors.chipAccentText : colors.chipText}
        style={{ fontWeight: 800 }}
      >
        {text}
      </text>
    </g>
  );

  const StepBadge = ({ x, y, step, terminal }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={30}
        height={30}
        rx={999}
        fill={terminal ? "rgba(34,197,94,0.12)" : "rgba(0,0,0,0.24)"}
        stroke={terminal ? "rgba(34,197,94,0.26)" : colors.chipBorder}
      />
      <text
        x={x + 15}
        y={y + 16}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={terminal ? colors.chipAccentText : colors.text}
        style={{ fontWeight: 900 }}
      >
        {step}
      </text>
    </g>
  );

  const NodeCard = ({ n }) => {
    const terminal = !!n.terminal;

    return (
      <g>
        <rect
          x={n.x}
          y={n.y}
          width={n.w}
          height={n.h}
          rx="18"
          fill={`url(#panelGradPUAP)`}
          stroke={terminal ? colors.nodeStrokeStrong : colors.nodeStroke}
          strokeWidth={terminal ? 1.8 : 1.4}
        />

        <StepBadge x={n.x + 14} y={n.y + 18} step={n.step} terminal={terminal} />

        <text x={n.x + 58} y={n.y + 36} fontSize="14" fill={colors.text} style={{ fontWeight: 900 }}>
          {n.title}
        </text>

        <text x={n.x + 58} y={n.y + 58} fontSize="12" fill={colors.subtext} style={{ fontWeight: 650 }}>
          {n.sub}
        </text>

        {terminal ? (
          <g>
            <rect
              x={n.x + n.w - 118}
              y={n.y + 22}
              width={96}
              height={26}
              rx={999}
              fill={colors.chipBgStrong}
              stroke={colors.chipAccentBorder}
            />
            <text
              x={n.x + n.w - 70}
              y={n.y + 35}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill={colors.chipAccentText}
              style={{ fontWeight: 900 }}
            >
              Terminal
            </text>
          </g>
        ) : null}
      </g>
    );
  };

  const svgNodes = React.useMemo(() => {
    const out = [];
    geo.spine.forEach((p, idx) => out.push({ ...p, ...nodes[idx] }));
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
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div
            style={{
              position: "relative",
              background: `linear-gradient(180deg, ${colors.innerBgTop} 0%, ${colors.innerBgBottom} 100%)`,
              padding: 14,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.55,
                background: `radial-gradient(80% 120% at 20% 0%, ${colors.radialA} 0%, rgba(0,0,0,0) 60%),
                             radial-gradient(70% 120% at 80% 0%, ${colors.radialB} 0%, rgba(0,0,0,0) 55%)`,
                pointerEvents: "none",
              }}
            />

            <svg
              viewBox={`0 0 ${geo.W} ${geo.H}`}
              className="w-full"
              role="img"
              aria-label="Player-facing UAP circulation path diagram"
              style={{ position: "relative" }}
            >
              <defs>
                <linearGradient id="panelGradPUAP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(2, 6, 23, 0.18)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0.20)" />
                </linearGradient>

                <marker id="puapArrowHead4" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.arrowHead} />
                </marker>
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
                    markerEnd="url(#puapArrowHead4)"
                  />
                  <Chip x={p.chip.x} y={p.chip.y} text={edgeChips[idx]} w={252} />
                </g>
              ))}

              <path
                d={geo.branch.d}
                fill="none"
                stroke={colors.lineStrong}
                strokeWidth="2.6"
                strokeLinecap="round"
                markerEnd="url(#puapArrowHead4)"
              />
              <Chip x={geo.branch.chip.x} y={geo.branch.chip.y} text={edgeChips[3]} w={276} accent />

              {/* nodes */}
              {svgNodes.map((n) => (
                <NodeCard key={`card-${n.i}`} n={n} />
              ))}
            </svg>
          </div>
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
