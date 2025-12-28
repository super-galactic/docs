"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  const [activeFlow, setActiveFlow] = React.useState<"reward" | "spend" | "sync">("sync");
  const [currentStep, setCurrentStep] = React.useState(0);

  // Define flows with precise step sequence and what to highlight
  const flows = {
    reward: {
      label: "Reward flow",
      steps: [
        { source: "game", row: 1, label: "Missions and combat completed" },
        { source: "game", row: 3, label: "Reward generated off-chain (unclaimed)" },
        { dest: "hub", row: 1, connector: "game_to_hub_reward", label: "Claimable balance visible in Hub" },
        { source: "hub", row: 2, label: "Player claims reward" },
        { dest: "chain", row: 4, connector: "hub_to_chain_claim", label: "Transaction verified on-chain" },
        { source: "chain", dest: "hub", connector: "chain_to_hub_balance", label: "Balance updated in Hub" },
        { dest: "game", row: 4, connector: "hub_to_game_balance", label: "Balance synced back to game client" },
      ],
    },
    spend: {
      label: "Spending and burn flow",
      steps: [
        { source: "game", row: 2, label: "Player initiates upgrade or breeding" },
        { dest: "hub", row: 3, connector: "game_to_hub_action", label: "Action prepared in Hub" },
        { source: "hub", dest: "chain", connector: "hub_to_chain_spend", label: "Settlement triggered on-chain" },
        { source: "chain", row: 2, state: "burn", label: "Burn execution (50%)" },
        { source: "chain", row: 3, state: "treasury", label: "Treasury allocation (50%)" },
        { source: "chain", dest: "hub", connector: "chain_to_hub_asset", label: "Updated state synced to Hub" },
        { dest: "game", row: 2, connector: "hub_to_game_asset", label: "Updated state reflected in game" },
      ],
    },
    sync: {
      label: "Asset synchronization",
      steps: [
        { source: "game", row: 2, label: "Gameplay progression or upgrades" },
        { dest: "hub", row: 4, connector: "game_to_hub_stats", label: "Asset state updated in Hub" },
        { source: "hub", row: 3, state: "nft_evolve", label: "NFT evolution or breeding result processed" },
        { source: "hub", dest: "game", connector: "hub_to_game_newstate", label: "Updated NFT & stats synced back" },
      ],
    },
  };

  const flow = flows[activeFlow];

  // Auto-advance steps
  React.useEffect(() => {
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= flow.steps.length - 1) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 2800); // Calm pacing: 2.8s per step

    return () => clearInterval(interval);
  }, [activeFlow, flow.steps.length]);

  const step = flow.steps[currentStep] || {};

  // Layout
  const card = { w: 320, h: 380, y: 170 };
  const nodes = { game: 40, hub: 400, chain: 760 };
  const pillY = (i: number) => card.y + 100 + i * 48;

  const isHighlighted = (type: "card" | "row" | "connector" | "state", id: string) => {
    if (!step) return false;
    if (type === "card") return step.source === id || step.dest === id;
    if (type === "row") return (step.source === "game" && step.row === id && id < 5) || 
                              (step.source === "hub" && step.row === id && id < 5) ||
                              (step.dest === "game" && step.row === id && id < 5) ||
                              (step.dest === "hub" && step.row === id && id < 5) ||
                              (step.source === "chain" && step.row === id && id < 5) ||
                              (step.dest === "chain" && step.row === id && id < 5);
    if (type === "connector") return step.connector === id;
    if (type === "state") return step.state === id;
    return false;
  };

  const Pill = ({ x, y, text, index, card }) => (
    <g className={isHighlighted("row", index + "_" + card) ? "pill highlighted" : "pill"}>
      <rect x={x} y={y} width="280" height="38" rx="12" className="pill-bg" />
      <text x={x + 16} y={y + 24} className="pill-text">{text}</text>
    </g>
  );

  const Card = ({ x, title, subtitle, type, children }) => (
    <g className={isHighlighted("card", type) ? "card highlighted" : "card"}>
      <rect x={x} y={card.y} width={card.w} height={card.h} rx="20" className="card-bg" />
      <text x={x + 20} y={card.y + 38} className="card-title">{title}</text>
      <text x={x + 20} y={card.y + 60} className="card-subtitle">{subtitle}</text>
      <line x1={x + 20} y1={card.y + 82} x2={x + card.w - 20} y2={card.y + 82} className="divider" />
      {children}
    </g>
  );

  const Connector = ({ id, d }) => (
    <path
      d={d}
      className={isHighlighted("connector", id) ? "connector active" : "connector"}
    />
  );

  const StateDot = ({ id, cx, cy, label }) => (
    <g className={isHighlighted("state", id) ? "state-dot pulse" : "state-dot"}>
      <circle cx={cx} cy={cy} r="10" />
      <text x={cx} y={cy + 28} textAnchor="middle" className="state-label">{label}</text>
    </g>
  );

  return (
    <div className="wrapper">
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
              onClick={() => setActiveFlow(key as any)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="caption">
        <span className="label">Now highlighting:</span>
        <span className="text">{step.label || "Select a flow to begin"}</span>
      </div>

      <svg viewBox="0 0 1120 720" className="diagram">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feFlood floodColor="#ffffff" floodOpacity="0.4"/>
            <feComposite in="blur" in2="SourceGraphic" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <text x="200" y="130" className="col-header">Gameplay logic</text>
        <text x="560" y="130" className="col-header">Application layer</text>
        <text x="920" y="130" className="col-header">On‑chain settlement</text>

        {/* Cards */}
        <Card x={nodes.game} title="Game Client" subtitle="Unity" type="game">
          <Pill x={nodes.game + 20} y={pillY(0)} text="Player gameplay" index={0} card="game" />
          <Pill x={nodes.game + 20} y={pillY(1)} text="Missions and combat" index={1} card="game" />
          <Pill x={nodes.game + 20} y={pillY(2)} text="Progression and upgrades" index={2} card="game" />
          <Pill x={nodes.game + 20} y={pillY(3)} text="Reward generation (off‑chain)" index={3} card="game" />
          <Pill x={nodes.game + 20} y={pillY(4)} text="UAP earned (unclaimed)" index={4} card="game" />
        </Card>

        <Card x={nodes.hub} title="Super Galactic Hub" subtitle="Unified app layer" type="hub">
          <Pill x={nodes.hub + 20} y={pillY(0)} text="Asset management" index={0} card="hub" />
          <Pill x={nodes.hub + 20} y={pillY(1)} text="UAP balance visibility" index={1} card="hub" />
          <Pill x={nodes.hub + 20} y={pillY(2)} text="Reward claiming" index={2} card="hub" />
          <Pill x={nodes.hub + 20} y={pillY(3)} text="Breeding and NFT actions" index={3} card="hub" />
          <Pill x={nodes.hub + 20} y={pillY(4)} text="Progression and stats" index={4} card="hub" />
        </Card>

        <Card x={nodes.chain} title="Blockchain Layer" subtitle="Ethereum (origin) + BNB & Avalanche (gameplay)" type="chain">
          <Pill x={nodes.chain + 20} y={pillY(0)} text="UAP token contracts" index={0} card="chain" />
          <Pill x={nodes.chain + 20} y={pillY(1)} text="NFT ownership contracts" index={1} card="chain" />
          <Pill x={nodes.chain + 20} y={pillY(2)} text="Burn execution" index={2} card="chain" />
          <Pill x={nodes.chain + 20} y={pillY(3)} text="Treasury flows" index={3} card="chain" />
          <Pill x={nodes.chain + 20} y={pillY(4)} text="Tx verification" index={4} card="chain" />
        </Card>

        {/* Static Connectors */}
        <Connector id="game_to_hub_reward" d={`M ${nodes.game + card.w} ${pillY(3)+19} C ${nodes.game + card.w + 80} ${pillY(3)+19}, ${nodes.hub - 80} ${pillY(1)+19}, ${nodes.hub} ${pillY(1)+19}`} />
        <Connector id="game_to_hub_stats" d={`M ${nodes.game + card.w} ${pillY(2)+19} C ${nodes.game + card.w + 80} ${pillY(2)+19}, ${nodes.hub - 80} ${pillY(4)+19}, ${nodes.hub} ${pillY(4)+19}`} />
        <Connector id="game_to_hub_action" d={`M ${nodes.game + card.w} ${pillY(2)+19} C ${nodes.game + card.w + 80} ${pillY(2)+19}, ${nodes.hub - 80} ${pillY(3)+19}, ${nodes.hub} ${pillY(3)+19}`} />

        <Connector id="hub_to_chain_claim" d={`M ${nodes.hub + card.w} ${pillY(2)+19} C ${nodes.hub + card.w + 80} ${pillY(2)+19}, ${nodes.chain - 80} ${pillY(4)+19}, ${nodes.chain} ${pillY(4)+19}`} />
        <Connector id="hub_to_chain_spend" d={`M ${nodes.hub + card.w} ${pillY(3)+19} C ${nodes.hub + card.w + 80} ${pillY(3)+19}, ${nodes.chain - 80} ${pillY(2)+19}, ${nodes.chain} ${pillY(2)+19}`} />

        <Connector id="chain_to_hub_balance" d={`M ${nodes.chain} ${pillY(1)+19} C ${nodes.chain - 80} ${pillY(1)+19}, ${nodes.hub + card.w + 80} ${pillY(1)+19}, ${nodes.hub + card.w} ${pillY(1)+19}`} />
        <Connector id="chain_to_hub_asset" d={`M ${nodes.chain} ${pillY(4)+19} C ${nodes.chain - 80} ${pillY(4)+19}, ${nodes.hub + card.w + 80} ${pillY(4)+19}, ${nodes.hub + card.w} ${pillY(4)+19}`} />

        <Connector id="hub_to_game_balance" d={`M ${nodes.hub} ${pillY(1)+19} C ${nodes.hub - 80} ${pillY(1)+19}, ${nodes.game + card.w + 80} ${pillY(4)+19}, ${nodes.game + card.w} ${pillY(4)+19}`} />
        <Connector id="hub_to_game_asset" d={`M ${nodes.hub} ${pillY(4)+19} C ${nodes.hub - 80} ${pillY(4)+19}, ${nodes.game + card.w + 80} ${pillY(2)+19}, ${nodes.game + card.w} ${pillY(2)+19}`} />
        <Connector id="hub_to_game_newstate" d={`M ${nodes.hub} ${pillY(0)+19} C ${nodes.hub - 100} ${pillY(0)+19}, ${nodes.game + card.w + 100} ${pillY(0)+19}, ${nodes.game + card.w} ${pillY(0)+19}`} />

        {/* Breeding loop in Hub */}
        <path
          d={`M ${nodes.hub + 160} ${pillY(3)+19} Q ${nodes.hub + 290} ${pillY(3)+80}, ${nodes.hub + 290} ${pillY(3)+130} Q ${nodes.hub + 290} ${pillY(3)+170}, ${nodes.hub + 160} ${pillY(3)+170}`}
          className={isHighlighted("connector", "hub_breed_loop") || (activeFlow === "sync" && currentStep === 2) ? "connector active" : "connector"}
        />

        {/* State Dots */}
        <StateDot id="nft_evolve" cx={nodes.hub + 290} cy={pillY(4) + 19} label="NFT state" />
        <StateDot id="burn" cx={nodes.chain + 290} cy={pillY(2) + 19} label="burn" />
        <StateDot id="treasury" cx={nodes.chain + 290} cy={pillY(3) + 19} label="treasury" />

        {/* Footer */}
        <g className="footer">
          <rect x="60" y="570" width="1000" height="100" rx="18" className="footer-bg" />
          <text x="80" y="605" className="footer-title">Key principles</text>
          <text x="80" y="635" className="footer-text">
            Single source of truth • Bidirectional synchronization • No manual syncing • Clear separation between gameplay, application, and on‑chain settlement
          </text>
        </g>
      </svg>

      <style jsx>{`
        .wrapper {
          padding: 28px;
          background: #0a0a12;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          font-family: system-ui, -apple-system, sans-serif;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }
        h1 { font-size: 21px; font-weight: 700; color: #fff; margin: 0; }
        p { font-size: 14px; color: #aaa; margin: 8px 0 0; }
        .tabs { display: flex; gap: 12px; flex-wrap: wrap; }
        .tab {
          padding: 10px 18px;
          border-radius: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          color: #ccc;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .tab:hover { background: rgba(255,255,255,0.08); }
        .tab.active {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
          font-weight: 600;
        }
        .caption {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          margin-bottom: 24px;
        }
        .label { font-size: 13px; color: #999; }
        .text { font-size: 15px; font-weight: 600; color: #fff; }

        .col-header { fill: #777; font-size: 13px; text-anchor: middle; }

        .card-bg { fill: rgba(255,255,255,0.05); stroke: rgba(255,255,255,0.15); }
        .card.highlighted .card-bg { fill: rgba(255,255,255,0.12); stroke: #fff; filter: url(#glow); }
        .card-title { fill: #fff; font-size: 17px; font-weight: 700; }
        .card-subtitle { fill: #bbb; font-size: 13px; }
        .divider { stroke: rgba(255,255,255,0.12); }

        .pill-bg { fill: rgba(255,255,255,0.04); stroke: rgba(255,255,255,0.12); }
        .pill.highlighted .pill-bg { fill: rgba(255,255,255,0.18); stroke: #fff; filter: url(#glow); }
        .pill-text { fill: #ddd; font-size: 13px; }

        .connector { fill: none; stroke: rgba(255,255,255,0.18); stroke-width: 2; }
        .connector.active { stroke: #fff; stroke-width: 3.5; filter: url(#glow); }

        .state-dot circle { fill: rgba(255,255,255,0.18); stroke: rgba(255,255,255,0.3); }
        .state-dot.pulse circle {
          animation: pulse 1.2s ease-out;
          fill: #fff;
        }
        @keyframes pulse {
          0% { r: 10; opacity: 0.6; }
          50% { r: 16; opacity: 1; }
          100% { r: 10; opacity: 0.6; }
        }
        .state-label { fill: #aaa; font-size: 11px; }

        .footer-bg { fill: rgba(255,255,255,0.04); stroke: rgba(255,255,255,0.12); }
        .footer-title { fill: #eee; font-size: 14px; font-weight: 700; }
        .footer-text { fill: #bbb; font-size: 13px; }
      `}</style>
    </div>
  );
};