"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  const W = 960;
  const H = 680;

  const cxLeft = 240;
  const cxCenter = 480;
  const cxRight = 720;
  const cy = 340;

  const containerW = 220;
  const containerH = 380;
  const nodeSize = 86;

  // Micro nodes per container (positioned relatively)
  const leftNodes = [
    { id: "l1", label: "Missions and Combat", x: cxLeft, y: cy - 120 },
    { id: "l2", label: "Progression and Upgrades", x: cxLeft, y: cy - 40 },
    { id: "l3", label: "Rewards Generated", x: cxLeft, y: cy + 40 },
    { id: "l4", label: "Local State Cache", x: cxLeft, y: cy + 120 },
  ];

  const centerNodes = [
    { id: "c1", label: "Sync Router", x: cxCenter, y: cy - 140 },
    { id: "c2", label: "Asset Manager", x: cxCenter, y: cy - 70 },
    { id: "c3", label: "UAP Balance", x: cxCenter, y: cy },
    { id: "c4", label: "Claim Service", x: cxCenter, y: cy + 70 },
    { id: "c5", label: "Breeding and NFT Actions", x: cxCenter, y: cy + 140 },
  ];

  const rightNodes = [
    { id: "r1", label: "Tx Verification", x: cxRight, y: cy - 100 },
    { id: "r2", label: "UAP Token Contract", x: cxRight, y: cy - 20 },
    { id: "r3", label: "NFT Ownership Contract", x: cxRight, y: cy + 40 },
    { id: "r4", label: "Burn Execution", x: cxRight, y: cy + 100 },
    { id: "r5", label: "Treasury Flows", x: cxRight, y: cy + 160 },
  ];

  // Global curved paths
  const paths = {
    l2c: `M ${cxLeft + 110} ${cy} Q ${cxCenter - 110} ${cy - 100}, ${cxCenter - 110} ${cy}`,
    c2r: `M ${cxCenter + 110} ${cy} Q ${cxRight - 110} ${cy - 80}, ${cxRight - 110} ${cy}`,
    r2c: `M ${cxRight - 110} ${cy + 50} Q ${cxCenter + 110} ${cy + 120}, ${cxCenter + 110} ${cy + 50}`,
    c2l: `M ${cxCenter - 110} ${cy + 50} Q ${cxLeft + 110} ${cy + 120}, ${cxLeft + 110} ${cy + 50}`,
  };

  const flows = {
    reward: [
      { highlightNodes: ["l1"], activePath: null, desc: "Missions and Combat completed" },
      { highlightNodes: ["l3"], activePath: null, desc: "Rewards generated off chain" },
      { highlightNodes: ["l3", "c3"], activePath: "l2c", desc: "Reward data sent to Hub" },
      { highlightNodes: ["c3"], activePath: null, desc: "UAP appears as claimable" },
    ],
    claim: [
      { highlightNodes: ["c4"], activePath: null, desc: "Player initiates claim" },
      { highlightNodes: ["c4", "r1"], activePath: "c2r", desc: "Claim transaction submitted" },
      { highlightNodes: ["r1"], activePath: null, desc: "Transaction verified on chain" },
      { highlightNodes: ["c3"], activePath: "r2c", desc: "Confirmed balance updates in Hub" },
    ],
    spending: [
      { highlightNodes: ["c2"], activePath: null, desc: "Spend or upgrade action" },
      { highlightNodes: ["c2", "r4", "r5"], activePath: "c2r", desc: "Burn and treasury allocation" },
      { highlightNodes: ["r4", "r5"], activePath: null, desc: "Chain state updated" },
      { highlightNodes: ["c3", "l4"], activePath: "r2c", desc: "Updated state syncs back" },
    ],
    asset: [
      { highlightNodes: ["l2"], activePath: null, desc: "Upgrades performed in game" },
      { highlightNodes: ["l2", "c5"], activePath: "l2c", desc: "NFT stats sent to Hub" },
      { highlightNodes: ["c5"], activePath: null, desc: "Breeding or evolution processed" },
      { highlightNodes: ["l4"], activePath: "c2l", desc: "Updated NFT state reflected in client" },
    ],
  };

  const flowKeys = Object.keys(flows);
  let currentFlow = "reward";
  let step = 0;
  let playing = false;

  const startPlay = () => {
    playing = true;
    step = 0;
    advanceStep();
  };

  const advanceStep = () => {
    if (!playing) return;
    step++;
    const max = flows[currentFlow].length;
    if (step >= max) {
      playing = false;
      step = max - 1;
      return;
    }
    setTimeout(advanceStep, 3200);
  };

  const currentDesc = step === 0 ? "Select a flow and press Play" : flows[currentFlow][step - 1]?.desc || "";
  const activePath = step === 0 ? null : flows[currentFlow][step - 1]?.activePath;
  const highlighted = step === 0 ? [] : flows[currentFlow][step - 1]?.highlightNodes || [];

  return (
    <div style={{ margin: "24px 0" }}>
      <style>{`
        @keyframes travelDot {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes pulseHalo {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.12); }
        }
        .glass-panel {
          fill: rgba(15,10,35,0.65);
          stroke: rgba(139,92,246,0.25);
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.6));
        }
        .micro-node {
          fill: rgba(20,15,45,0.8);
          stroke: rgba(139,92,246,0.2);
          transition: all 0.4s ease;
        }
        .micro-node.active {
          stroke: #a78bfa;
          filter: drop-shadow(0 0 20px rgba(167,139,250,0.6));
        }
        .container-glow {
          stroke-width: 3;
          stroke: rgba(167,139,250,0.15);
          opacity: 0;
        }
        .container-active .container-glow {
          opacity: 1;
          animation: pulseHalo 2.4s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {flowKeys.map((key) => (
          <button
            key={key}
            onClick={() => {
              currentFlow = key;
              startPlay();
            }}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              currentFlow === key
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {flows[key][0].desc.split(" ")[0] === "Missions" ? "Reward flow" :
             flows[key][0].desc.includes("claim") ? "Claim flow" :
             flows[key][0].desc.includes("Spend") ? "Spending and burn flow" :
             "Asset synchronisation flow"}
          </button>
        ))}
        <button onClick={startPlay} className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-500">
          Play
        </button>
        <button onClick={() => { playing = false; step = 0; }} className="px-8 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600">
          Reset
        </button>
      </div>

      <div
        style={{
          borderRadius: 20,
          padding: 20,
          background: "linear-gradient(135deg, #1a0b2e 0%, #2d1b4a 100%)",
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.6)",
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="purpleGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <path id="pathL2C" d={paths.l2c} />
            <path id="pathC2R" d={paths.c2r} />
            <path id="pathR2C" d={paths.r2c} />
            <path id="pathC2L" d={paths.c2l} />
          </defs>

          {/* Inactive global paths */}
          <path d={paths.l2c} fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="3"/>
          <path d={paths.c2r} fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="3"/>
          <path d={paths.r2c} fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="3"/>
          <path d={paths.c2l} fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="3"/>

          {/* Active global path + traveling dot */}
          {activePath && (
            <>
              <use href={`#path${activePath.toUpperCase()}`} stroke="url(#purpleGlow)" strokeWidth="4" filter="url(#glow)" />
              <circle r="8" fill="#e9d5ff">
                <animateMotion dur="1.2s" repeatCount="1" path={paths[activePath]} />
              </circle>
              <circle r="14" fill="none" stroke="#c4b5fd" strokeWidth="4" opacity="0.6">
                <animateMotion dur="1.2s" repeatCount="1" path={paths[activePath]} />
                <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.2s" repeatCount="1" />
              </circle>
            </>
          )}

          {/* Containers */}
          <g className={highlighted.some(n => n.startsWith('l')) ? "container-active" : ""}>
            <rect x={cxLeft - containerW/2} y={cy - containerH/2} width={containerW} height={containerH} rx="20" className="glass-panel"/>
            <circle cx={cxLeft} cy={cy} r={containerW/2 + 20} className="container-glow" fill="none"/>
            <text x={cxLeft} y={cy - containerH/2 - 30} textAnchor="middle" fill="#ddd" fontSize="18" fontWeight="600">Gameplay layer</text>
            <text x={cxLeft} y={cy - containerH/2 - 10} textAnchor="middle" fill="#a78bfa" fontSize="24" fontWeight="700">Game Client (Unity)</text>
          </g>

          <g className={highlighted.some(n => n.startsWith('c')) ? "container-active" : ""}>
            <rect x={cxCenter - containerW/2 - 20} y={cy - containerH/2 - 20} width={containerW + 40} height={containerH + 40} rx="24" className="glass-panel"/>
            <circle cx={cxCenter} cy={cy} r={containerW/2 + 40} className="container-glow" fill="none"/>
            <text x={cxCenter} y={cy - containerH/2 - 50} textAnchor="middle" fill="#ddd" fontSize="18" fontWeight="600">Application layer</text>
            <text x={cxCenter} y={cy - containerH/2 - 30} textAnchor="middle" fill="#a78bfa" fontSize="26" fontWeight="700">Super Galactic Hub</text>
          </g>

          <g className={highlighted.some(n => n.startsWith('r')) ? "container-active" : ""}>
            <rect x={cxRight - containerW/2} y={cy - containerH/2} width={containerW} height={containerH} rx="20" className="glass-panel"/>
            <circle cx={cxRight} cy={cy} r={containerW/2 + 20} className="container-glow" fill="none"/>
            <text x={cxRight} y={cy - containerH/2 - 30} textAnchor="middle" fill="#ddd" fontSize="18" fontWeight="600">On chain settlement</text>
            <text x={cxRight} y={cy - containerH/2 - 10} textAnchor="middle" fill="#a78bfa" fontSize="24" fontWeight="700">Blockchain Layer</text>
            <text x={cxRight} y={cy + containerH/2 + 30} textAnchor="middle" fill="#bbb" fontSize="14">
              Ethereum (origin) and BNB + Avalanche (gameplay)
            </text>
          </g>

          {/* Micro nodes */}
          {[...leftNodes, ...centerNodes, ...rightNodes].map(node => (
            <g key={node.id} className={highlighted.includes(node.id) ? "active" : ""}>
              <rect x={node.x - nodeSize/2} y={node.y - nodeSize/2} width={nodeSize} height={nodeSize} rx="12" className="micro-node"/>
              <text x={node.x} y={node.y - 8} textAnchor="middle" fill="#e0d8ff" fontSize="13" fontWeight="600">{node.label.split(" ")[0]}</text>
              <text x={node.x} y={node.y + 10} textAnchor="middle" fill="#bbb" fontSize="12">{node.label.split(" ").slice(1).join(" ")}</text>
            </g>
          ))}
        </svg>

        <div style={{ textAlign: "center", marginTop: 24, padding: "16px", background: "rgba(15,10,35,0.6)", borderRadius: 12, border: "1px solid rgba(139,92,246,0.2)" }}>
          <div style={{ fontSize: 16, color: "#ddd" }}>
            {step > 0 ? `Step ${step} of ${flows[currentFlow].length}` : "Ready"}
          </div>
          <div style={{ fontSize: 20, color: "#e0d8ff", fontStyle: "italic", marginTop: 8 }}>
            {currentDesc}
          </div>
        </div>
      </div>
    </div>
  );
};