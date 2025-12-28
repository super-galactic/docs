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
        edges: ["gc_to_hub_reward"],
        states: ["hub_claimable"],
      },
      claim: {
        label: "Claim flow",
        steps: [
          { id: "hub_to_chain_claim", caption: "Claim triggers on chain transaction" },
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
          { id: "hub_to_chain_spend", caption: "Spend triggers on chain settlement" },
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

  const timerRef = React.useRef();

  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const total = flows[activeFlow].steps.length;
    if (step < total - 1) {
      timerRef.current = setTimeout(() => setStep((s) => s + 1), 1600);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, activeFlow, flows]);

  const activeStepId = flows[activeFlow].steps[step]?.id;
  const caption = flows[activeFlow].steps[step]?.caption || "";

  const nodeWidth = 320;
  const nodeHeight = 340;

  const node = {
    game: { x: 35, y: 155, w: nodeWidth, h: nodeHeight },
    hub: { x: 390, y: 155, w: nodeWidth, h: nodeHeight },
    chain: { x: 745, y: 155, w: nodeWidth, h: nodeHeight },
  };

  const isEdgeVisible = (id) => flows[activeFlow].edges.includes(id);
  const isStateVisible = (id) => flows[activeFlow].states.includes(id);
  const isActive = (id) => id === activeStepId;

  const Arrow = ({ id, d }) => {
    if (!isEdgeVisible(id)) return null;
    const active = isActive(id);

    return (
      <g>
        <path d={d} className={`arrowBase${active ? " arrowBaseDim" : ""}`} />

        {active && (
          <g key={activeStepId}>
            <path d={d} className="arrowActive" markerEnd="url(#arrowHead)" />
            <TravelDot d={d} />
          </g>
        )}
      </g>
    );
  };

  const TravelDot = ({ d }) => {
    const pathRef = React.useRef(null);
    const outerRef = React.useRef(null);
    const innerRef = React.useRef(null);
    const rafRef = React.useRef(null);

    React.useEffect(() => {
      const path = pathRef.current;
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!path || !outer || !inner) return;

      const length = path.getTotalLength();
      let start;

      const tick = (t) => {
        if (!start) start = t;
        const p = Math.min((t - start) / 1200, 1);
        const pt = path.getPointAtLength(p * length);

        outer.setAttribute("cx", pt.x);
        outer.setAttribute("cy", pt.y);
        inner.setAttribute("cx", pt.x);
        inner.setAttribute("cy", pt.y);

        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    }, [d]);

    return (
      <g>
        <path ref={pathRef} d={d} fill="none" stroke="transparent" />
        <circle ref={outerRef} r="6" className="travelDotOuter" />
        <circle ref={innerRef} r="2.8" className="travelDotInner" />
      </g>
    );
  };

  return (
    <div className="wrap">
      <div className="topbar">
        <div>
          <div className="h1">Super Galactic Ecosystem Architecture</div>
          <div className="h2">System flow, data flow, and state synchronization</div>
        </div>
        <div className="controls">
          {Object.entries(flows).map(([k, v]) => (
            <button
              key={k}
              className={`btn${activeFlow === k ? " btnActive" : ""}`}
              onClick={() => {
                setActiveFlow(k);
                setStep(0);
              }}
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

      <svg viewBox={`0 0 ${W} ${H}`} className="svg">
        <defs>
          <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <Arrow
          id="gc_to_hub_reward"
          d={`M ${node.game.x + node.game.w} 445 C ${node.game.x + node.game.w + 90} 445, ${node.hub.x - 90} 445, ${node.hub.x} 445`}
        />

        <Arrow
          id="hub_to_gc_newstate"
          d={`M ${node.hub.x} 325 C ${node.hub.x - 120} 325, ${node.game.x + node.game.w + 120} 325, ${node.game.x + node.game.w} 325`}
        />
      </svg>

      <style jsx>{`
        .wrap {
          padding: 16px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
        }
        .topbar {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .h1 {
          font-size: 18px;
          font-weight: 700;
        }
        .h2 {
          font-size: 13px;
          opacity: 0.8;
        }
        .controls {
          display: flex;
          gap: 8px;
        }
        .btn {
          font-size: 12px;
          padding: 8px 10px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.03);
        }
        .btnActive {
          border-color: rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.06);
        }
        .caption {
          display: flex;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(0,0,0,0.12);
          margin-bottom: 12px;
        }
        .arrowBase {
          stroke: rgba(255,255,255,0.2);
          stroke-width: 2;
          fill: none;
        }
        .arrowActive {
          stroke: rgba(255,255,255,0.9);
          stroke-width: 3.5;
          fill: none;
        }
        .travelDotOuter {
          fill: rgba(255,255,255,0.18);
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.55));
        }
        .travelDotInner {
          fill: rgba(255,255,255,0.95);
          filter: drop-shadow(0 0 6px rgba(255,255,255,0.65));
        }
      `}</style>
    </div>
  );
};
