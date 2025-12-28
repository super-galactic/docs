"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  const W = 1100;
  const H = 650;

  const [activeFlow, setActiveFlow] = React.useState("reward");
  const [step, setStep] = React.useState(0);

  const flows = React.useMemo(
    () => ({
      reward: {
        label: "Reward flow",
        steps: [
          { id: "gc_to_hub_reward", caption: "Reward data sent to Hub" },
          { id: "hub_claimable", caption: "UAP appears as claimable balance" },
        ],
      },
      claim: {
        label: "Claim flow",
        steps: [
          { id: "hub_to_chain_claim", caption: "Claim triggers on-chain tx" },
          { id: "chain_confirm_claim", caption: "Chain confirms" },
          { id: "chain_to_hub_balance", caption: "Balance updates across systems" },
          { id: "hub_to_gc_balance", caption: "Game client reflects updated state" },
        ],
      },
      spend: {
        label: "Spending and burn flow",
        steps: [
          { id: "hub_to_chain_spend", caption: "Spend triggers on-chain settlement" },
          { id: "chain_burn", caption: "Automated burn executes" },
          { id: "chain_treasury", caption: "Treasury allocation recorded" },
          { id: "chain_to_hub_asset", caption: "Updated asset state syncs to Hub" },
          { id: "hub_to_gc_asset", caption: "Updated state syncs to Game client" },
        ],
      },
      sync: {
        label: "Asset synchronization",
        steps: [
          { id: "gc_to_hub_stats", caption: "Upgrades performed in game" },
          { id: "hub_nft_evolve", caption: "NFT stats and evolution update" },
          { id: "hub_breed", caption: "Breeding initiated in Hub" },
          { id: "hub_to_gc_newstate", caption: "Resulting NFT state reflects in game" },
        ],
      },
    }),
    []
  );

  React.useEffect(() => {
    const steps = flows[activeFlow]?.steps?.length || 1;
    setStep(0);
    const t = setInterval(() => {
      setStep((s) => (s + 1) % steps);
    }, 1600);
    return () => clearInterval(t);
  }, [activeFlow, flows]);

  const activeStepId = flows[activeFlow]?.steps?.[step]?.id;

  const isActive = (id) => id === activeStepId;

  // Layout (x, y, w, h)
  const node = {
    game: { x: 60, y: 155, w: 300, h: 300, title: "Game Client", subtitle: "Unity" },
    hub: { x: 405, y: 135, w: 320, h: 340, title: "Super Galactic Hub", subtitle: "Unified app layer" },
    chain: { x: 770, y: 155, w: 270, h: 300, title: "Blockchain Layer", subtitle: "Settlement + source of truth" },
  };

  const pill = (x, y, text, activeId) => (
    <g className={`pill ${isActive(activeId) ? "pillActive" : ""}`}>
      <rect x={x} y={y} rx="10" ry="10" width="260" height="34" className="pillRect" />
      <text x={x + 12} y={y + 22} className="pillText">
        {text}
      </text>
    </g>
  );

  const Card = ({ n, children }) => (
    <g>
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="18" ry="18" className="card" />
      <text x={n.x + 18} y={n.y + 34} className="cardTitle">
        {n.title}
      </text>
      <text x={n.x + 18} y={n.y + 58} className="cardSub">
        {n.subtitle}
      </text>
      <line x1={n.x + 18} y1={n.y + 78} x2={n.x + n.w - 18} y2={n.y + 78} className="divider" />
      {children}
    </g>
  );

  const Arrow = ({ id, d, label, yLabel }) => (
    <g className={`arrow ${isActive(id) ? "arrowActive" : ""}`}>
      <path d={d} className="arrowPath" markerEnd="url(#arrowHead)" />
      {label ? (
        <text x="0" y="0" className="arrowLabel">
          <textPath href={`#${id}_path`} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      ) : null}
      {/* Invisible path for label anchoring */}
      <path id={`${id}_path`} d={d} fill="none" stroke="transparent" strokeWidth="1" />
      {typeof yLabel === "number" ? null : null}
    </g>
  );

  const caption = flows[activeFlow]?.steps?.[step]?.caption || "";

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="title">
          <div className="h1">Super Galactic Ecosystem Architecture</div>
          <div className="h2">System flow, data flow, and state synchronization</div>
        </div>

        <div className="controls" role="tablist" aria-label="Flow toggles">
          {Object.entries(flows).map(([key, v]) => (
            <button
              key={key}
              type="button"
              className={`btn ${activeFlow === key ? "btnActive" : ""}`}
              onClick={() => setActiveFlow(key)}
              role="tab"
              aria-selected={activeFlow === key}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="caption">
        <span className="captionLabel">Now highlighting</span>
        <span className="captionText">{caption}</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className="svg">
        <defs>
          <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="arrowHead" />
          </marker>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Column headers */}
        <text x="210" y="120" className="colHeader" textAnchor="middle">
          Gameplay logic
        </text>
        <text x="565" y="120" className="colHeader" textAnchor="middle">
          Application layer
        </text>
        <text x="905" y="120" className="colHeader" textAnchor="middle">
          On-chain settlement
        </text>

        {/* Cards */}
        <Card n={node.game}>
          {pill(node.game.x + 20, node.game.y + 95, "Player gameplay", "gc_player")}
          {pill(node.game.x + 20, node.game.y + 140, "Missions and combat", "gc_missions")}
          {pill(node.game.x + 20, node.game.y + 185, "Progression and upgrades", "gc_prog")}
          {pill(node.game.x + 20, node.game.y + 230, "Reward generation (off-chain)", "gc_reward")}
          {pill(node.game.x + 20, node.game.y + 275, "UAP earned (unclaimed)", "gc_unclaimed")}
        </Card>

        <Card n={node.hub}>
          {pill(node.hub.x + 20, node.hub.y + 95, "Asset management", "hub_assets")}
          {pill(node.hub.x + 20, node.hub.y + 140, "UAP balance visibility", "hub_balance")}
          {pill(node.hub.x + 20, node.hub.y + 185, "Reward claiming", "hub_claim")}
          {pill(node.hub.x + 20, node.hub.y + 230, "Breeding and NFT actions", "hub_breed")}
          {pill(node.hub.x + 20, node.hub.y + 275, "Progression and stats", "hub_stats")}
        </Card>

        <Card n={node.chain}>
          {pill(node.chain.x + 20, node.chain.y + 95, "UAP token contracts", "chain_uap")}
          {pill(node.chain.x + 20, node.chain.y + 140, "NFT ownership contracts", "chain_nft")}
          {pill(node.chain.x + 20, node.chain.y + 185, "Burn execution", "chain_burn_pill")}
          {pill(node.chain.x + 20, node.chain.y + 230, "Treasury flows", "chain_treasury_pill")}
          {pill(node.chain.x + 20, node.chain.y + 275, "Tx verification", "chain_verify")}
        </Card>

        {/* Optional chain grouping labels */}
        <g className="chainGroup">
          <rect x={node.chain.x + 18} y={node.chain.y + 18} rx="12" ry="12" width={node.chain.w - 36} height="60" className="chainGroupRect" />
          <text x={node.chain.x + 34} y={node.chain.y + 43} className="chainGroupTitle">
            Chains
          </text>
          <text x={node.chain.x + 34} y={node.chain.y + 63} className="chainGroupSub">
            Ethereum (origin) plus BNB and Avalanche (gameplay)
          </text>
        </g>

        {/* Arrows (directional animated paths) */}
        {/* Reward: Game -> Hub */}
        <Arrow
          id="gc_to_hub_reward"
          d={`M ${node.game.x + node.game.w} ${node.game.y + 290} C ${node.game.x + node.game.w + 90} ${node.game.y + 290}, ${node.hub.x - 90} ${node.hub.y + 290}, ${node.hub.x} ${node.hub.y + 290}`}
        />
        {/* Hub claimable state highlight */}
        <g className={`stateDot ${isActive("hub_claimable") ? "stateDotActive" : ""}`}>
          <circle cx={node.hub.x + 290} cy={node.hub.y + 155} r="8" className="dot" />
          <text x={node.hub.x + 290} y={node.hub.y + 178} textAnchor="middle" className="dotLabel">
            claimable
          </text>
        </g>

        {/* Claim: Hub -> Chain -> Hub -> Game */}
        <Arrow
          id="hub_to_chain_claim"
          d={`M ${node.hub.x + node.hub.w} ${node.hub.y + 210} C ${node.hub.x + node.hub.w + 90} ${node.hub.y + 210}, ${node.chain.x - 90} ${node.chain.y + 210}, ${node.chain.x} ${node.chain.y + 210}`}
        />
        <Arrow
          id="chain_confirm_claim"
          d={`M ${node.chain.x + 40} ${node.chain.y + 210} C ${node.chain.x + 100} ${node.chain.y + 150}, ${node.chain.x + 160} ${node.chain.y + 150}, ${node.chain.x + 220} ${node.chain.y + 210}`}
        />
        <Arrow
          id="chain_to_hub_balance"
          d={`M ${node.chain.x} ${node.chain.y + 250} C ${node.chain.x - 90} ${node.chain.y + 250}, ${node.hub.x + node.hub.w + 90} ${node.hub.y + 250}, ${node.hub.x + node.hub.w} ${node.hub.y + 250}`}
        />
        <Arrow
          id="hub_to_gc_balance"
          d={`M ${node.hub.x} ${node.hub.y + 250} C ${node.hub.x - 90} ${node.hub.y + 250}, ${node.game.x + node.game.w + 90} ${node.game.y + 250}, ${node.game.x + node.game.w} ${node.game.y + 250}`}
        />

        {/* Spend: Hub -> Chain, burn, treasury, then sync back */}
        <Arrow
          id="hub_to_chain_spend"
          d={`M ${node.hub.x + node.hub.w} ${node.hub.y + 330} C ${node.hub.x + node.hub.w + 90} ${node.hub.y + 330}, ${node.chain.x - 90} ${node.chain.y + 330}, ${node.chain.x} ${node.chain.y + 330}`}
        />
        <Arrow
          id="chain_burn"
          d={`M ${node.chain.x + 60} ${node.chain.y + 330} C ${node.chain.x + 120} ${node.chain.y + 380}, ${node.chain.x + 150} ${node.chain.y + 380}, ${node.chain.x + 210} ${node.chain.y + 330}`}
        />
        <Arrow
          id="chain_treasury"
          d={`M ${node.chain.x + 60} ${node.chain.y + 330} C ${node.chain.x + 120} ${node.chain.y + 280}, ${node.chain.x + 150} ${node.chain.y + 280}, ${node.chain.x + 210} ${node.chain.y + 330}`}
        />
        <Arrow
          id="chain_to_hub_asset"
          d={`M ${node.chain.x} ${node.chain.y + 370} C ${node.chain.x - 90} ${node.chain.y + 370}, ${node.hub.x + node.hub.w + 90} ${node.hub.y + 370}, ${node.hub.x + node.hub.w} ${node.hub.y + 370}`}
        />
        <Arrow
          id="hub_to_gc_asset"
          d={`M ${node.hub.x} ${node.hub.y + 370} C ${node.hub.x - 90} ${node.hub.y + 370}, ${node.game.x + node.game.w + 90} ${node.game.y + 370}, ${node.game.x + node.game.w} ${node.game.y + 370}`}
        />

        {/* Sync: Game -> Hub, evolve, breed, Hub -> Game */}
        <Arrow
          id="gc_to_hub_stats"
          d={`M ${node.game.x + node.game.w} ${node.game.y + 190} C ${node.game.x + node.game.w + 90} ${node.game.y + 190}, ${node.hub.x - 90} ${node.hub.y + 190}, ${node.hub.x} ${node.hub.y + 190}`}
        />
        <g className={`stateDot ${isActive("hub_nft_evolve") ? "stateDotActive" : ""}`}>
          <circle cx={node.hub.x + 290} cy={node.hub.y + 300} r="8" className="dot" />
          <text x={node.hub.x + 290} y={node.hub.y + 323} textAnchor="middle" className="dotLabel">
            NFT state
          </text>
        </g>
        <Arrow
          id="hub_breed"
          d={`M ${node.hub.x + 160} ${node.hub.y + 320} C ${node.hub.x + 230} ${node.hub.y + 320}, ${node.hub.x + 230} ${node.hub.y + 355}, ${node.hub.x + 160} ${node.hub.y + 355}`}
        />
        <Arrow
          id="hub_to_gc_newstate"
          d={`M ${node.hub.x} ${node.hub.y + 170} C ${node.hub.x - 120} ${node.hub.y + 170}, ${node.game.x + node.game.w + 120} ${node.game.y + 170}, ${node.game.x + node.game.w} ${node.game.y + 170}`}
        />

        {/* Key principles footer */}
        <g className="footer">
          <rect x="60" y="510" width="980" height="110" rx="16" ry="16" className="footerCard" />
          <text x="85" y="545" className="footerTitle">
            Key principles
          </text>
          <text x="85" y="572" className="footerText">
            Single source of truth • Bidirectional synchronization • No manual syncing • Clear separation between gameplay, application, and on-chain settlement
          </text>
        </g>
      </svg>

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
          margin-bottom: 10px;
        }

        .title {
          min-width: 260px;
        }

        .h1 {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.2;
        }

        .h2 {
          margin-top: 6px;
          font-size: 13px;
          opacity: 0.8;
        }

        .controls {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
        }

        .btn {
          font-size: 12px;
          padding: 8px 10px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          opacity: 0.85;
        }

        .btn:hover {
          opacity: 1;
        }

        .btnActive {
          opacity: 1;
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.06);
        }

        .caption {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.12);
          margin-bottom: 12px;
        }

        .captionLabel {
          font-size: 12px;
          opacity: 0.75;
          white-space: nowrap;
        }

        .captionText {
          font-size: 12px;
          font-weight: 600;
        }

        .svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .colHeader {
          font-size: 12px;
          opacity: 0.75;
          letter-spacing: 0.2px;
        }

        .card {
          filter: url(#softShadow);
          stroke: rgba(255, 255, 255, 0.12);
          stroke-width: 1;
          fill: rgba(255, 255, 255, 0.03);
        }

        .cardTitle {
          font-size: 16px;
          font-weight: 700;
        }

        .cardSub {
          font-size: 12px;
          opacity: 0.8;
        }

        .divider {
          stroke: rgba(255, 255, 255, 0.12);
          stroke-width: 1;
        }

        .pillRect {
          stroke: rgba(255, 255, 255, 0.12);
          stroke-width: 1;
          fill: rgba(255, 255, 255, 0.02);
        }

        .pillText {
          font-size: 12px;
          opacity: 0.92;
        }

        .pillActive .pillRect {
          stroke: rgba(255, 255, 255, 0.35);
          fill: rgba(255, 255, 255, 0.06);
        }

        .arrowHead {
          fill: rgba(255, 255, 255, 0.7);
        }

        .arrowPath {
          fill: none;
          stroke: rgba(255, 255, 255, 0.22);
          stroke-width: 2;
          stroke-dasharray: 8 10;
          animation: dash 2.2s linear infinite;
        }

        .arrowActive .arrowPath {
          stroke: rgba(255, 255, 255, 0.85);
          stroke-width: 3.2;
          animation: dash 1.2s linear infinite, pulse 1.6s ease-in-out infinite;
        }

        @keyframes dash {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -180;
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.65;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.65;
          }
        }

        .stateDot .dot {
          fill: rgba(255, 255, 255, 0.22);
          stroke: rgba(255, 255, 255, 0.18);
          stroke-width: 1;
        }

        .stateDotActive .dot {
          fill: rgba(255, 255, 255, 0.9);
          stroke: rgba(255, 255, 255, 0.35);
          animation: dotPulse 1.2s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0% {
            transform: scale(1);
            transform-origin: center;
            opacity: 0.7;
          }
          50% {
            transform: scale(1.12);
            transform-origin: center;
            opacity: 1;
          }
          100% {
            transform: scale(1);
            transform-origin: center;
            opacity: 0.7;
          }
        }

        .dotLabel {
          font-size: 10px;
          opacity: 0.85;
        }

        .chainGroupRect {
          fill: rgba(255, 255, 255, 0.02);
          stroke: rgba(255, 255, 255, 0.10);
          stroke-width: 1;
        }

        .chainGroupTitle {
          font-size: 12px;
          font-weight: 700;
          opacity: 0.92;
        }

        .chainGroupSub {
          font-size: 11px;
          opacity: 0.78;
        }

        .footerCard {
          fill: rgba(255, 255, 255, 0.02);
          stroke: rgba(255, 255, 255, 0.10);
          stroke-width: 1;
        }

        .footerTitle {
          font-size: 13px;
          font-weight: 700;
          opacity: 0.95;
        }

        .footerText {
          font-size: 12px;
          opacity: 0.82;
        }
      `}</style>
    </div>
  );
};
