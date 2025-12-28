"use client";
import React from "react";

// This component renders a high‑level animated architecture diagram for the
// Super Galactic ecosystem. It is designed for Mintlify MDX pages and
// follows the same export pattern as other snippet components.  The diagram
// conveys the flow of data and actions between the Game Client, the
// Super Galactic Hub, and the Blockchain Layer.  Only the currently
// selected flow is visible at any given time to keep the visualization
// focused and easy to understand.  Non‑selected flows are hidden
// entirely rather than dimmed.  Within the selected flow, only the
// currently active step gets an animated overlay and arrowhead; all
// underlying static lines are rendered without arrowheads to avoid visual
// clutter.  See the CSS at the bottom of this file for details on how
// the arrow animations are implemented.

export const SuperGalacticArchitectureFlow = () => {
  const W = 1100;
  const H = 650;

  const [activeFlow, setActiveFlow] = React.useState("reward");
  const [step, setStep] = React.useState(0);

  // Define the flows, their labels, the order of steps, and which edges
  // (arrows) and state dots should be visible for each flow.  Only the
  // edges listed in `edges` will be rendered when that flow is active.
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
          { id: "hub_to_chain_claim", caption: "Claim triggers on‑chain tx" },
          { id: "chain_confirm_claim", caption: "Chain confirms transaction" },
          { id: "chain_to_hub_balance", caption: "Balance updates across systems" },
          { id: "hub_to_gc_balance", caption: "Game client reflects updated state" },
        ],
        edges: [
          "hub_to_chain_claim",
          "chain_confirm_claim",
          "chain_to_hub_balance",
          "hub_to_gc_balance",
        ],
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
        edges: [
          "hub_to_chain_spend",
          "chain_burn",
          "chain_treasury",
          "chain_to_hub_asset",
          "hub_to_gc_asset",
        ],
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

  // Whenever the active flow changes, reset the step to 0 and set an
  // interval to advance the step.  Steps cycle through the defined
  // sequence for the active flow.  The interval clears itself when the
  // component unmounts or when the active flow changes.
  React.useEffect(() => {
    const total = flows[activeFlow]?.steps?.length || 1;
    setStep(0);
    const t = setInterval(() => setStep((s) => (s + 1) % total), 1700);
    return () => clearInterval(t);
  }, [activeFlow, flows]);

  // Determine the ID of the currently active step and its caption for
  // display in the caption bar.  If no step exists, fall back to an
  // empty string.
  const activeStepId = flows[activeFlow]?.steps?.[step]?.id;
  const caption = flows[activeFlow]?.steps?.[step]?.caption || "";

  // Precompute the layout of the major nodes.  These numbers define the
  // positions and sizes of the Game Client, Hub, and Blockchain cards on
  // the SVG canvas.  Changing these values will reposition the entire
  // diagram.
  const node = {
    game: {
      x: 60,
      y: 155,
      w: 300,
      h: 300,
      title: "Game Client",
      subtitle: "Unity",
    },
    hub: {
      x: 405,
      y: 135,
      w: 320,
      h: 340,
      title: "Super Galactic Hub",
      subtitle: "Unified app layer",
    },
    chain: {
      x: 770,
      y: 155,
      w: 270,
      h: 300,
      title: "Blockchain Layer",
      subtitle: "Settlement and source of truth",
    },
  };

  // Helpers to decide whether a given edge (arrow) or state (dot) should
  // render for the current flow.  These functions look up the active
  // flow's edge/state lists and return true if the ID is present.
  const isEdgeVisible = (id) => (flows[activeFlow]?.edges || []).includes(id);
  const isStateVisible = (id) => (flows[activeFlow]?.states || []).includes(id);
  const isActive = (id) => id === activeStepId;

  // Render a pill representing a row inside a card.  Pills are reused for
  // multiple rows across the three node cards.  They are not interactive;
  // they simply display the text in a consistent style.
  const pill = (x, y, text) => (
    <g>
      <rect x={x} y={y} rx="10" ry="10" width="260" height="34" className="pillRect" />
      <text x={x + 12} y={y + 22} className="pillText">
        {text}
      </text>
    </g>
  );

  // Render a card with its title, subtitle, divider line, and child
  // elements (pills).  Each card is a rounded rectangle containing a
  // group of pill rows.  Children are passed in as children of the
  // Card component.
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

  // Render an arrow for a given edge.  If the edge is not visible for
  // the current flow, return null so nothing is rendered.  Otherwise
  // render a base line (static) and, if the edge is the active step,
  // overlay an animated path with an arrowhead.  The CSS ensures the
  // static line has no arrowhead via `marker-end: none` on .arrowBase.
  const Arrow = ({ id, d }) => {
    if (!isEdgeVisible(id)) return null;
    const active = isActive(id);
    return (
      <g className="arrow">
        <path d={d} className={`arrowBase${active ? " arrowBaseDim" : ""}`} />
        {active ? <path d={d} className="arrowActive" markerEnd="url(#arrowHead)" /> : null}
      </g>
    );
  };

  // Render a state indicator dot.  If the state is not visible for the
  // current flow, return null.  Otherwise render a circle and its
  // label.  When active, the dot pulses via CSS animation.
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
          {/* Arrowhead definition used only for active arrows. */}
          <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="arrowHead" />
          </marker>
          {/* Drop shadow for cards. */}
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
          On‑chain settlement
        </text>
        {/* Node cards */}
        <Card n={node.game}>
          {pill(node.game.x + 20, node.game.y + 95, "Player gameplay")}
          {pill(node.game.x + 20, node.game.y + 140, "Missions and combat")}
          {pill(node.game.x + 20, node.game.y + 185, "Progression and upgrades")}
          {pill(node.game.x + 20, node.game.y + 230, "Reward generation (off‑chain)")}
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
        {/* Chain grouping label */}
        <g className="chainGroup">
          <rect
            x={node.chain.x + 18}
            y={node.chain.y + 18}
            rx="12"
            ry="12"
            width={node.chain.w - 36}
            height="60"
            className="chainGroupRect"
          />
          <text x={node.chain.x + 34} y={node.chain.y + 43} className="chainGroupTitle">
            Chains
          </text>
          <text x={node.chain.x + 34} y={node.chain.y + 63} className="chainGroupSub">
            Ethereum (origin) plus BNB and Avalanche (gameplay)
          </text>
        </g>
        {/* Reward edges and states */}
        <Arrow
          id="gc_to_hub_reward"
          d={`M ${node.game.x + node.game.w} ${node.game.y + 290} C ${node.game.x + node.game.w + 90} ${node.game.y + 290}, ${
            node.hub.x - 90
          } ${node.hub.y + 290}, ${node.hub.x} ${node.hub.y + 290}`}
        />
        <StateDot
          id="hub_claimable"
          cx={node.hub.x + 290}
          cy={node.hub.y + 155}
          label="claimable"
        />
        {/* Claim edges */}
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
        {/* Spend edges */}
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
        {/* Sync edges and states */}
        <Arrow
          id="gc_to_hub_stats"
          d={`M ${node.game.x + node.game.w} ${node.game.y + 190} C ${node.game.x + node.game.w + 90} ${node.game.y + 190}, ${
            node.hub.x - 90
          } ${node.hub.y + 190}, ${node.hub.x} ${node.hub.y + 190}`}
        />
        <StateDot
          id="hub_nft_evolve"
          cx={node.hub.x + 290}
          cy={node.hub.y + 300}
          label="NFT state"
        />
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
        {/* Footer explaining the key principles */}
        <g className="footer">
          <rect x="60" y="510" width="980" height="110" rx="16" ry="16" className="footerCard" />
          <text x="85" y="545" className="footerTitle">
            Key principles
          </text>
          <text x="85" y="572" className="footerText">
            Single source of truth • Bidirectional synchronization • No manual syncing • Clear separation between gameplay, application, and on‑chain settlement
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
        /* Base arrow line: no arrowheads; lighten when active */
        .arrowBase {
          fill: none;
          stroke: rgba(255, 255, 255, 0.20);
          stroke-width: 2;
          marker-end: none;
        }
        .arrowBaseDim {
          stroke: rgba(255, 255, 255, 0.12);
        }
        .arrowActive {
          fill: none;
          stroke: rgba(255, 255, 255, 0.90);
          stroke-width: 3;
          stroke-dasharray: 10 12;
          animation: dash 1.4s linear infinite, pulse 1.6s ease-in-out infinite;
        }
        .arrowHead {
          fill: rgba(255, 255, 255, 0.9);
        }
        @keyframes dash {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -220;
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
          fill: rgba(255, 255, 255, 0.20);
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