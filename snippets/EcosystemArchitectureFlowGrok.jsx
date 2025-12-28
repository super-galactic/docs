"use client";
import React from "react";

// This component renders a high level animated architecture diagram for the
// Super Galactic ecosystem. It is designed for Mintlify MDX pages and
// follows the same export pattern as other snippet components. The diagram
// conveys the flow of data and actions between the Game Client, the
// Super Galactic Hub, and the Blockchain Layer. Only the currently
// selected flow is visible at any given time to keep the visualization
// focused and easy to understand. Non selected flows are hidden
// entirely rather than dimmed. Within the selected flow, only the
// currently active step gets an animated overlay and arrowhead. All
// underlying static lines are rendered without arrowheads to avoid visual
// clutter. See the CSS at the bottom of this file for details on how
// the arrow animations are implemented.

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
        edges: ["gc_to_hub_reward"],
        states: ["hub_claimable"],
      },
      claim: {
        label: "Claim flow",
        steps: [
          { id: "hub_to_chain_claim", caption: "Claim triggers on chain tx" },
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
          { id: "hub_to_chain_spend", caption: "Spend triggers on chain settlement" },
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

  // Step progression logic
  // When the active flow changes, reset step to zero.
  // Then automatically advance to the next step once after a short delay.
  // The animation plays through all steps exactly once and stops.
  // Clicking the same flow tab again restarts the sequence from the beginning.
  const timerRef = React.useRef();
  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const total = flows[activeFlow]?.steps?.length || 0;
    if (step < total - 1) {
      timerRef.current = setTimeout(() => setStep((s) => s + 1), 1600);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, activeFlow, flows]);

  const activeStepId = flows[activeFlow]?.steps?.[step]?.id;
  const caption = flows[activeFlow]?.steps?.[step]?.caption || "";

  const nodeWidth = 320;
  const nodeHeight = 340;
  const node = {
    game: { x: 35, y: 155, w: nodeWidth, h: nodeHeight, title: "Game Client", subtitle: "Unity" },
    hub: { x: 390, y: 155, w: nodeWidth, h: nodeHeight, title: "Super Galactic Hub", subtitle: "Unified app layer" },
    chain: {
      x: 745,
      y: 155,
      w: nodeWidth,
      h: nodeHeight,
      title: "Blockchain Layer",
      subtitle: "Chains: Ethereum (origin) plus BNB and Avalanche (gameplay)",
    },
  };

  const isEdgeVisible = (id) => (flows[activeFlow]?.edges || []).includes(id);
  const isStateVisible = (id) => (flows[activeFlow]?.states || []).includes(id);
  const isActive = (id) => id === activeStepId;

  const pill = (x, y, text) => (
    <g>
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

  // Arrow renders a base line, and when active overlays glow + arrowhead + traveling dot
  // The traveling dot uses SVG animateMotion which is reliable in Mintlify environments
  const Arrow = ({ id, d }) => {
    if (!isEdgeVisible(id)) return null;
    const active = isActive(id);

    return (
      <g className="arrow">
        <path d={d} className={`arrowBase${active ? " arrowBaseDim" : ""}`} />

        {active ? (
          <g key={activeStepId}>
            <path d={d} className="arrowActive" markerStart="none" markerEnd="url(#arrowHead)" />

            <circle r="6" className="travelDotOuter">
              <animateMotion dur="1.2s" repeatCount="1" path={d} />
            </circle>

            <circle r="2.8" className="travelDotInner">
              <animateMotion dur="1.2s" repeatCount="1" path={d} />
            </circle>
          </g>
        ) : null}
      </g>
    );
  };

  const StateDot = ({ id, cx, cy, label }) => {
    if (!isStateVisible(id)) return null;
    const active = isActive(id);

    return (
      <g className={`stateDot${active ? " stateDotActive" : ""}`}>
        <circle cx={cx} cy={cy} r="8" className="dot" />
        <text x={cx} y={cy + 23} textAnchor="middle" className="dotLabel">
          {label}
        </text>
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

        <div className="controls" role="tablist" aria-label="Flow toggles">
          {Object.entries(flows).map(([key, v]) => (
            <button
              key={key}
              type="button"
              className={`btn${activeFlow === key ? " btnActive" : ""}`}
              onClick={() => {
                setActiveFlow(key);
                setStep(0);
              }}
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

        <text x="210" y="120" className="colHeader" textAnchor="middle">
          Gameplay logic
        </text>
        <text x="565" y="120" className="colHeader" textAnchor="middle">
          Application layer
        </text>
        <text x="905" y="120" className="colHeader" textAnchor="middle">
          On chain settlement
        </text>

        <Card n={node.game}>
          {pill(node.game.x + 20, node.game.y + 95, "Player gameplay")}
          {pill(node.game.x + 20, node.game.y + 140, "Missions and combat")}
          {pill(node.game.x + 20, node.game.y + 185, "Progression and upgrades")}
          {pill(node.game.x + 20, node.game.y + 230, "Reward generation (off chain)")}
          {pill(node.game.x + 20, node.game.y + 275, "UAP earned (unclaimed)")}
        </Card>

        <Card n={node.hub}>
          {pill(node.hub.x + 20, node.hub.y + 95, "Asset management")}
          {pill(node.hub.x + 20, node.hub.y + 140, "UAP balance visibility")}
          {pill(node.hub.x + 20, node.hub.y + 185, "Reward claiming")}
          {pill(node.hub.x + 20, node.hub.y + 230, "Breeding and NFT actions")}
          {pill(node.hub.x + 20, node.hub.y + 275, "Progression and stats")}
        </Card>

        <Card n={node.chain}>
          {pill(node.chain.x + 20, node.chain.y + 95, "UAP token contracts")}
          {pill(node.chain.x + 20, node.chain.y + 140, "NFT ownership contracts")}
          {pill(node.chain.x + 20, node.chain.y + 185, "Burn execution")}
          {pill(node.chain.x + 20, node.chain.y + 230, "Treasury flows")}
          {pill(node.chain.x + 20, node.chain.y + 275, "Tx verification")}
        </Card>

        <Arrow
          id="gc_to_hub_reward"
          d={`M ${node.game.x + node.game.w} ${node.game.y + 290} C ${node.game.x + node.game.w + 90} ${node.game.y + 290}, ${
            node.hub.x - 90
          } ${node.hub.y + 290}, ${node.hub.x} ${node.hub.y + 290}`}
        />
        <StateDot id="hub_claimable" cx={node.hub.x + 290} cy={node.hub.y + 155} label="claimable" />

        <Arrow
          id="hub_to_chain_claim"
          d={`M ${node.hub.x + node.hub.w} ${node.hub.y + 210} C ${node.hub.x + node.hub.w + 90} ${node.hub.y + 210}, ${
            node.chain.x - 90
          } ${node.chain.y + 210}, ${node.chain.x} ${node.chain.y + 210}`}
        />
        <Arrow
          id="chain_confirm_claim"
          d={`M ${node.chain.x + 40} ${node.chain.y + 210} C ${node.chain.x + 100} ${node.chain.y + 150}, ${
            node.chain.x + 160
          } ${node.chain.y + 150}, ${node.chain.x + 220} ${node.chain.y + 210}`}
        />
        <Arrow
          id="chain_to_hub_balance"
          d={`M ${node.chain.x} ${node.chain.y + 250} C ${node.chain.x - 90} ${node.chain.y + 250}, ${
            node.hub.x + node.hub.w + 90
          } ${node.hub.y + 250}, ${node.hub.x + node.hub.w} ${node.hub.y + 250}`}
        />
        <Arrow
          id="hub_to_gc_balance"
          d={`M ${node.hub.x} ${node.hub.y + 250} C ${node.hub.x - 90} ${node.hub.y + 250}, ${
            node.game.x + node.game.w + 90
          } ${node.game.y + 250}, ${node.game.x + node.game.w} ${node.game.y + 250}`}
        />

        <Arrow
          id="hub_to_chain_spend"
          d={`M ${node.hub.x + node.hub.w} ${node.hub.y + 330} C ${node.hub.x + node.hub.w + 90} ${node.hub.y + 330}, ${
            node.chain.x - 90
          } ${node.chain.y + 330}, ${node.chain.x} ${node.chain.y + 330}`}
        />
        <Arrow
          id="chain_burn"
          d={`M ${node.chain.x + 60} ${node.chain.y + 330} C ${node.chain.x + 120} ${node.chain.y + 380}, ${
            node.chain.x + 150
          } ${node.chain.y + 380}, ${node.chain.x + 210} ${node.chain.y + 330}`}
        />
        <Arrow
          id="chain_treasury"
          d={`M ${node.chain.x + 60} ${node.chain.y + 330} C ${node.chain.x + 120} ${node.chain.y + 280}, ${
            node.chain.x + 150
          } ${node.chain.y + 280}, ${node.chain.x + 210} ${node.chain.y + 330}`}
        />
        <Arrow
          id="chain_to_hub_asset"
          d={`M ${node.chain.x} ${node.chain.y + 370} C ${node.chain.x - 90} ${node.chain.y + 370}, ${
            node.hub.x + node.hub.w + 90
          } ${node.hub.y + 370}, ${node.hub.x + node.hub.w} ${node.hub.y + 370}`}
        />
        <Arrow
          id="hub_to_gc_asset"
          d={`M ${node.hub.x} ${node.hub.y + 370} C ${node.hub.x - 90} ${node.hub.y + 370}, ${
            node.game.x + node.game.w + 90
          } ${node.game.y + 370}, ${node.game.x + node.game.w} ${node.game.y + 370}`}
        />

        <Arrow
          id="gc_to_hub_stats"
          d={`M ${node.game.x + node.game.w} ${node.game.y + 190} C ${node.game.x + node.game.w + 90} ${node.game.y + 190}, ${
            node.hub.x - 90
          } ${node.hub.y + 190}, ${node.hub.x} ${node.hub.y + 190}`}
        />
        <StateDot id="hub_nft_evolve" cx={node.hub.x + 290} cy={node.hub.y + 300} label="NFT state" />
        <Arrow
          id="hub_breed"
          d={`M ${node.hub.x + 160} ${node.hub.y + 320} C ${node.hub.x + 230} ${node.hub.y + 320}, ${
            node.hub.x + 230
          } ${node.hub.y + 355}, ${node.hub.x + 160} ${node.hub.y + 355}`}
        />
        <Arrow
          id="hub_to_gc_newstate"
          d={`M ${node.hub.x} ${node.hub.y + 170} C ${node.hub.x - 120} ${node.hub.y + 170}, ${
            node.game.x + node.game.w + 120
          } ${node.game.y + 170}, ${node.game.x + node.game.w} ${node.game.y + 170}`}
        />

        <g className="footer">
          <rect x="60" y="510" width="980" height="110" rx="16" ry="16" className="footerCard" />
          <text x="85" y="545" className="footerTitle">
            Key principles
          </text>
          <text x="85" y="572" className="footerText">
            Single source of truth • Bidirectional synchronization • No manual syncing • Clear separation between gameplay, application, and on chain settlement
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
          color: rgba(255, 255, 255, 0.92);
        }
        .h2 {
          margin-top: 6px;
          font-size: 13px;
          opacity: 0.8;
          color: rgba(255, 255, 255, 0.75);
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
          color: rgba(255, 255, 255, 0.8);
          white-space: nowrap;
        }
        .captionText {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.92);
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
        .svg text {
          fill: rgba(255, 255, 255, 0.86);
        }
        .card {
          filter: url(#softShadow);
          stroke: rgba(255, 255, 255, 0.18);
          stroke-width: 1;
          fill: rgba(255, 255, 255, 0.05);
        }
        .cardTitle {
          font-size: 16px;
          font-weight: 700;
          fill: rgba(255, 255, 255, 0.9);
        }
        .cardSub {
          font-size: 12px;
          fill: rgba(255, 255, 255, 0.8);
        }
        .divider {
          stroke: rgba(255, 255, 255, 0.12);
          stroke-width: 1;
        }
        .pillRect {
          stroke: rgba(255, 255, 255, 0.18);
          stroke-width: 1;
          fill: rgba(255, 255, 255, 0.04);
        }
        .pillText {
          font-size: 12px;
          fill: rgba(255, 255, 255, 0.86);
        }

        .arrowBase {
          fill: none;
          stroke: rgba(255, 255, 255, 0.2);
          stroke-width: 2;
          marker-start: none;
          marker-mid: none;
          marker-end: none;
        }
        .arrowBaseDim {
          stroke: rgba(255, 255, 255, 0.12);
        }
        .arrowActive {
          fill: none;
          stroke: rgba(255, 255, 255, 0.9);
          stroke-width: 3.5;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.45));
          animation: glowPulse 1.2s ease-in-out;
        }
        .arrowHead {
          fill: rgba(255, 255, 255, 0.9);
        }

        .travelDotOuter {
          fill: rgba(255, 255, 255, 0.18);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.55));
        }
        .travelDotInner {
          fill: rgba(255, 255, 255, 0.95);
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.65));
        }

        @keyframes glowPulse {
          0% {
            stroke-width: 3.5;
            opacity: 0.75;
          }
          50% {
            stroke-width: 5;
            opacity: 1;
          }
          100% {
            stroke-width: 3.5;
            opacity: 0.75;
          }
        }

        .stateDot .dot {
          fill: rgba(255, 255, 255, 0.2);
          stroke: rgba(255, 255, 255, 0.18);
          stroke-width: 1;
        }
        .stateDotActive .dot {
          fill: rgba(255, 255, 255, 0.92);
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
          fill: rgba(255, 255, 255, 0.86);
        }

        .footerCard {
          fill: rgba(255, 255, 255, 0.04);
          stroke: rgba(255, 255, 255, 0.16);
          stroke-width: 1;
        }
        .footerTitle {
          font-size: 13px;
          font-weight: 700;
          fill: rgba(255, 255, 255, 0.88);
        }
        .footerText {
          font-size: 12px;
          fill: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
};
