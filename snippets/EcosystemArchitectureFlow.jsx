"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  const [activeFlow, setActiveFlow] = React.useState("sync"); // Matches screenshot
  const [step, setStep] = React.useState(2); // 2 = "Breeding initiated in Hub"

  const flows = {
    reward: {
      label: "Reward flow",
      steps: [
        { id: "gc_to_hub_reward", caption: "Reward data sent to Hub" },
        { id: "hub_claimable", caption: "UAP appears as claimable balance" },
      ],
      edges: ["gc_to_hub_reward"],
      states: ["hub_claimable"],
    },
    claim: {
      label: "Claim flow",
      steps: [
        { id: "hub_to_chain_claim", caption: "Claim triggers on‑chain tx" },
        { id: "chain_confirm_claim", caption: "Chain confirms transaction" },
        { id: "chain_to_hub_balance", caption: "Balance updates across systems" },
        { id: "hub_to_gc_balance", caption: "Game client reflects updated state" },
      ],
      edges: ["hub_to_chain_claim", "chain_confirm_claim", "chain_to_hub_balance", "hub_to_gc_balance"],
      states: [],
    },
    spend: {
      label: "Spending and burn flow",
      steps: [
        { id: "hub_to_chain_spend", caption: "Spend triggers on‑chain settlement" },
        { id: "chain_burn", caption: "Automated burn executes" },
        { id: "chain_treasury", caption: "Treasury allocation recorded" },
        { id: "chain_to_hub_asset", caption: "Updated asset state syncs to Hub" },
        { id: "hub_to_gc_asset", caption: "Updated state syncs to game client" },
      ],
      edges: ["hub_to_chain_spend", "chain_burn", "chain_treasury", "chain_to_hub_asset", "hub_to_gc_asset"],
      states: [],
    },
    sync: {
      label: "Asset synchronization",
      steps: [
        { id: "gc_to_hub_stats", caption: "Upgrades performed in game" },
        { id: "hub_nft_evolve", caption: "NFT stats and evolution update in Hub" },
        { id: "hub_breed", caption: "Breeding initiated in Hub" },
        { id: "hub_to_gc_newstate", caption: "Resulting NFT state reflects in game" },
      ],
      edges: ["gc_to_hub_stats", "hub_breed", "hub_to_gc_newstate"],
      states: ["hub_nft_evolve"],
    },
  };

  React.useEffect(() => {
    const total = flows[activeFlow].steps.length;
    setStep(0);
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % total);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeFlow]);

  const currentFlow = flows[activeFlow];
  const caption = currentFlow.steps[step]?.caption || "";

  // Layout
  const card = { w: 320, h: 360, y: 160 };
  const nodes = {
    game: { x: 40 },
    hub: { x: 395 },
    chain: { x: 750 },
  };

  const pillY = (index) => card.y + 95 + index * 45;

  const isVisible = (type, id) => currentFlow[type].includes(id);
  const isActive = (id) => currentFlow.steps[step]?.id === id;

  const Pill = ({ x, y, text }) => (
    <g>
      <rect x={x} y={y} width="280" height="36" rx="12" className="pill-bg" />
      <text x={x + 16} y={y + 23} className="pill-text">{text}</text>
    </g>
  );

  const Card = ({ x, title, subtitle, children }) => (
    <g>
      <rect x={x} y={card.y} width={card.w} height={card.h} rx="20" className="card-bg" />
      <text x={x + 20} y={card.y + 36} className="card-title">{title}</text>
      <text x={x + 20} y={card.y + 58} className="card-subtitle">{subtitle}</text>
      <line x1={x + 20} y1={card.y + 78} x2={x + card.w - 20} y2={card.y + 78} className="divider" />
      {children}
    </g>
  );

  const AnimatedArrow = ({ id, d }) => {
    if (!isVisible("edges", id)) return null;
    const active = isActive(id);
    return (
      <g>
        <path d={d} className="arrow-static" />
        {active && <path d={d} className="arrow-animated" markerEnd="url(#arrowhead)" />}
      </g>
    );
  };

  const StateDot = ({ id, cx, cy, label }) => {
    if (!isVisible("states", id)) return null;
    const active = isActive(id);
    return (
      <g className={active ? "state-active" : "state-inactive"}>
        <circle cx={cx} cy={cy} r="10" />
        <text x={cx} y={cy + 28} textAnchor="middle" className="state-label">{label}</text>
      </g>
    );
  };

  return (
    <div className="architecture-wrapper">
      <div className="header">
        <div className="title">
          <h1>Super Galactic Ecosystem Architecture</h1>
          <p>System flow, data flow, and state synchronization</p>
        </div>
        <div className="tabs">
          {Object.entries(flows).map(([key, f]) => (
            <button
              key={key}
              className={activeFlow === key ? "tab active" : "tab"}
              onClick={() => setActiveFlow(key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="highlight-bar">
        <span className="label">Now highlighting</span>
        <span className="text">{caption}</span>
      </div>

      <svg viewBox="0 0 1100 680" className="diagram">
        <defs>
          <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="#fff" />
          </marker>
          <filter id="shadow">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Column headers */}
        <text x="200" y="125" className="col-header">Gameplay logic</text>
        <text x="555" y="125" className="col-header">Application layer</text>
        <text x="910" y="125" className="col-header">On‑chain settlement</text>

        {/* Cards */}
        <Card x={nodes.game.x} title="Game Client" subtitle="Unity">
          <Pill x={nodes.game.x + 20} y={pillY(0)} text="Player gameplay" />
          <Pill x={nodes.game.x + 20} y={pillY(1)} text="Missions and combat" />
          <Pill x={nodes.game.x + 20} y={pillY(2)} text="Progression and upgrades" />
          <Pill x={nodes.game.x + 20} y={pillY(3)} text="Reward generation (off‑chain)" />
          <Pill x={nodes.game.x + 20} y={pillY(4)} text="UAP earned (unclaimed)" />
        </Card>

        <Card x={nodes.hub.x} title="Super Galactic Hub" subtitle="Unified app layer">
          <Pill x={nodes.hub.x + 20} y={pillY(0)} text="Asset management" />
          <Pill x={nodes.hub.x + 20} y={pillY(1)} text="UAP balance visibility" />
          <Pill x={nodes.hub.x + 20} y={pillY(2)} text="Reward claiming" />
          <Pill x={nodes.hub.x + 20} y={pillY(3)} text="Breeding and NFT actions" />
          <Pill x={nodes.hub.x + 20} y={pillY(4)} text="Progression and stats" />
        </Card>

        <Card x={nodes.chain.x} title="Blockchain Layer" subtitle="On-chain settlement and verification">
          <Pill x={nodes.chain.x + 20} y={pillY(0)} text="UAP token contracts" />
          <Pill x={nodes.chain.x + 20} y={pillY(1)} text="NFT ownership contracts" />
          <Pill x={nodes.chain.x + 20} y={pillY(2)} text="Burn execution" />
          <Pill x={nodes.chain.x + 20} y={pillY(3)} text="Treasury flows" />
          <Pill x={nodes.chain.x + 20} y={pillY(4)} text="Tx verification" />
        </Card>

        {/* Arrows - Reward */}
        <AnimatedArrow
          id="gc_to_hub_reward"
          d={`M ${nodes.game.x + card.w} ${pillY(3) + 18} C ${nodes.game.x + card.w + 80} ${pillY(3) + 18}, ${nodes.hub.x - 80} ${pillY(1) + 18}, ${nodes.hub.x} ${pillY(1) + 18}`}
        />
        <StateDot id="hub_claimable" cx={nodes.hub.x + 290} cy={pillY(1) + 18} label="claimable" />

        {/* Arrows - Sync flow */}
        <AnimatedArrow
          id="gc_to_hub_stats"
          d={`M ${nodes.game.x + card.w} ${pillY(2) + 18} C ${nodes.game.x + card.w + 80} ${pillY(2) + 18}, ${nodes.hub.x - 80} ${pillY(4) + 18}, ${nodes.hub.x} ${pillY(4) + 18}`}
        />
        <StateDot id="hub_nft_evolve" cx={nodes.hub.x + 290} cy={pillY(4) + 18} label="NFT state" />

        {/* Curved breeding arrow - matches screenshot exactly */}
        <AnimatedArrow
          id="hub_breed"
          d={`M ${nodes.hub.x + 160} ${pillY(3) + 18}
              Q ${nodes.hub.x + 290} ${pillY(3) + 60}, ${nodes.hub.x + 290} ${pillY(3) + 100}
              Q ${nodes.hub.x + 290} ${pillY(3) + 140}, ${nodes.hub.x + 160} ${pillY(3) + 140}`}
        />

        <AnimatedArrow
          id="hub_to_gc_newstate"
          d={`M ${nodes.hub.x} ${pillY(0) + 18} C ${nodes.hub.x - 100} ${pillY(0) + 18}, ${nodes.game.x + card.w + 100} ${pillY(0) + 18}, ${nodes.game.x + card.w} ${pillY(0) + 18}`}
        />

        {/* Footer */}
        <g className="footer">
          <rect x="60" y="540" width="980" height="100" rx="18" className="footer-bg" />
          <text x="80" y="575" className="footer-title">Key principles</text>
          <text x="80" y="605" className="footer-text">
            Single source of truth • Bidirectional synchronization • No manual syncing • Clear separation between gameplay, application, and on‑chain settlement
          </text>
        </g>
      </svg>

      <style jsx>{`
        .architecture-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 24px;
          background: #0f0f1a;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 16px;
        }
        .title h1 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }
        .title p {
          font-size: 14px;
          color: #aaa;
          margin: 6px 0 0;
        }
        .tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .tab {
          padding: 8px 16px;
          border-radius: 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          color: #ddd;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab:hover { background: rgba(255,255,255,0.1); }
        .tab.active {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.3);
          font-weight: 600;
        }
        .highlight-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          margin-bottom: 20px;
        }
        .label {
          font-size: 13px;
          color: #aaa;
        }
        .text {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }
        .col-header {
          fill: #888;
          font-size: 13px;
          text-anchor: middle;
        }
        .card-bg {
          fill: rgba(255,255,255,0.06);
          stroke: rgba(255,255,255,0.18);
          filter: url(#shadow);
        }
        .card-title { fill: #fff; font-size: 17px; font-weight: 700; }
        .card-subtitle { fill: #ccc; font-size: 13px; }
        .divider { stroke: rgba(255,255,255,0.12); }
        .pill-bg {
          fill: rgba(255,255,255,0.04);
          stroke: rgba(255,255,255,0.15);
          rx: 12;
        }
        .pill-text { fill: #ddd; font-size: 13px; }
        .arrow-static {
          fill: none;
          stroke: rgba(255,255,255,0.18);
          stroke-width: 2;
        }
        .arrow-animated {
          fill: none;
          stroke: #fff;
          stroke-width: 3.5;
          stroke-dasharray: 14 16;
          animation: flow 1.8s linear infinite;
        }
        @keyframes flow {
          to { stroke-dashoffset: -30; }
        }
        .state-inactive circle { fill: rgba(255,255,255,0.2); stroke: rgba(255,255,255,0.3); }
        .state-active circle {
          fill: #fff;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { r: 10; opacity: 0.8; }
          50% { r: 14; opacity: 1; }
        }
        .state-label { fill: #bbb; font-size: 11px; }
        .footer-bg { fill: rgba(255,255,255,0.04); stroke: rgba(255,255,255,0.15); }
        .footer-title { fill: #eee; font-size: 14px; font-weight: 700; }
        .footer-text { fill: #ccc; font-size: 13px; }
      `}</style>
    </div>
  );
};