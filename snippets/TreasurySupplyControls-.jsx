export const TreasurySupplyControls = () => {
  const title = "Treasury supply controls";
  const caption =
    "Treasury routing is a supply control mechanism and operates outside player circulation.";

  const labels = {
    divider: "Outside player circulation",
    auto: "Automated routing (50 percent)",
    manualPool: "Manual allocation (stabilisation)",
    manualBurn: "Manual burn (if required)",
  };

  const nodes = {
    tokenSinks: "Token Sinks",
    burnWallet: "Burn Wallet",
    gameTreasury: "Game Treasury",
    p2ePool: "P2E Reward Pool",
    furtherBurn: "Further Burn",
  };

  const colors = {
    border: "rgba(255,255,255,0.10)",
    panelInner: "rgba(2, 6, 23, 0.55)",
    nodeFill: "rgba(15,23,42,0.84)",
    nodeFillAlt: "rgba(20, 30, 46, 0.78)",
    text: "rgba(255,255,255,0.92)",
    textSoft: "rgba(226,232,240,0.72)",
    line: "rgba(226,232,240,0.35)",
    lineSoft: "rgba(226,232,240,0.22)",
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
      { key: "ts", label: nodes.tokenSinks, cx: leftX, cy: topY + vGap * 0, tone: "base" },
      { key: "bw", label: nodes.burnWallet, cx: leftX, cy: topY + vGap * 1, tone: "alt" },
      { key: "gt", label: nodes.gameTreasury, cx: leftX, cy: topY + vGap * 2, tone: "alt" },
    ].map((n) => ({
      ...n,
      x: n.cx - nodeW / 2,
      y: n.cy - nodeH / 2,
      w: nodeW,
      h: nodeH,
    }));

    const right = [
      { key: "pp", label: nodes.p2ePool, cx: rightX, cy: topY + vGap * 1, tone: "base" },
      { key: "fb", label: nodes.furtherBurn, cx: rightX, cy: topY + vGap * 2, tone: "alt" },
    ].map((n) => ({
      ...n,
      x: n.cx - nodeW / 2,
      y: n.cy - nodeH / 2,
      w: nodeW,
      h: nodeH,
    }));

    const dividerX = (leftX + rightX) / 2;

    const midR = (n) => ({ x: n.x + n.w, y: n.cy });
    const midL = (n) => ({ x: n.x, y: n.cy });

    const paths = {
      autoBurn: {
        d: `M ${midR(left[0]).x} ${midR(left[0]).y - 6} Q ${midR(left[0]).x + 48} ${
          midR(left[0]).y + 10
        } ${midL(left[1]).x} ${midL(left[1]).y - 8}`,
        chip: { x: leftX + 60, y: topY + 64 },
        text: labels.auto,
      },
      autoTreasury: {
        d: `M ${midR(left[0]).x} ${midR(left[0]).y + 10} Q ${midR(left[0]).x + 58} ${
          midR(left[0]).y + 56
        } ${midL(left[2]).x} ${midL(left[2]).y - 14}`,
        chip: { x: leftX + 76, y: topY + 136 },
        text: labels.auto,
      },
      manualPool: {
        d: `M ${midR(left[2]).x} ${midR(left[2]).y - 10} Q ${dividerX} ${left[2].cy - 90} ${midL(
          right[0]
        ).x} ${midL(right[0]).y - 4}`,
        chip: { x: dividerX, y: left[2].cy - 98 },
        text: labels.manualPool,
      },
      manualBurn: {
        d: `M ${midR(left[2]).x} ${midR(left[2]).y + 12} Q ${dividerX} ${left[2].cy + 34} ${midL(
          right[1]
        ).x} ${midL(right[1]).y + 2}`,
        chip: { x: dividerX + 10, y: left[2].cy + 54 },
        text: labels.manualBurn,
      },
    };

    return { W, H, left, right, dividerX, paths };
  }, []);

  const Node = (n) => {
    const fill = n.tone === "alt" ? colors.nodeFillAlt : colors.nodeFill;
    const stroke = n.tone === "alt" ? "rgba(226,232,240,0.40)" : "rgba(226,232,240,0.28)";
    const strokeWidth = n.tone === "alt" ? 1.9 : 1.4;

    return (
      <g key={n.key}>
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="14" ry="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        <text x={n.cx} y={n.cy} textAnchor="middle" dominantBaseline="middle" fontSize="13" fill={colors.text}>
          {n.label}
        </text>
      </g>
    );
  };

  const Chip = (x, y, text) => (
    <g>
      <rect x={x - 152} y={y - 13} width={304} height={26} rx={999} fill={colors.chipBg} stroke={colors.border} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={colors.textSoft}>
        {text}
      </text>
    </g>
  );

  return (
    <div className="not-prose w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="text-lg font-semibold text-slate-100">{title}</div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10" style={{ background: colors.panelInner }}>
          <svg viewBox={`0 0 ${geo.W} ${geo.H}`} className="w-full" role="img" aria-label="Treasury supply controls diagram">
            {/* Debug marker so you can confirm it is rendering */}
            <text x="18" y="24" fontSize="12" fill="rgba(226,232,240,0.55)">
              Loaded
            </text>

            {/* Canvas backing */}
            <rect x="0" y="0" width={geo.W} height={geo.H} fill="rgba(0,0,0,0.06)" />

            <defs>
              <marker id="tscArrowHead" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(226,232,240,0.9)" />
              </marker>
            </defs>

            {/* Divider */}
            <line x1={geo.dividerX} y1={110} x2={geo.dividerX} y2={480} stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
            <g>
              <rect x={geo.dividerX - 120} y={92} width={240} height={28} rx={999} fill="rgba(0,0,0,0.22)" stroke={colors.border} />
              <text x={geo.dividerX} y={106} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={colors.textSoft}>
                {labels.divider}
              </text>
            </g>

            {/* Paths + chips */}
            <path d={geo.paths.autoBurn.d} fill="none" stroke={colors.line} strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#tscArrowHead)" />
            {Chip(geo.paths.autoBurn.chip.x, geo.paths.autoBurn.chip.y, geo.paths.autoBurn.text)}

            <path d={geo.paths.autoTreasury.d} fill="none" stroke={colors.line} strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#tscArrowHead)" />
            {Chip(geo.paths.autoTreasury.chip.x, geo.paths.autoTreasury.chip.y, geo.paths.autoTreasury.text)}

            <path d={geo.paths.manualPool.d} fill="none" stroke={colors.lineSoft} strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#tscArrowHead)" />
            {Chip(geo.paths.manualPool.chip.x, geo.paths.manualPool.chip.y, geo.paths.manualPool.text)}

            <path d={geo.paths.manualBurn.d} fill="none" stroke={colors.lineSoft} strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#tscArrowHead)" />
            {Chip(geo.paths.manualBurn.chip.x, geo.paths.manualBurn.chip.y, geo.paths.manualBurn.text)}

            {/* Nodes */}
            {geo.left.map(Node)}
            {geo.right.map(Node)}
          </svg>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">{caption}</div>
      </div>
    </div>
  );
};
