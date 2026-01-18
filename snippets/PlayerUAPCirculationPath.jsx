export const PlayerUAPCirculationPath = ({ showCaption = true }) => {
  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",

    // inner panel background
    innerBgTop: "rgba(4, 14, 34, 0.78)",
    innerBgBottom: "rgba(0, 0, 0, 0.26)",
    radialA: "rgba(37, 99, 235, 0.10)",
    radialB: "rgba(15, 23, 42, 0.18)",

    // nodes
    nodeFill: "rgba(15,23,42,0.82)",
    nodeStroke: "rgba(255,255,255,0.14)",
    nodeStrokeTerminal: "rgba(34,197,94,0.28)",

    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",

    // connectors
    line: "rgba(255,255,255,0.22)",
    lineStrong: "rgba(255,255,255,0.28)",
    arrowHead: "rgba(226,232,240,0.90)",

    // chips
    chipBg: "rgba(0,0,0,0.22)",
    chipBorder: "rgba(255,255,255,0.12)",
    chipText: "rgba(255,255,255,0.78)",
    chipTerminalText: "rgba(34,197,94,0.90)",
    chipTerminalBorder: "rgba(34,197,94,0.26)",
  };

  const nodes = [
    { step: "1", title: "Gameplay Activity", sub: "Outcome generation" },
    { step: "2", title: "Reward Generation", sub: "Reward calculation" },
    { step: "3", title: "Player Wallet", sub: "Claimed balance" },
    { step: "4", title: "Token Sinks", sub: "Progression spend" },
    { step: "5", title: "Burn", sub: "Irreversible supply reduction", terminal: true },
  ];

  const labels = [
    "Reward issuance (capped)",
    "Claimable rewards",
    "Voluntary spend",
    "Automated burn execution",
  ];

  const geo = React.useMemo(() => {
    const W = 1120;
    const H = 720;

    const nodeW = 360;
    const nodeH = 82;

    const spineX = 460;
    const topY = 120;
    const gap = 142;

    const spine = [0, 1, 2, 3].map((i) => {
      const cx = spineX;
      const cy = topY + gap * i;
      return { i, cx, cy, x: cx - nodeW / 2, y: cy - nodeH / 2, w: nodeW, h: nodeH };
    });

    const burn = {
      i: 4,
      cx: spineX + 420,
      cy: spine[3].cy + 114,
    };
    const burnNode = { ...burn, x: burn.cx - nodeW / 2, y: burn.cy - nodeH / 2, w: nodeW, h: nodeH };

    const bottom = (n) => ({ x: n.cx, y: n.y + n.h });
    const top = (n) => ({ x: n.cx, y: n.y });
    const right = (n) => ({ x: n.x + n.w, y: n.cy });
    const left = (n) => ({ x: n.x, y: n.cy });

    // Move the vertical flow line slightly right inside the node to feel like a system "bus"
    const flowX = spineX + 70;

    const vertical = spine.slice(0, 3).map((n, i) => ({
      d: `M ${flowX} ${bottom(n).y} L ${flowX} ${top(spine[i + 1]).y}`,
      // Right lane label chips (prevents clipping)
      chip: {
        x: spineX + nodeW / 2 + 190,
        y: (n.cy + spine[i + 1].cy) / 2,
      },
    }));

    // Branch with right-angle routing from Token Sinks to Burn
    const start = { x: spine[3].x + spine[3].w, y: spine[3].cy };
    const elbowX = spineX + nodeW / 2 + 90;
    const end = { x: burnNode.x, y: burnNode.cy };

    const branch = {
      d: `M ${start.x} ${start.y} L ${elbowX} ${start.y} L ${elbowX} ${end.y} L ${end.x} ${end.y}`,
      // Chip sits at elbow lane, not on top of the Burn card
      chip: { x: elbowX + 150, y: (start.y + end.y) / 2 + 18 },
      arrowStart: start,
    };

    return { W, H, spine, burnNode, vertical, branch, flowX, nodeW, nodeH, spineX };
  }, []);

  const Chip = ({ x, y, text, w = 260, terminal = false }) => (
    <g>
      <rect
        x={x - w / 2}
        y={y - 14}
        width={w}
        height={28}
        rx={10}
        fill={colors.chipBg}
        stroke={terminal ? colors.chipTerminalBorder : colors.chipBorder}
      />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={terminal ? colors.chipTerminalText : colors.chipText}
        style={{ fontWeight: 650 }}
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
        rx={8}
        fill={terminal ? "rgba(34,197,94,0.12)" : "rgba(0,0,0,0.24)"}
        stroke={terminal ? "rgba(34,197,94,0.26)" : colors.chipBorder}
      />
      <text
        x={x + 15}
        y={y + 16}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={terminal ? colors.chipTerminalText : colors.text}
        style={{ fontWeight: 900 }}
      >
        {step}
      </text>
    </g>
  );

  const Node = ({ n }) => (
    <g>
      <rect
        x={n.x}
        y={n.y}
        width={n.w}
        height={n.h}
        rx={18}
        fill={colors.nodeFill}
        stroke={n.terminal ? colors.nodeStrokeTerminal : colors.nodeStroke}
        strokeWidth={n.terminal ? 1.8 : 1.4}
      />

      <StepBadge x={n.x + 16} y={n.y + 20} step={n.step} terminal={!!n.terminal} />

      <text x={n.x + 62} y={n.y + 36} fontSize="14" fill={colors.text} style={{ fontWeight: 800 }}>
        {n.title}
      </text>
      <text x={n.x + 62} y={n.y + 58} fontSize="12" fill={colors.subtext}>
        {n.sub}
      </text>

      {n.terminal ? (
        <g>
          <rect
            x={n.x + n.w - 118}
            y={n.y + 22}
            width={96}
            height={28}
            rx={10}
            fill={colors.chipBg}
            stroke={colors.chipTerminalBorder}
          />
          <text
            x={n.x + n.w - 70}
            y={n.y + 36}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill={colors.chipTerminalText}
            style={{ fontWeight: 700 }}
          >
            Terminal
          </text>
        </g>
      ) : null}
    </g>
  );

  const allNodes = React.useMemo(() => {
    const out = geo.spine.map((p, i) => ({ ...p, ...nodes[i] }));
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
              aria-label="Player-facing UAP circulation path"
              style={{ position: "relative" }}
            >
              <defs>
                <marker id="puapArrowHeadLane" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.arrowHead} />
                </marker>
              </defs>

              {/* Vertical flow connectors */}
              {geo.vertical.map((v, i) => (
                <g key={`v-${i}`}>
                  <path
                    d={v.d}
                    fill="none"
                    stroke={colors.line}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    markerEnd="url(#puapArrowHeadLane)"
                  />
                  <Chip x={v.chip.x} y={v.chip.y} text={labels[i]} w={270} />
                </g>
              ))}

              {/* Branch connector */}
              <path
                d={geo.branch.d}
                fill="none"
                stroke={colors.lineStrong}
                strokeWidth="2.6"
                strokeLinecap="round"
                markerEnd="url(#puapArrowHeadLane)"
              />
              <Chip x={geo.branch.chip.x} y={geo.branch.chip.y} text={labels[3]} w={280} terminal />

              {/* Nodes */}
              {allNodes.map((n) => (
                <Node key={`n-${n.step}`} n={n} />
              ))}

              {/* Subtle guide line for the flow lane (system bus) */}
              <line
                x1={geo.flowX}
                y1={geo.spine[0].y + geo.nodeH - 2}
                x2={geo.flowX}
                y2={geo.spine[3].y + 2}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
              />
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
