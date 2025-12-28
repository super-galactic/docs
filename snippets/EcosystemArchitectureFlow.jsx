"use client";
import React from "react";

// Ecosystem Architecture Flowboard
// Premium micro node system map with a traveling glow dot on the active connector
// Mintlify safe: single file, inline styles, no external deps, no emoji

export const SuperGalacticArchitectureFlow = () => {
  const [activeFlow, setActiveFlow] = React.useState("reward");
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [mode, setMode] = React.useState("desktop"); // "desktop" | "mobile"
  const timerRef = React.useRef(null);

  // Responsive mode switch
  React.useEffect(() => {
    const decide = () => {
      if (typeof window === "undefined") return;
      setMode(window.innerWidth < 820 ? "mobile" : "desktop");
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, []);

  const flows = React.useMemo(
    () => ({
      reward: {
        label: "Reward flow",
        steps: [
          { id: "gc_missions", caption: "Missions and combat" },
          { id: "gc_rewards", caption: "Rewards generated off chain" },
          { id: "edge_gc_to_hub", caption: "Reward data sent to Hub" },
          { id: "hub_balance_claimable", caption: "UAP appears as claimable balance" },
        ],
      },
      claim: {
        label: "Claim flow",
        steps: [
          { id: "hub_claim", caption: "Player claims via Hub" },
          { id: "edge_hub_to_chain", caption: "Claim triggers on chain transaction" },
          { id: "chain_tx_verify", caption: "Chain verifies and confirms" },
          { id: "edge_chain_to_hub", caption: "Balance updates across systems" },
        ],
      },
      spend: {
        label: "Spending and burn flow",
        steps: [
          { id: "hub_asset", caption: "Player spends UAP via an asset action" },
          { id: "edge_hub_to_chain", caption: "Spend triggers on chain settlement" },
          { id: "chain_burn_treasury", caption: "Burn executes and treasury records" },
          { id: "edge_chain_to_hub_then_hub_to_gc", caption: "State syncs to Hub and Game Client" },
        ],
      },
      sync: {
        label: "Asset synchronization flow",
        steps: [
          { id: "gc_progression", caption: "Upgrades performed in game" },
          { id: "edge_gc_to_hub", caption: "Gameplay state syncs to Hub" },
          { id: "hub_breeding", caption: "Breeding and NFT actions update state" },
          { id: "edge_hub_to_gc", caption: "Resulting NFT state reflects in game" },
        ],
      },
    }),
    []
  );

  const totalSteps = flows[activeFlow].steps.length;
  const activeStepId = flows[activeFlow].steps[step]?.id;
  const caption = flows[activeFlow].steps[step]?.caption || "";

  const stop = React.useCallback(() => {
    setPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = React.useCallback(() => {
    stop();
    setStep(0);
  }, [stop]);

  const startFromBeginning = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setStep(0);
    setPlaying(true);
  }, []);

  // Play once, then stop
  React.useEffect(() => {
    if (!playing) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (step >= totalSteps - 1) {
      // last step stays visible, then stop
      timerRef.current = setTimeout(() => {
        setPlaying(false);
        timerRef.current = null;
      }, 900);
      return;
    }

    timerRef.current = setTimeout(() => {
      setStep((s) => s + 1);
      timerRef.current = null;
    }, 1500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playing, step, totalSteps]);

  // Layouts are expressed in SVG coordinates for reliability in Mintlify
  const layout = React.useMemo(() => {
    if (mode === "mobile") {
      const W = 720;
      const H = 1120;

      const colW = 620;
      const x0 = 50;
      const yGame = 170;
      const yHub = 490;
      const yChain = 810;

      const card = {
        w: colW,
        h: 255,
      };

      const containers = {
        game: { x: x0, y: yGame, w: card.w, h: card.h, title: "Game Client", sub: "Unity" },
        hub: { x: x0, y: yHub, w: card.w, h: card.h, title: "Super Galactic Hub", sub: "Unified app layer" },
        chain: {
          x: x0,
          y: yChain,
          w: card.w,
          h: card.h,
          title: "Blockchain Layer",
          sub: "Ethereum (origin), BNB and Avalanche (gameplay)",
        },
      };

      // Micro tiles (x,y are within the svg coordinate system)
      const micro = {
        game: [
          { id: "gc_missions", label: "Missions and combat", x: x0 + 26, y: yGame + 82 },
          { id: "gc_progression", label: "Progression and upgrades", x: x0 + 26, y: yGame + 124 },
          { id: "gc_rewards", label: "Rewards generated (off chain)", x: x0 + 26, y: yGame + 166 },
          { id: "gc_cache", label: "Local state cache", x: x0 + 26, y: yGame + 208 },
        ],
        hub: [
          { id: "hub_asset", label: "Asset manager", x: x0 + 26, y: yHub + 82 },
          { id: "hub_balance", label: "UAP balance", x: x0 + 26, y: yHub + 124 },
          { id: "hub_claim", label: "Claim service", x: x0 + 26, y: yHub + 166 },
          { id: "hub_breeding", label: "Breeding and NFT actions", x: x0 + 26, y: yHub + 208 },
          { id: "hub_sync", label: "Sync router", x: x0 + 330, y: yHub + 124 },
        ],
        chain: [
          { id: "chain_uap", label: "UAP token contract", x: x0 + 26, y: yChain + 82 },
          { id: "chain_nft", label: "NFT ownership contract", x: x0 + 26, y: yChain + 124 },
          { id: "chain_burn", label: "Burn execution", x: x0 + 26, y: yChain + 166 },
          { id: "chain_treasury", label: "Treasury flows", x: x0 + 26, y: yChain + 208 },
          { id: "chain_tx_verify", label: "Tx verification", x: x0 + 330, y: yChain + 124 },
        ],
      };

      const edge = {
        gc_to_hub: `M ${x0 + card.w / 2} ${yGame + card.h} C ${x0 + card.w / 2} ${yGame + card.h + 40}, ${x0 + card.w / 2} ${
          yHub - 40
        }, ${x0 + card.w / 2} ${yHub}`,
        hub_to_chain: `M ${x0 + card.w / 2} ${yHub + card.h} C ${x0 + card.w / 2} ${yHub + card.h + 40}, ${x0 + card.w / 2} ${
          yChain - 40
        }, ${x0 + card.w / 2} ${yChain}`,
        chain_to_hub: `M ${x0 + card.w / 2 + 70} ${yChain} C ${x0 + card.w / 2 + 70} ${yChain - 40}, ${x0 + card.w / 2 + 70} ${
          yHub + card.h + 40
        }, ${x0 + card.w / 2 + 70} ${yHub + card.h}`,
        hub_to_gc: `M ${x0 + card.w / 2 + 70} ${yHub} C ${x0 + card.w / 2 + 70} ${yHub - 40}, ${x0 + card.w / 2 + 70} ${
          yGame + card.h + 40
        }, ${x0 + card.w / 2 + 70} ${yGame + card.h}`,
      };

      return { W, H, containers, micro, edge };
    }

    // Desktop
    const W = 1100;
    const H = 720;

    const margin = 40;
    const gap = 30;
    const cardW = (W - margin * 2 - gap * 2) / 3;
    const cardH = 360;
    const y = 210;

    const xGame = margin;
    const xHub = margin + cardW + gap;
    const xChain = margin + (cardW + gap) * 2;

    const containers = {
      game: { x: xGame, y, w: cardW, h: cardH, title: "Game Client", sub: "Unity" },
      hub: { x: xHub, y, w: cardW, h: cardH, title: "Super Galactic Hub", sub: "Unified app layer" },
      chain: { x: xChain, y, w: cardW, h: cardH, title: "Blockchain Layer", sub: "Ethereum (origin), BNB and Avalanche (gameplay)" },
    };

    const tileW = cardW - 52;
    const tileW2 = Math.max(170, Math.floor((tileW - 14) / 2));

    const micro = {
      game: [
        { id: "gc_missions", label: "Missions and combat", x: xGame + 26, y: y + 92, w: tileW, h: 34 },
        { id: "gc_progression", label: "Progression and upgrades", x: xGame + 26, y: y + 136, w: tileW, h: 34 },
        { id: "gc_rewards", label: "Rewards generated (off chain)", x: xGame + 26, y: y + 180, w: tileW, h: 34 },
        { id: "gc_cache", label: "Local state cache", x: xGame + 26, y: y + 224, w: tileW, h: 34 },
      ],
      hub: [
        { id: "hub_asset", label: "Asset manager", x: xHub + 26, y: y + 92, w: tileW2, h: 34 },
        { id: "hub_balance", label: "UAP balance", x: xHub + 26 + tileW2 + 14, y: y + 92, w: tileW2, h: 34 },
        { id: "hub_claim", label: "Claim service", x: xHub + 26, y: y + 136, w: tileW2, h: 34 },
        { id: "hub_breeding", label: "Breeding and NFT actions", x: xHub + 26 + tileW2 + 14, y: y + 136, w: tileW2, h: 34 },
        { id: "hub_sync", label: "Sync router", x: xHub + 26, y: y + 180, w: tileW, h: 34 },
      ],
      chain: [
        { id: "chain_uap", label: "UAP token contract", x: xChain + 26, y: y + 92, w: tileW2, h: 34 },
        { id: "chain_nft", label: "NFT ownership contract", x: xChain + 26 + tileW2 + 14, y: y + 92, w: tileW2, h: 34 },
        { id: "chain_burn", label: "Burn execution", x: xChain + 26, y: y + 136, w: tileW2, h: 34 },
        { id: "chain_treasury", label: "Treasury flows", x: xChain + 26 + tileW2 + 14, y: y + 136, w: tileW2, h: 34 },
        { id: "chain_tx_verify", label: "Tx verification", x: xChain + 26, y: y + 180, w: tileW, h: 34 },
      ],
    };

    // Global connectors are routed in the empty space between cards and above tiles
    const midY = y + 250;

    const edge = {
      gc_to_hub: `M ${xGame + cardW} ${midY} C ${xGame + cardW + 60} ${midY - 40}, ${xHub - 60} ${midY - 40}, ${xHub} ${midY}`,
      hub_to_chain: `M ${xHub + cardW} ${midY} C ${xHub + cardW + 60} ${midY - 40}, ${xChain - 60} ${midY - 40}, ${xChain} ${midY}`,
      chain_to_hub: `M ${xChain} ${midY + 34} C ${xChain - 60} ${midY + 70}, ${xHub + cardW + 60} ${midY + 70}, ${xHub + cardW} ${midY + 34}`,
      hub_to_gc: `M ${xHub} ${midY + 34} C ${xHub - 60} ${midY + 70}, ${xGame + cardW + 60} ${midY + 70}, ${xGame + cardW} ${midY + 34}`,
    };

    return { W, H, containers, micro, edge };
  }, [mode]);

  const isMicroActive = (id) => {
    if (activeStepId === id) return true;
    // Combined step in spending flow
    if (activeStepId === "chain_burn_treasury" && (id === "chain_burn" || id === "chain_treasury")) return true;
    if (activeStepId === "hub_balance_claimable" && id === "hub_balance") return true;
    return false;
  };

  const isContainerActive = (key) => {
    const group = layout.micro[key] || [];
    for (let i = 0; i < group.length; i++) {
      if (isMicroActive(group[i].id)) return true;
    }
    // Also glow container on edge steps that target it
    if (key === "hub" && (activeStepId === "edge_gc_to_hub" || activeStepId === "edge_chain_to_hub")) return true;
    if (key === "chain" && activeStepId === "edge_hub_to_chain") return true;
    if (key === "game" && (activeStepId === "edge_hub_to_gc" || activeStepId === "edge_chain_to_hub_then_hub_to_gc")) return true;
    if (key === "hub" && activeStepId === "edge_chain_to_hub_then_hub_to_gc") return true;
    return false;
  };

  const activeEdgeKey = React.useMemo(() => {
    if (activeStepId === "edge_gc_to_hub") return "gc_to_hub";
    if (activeStepId === "edge_hub_to_chain") return "hub_to_chain";
    if (activeStepId === "edge_chain_to_hub") return "chain_to_hub";
    if (activeStepId === "edge_hub_to_gc") return "hub_to_gc";
    // Combined step plays two edges in sequence using internal sub-phase
    if (activeStepId === "edge_chain_to_hub_then_hub_to_gc") return "chain_to_hub_then_hub_to_gc";
    return null;
  }, [activeStepId]);

  // Two edge sequence support for the combined step
  const [edgePhase, setEdgePhase] = React.useState(0); // 0 or 1
  React.useEffect(() => {
    setEdgePhase(0);
    if (activeStepId !== "edge_chain_to_hub_then_hub_to_gc") return;

    const t = setTimeout(() => setEdgePhase(1), 850);
    return () => clearTimeout(t);
  }, [activeStepId, step, activeFlow]);

  const getActivePathD = () => {
    if (!activeEdgeKey) return null;
    if (activeEdgeKey === "gc_to_hub") return layout.edge.gc_to_hub;
    if (activeEdgeKey === "hub_to_chain") return layout.edge.hub_to_chain;
    if (activeEdgeKey === "chain_to_hub") return layout.edge.chain_to_hub;
    if (activeEdgeKey === "hub_to_gc") return layout.edge.hub_to_gc;
    if (activeEdgeKey === "chain_to_hub_then_hub_to_gc") {
      return edgePhase === 0 ? layout.edge.chain_to_hub : layout.edge.hub_to_gc;
    }
    return null;
  };

  const isEdgeBright = (k) => {
    if (activeEdgeKey === null) return false;
    if (activeEdgeKey === "chain_to_hub_then_hub_to_gc") {
      if (k === "chain_to_hub" && edgePhase === 0) return true;
      if (k === "hub_to_gc" && edgePhase === 1) return true;
      return false;
    }
    return (
      (activeEdgeKey === "gc_to_hub" && k === "gc_to_hub") ||
      (activeEdgeKey === "hub_to_chain" && k === "hub_to_chain") ||
      (activeEdgeKey === "chain_to_hub" && k === "chain_to_hub") ||
      (activeEdgeKey === "hub_to_gc" && k === "hub_to_gc")
    );
  };

  const TravelDot = ({ d, durationMs }) => {
    const pathRef = React.useRef(null);
    const outerRef = React.useRef(null);
    const innerRef = React.useRef(null);
    const rafRef = React.useRef(null);

    React.useEffect(() => {
      const pathEl = pathRef.current;
      const outer = outerRef.current;
      const inner = innerRef.current;

      if (pathEl === null || outer === null || inner === null) return;

      let length = 0;
      try {
        length = pathEl.getTotalLength();
      } catch (e) {
        length = 0;
      }
      if (length <= 0) return;

      // Set immediate visible start point
      try {
        const startPt = pathEl.getPointAtLength(0);
        outer.setAttribute("cx", String(startPt.x));
        outer.setAttribute("cy", String(startPt.y));
        inner.setAttribute("cx", String(startPt.x));
        inner.setAttribute("cy", String(startPt.y));
      } catch (e) {
        return;
      }

      let startTime;

      const tick = (t) => {
        if (startTime === undefined) startTime = t;
        const elapsed = t - startTime;
        const p = Math.min(elapsed / durationMs, 1);

        let pt;
        try {
          pt = pathEl.getPointAtLength(p * length);
        } catch (e) {
          return;
        }

        outer.setAttribute("cx", String(pt.x));
        outer.setAttribute("cy", String(pt.y));
        inner.setAttribute("cx", String(pt.x));
        inner.setAttribute("cy", String(pt.y));

        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [d, durationMs]);

    return (
      <g>
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth="10"
          vectorEffect="non-scaling-stroke"
        />
        <circle ref={outerRef} cx="0" cy="0" r="7" className="travelDotOuter" />
        <circle ref={innerRef} cx="0" cy="0" r="3.2" className="travelDotInner" />
      </g>
    );
  };

  const IconGame = ({ active }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="hdrIcon">
      <path
        d="M7.5 9.5h9A4.5 4.5 0 0 1 21 14v1.2A2.8 2.8 0 0 1 18.2 18H17l-1.2-1.2H8.2L7 18H5.8A2.8 2.8 0 0 1 3 15.2V14a4.5 4.5 0 0 1 4.5-4.5Z"
        stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 13.7h2.2M9.3 12.6v2.2"
        stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15.6 13.7h.01M17.5 12.8h.01"
        stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );

  const IconHub = ({ active }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="hdrIcon">
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"}
        strokeWidth="2"
      />
      <path
        d="M4 12c2.3-3.7 13.7-3.7 16 0"
        stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 12c2.3 3.7 13.7 3.7 16 0"
        stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );

  const IconChain = ({ active }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="hdrIcon">
      <path
        d="M10 13.5 8.4 15.1a3 3 0 0 1-4.2-4.2L5.8 9.3a3 3 0 0 1 4.2 0"
        stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 10.5l1.6-1.6a3 3 0 0 1 4.2 4.2L18.2 14.7a3 3 0 0 1-4.2 0"
        stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.5 14.5 14.5 9.5"
        stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );

  const MicroTile = ({ t, active }) => {
    const w = t.w || 260;
    const h = t.h || 34;
    return (
      <g>
        <rect
          x={t.x}
          y={t.y}
          width={w}
          height={h}
          rx="10"
          ry="10"
          className={active ? "tile tileActive" : "tile"}
        />
        <circle cx={t.x + 14} cy={t.y + h / 2} r="3" className={active ? "tileDot tileDotActive" : "tileDot"} />
        <text x={t.x + 26} y={t.y + h / 2 + 4} className={active ? "tileText tileTextActive" : "tileText"}>
          {t.label}
        </text>
      </g>
    );
  };

  const Container = ({ k, c, headerIcon }) => {
    const active = isContainerActive(k);
    const titleX = c.x + 18;
    const titleY = c.y + 32;
    const subY = c.y + 54;
    const dividerY = c.y + 72;

    return (
      <g>
        {active ? (
          <rect x={c.x - 6} y={c.y - 6} width={c.w + 12} height={c.h + 12} rx="22" ry="22" className="halo" />
        ) : null}

        <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="18" ry="18" className="card" />

        <g transform={`translate(${c.x + 18}, ${c.y + 16})`}>{headerIcon}</g>

        <text x={titleX + 26} y={titleY} className="cardTitle">
          {c.title}
        </text>
        <text x={titleX + 26} y={subY} className="cardSub">
          {c.sub}
        </text>

        <line x1={c.x + 18} y1={dividerY} x2={c.x + c.w - 18} y2={dividerY} className="divider" />

        {(layout.micro[k] || []).map((t) => (
          <MicroTile key={t.id} t={t} active={isMicroActive(t.id)} />
        ))}

        {/* Badges */}
        {activeStepId === "hub_balance_claimable" && k === "hub" ? (
          <g>
            <rect
              x={c.x + c.w - 126}
              y={c.y + 18}
              width="108"
              height="22"
              rx="11"
              ry="11"
              className="badge"
            />
            <text x={c.x + c.w - 72} y={c.y + 34} textAnchor="middle" className="badgeText">
              Claimable
            </text>
          </g>
        ) : null}

        {activeFlow === "sync" && activeStepId === "hub_breeding" && k === "hub" ? (
          <g>
            <rect
              x={c.x + c.w - 150}
              y={c.y + 18}
              width="132"
              height="22"
              rx="11"
              ry="11"
              className="badge"
            />
            <text x={c.x + c.w - 84} y={c.y + 34} textAnchor="middle" className="badgeText">
              NFT state updated
            </text>
          </g>
        ) : null}
      </g>
    );
  };

  const StagePaths = () => {
    const activeD = getActivePathD();
    const showDot = activeD && (activeEdgeKey !== null);

    return (
      <g>
        {/* Inactive global routes */}
        <path d={layout.edge.gc_to_hub} className={isEdgeBright("gc_to_hub") ? "route routeDim" : "route"} />
        <path d={layout.edge.hub_to_chain} className={isEdgeBright("hub_to_chain") ? "route routeDim" : "route"} />
        <path d={layout.edge.chain_to_hub} className={isEdgeBright("chain_to_hub") ? "route routeDim" : "route"} />
        <path d={layout.edge.hub_to_gc} className={isEdgeBright("hub_to_gc") ? "route routeDim" : "route"} />

        {/* Active route */}
        {activeD ? <path d={activeD} className="routeActive" markerEnd="url(#arrowHead)" /> : null}
        {showDot ? <TravelDot d={activeD} durationMs={1150} /> : null}
      </g>
    );
  };

  const onTabClick = (key) => {
    // Reclick same tab restarts from step 1 and plays once
    setActiveFlow(key);
    startFromBeginning();
  };

  const onPlayClick = () => {
    // Play runs the selected flow once from step 1
    startFromBeginning();
  };

  const onResetClick = () => {
    reset();
  };

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="titleBlock">
          <div className="h1">Ecosystem Architecture</div>
          <div className="h2">System flow, data flow, and state synchronization</div>

          <div className="chips">
            <span className="chip">Single source of truth</span>
            <span className="chip">Bidirectional sync</span>
            <span className="chip">No manual syncing</span>
            <span className="chip">On chain verification</span>
          </div>
        </div>

        <div className="rightControls">
          <div className="tabs" role="tablist" aria-label="Flow toggles">
            {Object.entries(flows).map(([k, v]) => (
              <button
                key={k}
                type="button"
                className={activeFlow === k ? "tab tabActive" : "tab"}
                onClick={() => onTabClick(k)}
                role="tab"
                aria-selected={activeFlow === k}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="actions">
            <button type="button" className="btnPlay" onClick={onPlayClick}>
              Play
            </button>
            <button type="button" className="btnReset" onClick={onResetClick}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="caption">
        <span className="captionLabel">Now highlighting</span>
        <span className="captionText">{caption || " "}</span>
        <span className="captionRight">
          Step {Math.min(step + 1, totalSteps)} of {totalSteps}
        </span>
      </div>

      <div className="stage">
        <svg viewBox={`0 0 ${layout.W} ${layout.H}`} width="100%" height="100%" className="svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="softShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodOpacity="0.22" />
            </filter>

            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" className="arrowHead" />
            </marker>

            <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(88, 28, 135, 0.38)" />
              <stop offset="0.55" stopColor="rgba(15, 23, 42, 0.32)" />
              <stop offset="1" stopColor="rgba(2, 6, 23, 0.28)" />
            </linearGradient>
          </defs>

          {/* Stage background */}
          <rect x="0" y="0" width={layout.W} height={layout.H} rx="20" ry="20" fill="url(#bgGrad)" className="stageBg" />

          {/* Column headers */}
          {mode === "desktop" ? (
            <g>
              <text x={layout.containers.game.x + layout.containers.game.w / 2} y="160" textAnchor="middle" className="colHeader">
                Gameplay layer
              </text>
              <text x={layout.containers.hub.x + layout.containers.hub.w / 2} y="160" textAnchor="middle" className="colHeader">
                Application layer
              </text>
              <text x={layout.containers.chain.x + layout.containers.chain.w / 2} y="160" textAnchor="middle" className="colHeader">
                On chain settlement
              </text>
            </g>
          ) : (
            <g>
              <text x={layout.W / 2} y="140" textAnchor="middle" className="colHeader">
                System map
              </text>
            </g>
          )}

          {/* Routes behind cards */}
          <StagePaths />

          {/* Cards */}
          <Container k="game" c={layout.containers.game} headerIcon={<IconGame active={isContainerActive("game")} />} />
          <Container k="hub" c={layout.containers.hub} headerIcon={<IconHub active={isContainerActive("hub")} />} />
          <Container k="chain" c={layout.containers.chain} headerIcon={<IconChain active={isContainerActive("chain")} />} />

          {/* Footer strip */}
          <g>
            <rect
              x={mode === "mobile" ? 50 : 40}
              y={mode === "mobile" ? layout.H - 120 : 600}
              width={mode === "mobile" ? layout.W - 100 : layout.W - 80}
              height={84}
              rx="16"
              ry="16"
              className="footer"
            />
            <text
              x={mode === "mobile" ? 70 : 62}
              y={mode === "mobile" ? layout.H - 92 : 630}
              className="footerTitle"
            >
              Key principles
            </text>
            <text
              x={mode === "mobile" ? 70 : 62}
              y={mode === "mobile" ? layout.H - 68 : 654}
              className="footerText"
            >
              Single source of truth • Bidirectional synchronization • No manual syncing • Clear separation of layers • Transparent verification
            </text>
          </g>
        </svg>
      </div>

      <style jsx>{`
        .wrap {
          width: 100%;
          border-radius: 18px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
        }

        .topbar {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .titleBlock {
          min-width: 260px;
          max-width: 560px;
        }

        .h1 {
          font-size: 18px;
          font-weight: 750;
          line-height: 1.2;
          color: rgba(255, 255, 255, 0.92);
        }

        .h2 {
          margin-top: 6px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.72);
        }

        .chips {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.74);
        }

        .rightControls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex: 1;
          min-width: 280px;
        }

        .tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
        }

        .tab {
          font-size: 12px;
          padding: 8px 10px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          color: rgba(255, 255, 255, 0.78);
        }

        .tab:hover {
          border-color: rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.88);
        }

        .tabActive {
          border-color: rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.92);
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .btnPlay,
        .btnReset {
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          cursor: pointer;
          color: rgba(255, 255, 255, 0.88);
          background: rgba(255, 255, 255, 0.03);
        }

        .btnPlay:hover,
        .btnReset:hover {
          border-color: rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.05);
        }

        .caption {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.12);
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .captionLabel {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.72);
          white-space: nowrap;
        }

        .captionText {
          font-size: 12px;
          font-weight: 650;
          color: rgba(255, 255, 255, 0.92);
        }

        .captionRight {
          margin-left: auto;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.62);
          white-space: nowrap;
        }

        .stage {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: radial-gradient(1200px 600px at 50% 20%, rgba(124, 58, 237, 0.14), rgba(2, 6, 23, 0.08));
        }

        .svg {
          width: 100%;
          height: auto;
          min-height: 640px;
          display: block;
        }

        .stageBg {
          opacity: 1;
        }

        .colHeader {
          font-size: 12px;
          fill: rgba(255, 255, 255, 0.70);
          letter-spacing: 0.2px;
        }

        .card {
          filter: url(#softShadow);
          stroke: rgba(255, 255, 255, 0.16);
          stroke-width: 1;
          fill: rgba(255, 255, 255, 0.045);
        }

        .halo {
          fill: rgba(124, 58, 237, 0.12);
          filter: url(#softGlow);
        }

        .cardTitle {
          font-size: 15px;
          font-weight: 720;
          fill: rgba(255, 255, 255, 0.92);
        }

        .cardSub {
          font-size: 11px;
          fill: rgba(255, 255, 255, 0.70);
        }

        .divider {
          stroke: rgba(255, 255, 255, 0.10);
          stroke-width: 1;
        }

        .tile {
          stroke: rgba(255, 255, 255, 0.16);
          stroke-width: 1;
          fill: rgba(255, 255, 255, 0.03);
        }

        .tileActive {
          stroke: rgba(255, 255, 255, 0.30);
          fill: rgba(124, 58, 237, 0.10);
          filter: url(#softGlow);
        }

        .tileDot {
          fill: rgba(255, 255, 255, 0.34);
        }

        .tileDotActive {
          fill: rgba(255, 255, 255, 0.92);
          filter: url(#softGlow);
        }

        .tileText {
          font-size: 11px;
          fill: rgba(255, 255, 255, 0.80);
        }

        .tileTextActive {
          fill: rgba(255, 255, 255, 0.94);
        }

        .badge {
          fill: rgba(255, 255, 255, 0.06);
          stroke: rgba(255, 255, 255, 0.18);
          stroke-width: 1;
        }

        .badgeText {
          font-size: 10px;
          font-weight: 650;
          fill: rgba(255, 255, 255, 0.86);
        }

        .route {
          fill: none;
          stroke: rgba(255, 255, 255, 0.10);
          stroke-width: 2;
          vector-effect: non-scaling-stroke;
        }

        .routeDim {
          stroke: rgba(255, 255, 255, 0.07);
        }

        .routeActive {
          fill: none;
          stroke: rgba(255, 255, 255, 0.88);
          stroke-width: 3.2;
          vector-effect: non-scaling-stroke;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.35));
          animation: routePulse 1.15s ease-in-out;
        }

        .arrowHead {
          fill: rgba(255, 255, 255, 0.88);
        }

        .travelDotOuter {
          fill: rgba(255, 255, 255, 0.18);
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.55));
        }

        .travelDotInner {
          fill: rgba(255, 255, 255, 0.95);
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.65));
        }

        .footer {
          fill: rgba(255, 255, 255, 0.035);
          stroke: rgba(255, 255, 255, 0.12);
          stroke-width: 1;
        }

        .footerTitle {
          font-size: 12px;
          font-weight: 720;
          fill: rgba(255, 255, 255, 0.86);
        }

        .footerText {
          font-size: 11px;
          fill: rgba(255, 255, 255, 0.72);
        }

        @keyframes routePulse {
          0% {
            opacity: 0.68;
            stroke-width: 3.2;
          }
          50% {
            opacity: 1;
            stroke-width: 4.3;
          }
          100% {
            opacity: 0.68;
            stroke-width: 3.2;
          }
        }

        @media (prefers-color-scheme: light) {
          .wrap {
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: rgba(0, 0, 0, 0.02);
          }
          .h1 {
            color: rgba(0, 0, 0, 0.85);
          }
          .h2 {
            color: rgba(0, 0, 0, 0.62);
          }
          .chip {
            border: 1px solid rgba(0, 0, 0, 0.10);
            background: rgba(0, 0, 0, 0.03);
            color: rgba(0, 0, 0, 0.65);
          }
          .tab,
          .btnPlay,
          .btnReset {
            border: 1px solid rgba(0, 0, 0, 0.12);
            background: rgba(0, 0, 0, 0.03);
            color: rgba(0, 0, 0, 0.75);
          }
          .caption {
            border: 1px solid rgba(0, 0, 0, 0.10);
            background: rgba(0, 0, 0, 0.03);
          }
          .captionLabel {
            color: rgba(0, 0, 0, 0.65);
          }
          .captionText {
            color: rgba(0, 0, 0, 0.82);
          }
          .captionRight {
            color: rgba(0, 0, 0, 0.55);
          }
        }
      `}</style>
    </div>
  );
};
