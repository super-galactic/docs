export const PlayerUAPCirculationPath = ({ showCaption = true }) => {
  const colors = {
    accent: "#22C55E",
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",

    // Inner panel background aligned to Layered Architecture feel
    innerTop: "rgba(4, 14, 34, 0.72)",
    innerBottom: "rgba(0, 0, 0, 0.22)",
    radialA: "rgba(37, 99, 235, 0.10)",
    radialB: "rgba(15, 23, 42, 0.18)",

    nodeFill: "rgba(15,23,42,0.82)",
    nodeStroke: "rgba(255,255,255,0.14)",
    nodeStrokeTerminal: "rgba(34,197,94,0.28)",

    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",

    line: "rgba(255,255,255,0.22)",
    lineStrong: "rgba(255,255,255,0.28)",
    arrowHead: "rgba(226,232,240,0.92)",

    chipBg: "rgba(0,0,0,0.22)",
    chipBorder: "rgba(255,255,255,0.12)",
    chipText: "rgba(255,255,255,0.80)",
    chipTerminalBorder: "rgba(34,197,94,0.26)",
    chipTerminalText: "rgba(34,197,94,0.90)",
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
    // Bigger working canvas so the diagram reads at full width
    const W = 1200;
    const H = 720;

    // Larger nodes for readability
    const nodeW = 460;
    const nodeH = 96;

    // Center the stack inside the frame
    const spineX = 520;
    const topY = 150;
    const gap = 148;

    const spine = [0, 1, 2, 3].map((i) => {
      const cx = spineX;
      const cy = topY + gap * i;
      return { i, cx, cy, x: cx - nodeW / 2, y: cy - nodeH / 2, w: nodeW, h: nodeH };
    });

    // Terminal node sits to the right but stays within the same main block
    const burn = {
      i: 4,
      cx: spineX + 460,
      cy: spine[3].cy + 124,
    };
    const burnNode = { ...burn, x: burn.cx - nodeW / 2, y: burn.cy - nodeH / 2, w: nodeW, h: nodeH };

    const bottom = (n) => ({ x: n.cx, y: n.y + n.h });
    const top = (n) => ({ x: n.cx, y: n.y });
    const rightMid = (n) => ({ x: n.x + n.w, y: n.cy });
    const leftMid = (n) => ({ x: n.x, y: n.cy });

    // Flow lane runs through the right third of the cards like a system bus
    const flowX = spineX + 140;

    // Annotation lane close to the flow, not far right
    const labelLaneX = flowX + 250;

    const vertical = spine.slice(0, 3).map((n, i) => ({
      d: `M ${flowX} ${bottom(n).y} L ${flowX} ${top(spine[i + 1]).y}`,
      chip: { x: labelLaneX, y: (n.cy + spine[i + 1].cy) / 2 },
    }));

    // Branch from Token Sinks to Burn
    const start = rightMid(spine[3]);
    const elbowX = spineX + nodeW / 2 + 130;
    const end = leftMid(burnNode);

    const branch = {
      d: `M ${start.x} ${start.y} L ${elbowX} ${start.y} L ${elbowX} ${end.y} L ${end.x} ${end.y}`,
      // Put label above the horizontal segment, away from the Burn card
      chip: { x: elbowX + 210, y: start.y - 26 },
    };

    return { W, H, spine, burnNode, vertical, branch, nodeW, nodeH, flowX };
  }, []);

  const Chip = ({ x, y, text, w = 280, terminal = false }) => (
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
        width={34}
        height={34}
        rx={9}
        fill={terminal ? "rgba(34,197,94,0.12)" : "rgba(0,0,0,0.24)"}
        stroke={terminal ? "rgba(34,197,94,0.26)" : colors.chipBorder}
      />
      <text
        x={x + 17}
        y={y + 18}
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

      <StepBadge x={n.x + 18} y={n.y + 26} step={n.step} terminal={!!n.terminal} />

      <text x={n.x + 70} y={n.y + 44} fontSize="14" fill={colors.text} style={{ fontWeight: 800 }}>
        {n.title}
      </text>
      <text x={n.x + 70} y={n.y + 68} fontSize="12" fill={colors.subtext}>
        {n.sub}
      </text>

      {n.terminal ? (
        <g>
          <rect
            x={n.x + n.w - 128}
            y={n.y + 30}
            width={104}
            height={28}
            rx={10}
            fill={colors.chipBg}
            stroke={colors.chipTerminalBorder}
          />
          <text
            x={n.x + n.w - 76}
            y={n.y + 44}
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
              background: `linear-gradient(180deg, ${colors.innerTop} 0%, ${colors.innerBottom} 100%)`,
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
                <marker id="puapArrowHeadFull" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.arrowHead} />
                </marker>
              </defs>

              {/* Flow lane guide to help scanning */}
              <line
                x1={geo.flowX}
                y1={geo.spine[0].y + geo.nodeH - 2}
                x2={geo.flowX}
                y2={geo.spine[3].y + 2}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
              />

              {/* Vertical flow connectors */}
              {geo.vertical.map((v, i) => (
                <g key={`v-${i}`}>
                  <path
                    d={v.d}
                    fill="none"
                    stroke={colors.line}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    markerEnd="url(#puapArrowHeadFull)"
                  />
                  <Chip x={v.chip.x} y={v.chip.y} text={labels[i]} w={300} />
                </g>
              ))}

              {/* Branch connector */}
              <path
                d={geo.branch.d}
                fill="none"
                stroke={colors.lineStrong}
                strokeWidth="2.8"
                strokeLinecap="round"
                markerEnd="url(#puapArrowHeadFull)"
              />
              <Chip x={geo.branch.chip.x} y={geo.branch.chip.y} text={labels[3]} w={320} terminal />

              {/* Nodes */}
              {allNodes.map((n) => (
                <Node key={`n-${n.step}`} n={n} />
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
