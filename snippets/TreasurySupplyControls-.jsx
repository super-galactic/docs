export const TreasurySupplyControls = () => {
  const title = "Treasury supply controls";

  const caption =
    "Treasury routing is a supply control mechanism and operates outside player circulation.";

  const nodes = {
    left: ["Token Sinks", "Burn Wallet", "Game Treasury"],
    right: ["P2E Reward Pool", "Further Burn"],
  };

  const labels = {
    autoBurn: "Automated routing (50 percent)",
    autoTreasury: "Automated routing (50 percent)",
    manualPool: "Manual allocation (stabilisation)",
    manualBurn: "Manual burn (if required)",
    divider: "Outside player circulation",
  };

  const colors = {
    border: "rgba(255,255,255,0.10)",
    panel: "rgba(255,255,255,0.03)",
    panelInner: "rgba(2, 6, 23, 0.55)",
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.72)",
    line: "rgba(226,232,240,0.35)",
    lineSoft: "rgba(226,232,240,0.22)",
    nodeFill: "rgba(15,23,42,0.84)",
    nodeFillAlt: "rgba(20, 30, 46, 0.78)",
    chipBg: "rgba(0,0,0,0.28)",
  };

  const geo = React.useMemo(() => {
    const W = 980;
    const H = 560;

    const nodeW = 220;
    const nodeH = 56;

    const leftX = 250;
    const rightX = 730;

    const topY = 150;
    const vGap = 118;

    const left = [
      { i: "ls", label: nodes.left[0], cx: leftX, cy: topY + vGap * 0 }, // Token Sinks
      { i: "bw", label: nodes.left[1], cx: leftX, cy: topY + vGap * 1 }, // Burn Wallet
      { i: "gt", label: nodes.left[2], cx: leftX, cy: topY + vGap * 2 }, // Game Treasury
    ].map((n) => ({
      ...n,
      x: n.cx - nodeW / 2,
      y: n.cy - nodeH / 2,
      w: nodeW,
      h: nodeH,
    }));

    const right = [
      { i: "pp", label: nodes.right[0], cx: rightX, cy: topY + vGap * 1 }, // P2E Reward Pool
      { i: "fb", label: nodes.right[1], cx: rightX, cy: topY + vGap * 2 }, // Further Burn
    ].map((n) => ({
      ...n,
      x: n.cx - nodeW / 2,
      y: n.cy - nodeH / 2,
      w: nodeW,
      h: nodeH,
    }));

    const dividerX = (leftX + rightX) / 2;

    const topOf = (n) => ({ x: n.cx, y: n.y });
    const bottomOf = (n) => ({ x: n.cx, y: n.y + n.h });
    const midRight = (n) => ({ x: n.x + n.w, y: n.cy });
    const midLeft = (n) => ({ x: n.x, y: n.cy });

    const paths = {
      // From Token Sinks to Burn Wallet (auto)
      autoBurn: {
        d: `M ${midRight(left[0]).x} ${midRight(left[0]).y - 6} Q ${midRight(left[0]).x + 40} ${
          midRight(left[0]).y + 12
        } ${midLeft(left[1]).x} ${midLeft(left[1]).y - 8}`,
        label: { x: leftX + 40, y: topY + 64 },
      },
      // From Token Sinks to Game Treasury (auto)
      autoTreasury: {
        d: `M ${midRight(left[0]).x} ${midRight(left[0]).y + 10} Q ${midRight(left[0]).x + 50} ${
          midRight(left[0]).y + 52
        } ${midLeft(left[2]).x} ${midLeft(left[2]).y - 14}`,
        label: { x: leftX + 55, y: topY + 136 },
      },
      // From Game Treasury to P2E Reward Pool (manual)
      manualPool: {
        d: `M ${midRight(left[2]).x} ${midRight(left[2]).y - 10} Q ${dividerX} ${left[2].cy - 80} ${midLeft(
          right[0]
        ).x} ${midLeft(right[0]).y - 4}`,
        label: { x: dividerX, y: left[2].cy - 88 },
      },
      // From Game Treasury to Further Burn (manual)
      manualBurn: {
        d: `M ${midRight(left[2]).x} ${midRight(left[2]).y + 12} Q ${dividerX} ${left[2].cy + 34} ${midLeft(
          right[1]
        ).x} ${midLeft(right[1]).y + 2}`,
        label: { x: dividerX + 10, y: left[2].cy + 52 },
      },
    };

    return { W, H, nodeW, nodeH, left, right, dividerX, paths };
  }, []);

  const Node = ({ n, tone }) => {
    const fill = tone === "alt" ? colors.nodeFillAlt : colors.nodeFill;
    const stroke = tone === "alt" ? "rgba(226,232,240,0.40)" : "rgba(226,232,240,0.28)";
    const strokeWidth = tone === "alt" ? 1.9 : 1.4;

    return (
      <g filter="url(#nodeGlow)">
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="14" ry="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        <foreignObject x={n.x} y={n.y} width={n.w} height={n.h}>
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-100 text-center px-3" style={{ lineHeight: 1.15 }}>
            {n.label}
          </div>
        </foreignObject>
      </g>
    );
  };

  const Chip = ({ x, y, text }) => (
    <g>
      <rect x={x - 150} y={y - 13} width={300} height={26} rx={999} fill={colors.chipBg} stroke={colors.border} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="rgba(226,232,240,0.74)">
        {text}
      </text>
    </g>
  );

  return (
    <div className="not-prose w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="text-lg font-semibold text-slate-100">{title}</div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
          <svg viewBox={`0 0 ${geo.W} ${geo.H}`} className="w-full" role="img" aria-label="Treasury supply controls diagram">
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

            {/* Divider */}
            <line x1={geo.dividerX} y1={110} x2={geo.dividerX} y2={480} stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
            <g>
              <rect x={geo.dividerX - 120} y={92} width={240} height={28} rx={999} fill="rgba(0,0,0,0.22)" stroke={colors.border} />
              <text x={geo.dividerX} y={106} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="rgba(226,232,240,0.72)">
                {labels.divider}
              </text>
            </g>

            {/* Automated routing paths */}
            <path d={geo.paths.autoBurn.d} fill="none" stroke={colors.line} strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#arrowHead)" />
            <Chip x={geo.paths.autoBurn.label.x} y={geo.paths.autoBurn.label.y} text={labels.autoBurn} />

            <path d={geo.paths.autoTreasury.d} fill="none" stroke={colors.line} strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#arrowHead)" />
            <Chip x={geo.paths.autoTreasury.label.x} y={geo.paths.autoTreasury.label.y} text={labels.autoTreasury} />

            {/* Manual control paths */}
            <path d={geo.paths.manualPool.d} fill="none" stroke={colors.lineSoft} strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#arrowHead)" />
            <Chip x={geo.paths.manualPool.label.x} y={geo.paths.manualPool.label.y} text={labels.manualPool} />

            <path d={geo.paths.manualBurn.d} fill="none" stroke={colors.lineSoft} strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#arrowHead)" />
            <Chip x={geo.paths.manualBurn.label.x} y={geo.paths.manualBurn.label.y} text={labels.manualBurn} />

            {/* Nodes */}
            <Node n={geo.left[0]} />
            <Node n={geo.left[1]} tone="alt" />
            <Node n={geo.left[2]} tone="alt" />

            <Node n={geo.right[0]} />
            <Node n={geo.right[1]} tone="alt" />
          </svg>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">{caption}</div>
      </div>
    </div>
  );
};
