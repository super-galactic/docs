"use client";
import React from "react";

// Ecosystem Architecture Flowboard
// Premium micro node system map with a traveling glow dot on the active connector
// Implements equal width containers and animated highlight along each step.
// Each micro tile contains an icon and dashed border animation when active.

export const SuperGalacticArchitectureFlow = () => {
  // Flow state management
  const [activeFlow, setActiveFlow] = React.useState("reward");
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  // Responsive mode: switch to mobile layout when width < 820px
  const [mode, setMode] = React.useState("desktop");
  React.useEffect(() => {
    const updateMode = () => {
      if (typeof window === "undefined") return;
      setMode(window.innerWidth < 820 ? "mobile" : "desktop");
    };
    updateMode();
    window.addEventListener("resize", updateMode);
    return () => window.removeEventListener("resize", updateMode);
  }, []);

  // Define flows and steps. Each step has an id used to identify which micro tile or connector is active.
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
          { id: "hub_asset", caption: "Player spends via asset action" },
          { id: "edge_hub_to_chain", caption: "Spend triggers on chain settlement" },
          { id: "chain_burn_treasury", caption: "Burn executes and treasury records" },
          { id: "edge_chain_to_hub_then_hub_to_gc", caption: "State syncs back to Hub and Game Client" },
        ],
      },
      sync: {
        label: "Asset synchronization",
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

  // Auto advance through steps when playing
  const timerRef = React.useRef(null);
  React.useEffect(() => {
    if (!playing) return;
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const steps = flows[activeFlow].steps;
    // If last step reached, stop after a short delay
    if (step >= steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setPlaying(false);
        timerRef.current = null;
      }, 800);
    } else {
      timerRef.current = setTimeout(() => {
        setStep((s) => s + 1);
        timerRef.current = null;
      }, 1400);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, step, activeFlow, flows]);

  // Start playing from beginning of selected flow
  const startFlow = (key) => {
    setActiveFlow(key);
    setStep(0);
    setPlaying(true);
  };
  // Manual play button handler
  const onPlay = () => {
    setStep(0);
    setPlaying(true);
  };
  // Reset button handler
  const onReset = () => {
    setPlaying(false);
    setStep(0);
  };

  // Current step info
  const currentStep = flows[activeFlow].steps[step] || {};
  const currentId = currentStep.id;
  const caption = currentStep.caption || "";
  const totalSteps = flows[activeFlow].steps.length;

  /**
   * Compute layout for nodes, micro tiles, and connector paths based on mode.
   * Returns object with width (W), height (H), containers, micro tiles, and connector paths.
   */
  const layout = React.useMemo(() => {
    if (mode === "mobile") {
      const W = 720;
      const H = 1120;
      const x0 = 50;
      const yGame = 170;
      const yHub = 490;
      const yChain = 810;
      const cardW = 620;
      const cardH = 255;
      const containers = {
        game: { x: x0, y: yGame, w: cardW, h: cardH, title: "Game Client", sub: "Unity" },
        hub: { x: x0, y: yHub, w: cardW, h: cardH, title: "Super Galactic Hub", sub: "Unified app layer" },
        chain: {
          x: x0,
          y: yChain,
          w: cardW,
          h: cardH,
          title: "Blockchain Layer",
          sub: "Ethereum (origin), BNB and Avalanche (gameplay)",
        },
      };
      // Micro tiles positions; width and height always 300 by 34 on mobile
      const micro = {
        game: [
          { id: "gc_missions", label: "Missions and combat", x: x0 + 26, y: yGame + 82, w: 300, h: 38 },
          { id: "gc_progression", label: "Progression and upgrades", x: x0 + 26, y: yGame + 124, w: 300, h: 38 },
          { id: "gc_rewards", label: "Rewards generated (off chain)", x: x0 + 26, y: yGame + 166, w: 300, h: 38 },
          { id: "gc_cache", label: "Local state cache", x: x0 + 26, y: yGame + 208, w: 300, h: 38 },
        ],
        hub: [
          { id: "hub_asset", label: "Asset manager", x: x0 + 26, y: yHub + 82, w: 300, h: 38 },
          { id: "hub_balance", label: "UAP balance", x: x0 + 26, y: yHub + 124, w: 300, h: 38 },
          { id: "hub_claim", label: "Claim service", x: x0 + 26, y: yHub + 166, w: 300, h: 38 },
          { id: "hub_breeding", label: "Breeding and NFT actions", x: x0 + 26, y: yHub + 208, w: 300, h: 38 },
          { id: "hub_sync", label: "Sync router", x: x0 + 26, y: yHub + 250, w: 300, h: 38 },
        ],
        chain: [
          { id: "chain_uap", label: "UAP token contract", x: x0 + 26, y: yChain + 82, w: 300, h: 38 },
          { id: "chain_nft", label: "NFT ownership contract", x: x0 + 26, y: yChain + 124, w: 300, h: 38 },
          { id: "chain_burn", label: "Burn execution", x: x0 + 26, y: yChain + 166, w: 300, h: 38 },
          { id: "chain_treasury", label: "Treasury flows", x: x0 + 26, y: yChain + 208, w: 300, h: 38 },
          { id: "chain_tx_verify", label: "Tx verification", x: x0 + 26, y: yChain + 250, w: 300, h: 38 },
        ],
      };
      // Connector paths (vertical order on mobile)
      const edge = {
        gc_to_hub: `M ${x0 + containers.game.w / 2} ${yGame + cardH} C ${x0 + containers.game.w / 2} ${yGame + cardH + 40}, ${x0 + containers.hub.w / 2} ${yHub - 40}, ${x0 + containers.hub.w / 2} ${yHub}`,
        hub_to_chain: `M ${x0 + containers.hub.w / 2} ${yHub + cardH} C ${x0 + containers.hub.w / 2} ${yHub + cardH + 40}, ${x0 + containers.chain.w / 2} ${yChain - 40}, ${x0 + containers.chain.w / 2} ${yChain}`,
        chain_to_hub: `M ${x0 + containers.chain.w / 2 + 70} ${yChain} C ${x0 + containers.chain.w / 2 + 70} ${yChain - 40}, ${x0 + containers.hub.w / 2 + 70} ${yHub + cardH + 40}, ${x0 + containers.hub.w / 2 + 70} ${yHub + cardH}`,
        hub_to_gc: `M ${x0 + containers.hub.w / 2 + 70} ${yHub} C ${x0 + containers.hub.w / 2 + 70} ${yHub - 40}, ${x0 + containers.game.w / 2 + 70} ${yGame + cardH + 40}, ${x0 + containers.game.w / 2 + 70} ${yGame + cardH}`,
      };
      return { W, H, containers, micro, edge };
    }
    // Desktop layout
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
      chain: {
        x: xChain,
        y,
        w: cardW,
        h: cardH,
        title: "Blockchain Layer",
        sub: "Ethereum (origin), BNB and Avalanche (gameplay)",
      },
    };
    // micro tile widths: two columns inside hub and chain, one column in game
    const tileWGame = cardW - 52;
    const tileWHalf = Math.floor((tileWGame - 14) / 2);
    const micro = {
      game: [
        { id: "gc_missions", label: "Missions and combat", x: xGame + 26, y: y + 92, w: tileWGame, h: 38 },
        { id: "gc_progression", label: "Progression and upgrades", x: xGame + 26, y: y + 136, w: tileWGame, h: 38 },
        { id: "gc_rewards", label: "Rewards generated (off chain)", x: xGame + 26, y: y + 180, w: tileWGame, h: 38 },
        { id: "gc_cache", label: "Local state cache", x: xGame + 26, y: y + 224, w: tileWGame, h: 38 },
      ],
      hub: [
        { id: "hub_asset", label: "Asset manager", x: xHub + 26, y: y + 92, w: tileWHalf, h: 38 },
        { id: "hub_balance", label: "UAP balance", x: xHub + 26 + tileWHalf + 14, y: y + 92, w: tileWHalf, h: 38 },
        { id: "hub_claim", label: "Claim service", x: xHub + 26, y: y + 136, w: tileWHalf, h: 38 },
        { id: "hub_breeding", label: "Breeding and NFT actions", x: xHub + 26 + tileWHalf + 14, y: y + 136, w: tileWHalf, h: 38 },
        { id: "hub_sync", label: "Sync router", x: xHub + 26, y: y + 180, w: tileWGame, h: 38 },
      ],
      chain: [
        { id: "chain_uap", label: "UAP token contract", x: xChain + 26, y: y + 92, w: tileWHalf, h: 38 },
        { id: "chain_nft", label: "NFT ownership contract", x: xChain + 26 + tileWHalf + 14, y: y + 92, w: tileWHalf, h: 38 },
        { id: "chain_burn", label: "Burn execution", x: xChain + 26, y: y + 136, w: tileWHalf, h: 38 },
        { id: "chain_treasury", label: "Treasury flows", x: xChain + 26 + tileWHalf + 14, y: y + 136, w: tileWHalf, h: 38 },
        { id: "chain_tx_verify", label: "Tx verification", x: xChain + 26, y: y + 180, w: tileWGame, h: 38 },
      ],
    };
    // Global connectors (desktop): draw nice curves across columns
    const midY = y + 250;
    const edge = {
      gc_to_hub: `M ${xGame + cardW} ${midY} C ${xGame + cardW + 60} ${midY - 40}, ${xHub - 60} ${midY - 40}, ${xHub} ${midY}`,
      hub_to_chain: `M ${xHub + cardW} ${midY} C ${xHub + cardW + 60} ${midY - 40}, ${xChain - 60} ${midY - 40}, ${xChain} ${midY}`,
      chain_to_hub: `M ${xChain} ${midY + 34} C ${xChain - 60} ${midY + 70}, ${xHub + cardW + 60} ${midY + 70}, ${xHub + cardW} ${midY + 34}`,
      hub_to_gc: `M ${xHub} ${midY + 34} C ${xHub - 60} ${midY + 70}, ${xGame + cardW + 60} ${midY + 70}, ${xGame + cardW} ${midY + 34}`,
    };
    return { W, H, containers, micro, edge };
  }, [mode]);

  /**
   * Determine which micro tile is active for current step.
   * Combined conditions: claimable badge uses id "hub_balance_claimable"; burn & treasury step uses id "chain_burn_treasury".
   */
  const isMicroActive = (id) => {
    if (currentId === id) return true;
    // Combined step: treat burn and treasury both active
    if (currentId === "chain_burn_treasury" && (id === "chain_burn" || id === "chain_treasury")) return true;
    // Claimable: show highlight on hub_balance
    if (currentId === "hub_balance_claimable" && id === "hub_balance") return true;
    // Combined sync step: treat chain to hub and hub to gc as connectors, not micro
    return false;
  };

  // Determine container-level highlight (faint halo) based on active micro or connector step.
  const isContainerActive = (key) => {
    // If any micro tile inside is active, container is active
    for (const t of layout.micro[key] || []) {
      if (isMicroActive(t.id)) return true;
    }
    // Additional highlight rules for connector steps
    if (key === "hub" && (currentId === "edge_gc_to_hub" || currentId === "edge_chain_to_hub")) return true;
    if (key === "chain" && currentId === "edge_hub_to_chain") return true;
    if (key === "game" && currentId === "edge_hub_to_gc") return true;
    if (key === "hub" && currentId === "edge_chain_to_hub_then_hub_to_gc") return true;
    if (key === "game" && currentId === "edge_chain_to_hub_then_hub_to_gc") return true;
    return false;
  };

  // Compute which connector path is currently active and if it's multi-phase (two segments)
  const [edgePhase, setEdgePhase] = React.useState(0);
  React.useEffect(() => {
    setEdgePhase(0);
    if (currentId === "edge_chain_to_hub_then_hub_to_gc") {
      const timer = setTimeout(() => setEdgePhase(1), 800);
      return () => clearTimeout(timer);
    }
  }, [currentId]);
  const getActiveEdgeKey = () => {
    if (currentId === "edge_gc_to_hub") return "gc_to_hub";
    if (currentId === "edge_hub_to_chain") return "hub_to_chain";
    if (currentId === "edge_chain_to_hub") return "chain_to_hub";
    if (currentId === "edge_hub_to_gc") return "hub_to_gc";
    if (currentId === "edge_chain_to_hub_then_hub_to_gc") {
      return edgePhase === 0 ? "chain_to_hub" : "hub_to_gc";
    }
    return null;
  };
  const activeEdgeKey = getActiveEdgeKey();

  // Returns true if a connector path should be highlighted (brighter) at this step
  const isEdgeBright = (key) => {
    if (!activeEdgeKey) return false;
    if (currentId === "edge_chain_to_hub_then_hub_to_gc") {
      // Only highlight the segment currently active
      return (key === "chain_to_hub" && edgePhase === 0) || (key === "hub_to_gc" && edgePhase === 1);
    }
    return activeEdgeKey === key;
  };

  /**
   * Returns an SVG group representing an icon for a given micro tile ID.
   * Each icon uses stroke for outline; fill is controlled by CSS classes via currentColor.
   */
  const getTileIcon = (id) => {
    // Use stroke color via CSS (currentColor) for icons; sizes standardized to 14x14 viewBox
    const stroke = "currentColor";
    switch (id) {
      case "gc_missions":
        // Crosshair icon
        return (
          <g stroke={stroke} strokeWidth={1.6} strokeLinecap="round">
            <circle cx="7" cy="7" r="2" fill={stroke} />
            <line x1="7" y1="0" x2="7" y2="5" />
            <line x1="7" y1="9" x2="7" y2="14" />
            <line x1="0" y1="7" x2="5" y2="7" />
            <line x1="9" y1="7" x2="14" y2="7" />
          </g>
        );
      case "gc_progression":
        // Upwards arrow icon
        return (
          <g stroke={stroke} strokeWidth={1.6} strokeLinecap="round" fill="none">
            <path d="M2 10 L7 5 L12 10" />
            <line x1="7" y1="5" x2="7" y2="14" />
          </g>
        );
      case "gc_rewards":
        // Star icon
        return (
          <g stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="7,1 8.8,5.2 13,5.5 9.7,8.6 10.6,12.8 7,10.6 3.4,12.8 4.3,8.6 1,5.5 5.2,5.2" />
          </g>
        );
      case "gc_cache":
        // Database icon (cylinder)
        return (
          <g stroke={stroke} strokeWidth={1.4} fill="none">
            <ellipse cx="7" cy="3.5" rx="5" ry="2" />
            <rect x="2" y="3.5" width="10" height="7" />
            <ellipse cx="7" cy="10.5" rx="5" ry="2" />
          </g>
        );
      case "hub_asset":
        // Grid of squares icon
        return (
          <g stroke={stroke} strokeWidth={1.6} fill="none">
            <rect x="1" y="1" width="4" height="4" />
            <rect x="1" y="7" width="4" height="4" />
            <rect x="7" y="1" width="4" height="4" />
            <rect x="7" y="7" width="4" height="4" />
          </g>
        );
      case "hub_balance":
        // Coin stack icon
        return (
          <g stroke={stroke} strokeWidth={1.4} fill="none">
            <ellipse cx="7" cy="3" rx="5" ry="2" />
            <ellipse cx="7" cy="5" rx="5" ry="2" />
            <ellipse cx="7" cy="7" rx="5" ry="2" />
            <ellipse cx="7" cy="9" rx="5" ry="2" />
          </g>
        );
      case "hub_claim":
        // Downward arrow
        return (
          <g stroke={stroke} strokeWidth={1.6} strokeLinecap="round" fill="none">
            <line x1="7" y1="0" x2="7" y2="12" />
            <polyline points="3,8 7,12 11,8" />
          </g>
        );
      case "hub_breeding":
        // Heart icon
        return (
          <g stroke={stroke} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 12.5c4-2.4 6.5-4.8 6.5-7.5C13.5 2.5 11 1 8.5 3C7 1 4.5 2.5 4.5 5c0 2.7 2.5 5.1 6.5 7.5z" />
          </g>
        );
      case "hub_sync":
        // Network nodes connected
        return (
          <g stroke={stroke} strokeWidth={1.4} strokeLinecap="round" fill="none">
            <circle cx="2.5" cy="7" r="1.5" />
            <circle cx="11.5" cy="4" r="1.5" />
            <circle cx="11.5" cy="10" r="1.5" />
            <line x1="3.6" y1="6.4" x2="10.4" y2="4.4" />
            <line x1="3.6" y1="7.6" x2="10.4" y2="9.6" />
          </g>
        );
      case "chain_uap":
        // Coin icon (similar to balance but fewer)
        return (
          <g stroke={stroke} strokeWidth={1.4} fill="none">
            <ellipse cx="7" cy="4" rx="5" ry="2" />
            <ellipse cx="7" cy="7" rx="5" ry="2" />
            <ellipse cx="7" cy="10" rx="5" ry="2" />
          </g>
        );
      case "chain_nft":
        // NFT frame icon
        return (
          <g stroke={stroke} strokeWidth={1.6} fill="none">
            <rect x="1" y="1" width="12" height="12" />
            <rect x="3" y="3" width="8" height="8" />
          </g>
        );
      case "chain_burn":
        // Flame icon
        return (
          <g stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13c-3-2-5-4-5-7.5 0-3 2-5 5-5.5 3 .5 5 2.5 5 5.5 0 3.5-2 5.5-5 7.5z" />
          </g>
        );
      case "chain_treasury":
        // Treasury icon (building columns)
        return (
          <g stroke={stroke} strokeWidth={1.4} fill="none">
            <polygon points="7,1 1,4 13,4" />
            <line x1="3" y1="4" x2="3" y2="11" />
            <line x1="7" y1="4" x2="7" y2="11" />
            <line x1="11" y1="4" x2="11" y2="11" />
            <rect x="1" y="11" width="12" height="2" />
          </g>
        );
      case "chain_tx_verify":
        // Checkmark icon in circle
        return (
          <g stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round">
            <circle cx="7" cy="7" r="6" />
            <polyline points="4,7 6,9 10,5" />
          </g>
        );
      case "chain_burn_treasury":
        // Combined burn/treasury step: draw nothing (no tile, just highlight both)
        return null;
      default:
        // Default icon: small dot
        return <circle cx="7" cy="7" r="2" fill={stroke} />;
    }
  };

  // Micro tile component. Includes icon, label and dashed border when active.
  const MicroTile = ({ tile }) => {
    const { x, y, w, h, id, label } = tile;
    const active = isMicroActive(id);
    return (
      <g>
        {/* Base rectangle */}
        <rect x={x} y={y} width={w} height={h} rx="10" ry="10" className={active ? "tile tileActive" : "tile"} />
        {/* Dashed border overlay when active */}
        {active ? (
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx="10"
            ry="10"
            className="tileDash"
          />
        ) : null}
        {/* Icon at left */}
        <g transform={`translate(${x + 14}, ${y + h / 2 - 7}) scale(0.9)`} className="tileIcon">
          {getTileIcon(id)}
        </g>
        {/* Label text */}
        <text x={x + 36} y={y + h / 2 + 4} className={active ? "tileText tileTextActive" : "tileText"}>
          {label}
        </text>
      </g>
    );
  };

  // Container card with halo highlight and header icons
  const Container = ({ id, info, Icon }) => {
    const active = isContainerActive(id);
    return (
      <g>
        {active ? (
          <rect
            x={info.x - 6}
            y={info.y - 6}
            width={info.w + 12}
            height={info.h + 12}
            rx="22"
            ry="22"
            className="halo"
          />
        ) : null}
        <rect x={info.x} y={info.y} width={info.w} height={info.h} rx="18" ry="18" className="card" />
        {/* Header icon */}
        <g transform={`translate(${info.x + 18}, ${info.y + 16})`}>
          <Icon active={active} />
        </g>
        {/* Title */}
        <text x={info.x + 44} y={info.y + 32} className="cardTitle">
          {info.title}
        </text>
        {/* Subtitle */}
        <text x={info.x + 44} y={info.y + 52} className="cardSub">
          {info.sub}
        </text>
        <line x1={info.x + 18} y1={info.y + 70} x2={info.x + info.w - 18} y2={info.y + 70} className="divider" />
        {/* Micro tiles */}
        {(layout.micro[id] || []).map((tile) => (
          <MicroTile key={tile.id} tile={tile} />
        ))}
        {/* Special badges */}
        {currentId === "hub_balance_claimable" && id === "hub" ? (
          <g>
            <rect
              x={info.x + info.w - 126}
              y={info.y + 18}
              width={108}
              height={22}
              rx={11}
              ry={11}
              className="badge"
            />
            <text x={info.x + info.w - 72} y={info.y + 34} textAnchor="middle" className="badgeText">
              Claimable
            </text>
          </g>
        ) : null}
        {currentId === "hub_breeding" && activeFlow === "sync" && id === "hub" ? (
          <g>
            <rect
              x={info.x + info.w - 160}
              y={info.y + 18}
              width={140}
              height={22}
              rx={11}
              ry={11}
              className="badge"
            />
            <text x={info.x + info.w - 90} y={info.y + 34} textAnchor="middle" className="badgeText">
              NFT state updated
            </text>
          </g>
        ) : null}
      </g>
    );
  };

  // Icon for Game container header
  const HeaderGame = ({ active }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="9" width="14" height="8" rx="2" stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"} strokeWidth={2} />
      <circle cx="9" cy="13" r="1.5" fill={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"} />
      <circle cx="15" cy="13" r="1.5" fill={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"} />
    </svg>
  );
  // Icon for Hub container header
  const HeaderHub = ({ active }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"} strokeWidth={2} />
      <ellipse cx="12" cy="12" rx="8" ry="3" stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"} strokeWidth={2} />
    </svg>
  );
  // Icon for Chain container header
  const HeaderChain = ({ active }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="6" height="6" rx="1" stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"} strokeWidth={2} />
      <rect x="14" y="4" width="6" height="6" rx="1" stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"} strokeWidth={2} />
      <rect x="9" y="14" width="6" height="6" rx="1" stroke={active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)"} strokeWidth={2} />
    </svg>
  );

  // StagePaths component draws the connector curves behind the cards
  const StagePaths = () => {
    const dActive = activeEdgeKey ? layout.edge[activeEdgeKey] : null;
    return (
      <g>
        {/* Inactive connectors */}
        <path d={layout.edge.gc_to_hub} className={isEdgeBright("gc_to_hub") ? "route routeDim" : "route"} />
        <path d={layout.edge.hub_to_chain} className={isEdgeBright("hub_to_chain") ? "route routeDim" : "route"} />
        <path d={layout.edge.chain_to_hub} className={isEdgeBright("chain_to_hub") ? "route routeDim" : "route"} />
        <path d={layout.edge.hub_to_gc} className={isEdgeBright("hub_to_gc") ? "route routeDim" : "route"} />
        {/* Active connector */}
        {dActive ? (
          <path d={dActive} className="routeActive" markerEnd="url(#arrowHead)" />
        ) : null}
        {/* Traveling dot */}
        {dActive ? <TravelDot d={dActive} durationMs={1000} /> : null}
      </g>
    );
  };

  return (
    <div className="wrap">
      {/* Header section with title and flows */}
      <div className="header">
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
        <div className="controlsBlock">
          <div className="flowTabs" role="tablist" aria-label="Flow toggles">
            {Object.entries(flows).map(([key, f]) => (
              <button
                key={key}
                type="button"
                className={activeFlow === key ? "tab tabActive" : "tab"}
                onClick={() => startFlow(key)}
                role="tab"
                aria-selected={activeFlow === key}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="actionBtns">
            <button type="button" className="btnPlay" onClick={onPlay}>Play</button>
            <button type="button" className="btnReset" onClick={onReset}>Reset</button>
          </div>
        </div>
      </div>
      {/* Caption bar */}
      <div className="caption">
        <span className="captionLabel">Now highlighting</span>
        <span className="captionText">{caption || " "}</span>
        <span className="captionStep">Step {Math.min(step + 1, totalSteps)} of {totalSteps}</span>
      </div>
      {/* Stage area */}
      <div className="stage">
        <svg
          viewBox={`0 0 ${layout.W} ${layout.H}`}
          width="100%"
          height="100%"
          className="svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Soft shadow for cards */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="12" floodOpacity="0.18" />
            </filter>
            {/* Soft glow for halos */}
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Arrowhead marker */}
            <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" className="arrowHead" />
            </marker>
            {/* Background gradient */}
            <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(88, 28, 135, 0.38)" />
              <stop offset="0.55" stopColor="rgba(15, 23, 42, 0.32)" />
              <stop offset="1" stopColor="rgba(2, 6, 23, 0.28)" />
            </linearGradient>
          </defs>
          {/* Stage background */}
          <rect x="0" y="0" width={layout.W} height={layout.H} rx="20" ry="20" fill="url(#bgGrad)" />
          {/* Column headers (desktop only) */}
          {mode === "desktop" ? (
            <g>
              <text
                x={layout.containers.game.x + layout.containers.game.w / 2}
                y="160"
                textAnchor="middle"
                className="colHeader"
              >
                Gameplay layer
              </text>
              <text
                x={layout.containers.hub.x + layout.containers.hub.w / 2}
                y="160"
                textAnchor="middle"
                className="colHeader"
              >
                Application layer
              </text>
              <text
                x={layout.containers.chain.x + layout.containers.chain.w / 2}
                y="160"
                textAnchor="middle"
                className="colHeader"
              >
                On chain settlement
              </text>
            </g>
          ) : (
            <text x={layout.W / 2} y="140" textAnchor="middle" className="colHeader">
              System map
            </text>
          )}
          {/* Connector paths */}
          <StagePaths />
          {/* Containers */}
          <Container id="game" info={layout.containers.game} Icon={HeaderGame} />
          <Container id="hub" info={layout.containers.hub} Icon={HeaderHub} />
          <Container id="chain" info={layout.containers.chain} Icon={HeaderChain} />
          {/* Footer principle strip */}
          <g>
            <rect
              x={mode === "mobile" ? 50 : 40}
              y={mode === "mobile" ? layout.H - 120 : 600}
              width={mode === "mobile" ? layout.W - 100 : layout.W - 80}
              height={84}
              rx="16"
              ry="16"
              className="footerStrip"
            />
            <text
              x={mode === "mobile" ? 70 : 60 + 22}
              y={mode === "mobile" ? layout.H - 92 : 630}
              className="footerTitle"
            >
              Key principles
            </text>
          </g>
          <text
            x={mode === "mobile" ? 70 : 60 + 22}
            y={mode === "mobile" ? layout.H - 68 : 654}
            className="footerText"
          >
            Single source of truth • Bidirectional synchronization • No manual syncing • Clear separation of layers • Transparent verification
          </text>
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
        .header {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .titleBlock {
          min-width: 240px;
        }
        .h1 {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.2;
          color: rgba(255, 255, 255, 0.92);
        }
        .h2 {
          margin-top: 6px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
        }
        .chips {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .chip {
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.72);
        }
        .controlsBlock {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          min-width: 280px;
        }
        .flowTabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tab {
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 12px;
          /* Make un‑selected tabs visible on dark backgrounds */
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.88);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .tab:hover {
          border-color: rgba(255, 255, 255, 0.32);
          background: rgba(255, 255, 255, 0.10);
          color: rgba(255, 255, 255, 0.94);
        }
        .tabActive {
          /* Active tab stands out more */
          border-color: rgba(255, 255, 255, 0.36);
          background: rgba(255, 255, 255, 0.14);
          color: rgba(255, 255, 255, 0.98);
        }
        .actionBtns {
          display: flex;
          gap: 10px;
        }
        .btnPlay,
        .btnReset {
          font-size: 12px;
          padding: 8px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.92);
          cursor: pointer;
        }
        .btnPlay:hover,
        .btnReset:hover {
          border-color: rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.12);
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
        .captionStep {
          margin-left: auto;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.62);
          white-space: nowrap;
        }
        .stage {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: radial-gradient(1000px 600px at 50% 10%, rgba(88, 28, 135, 0.18), rgba(2, 6, 23, 0.08));
        }
        .svg {
          width: 100%;
          display: block;
          min-height: 600px;
        }
        .colHeader {
          font-size: 12px;
          fill: rgba(255, 255, 255, 0.72);
          letter-spacing: 0.2px;
        }
        .card {
          filter: url(#softShadow);
          stroke: rgba(255, 255, 255, 0.16);
          stroke-width: 1;
          fill: rgba(255, 255, 255, 0.05);
        }
        .halo {
          fill: rgba(124, 58, 237, 0.14);
          filter: url(#softGlow);
        }
        .cardTitle {
          font-size: 15px;
          font-weight: 700;
          fill: rgba(255, 255, 255, 0.92);
        }
        .cardSub {
          font-size: 11px;
          fill: rgba(255, 255, 255, 0.72);
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
          /* Increase contrast on active micro tiles */
          fill: rgba(124, 58, 237, 0.18);
          stroke: rgba(255, 255, 255, 0.40);
        }
        .tileDash {
          /* Animated dashed outline that wraps the tile */
          fill: none;
          stroke: rgba(255, 255, 255, 0.55);
          stroke-width: 1.8;
          stroke-dasharray: 6 3;
          animation: dashMove 2.8s linear infinite;
        }
        .tileIcon {
          color: rgba(255, 255, 255, 0.82);
        }
        .tileText {
          font-size: 11px;
          fill: rgba(255, 255, 255, 0.80);
        }
        .tileTextActive {
          fill: rgba(255, 255, 255, 0.95);
        }
        .badge {
          fill: rgba(124, 58, 237, 0.18);
          stroke: rgba(255, 255, 255, 0.26);
          stroke-width: 1;
        }
        .badgeText {
          font-size: 10px;
          font-weight: 650;
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
          stroke: rgba(255, 255, 255, 0.92);
          stroke-width: 3;
          vector-effect: non-scaling-stroke;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.35));
          animation: routeGlow 1.2s ease-in-out;
        }
        .arrowHead {
          fill: rgba(255, 255, 255, 0.92);
        }
        .travelDotOuter {
          fill: rgba(255, 255, 255, 0.22);
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.55));
        }
        .travelDotInner {
          fill: rgba(255, 255, 255, 0.95);
          filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.65));
        }
        .footerStrip {
          fill: rgba(255, 255, 255, 0.04);
          stroke: rgba(255, 255, 255, 0.14);
          stroke-width: 1;
        }
        .footerTitle {
          font-size: 11px;
          font-weight: 700;
          fill: rgba(255, 255, 255, 0.88);
        }
        .footerText {
          font-size: 10px;
          fill: rgba(255, 255, 255, 0.78);
        }
        @keyframes dashMove {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }
        @keyframes routeGlow {
          0% {
            opacity: 0.68;
            stroke-width: 3;
          }
          50% {
            opacity: 1;
            stroke-width: 4;
          }
          100% {
            opacity: 0.68;
            stroke-width: 3;
          }
        }
      `}</style>
    </div>
  );
};