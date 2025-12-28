"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  const W = 1100;
  const H = 680;

  const [activeFlow, setActiveFlow] = React.useState("sync"); // Start with sync to match screenshot
  const [step, setStep] = React.useState(0);

  const flows = React.useMemo(
    () => ({
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
          { id: "hub_to_chain_claim", caption: "Claim triggers on-chain tx" },
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
          { id: "hub_to_chain_spend", caption: "Spend triggers on-chain settlement" },
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
    }),
    []
  );

  React.useEffect(() => {
    const total = flows[activeFlow]?.steps?.length || 1;
    setStep(0);
    const interval = setInterval(() => setStep((s) => (s + 1) % total), 1800);
    return () => clearInterval(interval);
  }, [activeFlow, flows]);

  const activeStepId = flows[activeFlow]?.steps?.[step]?.id || "";
  const caption = flows[activeFlow]?.steps?.[step]?.caption || "";

  // Layout constants
  const cardWidth = 320;
  const cardHeight = 360;
  const cardY = 160;
  const nodes = {
    game: { x: 40, title: "Game Client", subtitle: "Unity" },
    hub: { x: 395, title: "Super Galactic Hub", subtitle: "Unified app layer" },
    chain: { x: 750, title: "Blockchain Layer", subtitle: "Chains: Ethereum (origin) plus BNB and Avalanche (gameplay)" },
  };

  const pillY = (offset: number) => cardY + 95 + offset * 45;

  const isEdgeVisible = (id: string) => flows[activeFlow]?.edges?.includes(id);
  const isStateVisible = (id: string) => flows[activeFlow]?.states?.includes(id);
  const isActive = (id: string) => id === activeStepId;

  const Pill = ({ x, y, text }: { x: number; y: number; text: string }) => (
    <g>
      <rect x={x} y={y} width="280" height="36" rx="12" className="pillRect" />
      <text x={x + 16} y={y + 23} className="pillText">{text}</text>
    </g>
  );

  const Card = ({ node, children }: { node: any; children: React.ReactNode }) => (
    <g>
      <rect x={node.x} y={cardY} width={cardWidth} height={cardHeight} rx="20" className="card" />
      <text x={node.x + 20} y={cardY + 36} className="cardTitle">{node.title}</text>
      <text x={node.x + 20} y={cardY + 58} className="cardSub">{node.subtitle}</text>
      <line x1={node.x + 20} y1={cardY + 78} x2={node.x + cardWidth - 20} y2={cardY + 78} className="divider" />
      {children}
    </g>
  );

  const Arrow = ({ id, d }: { id: string; d: string }) => {
    if (!isEdgeVisible(id)) return null;
    const active = isActive(id);
    return (
      <g className="arrowGroup">
        <path d={d} className="arrowBase" />
        {active && (
          <path d={d} className="arrowActive" markerEnd="url(#arrowHead)" />
        )}
      </g>
    );
  };

  const StateDot = ({ id, cx, cy, label }: { id: string; cx: number; cy: number; label: string }) => {
    if (!isStateVisible(id)) return null;
    const active = isActive(id);
    return (
      <g className={active ? "stateDotActive" : "stateDot"}>
        <circle cx={cx} cy={cy} r="10" className="dot" />
        <text x={cx} y={cy + 28} textAnchor="middle" className="dotLabel">{label}</text>
      </g>
    );
  };

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="title">
          <div className="h1">Super Galactic Ecosystem Architecture</div>
          <div className="h2">System flow, data flow, and state synchronization</div>
        </div>
        <div className="controls">
          {Object.entries(flows).map(([key, flow]) => (
            <button
              key={key}
              className={`btn ${activeFlow === key ? "btnActive" : ""}`}
              onClick={() => setActiveFlow(key)}
            >
              {flow.label}
            </button>
          ))}
        </div>
      </div>

      <div className="highlightBar">
        <span className="highlightLabel">Now highlighting</span>
        <span className="highlightText">Breeding initiated in Hub</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="svg">
        <defs>
          <marker id="arrowHead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="arrowHeadFill" />
          </marker>
          <filter id="shadow">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.2" />
          </filter>
        </defs>

        <text x="200" y="125" className="colHeader" textAnchor="middle">Gameplay logic</text>
        <text x="555" y="125" className="colHeader" textAnchor="middle">Application layer</text>
        <text x="910" y="125" className="colHeader" textAnchor="middle">On-chain settlement</text>

        {/* Cards */}
        <Card node={nodes.game}>
          <Pill x={nodes.game.x + 20} y={pillY(0)} text="Player gameplay" />
          <Pill x={nodes.game.x + 20} y={pillY(1)} text="Missions and combat" />
          <Pill x={nodes.game.x + 20} y={pillY(2)} text="Progression and upgrades" />
          <Pill x={nodes.game.x + 20} y={pillY(3)} text="Reward generation (off-chain)" />
          <Pill x={nodes.game.x + 20} y={pillY(4)} text="UAP earned (unclaimed)" />
        </Card>

        <Card node={nodes.hub}>
          <Pill x={nodes.hub.x + 20} y={pillY(0)} text="Asset management" />
          <Pill x={nodes.hub.x + 20} y={pillY(1)} text="UAP balance visibility" />
          <Pill x={nodes.hub.x + 20} y={pillY(2)} text="Reward claiming" />
          <Pill x={nodes.hub.x + 20} y={pillY(3)} text="Breeding and NFT actions" />
          <Pill x={nodes.hub.x + 20} y={pillY(4)} text="Progression and stats" />
        </Card>

        <Card node={nodes.chain}>
          <Pill x={nodes.chain.x + 20} y={pillY(0)} text="UAP token contracts" />
          <Pill x={nodes.chain.x + 20} y={pillY(1)} text="NFT ownership contracts" />
          <Pill x={nodes.chain.x + 20} y={pillY(2)} text="Burn execution" />
          <Pill x={nodes.chain.x + 20} y={pillY(3)} text="Treasury flows" />
          <Pill x={nodes.chain.x + 20} y={pillY(4)} text="Tx verification" />
        </Card>

        {/* Arrows */}
        {/* Reward */}
        <Arrow id="gc_to_hub_reward" d={`M ${nodes.game.x + cardWidth} ${pillY(3) + 18} C ${nodes.game.x + cardWidth + 80} ${pillY(3) + 18}, ${nodes.hub.x - 80} ${pillY(1) + 18}, ${nodes.hub.x} ${pillY(1) + 18}`} />
        <StateDot id="hub_claimable" cx={nodes.hub.x + 290} cy={pillY(1) + 18} label="claimable" />

        {/* Claim */}
        <Arrow id="hub_to_chain_claim" d={`M ${nodes.hub.x + cardWidth} ${pillY(2) + 18} C ${nodes.hub.x + cardWidth + 80} ${pillY(2) + 18}, ${nodes.chain.x - 80} ${pillY(0) + 18}, ${nodes.chain.x} ${pillY(0) + 18}`} />
        <Arrow id="chain_confirm_claim" d={`M ${nodes.chain.x + 60} ${pillY(0) + 18} C ${nodes.chain.x + 140} ${pillY(0) - 40}, ${nodes.chain.x + 200} ${pillY(0) - 40}, ${nodes.chain.x + 260} ${pillY(0) + 18}`} />
        <Arrow id="chain_to_hub_balance" d={`M ${nodes.chain.x} ${pillY(1) + 18} C ${nodes.chain.x - 80} ${pillY(1) + 18}, ${nodes.hub.x + cardWidth + 80} ${pillY(1) + 18}, ${nodes.hub.x + cardWidth} ${pillY(1) + 18}`} />
        <Arrow id="hub_to_gc_balance" d={`M ${nodes.hub.x} ${pillY(1) + 18} C ${nodes.hub.x - 80} ${pillY(1) + 18}, ${nodes.game.x + cardWidth + 80} ${pillY(4) + 18}, ${nodes.game.x + cardWidth} ${pillY(4) + 18}`} />

        {/* Spend/Burn */}
        <Arrow id="hub_to_chain_spend" d={`M ${nodes.hub.x + cardWidth} ${pillY(3) + 18} C ${nodes.hub.x + cardWidth + 80} ${pillY(3) + 18}, ${nodes.chain.x - 80} ${pillY(2) + 18}, ${nodes.chain.x} ${pillY(2) + 18}`} />
        <Arrow id="chain_burn" d={`M ${nodes.chain.x + 80} ${pillY(2) + 18} C ${nodes.chain.x + 140} ${pillY(2) + 60}, ${nodes.chain.x + 180} ${pillY(2) + 60}, ${nodes.chain.x + 240} ${pillY(2) + 18}`} />
        <Arrow id="chain_treasury" d={`M ${nodes.chain.x + 80} ${pillY(3) + 18} C ${nodes.chain.x + 140} ${pillY(3) - 40}, ${nodes.chain.x + 180} ${pillY(3) - 40}, ${nodes.chain.x + 240} ${pillY(3) + 18}`} />
        <Arrow id="chain_to_hub_asset" d={`M ${nodes.chain.x} ${pillY(4) + 18} C ${nodes.chain.x - 80} ${pillY(4) + 18}, ${nodes.hub.x + cardWidth + 80} ${pillY(4) + 18}, ${nodes.hub.x + cardWidth} ${pillY(4) + 18}`} />
        <Arrow id="hub_to_gc_asset" d={`M ${nodes.hub.x} ${pillY(4) + 18} C ${nodes.hub.x - 80} ${pillY(4) + 18}, ${nodes.game.x + cardWidth + 80} ${pillY(2) + 18}, ${nodes.game.x + cardWidth} ${pillY(2) + 18}`} />

        {/* Sync / Breeding */}
        <Arrow id="gc_to_hub_stats" d={`M ${nodes.game.x + cardWidth} ${pillY(2) + 18} C ${nodes.game.x + cardWidth + 80} ${pillY(2) + 18}, ${nodes.hub.x - 80} ${pillY(4) + 18}, ${nodes.hub.x} ${pillY(4) + 18}`} />
        <StateDot id="hub_nft_evolve" cx={nodes.hub.x + 290} cy={pillY(4) + 18} label="NFT state" />
        <Arrow id="hub_breed" d={`M ${nodes.hub.x + 160} ${pillY(3) + 18} Q ${nodes.hub.x + 290} ${pillY(3) + 18}, ${nodes.hub.x + 290} ${pillY(3) + 70} Q ${nodes.hub.x + 290} ${pillY(3) + 100}, ${nodes.hub.x + 160} ${pillY(3) + 100}`} />
        <Arrow id="hub_to_gc_newstate" d={`M ${nodes.hub.x} ${pillY(0) + 18} C ${nodes.hub.x - 100} ${pillY(0) + 18}, ${nodes.game.x + cardWidth + 100} ${pillY(0) + 18}, ${nodes.game.x + cardWidth} ${pillY(0) + 18}`} />

        {/* Footer */}
        <g className="footer">
          <rect x="60" y="540" width="980" height="100" rx="18" className="footerBg" />
          <text x="80" y="575" className="footerTitle">Key principles</text>
          <text x="80" y="605" className="footerText">
            Single source of truth • Bidirectional synchronization • No manual syncing • Clear separation between gameplay, application, and on‑chain settlement
          </text>
        </g>
      </svg>

      <style jsx>{`
        .wrap {
          width: 100%;
          padding: 20px;
          border-radius: 20px;
          background: rgba(20, 20, 30, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 12px;
        }
        .h1 { font-size: 20px; font-weight: 700; color: #fff; }
        .h2 { font-size: 14px; margin-top: 6px; opacity: 0.8; color: #ccc; }
        .controls { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn {
          padding: 8px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          color: #ddd;
          font-size: 13px;
          cursor: pointer;
        }
        .btn:hover { background: rgba(255,255,255,0.08); }
        .btnActive {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
          font-weight: 600;
        }
        .highlightBar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 20px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 16px;
        }
        .highlightLabel {
          font-size: 13px;
          color: #aaa;
          white-space: nowrap;
        }
        .highlightText {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }
        .svg text { fill: #e0e0e0; }
        .colHeader { font-size: 13px; opacity: 0.7; }
        .card {
          fill: rgba(255,255,255,0.06);
          stroke: rgba(255,255,255,0.18);
          stroke-width: 1;
          filter: url(#shadow);
        }
        .cardTitle { font-size: 17px; font-weight: 700; fill: #fff; }
        .cardSub { font-size: 13px; fill: #ccc; }
        .divider { stroke: rgba(255,255,255,0.12); }
        .pillRect {
          fill: rgba(255,255,255,0.04);
          stroke: rgba(255,255,255,0.15);
          rx: 12;
        }
        .pillText { font-size: 13px; fill: #ddd; }
        .arrowBase {
          fill: none;
          stroke: rgba(255,255,255,0.18);
          stroke-width: 2;
        }
        .arrowActive {
          fill: none;
          stroke: #fff;
          stroke-width: 3.5;
          stroke-dasharray: 12 14;
          animation: flow 2s linear infinite;
        }
        @keyframes flow {
          to { stroke-dashoffset: -26; }
        }
        .arrowHeadFill { fill: #fff; }
        .dot { fill: rgba(255,255,255,0.2); stroke: rgba(255,255,255,0.3); }
        .stateDotActive .dot {
          fill: #fff;
          animation: pulseDot 1.8s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%, 100% { r: 10; opacity: 0.8; }
          50% { r: 13; opacity: 1; }
        }
        .dotLabel { font-size: 11px; fill: #ccc; }
        .footerBg {
          fill: rgba(255,255,255,0.04);
          stroke: rgba(255,255,255,0.15);
        }
        .footerTitle { font-size: 14px; font-weight: 700; fill: #eee; }
        .footerText { font-size: 13px; fill: #ccc; }
      `}</style>
    </div>
  );
};