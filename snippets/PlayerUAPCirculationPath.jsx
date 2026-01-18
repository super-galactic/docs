export const PlayerUAPCirculationPath = ({ showCaption = true }) => {
  const colors = {
    border: "rgba(255,255,255,0.10)",
    panelOuter: "rgba(255,255,255,0.03)",

    // background layers
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
    const W = 1040;
    const H = 700;

    const nodeW = 360;
    const nodeH = 82;

    const spineX = 440;
    const topY = 120;
    const gap = 140;

    const spine = [0, 1, 2, 3].map((i) => {
      const cx = spineX;
      const cy = topY + gap * i;
      return { i, cx, cy, x: cx - nodeW / 2, y: cy - nodeH / 2, w: nodeW, h: nodeH };
    });

    const burn = {
      i: 4,
      cx: spineX + 420,
      cy: spine[3].cy + 110,
    };

    const burnNode = { ...burn, x: burn.cx - nodeW / 2, y: burn.cy - nodeH / 2, w: nodeW, h: nodeH };

    const bottom = (n) => ({ x: n.cx, y: n.y + n.h });
    const top = (n) => ({ x: n.cx, y: n.y });
    const right = (n) => ({ x: n.x + n.w, y: n.cy });
    const left = (n) => ({ x: n.x, y: n.cy });

    const vertical = spine.slice(0, 3).map((n, i) => ({
      d: `M ${bottom(n).x} ${bottom(n).y} L ${top(spine[i + 1]).x} ${top(spine[i + 1]).y}`,
      label: { x: spineX - 200, y: (n.cy + spine[i + 1].cy) / 2 },
    }));

    const elbowX = spineX + 210;
    const branch = {
      d: `M ${right(spine[3]).x} ${right(spine[3]).y}
          L ${elbowX} ${right(spine[3]).y}
          L ${elbowX} ${left(burnNode).y}
          L ${left(burnNode).x} ${left(burnNode).y}`,
      label: { x: elbowX + 190, y: burnNode.cy },
    };

    return { W, H, spine, burnNode, vertical, branch };
  }, []);

  const Chip = ({ x, y, text, terminal }) => (
    <g>
      <rect
        x={x - 120}
        y={y - 14}
        width={240}
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
        style={{ fontWeight: 600 }}
      >
        {text}
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

      <rect
        x={n.x + 16}
        y={n.y + 20}
        width={30}
        height={30}
        rx={8}
        fill="rgba(0,0,0,0.24)"
        stroke={colors.chipBorder}
      />
      <text
        x={n.x + 31}
        y={n.y + 36}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={colors.text}
        style={{ fontWeight: 800 }}
      >
        {n.step}
      </text>

      <text x={n.x + 58} y={n.y + 36} fontSize="14" fill={colors.text} style={{ fontWeight: 800 }}>
        {n.title}
      </text>
      <text x={n.x + 58} y={n.y + 58} fontSize="12" fill={colors.subtext}>
        {n.sub}
      </text>

      {n.terminal && (
        <Chip
          x={n.x + n.w - 64}
          y={n.y + 32}
          text="Terminal"
          terminal
        />
      )}
    </g>
  );

  return (
    <div className="not-prose w-full">
      <div style={{ borderRadius: 18, border: `1px solid ${colors.border}`, background: colors.panelOuter, padding: 16 }}>
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

            <svg viewBox={`0 0 ${geo.W} ${geo.H}`} className="w-full" role="img" aria-label="Player-facing UAP circulation path">
              <defs>
                <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.arrowHead} />
                </marker>
              </defs>

              {geo.vertical.map((v, i) => (
                <g key={i}>
                  <path d={v.d} fill="none" stroke={colors.line} strokeWidth="2.4" markerEnd="url(#arrowHead)" />
                  <Chip x={v.label.x} y={v.label.y} text={labels[i]} />
                </g>
              ))}

              <path d={geo.branch.d} fill="none" stroke={colors.line} strokeWidth="2.6" markerEnd="url(#arrowHead)" />
              <Chip x={geo.branch.label.x} y={geo.branch.label.y} text={labels[3]} terminal />

              {[...geo.spine.map((p, i) => ({ ...p, ...nodes[i] })), { ...geo.burnNode, ...nodes[4] }].map((n) => (
                <Node key={n.step} n={n} />
              ))}
            </svg>
          </div>
        </div>

        {showCaption && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            Player-facing UAP circulation path.
          </div>
        )}
      </div>
    </div>
  );
};
