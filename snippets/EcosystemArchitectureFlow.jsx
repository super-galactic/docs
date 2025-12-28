"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  const [activeFlow, setActiveFlow] = React.useState("reward");
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const timerRef = React.useRef(null);
  const [mode, setMode] = React.useState("desktop"); // desktop | mobile
  const [edgePhase, setEdgePhase] = React.useState(0);

  React.useEffect(() => {
    const decide = () => {
      if (typeof window === "undefined") return;
      setMode(window.innerWidth < 860 ? "mobile" : "desktop");
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
  const activeStepId = flows[activeFlow].steps[step] ? flows[activeFlow].steps[step].id : null;
  const caption = flows[activeFlow].steps[step] ? flows[activeFlow].steps[step].caption : "";

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

  React.useEffect(() => {
    if (playing === false) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (step >= totalSteps - 1) {
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

  React.useEffect(() => {
    setEdgePhase(0);
    if (activeStepId === "edge_chain_to_hub_then_hub_to_gc") {
      const t = setTimeout(() => setEdgePhase(1), 850);
      return () => clearTimeout(t);
    }
    return;
  }, [activeStepId, step, activeFlow]);

  const layout = React.useMemo(() => {
    if (mode === "mobile") {
      const W = 760;
      const H = 1180;

      const x0 = 60;
      const w = 640;
      const h = 280;

      const yGame = 190;
      const yHub = 520;
      const yChain = 850;

      const containers = {
        game: { x: x0, y: yGame, w, h, title: "Game Client", sub: "Unity" },
        hub: { x: x0, y: yHub, w, h, title: "Super Galactic Hub", sub: "Unified app layer" },
        chain: { x: x0, y: yChain, w, h, title: "Blockchain Layer", sub: "Ethereum (origin), BNB and Avalanche (gameplay)" },
      };

      const tileW = w - 52;
      const row = (i) => 92 + i * 48;

      const micro = {
        game: [
          { id: "gc_missions", label: "Missions and combat", x: x0 + 26, y: yGame + row(0), w: tileW, h: 38, icon: "mission" },
          { id: "gc_progression", label: "Progression and upgrades", x: x0 + 26, y: yGame + row(1), w: tileW, h: 38, icon: "upgrade" },
          { id: "gc_rewards", label: "Rewards generated (off chain)", x: x0 + 26, y: yGame + row(2), w: tileW, h: 38, icon: "reward" },
          { id: "gc_cache", label: "Local state cache", x: x0 + 26, y: yGame + row(3), w: tileW, h: 38, icon: "cache" },
        ],
        hub: [
          { id: "hub_asset", label: "Asset manager", x: x0 + 26, y: yHub + row(0), w: tileW, h: 38, icon: "asset" },
          { id: "hub_balance", label: "UAP balance", x: x0 + 26, y: yHub + row(1), w: tileW, h: 38, icon: "balance" },
          { id: "hub_claim", label: "Claim service", x: x0 + 26, y: yHub + row(2), w: tileW, h: 38, icon: "claim" },
          { id: "hub_breeding", label: "Breeding and NFT actions", x: x0 + 26, y: yHub + row(3), w: tileW, h: 38, icon: "nft" },
          { id: "hub_sync", label: "Sync router", x: x0 + 26, y: yHub + row(4), w: tileW, h: 38, icon: "sync" },
        ],
        chain: [
          { id: "chain_uap", label: "UAP token contract", x: x0 + 26, y: yChain + row(0), w: tileW, h: 38, icon: "token" },
          { id: "chain_nft", label: "NFT ownership contract", x: x0 + 26, y: yChain + row(1), w: tileW, h: 38, icon: "nft" },
          { id: "chain_burn", label: "Burn execution", x: x0 + 26, y: yChain + row(2), w: tileW, h: 38, icon: "burn" },
          { id: "chain_treasury", label: "Treasury flows", x: x0 + 26, y: yChain + row(3), w: tileW, h: 38, icon: "treasury" },
          { id: "chain_tx_verify", label: "Tx verification", x: x0 + 26, y: yChain + row(4), w: tileW, h: 38, icon: "verify" },
        ],
      };

      const edge = {
        gc_to_hub: `M ${x0 + w / 2} ${yGame + h} C ${x0 + w / 2} ${yGame + h + 40}, ${x0 + w / 2} ${yHub - 40}, ${x0 + w / 2} ${yHub}`,
        hub_to_chain: `M ${x0 + w / 2} ${yHub + h} C ${x0 + w / 2} ${yHub + h + 40}, ${x0 + w / 2} ${yChain - 40}, ${x0 + w / 2} ${yChain}`,
        chain_to_hub: `M ${x0 + w / 2 + 78} ${yChain} C ${x0 + w / 2 + 78} ${yChain - 40}, ${x0 + w / 2 + 78} ${yHub + h + 40}, ${x0 + w / 2 + 78} ${yHub + h}`,
        hub_to_gc: `M ${x0 + w / 2 + 78} ${yHub} C ${x0 + w / 2 + 78} ${yHub - 40}, ${x0 + w / 2 + 78} ${yGame + h + 40}, ${x0 + w / 2 + 78} ${yGame + h}`,
      };

      return { W, H, containers, micro, edge };
    }

    // Desktop layout, equal widths, vertical lists for all cards
    const W = 1160;
    const H = 760;

    const margin = 46;
    const gap = 34;
    const cardW = (W - margin * 2 - gap * 2) / 3;
    const cardH = 400;
    const y = 220;

    const xGame = margin;
    const xHub = margin + cardW + gap;
    const xChain = margin + (cardW + gap) * 2;

    const containers = {
      game: { x: xGame, y, w: cardW, h: cardH, title: "Game Client", sub: "Unity" },
      hub: { x: xHub, y, w: cardW, h: cardH, title: "Super Galactic Hub", sub: "Unified app layer" },
      chain: { x: xChain, y, w: cardW, h: cardH, title: "Blockchain Layer", sub: "Ethereum (origin), BNB and Avalanche (gameplay)" },
    };

    const tileW = cardW - 52;
    const row = (i) => 98 + i * 50;

    const micro = {
      game: [
        { id: "gc_missions", label: "Missions and combat", x: xGame + 26, y: y + row(0), w: tileW, h: 38, icon: "mission" },
        { id: "gc_progression", label: "Progression and upgrades", x: xGame + 26, y: y + row(1), w: tileW, h: 38, icon: "upgrade" },
        { id: "gc_rewards", label: "Rewards generated (off chain)", x: xGame + 26, y: y + row(2), w: tileW, h: 38, icon: "reward" },
        { id: "gc_cache", label: "Local state cache", x: xGame + 26, y: y + row(3), w: tileW, h: 38, icon: "cache" },
      ],
      hub: [
        { id: "hub_asset", label: "Asset manager", x: xHub + 26, y: y + row(0), w: tileW, h: 38, icon: "asset" },
        { id: "hub_balance", label: "UAP balance", x: xHub + 26, y: y + row(1), w: tileW, h: 38, icon: "balance" },
        { id: "hub_claim", label: "Claim service", x: xHub + 26, y: y + row(2), w: tileW, h: 38, icon: "claim" },
        { id: "hub_breeding", label: "Breeding and NFT actions", x: xHub + 26, y: y + row(3), w: tileW, h: 38, icon: "nft" },
        { id: "hub_sync", label: "Sync router", x: xHub + 26, y: y + row(4), w: tileW, h: 38, icon: "sync" },
      ],
      chain: [
        { id: "chain_uap", label: "UAP token contract", x: xChain + 26, y: y + row(0), w: tileW, h: 38, icon: "token" },
        { id: "chain_nft", label: "NFT ownership contract", x: xChain + 26, y: y + row(1), w: tileW, h: 38, icon: "nft" },
        { id: "chain_burn", label: "Burn execution", x: xChain + 26, y: y + row(2), w: tileW, h: 38, icon: "burn" },
        { id: "chain_treasury", label: "Treasury flows", x: xChain + 26, y: y + row(3), w: tileW, h: 38, icon: "treasury" },
        { id: "chain_tx_verify", label: "Tx verification", x: xChain + 26, y: y + row(4), w: tileW, h: 38, icon: "verify" },
      ],
    };

    const midY = y + 300;
    const edge = {
      gc_to_hub: `M ${xGame + cardW} ${midY} C ${xGame + cardW + 62} ${midY - 44}, ${xHub - 62} ${midY - 44}, ${xHub} ${midY}`,
      hub_to_chain: `M ${xHub + cardW} ${midY} C ${xHub + cardW + 62} ${midY - 44}, ${xChain - 62} ${midY - 44}, ${xChain} ${midY}`,
      chain_to_hub: `M ${xChain} ${midY + 34} C ${xChain - 62} ${midY + 74}, ${xHub + cardW + 62} ${midY + 74}, ${xHub + cardW} ${midY + 34}`,
      hub_to_gc: `M ${xHub} ${midY + 34} C ${xHub - 62} ${midY + 74}, ${xGame + cardW + 62} ${midY + 74}, ${xGame + cardW} ${midY + 34}`,
    };

    return { W, H, containers, micro, edge };
  }, [mode]);

  const isMicroActive = (id) => {
    if (activeStepId === null) return false;
    if (activeStepId === id) return true;
    if (activeStepId === "chain_burn_treasury" && (id === "chain_burn" || id === "chain_treasury")) return true;
    if (activeStepId === "hub_balance_claimable" && id === "hub_balance") return true;
    return false;
  };

  const isContainerActive = (key) => {
    const group = layout.micro[key] || [];
    for (let i = 0; i < group.length; i++) {
      if (isMicroActive(group[i].id)) return true;
    }
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
    if (activeStepId === "edge_chain_to_hub_then_hub_to_gc") return "chain_to_hub_then_hub_to_gc";
    return null;
  }, [activeStepId]);

  const getActivePathD = () => {
    if (activeEdgeKey === null) return null;
    if (activeEdgeKey === "gc_to_hub") return layout.edge.gc_to_hub;
    if (activeEdgeKey === "hub_to_chain") return layout.edge.hub_to_chain;
    if (activeEdgeKey === "chain_to_hub") return layout.edge.chain_to_hub;
    if (activeEdgeKey === "hub_to_gc") return layout.edge.hub_to_gc;
    if (activeEdgeKey === "chain_to_hub_then_hub_to_gc") return edgePhase === 0 ? layout.edge.chain_to_hub : layout.edge.hub_to_gc;
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

      try {
        const startPt = pathEl.getInlineBox ? { x: 0, y: 0 } : pathEl.getPointAtLength(0);
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
        <path ref={pathRef} d={d} fill="none" stroke="transparent" strokeWidth="10" vectorEffect="non-scaling-stroke" />
        <circle ref={outerRef} cx="0" cy="0" r="7" className="travelDotOuter" />
        <circle ref={innerRef} cx="0" cy="0" r="3.2" className="travelDotInner" />
      </g>
    );
  };

  const iconSvg = (name, active) => {
    const stroke = active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)";
    const fill = "none";

    const common = {
      stroke,
      fill,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    };

    if (name === "mission") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" />
        </svg>
      );
    }
    if (name === "upgrade") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M12 19V5" />
          <path {...common} d="M6 11l6-6 6 6" />
          <path {...common} d="M5 21h14" />
        </svg>
      );
    }
    if (name === "reward") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M7 8h10v12H7z" />
          <path {...common} d="M9 8V6a3 3 0 0 1 6 0v2" />
          <path {...common} d="M12 12v4" />
        </svg>
      );
    }
    if (name === "cache") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M4 7h16" />
          <path {...common} d="M6 7v12" />
          <path {...common} d="M18 7v12" />
          <path {...common} d="M4 19h16" />
        </svg>
      );
    }
    if (name === "asset") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M7 7h10v10H7z" />
          <path {...common} d="M9 5h6" />
          <path {...common} d="M9 19h6" />
        </svg>
      );
    }
    if (name === "balance") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M4 7h16" />
          <path {...common} d="M6 7v12h12V7" />
          <path {...common} d="M8 11h8" />
          <path {...common} d="M8 15h6" />
        </svg>
      );
    }
    if (name === "claim") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M12 3v10" />
          <path {...common} d="M8 9l4 4 4-4" />
          <path {...common} d="M5 21h14" />
        </svg>
      );
    }
    if (name === "nft") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M7 7h10v10H7z" />
          <path {...common} d="M9 9h6v6H9z" />
        </svg>
      );
    }
    if (name === "sync") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M7 7h6" />
          <path {...common} d="M7 7l2-2" />
          <path {...common} d="M7 7l2 2" />
          <path {...common} d="M17 17h-6" />
          <path {...common} d="M17 17l-2-2" />
          <path {...common} d="M17 17l-2 2" />
        </svg>
      );
    }
    if (name === "token") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <circle {...common} cx="12" cy="12" r="7" />
          <path {...common} d="M9 12h6" />
        </svg>
      );
    }
    if (name === "burn") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M12 22c4 0 7-3 7-7 0-4-3-7-7-11C8 8 5 11 5 15c0 4 3 7 7 7z" />
        </svg>
      );
    }
    if (name === "treasury") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M6 9h12v12H6z" />
          <path {...common} d="M8 9V7a4 4 0 0 1 8 0v2" />
        </svg>
      );
    }
    if (name === "verify") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path {...common} d="M20 7l-9 10-4-4" />
          <path {...common} d="M12 2l8 4v6c0 5-3 9-8 10C7 21 4 17 4 12V6l8-4z" opacity="0.55" />
        </svg>
      );
    }

    return (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <circle {...common} cx="12" cy="12" r="6" />
      </svg>
    );
  };

  const headerIcon = (kind, active) => {
    const stroke = active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)";
    if (kind === "game") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M7.5 9.5h9A4.5 4.5 0 0 1 21 14v1.2A2.8 2.8 0 0 1 18.2 18H17l-1.2-1.2H8.2L7 18H5.8A2.8 2.8 0 0 1 3 15.2V14a4.5 4.5 0 0 1 4.5-4.5Z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <path d="M8.2 13.7h2.2M9.3 12.6v2.2" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M15.6 13.7h.01M17.5 12.8h.01" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    }
    if (kind === "hub") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth="2" />
          <path d="M4 12c2.3-3.7 13.7-3.7 16 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12c2.3 3.7 13.7 3.7 16 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        </svg>
      );
    }
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M10 13.5 8.4 15.1a3 3 0 0 1-4.2-4.2L5.8 9.3a3 3 0 0 1 4.2 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M14 10.5l1.6-1.6a3 3 0 0 1 4.2 4.2L18.2 14.7a3 3 0 0 1-4.2 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M9.5 14.5 14.5 9.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      </svg>
    );
  };

  const MicroTile = ({ t, active }) => {
    const w = t.w || 260;
    const h = t.h || 38;

    return (
      <g>
        <rect x={t.x} y={t.y} width={w} height={h} rx="11" ry="11" className={active ? "tile tileActive" : "tile"} />
        {active ? (
          <rect x={t.x + 1.5} y={t.y + 1.5} width={w - 3} height={h - 3} rx="10" ry="10" className="tileDash" />
        ) : null}
        <g transform={`translate(${t.x + 12}, ${t.y + 11})`} className={active ? "tileIcon tileIconActive" : "tileIcon"}>
          {iconSvg(t.icon, active)}
        </g>
        <text x={t.x + 36} y={t.y + h / 2 + 4} className={active ? "tileText tileTextActive" : "tileText"}>
          {t.label}
        </text>
      </g>
    );
  };

  const Container = ({ k, c }) => {
    const active = isContainerActive(k);

    return (
      <g>
        {active ? <rect x={c.x - 6} y={c.y - 6} width={c.w + 12} height={c.h + 12} rx="22" ry="22" className="halo" /> : null}

        <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="18" ry="18" className="card" />

        <g transform={`translate(${c.x + 18}, ${c.y + 16})`}>{headerIcon(k, active)}</g>

        <text x={c.x + 46} y={c.y + 32} className="cardTitle">
          {c.title}
        </text>
        <text x={c.x + 46} y={c.y + 54} className="cardSub">
          {c.sub}
        </text>

        <line x1={c.x + 18} y1={c.y + 72} x2={c.x + c.w - 18} y2={c.y + 72} className="divider" />

        {(layout.micro[k] || []).map((t) => (
          <MicroTile key={t.id} t={t} active={isMicroActive(t.id)} />
        ))}

        {activeStepId === "hub_balance_claimable" && k === "hub" ? (
          <g>
            <rect x={c.x + c.w - 126} y={c.y + 18} width="108" height="22" rx="11" ry="11" className="badge" />
            <text x={c.x + c.w - 72} y={c.y + 34} textAnchor="middle" className="badgeText">
              Claimable
            </text>
          </g>
        ) : null}
      </g>
    );
  };

  const StagePaths = () => {
    const activeD = getActivePathD();
    const showDot = Boolean(activeD && activeEdgeKey);

    return (
      <g>
        <path d={layout.edge.gc_to_hub} className={isEdgeBright("gc_to_hub") ? "route routeDim" : "route"} />
        <path d={layout.edge.hub_to_chain} className={isEdgeBright("hub_to_chain") ? "route routeDim" : "route"} />
        <path d={layout.edge.chain_to_hub} className={isEdgeBright("chain_to_hub") ? "route routeDim" : "route"} />
        <path d={layout.edge.hub_to_gc} className={isEdgeBright("hub_to_gc") ? "route routeDim" : "route"} />

        {activeD ? <path d={activeD} className="routeActive" markerEnd="url(#arrowHead)" /> : null}
        {showDot ? <TravelDot d={activeD} durationMs={1150} /> : null}
      </g>
    );
  };

  const onTabClick = (key) => {
    setActiveFlow(key);
    startFromBeginning();
  };

  const tabStyleBase = {
    fontSize: 12,
    padding: "9px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    opacity: 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const tabStyleActive = {
    ...tabStyleBase,
    border: "1px solid rgba(255,255,255,0.30)",
    background: "rgba(255,255,255,0.12)",
  };

  const actionBtn = {
    fontSize: 12,
    padding: "9px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    opacity: 1,
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
                style={activeFlow === k ? tabStyleActive : tabStyleBase}
                onClick={() => onTabClick(k)}
                role="tab"
                aria-selected={activeFlow === k}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="actions">
            <button type="button" style={actionBtn} onClick={startFromBeginning}>
              Play
            </button>
            <button type="button" style={actionBtn} onClick={reset}>
              Reset
            </button>
            <button
              type="button"
              style={actionBtn}
              onClick={() => {
                if (playing) stop();
                else startFromBeginning();
              }}
            >
              {playing ? "Pause" : "Auto"}
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

          <rect x="0" y="0" width={layout.W} height={layout.H} rx="20" ry="20" fill="url(#bgGrad)" className="stageBg" />

          {mode === "desktop" ? (
            <g>
              <text x={layout.containers.game.x + layout.containers.game.w / 2} y="170" textAnchor="middle" className="colHeader">
                Gameplay layer
              </text>
              <text x={layout.containers.hub.x + layout.containers.hub.w / 2} y="170" textAnchor="middle" className="colHeader">
                Application layer
              </text>
              <text x={layout.containers.chain.x + layout.containers.chain.w / 2} y="170" textAnchor="middle" className="colHeader">
                On chain settlement
              </text>
            </g>
          ) : (
            <g>
              <text x={layout.W / 2} y="155" textAnchor="middle" className="colHeader">
                System map
              </text>
            </g>
          )}

          <StagePaths />
          <Container k="game" c={layout.containers.game} />
          <Container k="hub" c={layout.containers.hub} />
          <Container k="chain" c={layout.containers.chain} />

          <g>
            <rect
              x={mode === "mobile" ? 60 : 46}
              y={mode === "mobile" ? layout.H - 128 : 644}
              width={mode === "mobile" ? layout.W - 120 : layout.W - 92}
              height={88}
              rx="16"
              ry="16"
              className="footer"
            />
            <text x={mode === "mobile" ? 84 : 68} y={mode === "mobile" ? layout.H - 98 : 676} className="footerTitle">
              Key principles
            </text>
            <text x={mode === "mobile" ? 84 : 68} y={mode === "mobile" ? layout.H - 74 : 700} className="footerText">
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
          color: rgba(255, 255, 255, 0.74);
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
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.80);
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
          gap: 10px;
          justify-content: flex-end;
        }

        .actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .caption {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.12);
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .captionLabel {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.78);
          white-space: nowrap;
        }

        .captionText {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.94);
        }

        .captionRight {
          margin-left: auto;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.70);
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

        .colHeader {
          font-size: 12px;
          fill: rgba(255, 255, 255, 0.74);
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
          font-weight: 740;
          fill: rgba(255, 255, 255, 0.94);
        }

        .cardSub {
          font-size: 11px;
          fill: rgba(255, 255, 255, 0.74);
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
          fill: rgba(124, 58, 237, 0.12);
          stroke: rgba(255, 255, 255, 0.28);
          filter: url(#softGlow);
        }

        .tileDash {
          fill: none;
          stroke: rgba(255, 255, 255, 0.50);
          stroke-width: 1.6;
          stroke-dasharray: 8 5;
          animation: dashMove 1.35s linear infinite;
          pointer-events: none;
        }

        .tileIcon {
          opacity: 0.85;
        }

        .tileIconActive {
          opacity: 1;
          filter: url(#softGlow);
        }

        .tileText {
          font-size: 11px;
          fill: rgba(255, 255, 255, 0.84);
        }

        .tileTextActive {
          fill: rgba(255, 255, 255, 0.96);
        }

        .badge {
          fill: rgba(255, 255, 255, 0.06);
          stroke: rgba(255, 255, 255, 0.18);
          stroke-width: 1;
        }

        .badgeText {
          font-size: 10px;
          font-weight: 700;
          fill: rgba(255, 255, 255, 0.88);
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
          font-weight: 740;
          fill: rgba(255, 255, 255, 0.88);
        }

        .footerText {
          font-size: 11px;
          fill: rgba(255, 255, 255, 0.74);
        }

        @keyframes routePulse {
          0% {
            opacity: 0.70;
            stroke-width: 3.2;
          }
          50% {
            opacity: 1;
            stroke-width: 4.2;
          }
          100% {
            opacity: 0.70;
            stroke-width: 3.2;
          }
        }

        @keyframes dashMove {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -26;
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
            border: 1px solid rgba(0, 0, 0, 0.12);
            background: rgba(0, 0, 0, 0.03);
            color: rgba(0, 0, 0, 0.70);
          }
          .caption {
            border: 1px solid rgba(0, 0, 0, 0.10);
            background: rgba(0, 0, 0, 0.03);
          }
          .captionLabel {
            color: rgba(0, 0, 0, 0.68);
          }
          .captionText {
            color: rgba(0, 0, 0, 0.84);
          }
          .captionRight {
            color: rgba(0, 0, 0, 0.58);
          }
        }
      `}</style>
    </div>
  );
};
