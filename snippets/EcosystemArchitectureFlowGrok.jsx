"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  const W = 1000;
  const H = 720;

  const cxLeft = 250;
  const cxCenter = 500;
  const cxRight = 750;
  const baseY = 360;

  const containerW = 240;
  const containerH = 460;
  const largeContainerW = 280;
  const largeContainerH = 500;
  const nodeW = 180;
  const nodeH = 56;

  // Micro nodes - centered in their container
  const leftNodes = [
    { id: "l1", label: "Missions and Combat", y: baseY - 150 },
    { id: "l2", label: "Progression and Upgrades", y: baseY - 70 },
    { id: "l3", label: "Rewards Generated", y: baseY + 20 },
    { id: "l4", label: "Local State Cache", y: baseY + 110 },
  ];

  const centerNodes = [
    { id: "c1", label: "Sync Router", y: baseY - 180 },
    { id: "c2", label: "Asset Manager", y: baseY - 100 },
    { id: "c3", label: "UAP Balance", y: baseY - 20 },
    { id: "c4", label: "Claim Service", y: baseY + 60 },
    { id: "c5", label: "Breeding and NFT Actions", y: baseY + 140 },
  ];

  const rightNodes = [
    { id: "r1", label: "Tx Verification", y: baseY - 130 },
    { id: "r2", label: "UAP Token Contract", y: baseY - 50 },
    { id: "r3", label: "NFT Ownership Contract", y: baseY + 20 },
    { id: "r4", label: "Burn Execution", y: baseY + 90 },
    { id: "r5", label: "Treasury Flows", y: baseY + 160 },
  ];

  // Global curved paths - carefully tuned for beauty
  const paths = {
    l2c: `M ${cxLeft + 120} ${baseY + 20} Q ${cxCenter - 140} ${baseY - 120}, ${cxCenter - 140} ${baseY - 20}`,
    c2r: `M ${cxCenter + 140} ${baseY} Q ${cxRight - 120} ${baseY - 100}, ${cxRight - 120} ${baseY}`,
    r2c: `M ${cxRight - 120} ${baseY + 40} Q ${cxCenter + 140} ${baseY + 140}, ${cxCenter + 140} ${baseY + 40}`,
    c2l: `M ${cxCenter - 140} ${baseY + 80} Q ${cxLeft + 120} ${baseY + 160}, ${cxLeft + 120} ${baseY + 80}`,
  };

  const flows = {
    reward: [
      { nodes: ["l1"], path: null, desc: "Missions and Combat completed" },
      { nodes: ["l3"], path: null, desc: "Rewards generated off-chain" },
      { nodes: ["l3", "c3"], path: "l2c", desc: "Reward data sent to Hub" },
      { nodes: ["c3"], path: null, desc: "UAP appears as claimable balance" },
    ],
    claim: [
      { nodes: ["c4"], path: null, desc: "Player initiates claim via Hub" },
      { nodes: ["c4", "r1"], path: "c2r", desc: "Claim transaction submitted" },
      { nodes: ["r1"], path: null, desc: "Transaction verified on chain" },
      { nodes: ["c3"], path: "r2c", desc: "Confirmed balance reflected in Hub" },
    ],
    spending: [
      { nodes: ["c2"], path: null, desc: "Player spends UAP on upgrade" },
      { nodes: ["c2", "r4", "r5"], path: "c2r", desc: "Burn and treasury allocation executed" },
      { nodes: ["r4", "r5"], path: null, desc: "Chain state updated" },
      { nodes: ["c3", "l4"], path: "r2c", desc: "Updated balances sync back" },
    ],
    asset: [
      { nodes: ["l2"], path: null, desc: "Upgrades performed in game" },
      { nodes: ["l2", "c5"], path: "l2c", desc: "NFT stats and evolution sent to Hub" },
      { nodes: ["c5"], path: null, desc: "Breeding or evolution processed" },
      { nodes: ["l4"], path: "c2l", desc: "Updated NFT state reflected in client" },
    ],
  };

  const flowNames = {
    reward: "Reward flow",
    claim: "Claim flow",
    spending: "Spending and burn flow",
    asset: "Asset synchronisation flow",
  };

  let currentFlow = "reward";
  let stepIndex = 0;
  let isPlaying = false;

  const play = () => {
    isPlaying = true;
    stepIndex = 0;
    advance();
  };

  const advance = () => {
    if (!isPlaying) return;
    stepIndex++;
    if (stepIndex >= flows[currentFlow].length) {
      isPlaying = false;
      return;
    }
    requestAnimationFrame(() => setTimeout(advance, 3200));
  };

  const reset = () => {
    isPlaying = false;
    stepIndex = 0;
  };

  const currentStep = stepIndex === 0 ? null : flows[currentFlow][stepIndex - 1];
  const activePath = currentStep?.path;
  const activeNodes = currentStep?.nodes || [];
  const description = stepIndex === 0 ? "Select a flow and press Play to begin" : currentStep?.desc || "";

  return (
    <div style={{ margin: "32px 0" }}>
      <style>{`
        @keyframes dotTravel {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
        @keyframes haloPulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        .glass {
          fill: rgba(30, 20, 60, 0.65);
          stroke: rgba(167, 139, 250, 0.3);
          filter: url(#softGlow);
        }
        .node-base {
          fill: rgba(45, 30, 90, 0.75);
          stroke: rgba(167, 139, 250, 0.25);
          rx: 12;
          ry: 12;
        }
        .node-active {
          stroke: #c4b5fd;
          stroke-width: 2.5;
          filter: url(#nodeGlow);
        }
        .container-halo {
          stroke: #a78bfa;
          stroke-width: 4;
          fill: none;
          opacity: 0;
        }
        .container-active .container-halo {
          opacity: 0.6;
          animation: haloPulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {Object.keys(flows).map((key) => (
          <button
            key={key}
            onClick={() => {
              currentFlow = key;
              play();
            }}
            className={`px-7 py-3 rounded-2xl font-semibold text-lg transition-all ${
              currentFlow === key
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40"
                : "bg-slate-800/70 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {flowNames[key]}
          </button>
        ))}
        <button
          onClick={play}
          className="px-10 py-3 bg-green-600 text-white rounded-2xl font-semibold text-lg hover:bg-green-500 shadow-lg"
        >
          Play
        </button>
        <button
          onClick={reset}
          className="px-10 py-3 bg-slate-700 text-white rounded-2xl font-semibold text-lg hover:bg-slate-600"
        >
          Reset
        </button>
      </div>

      <div
        style={{
          borderRadius: "28px",
          padding: "32px",
          background: "radial-gradient(ellipse at center, #2d1b4a 0%, #1a0b2e 70%)",
          boxShadow: "inset 0 0 140px rgba(0,0,0,0.8)",
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="pathGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c4b5fd"/>
              <stop offset="100%" stopColor="#818cf8"/>
            </linearGradient>

            <filter id="softGlow">
              <feGaussianBlur stdDeviation="10" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <path id="pL2C" d={paths.l2c} />
            <path id="pC2R" d={paths.c2r} />
            <path id="pR2C" d={paths.r2c} />
            <path id="pC2L" d={paths.c2l} />
          </defs>

          {/* Faint inactive paths */}
          {Object.values(paths).map((d, i) => (
            <path key={i} d={d} fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="3"/>
          ))}

          {/* Active path glow + traveling dot */}
          {activePath && (
            <>
              <use href={`#p${activePath.toUpperCase()}`} stroke="url(#pathGlow)" strokeWidth="5" filter="url(#softGlow)" opacity="0.9"/>
              {/* Bright core dot */}
              <circle r="9" fill="#e0d8ff" filter="url(#nodeGlow)">
                <animateMotion dur="1.3s" repeatCount="1" path={paths[activePath]}>
                  <mpath xlinkHref={`#p${activePath.toUpperCase()}`} />
                </animateMotion>
              </circle>
              {/* Soft halo */}
              <circle r="18" fill="none" stroke="#c4b5fd" strokeWidth="6" opacity="0.6">
                <animateMotion dur="1.3s" repeatCount="1" path={paths[activePath]}>
                  <mpath xlinkHref={`#p${activePath.toUpperCase()}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.3s" repeatCount="1"/>
              </circle>
            </>
          )}

          {/* Containers */}
          <g className={activeNodes.some(n => n.startsWith("l")) ? "container-active" : ""}>
            <rect x={cxLeft - containerW/2} y={baseY - containerH/2} width={containerW} height={containerH} rx="24" className="glass"/>
            <circle cx={cxLeft} cy={baseY} r={containerW/2 + 25} className="container-halo"/>
            <text x={cxLeft} y={baseY - containerH/2 - 50} textAnchor="middle" fill="#a78bfa" fontSize="20" fontWeight="600">Gameplay layer</text>
            <text x={cxLeft} y={baseY - containerH/2 - 20} textAnchor="middle" fill="#e0d8ff" fontSize="28" fontWeight="800">Game Client (Unity)</text>
          </g>

          <g className={activeNodes.some(n => n.startsWith("c")) ? "container-active" : ""}>
            <rect x={cxCenter - largeContainerW/2} y={baseY - largeContainerH/2} width={largeContainerW} height={largeContainerH} rx="28" className="glass"/>
            <circle cx={cxCenter} cy={baseY} r={largeContainerW/2 + 30} className="container-halo"/>
            <text x={cxCenter} y={baseY - largeContainerH/2 - 60} textAnchor="middle" fill="#a78bfa" fontSize="22" fontWeight="600">Application layer</text>
            <text x={cxCenter} y={baseY - largeContainerH/2 - 25} textAnchor="middle" fill="#e0d8ff" fontSize="32" fontWeight="800">Super Galactic Hub</text>
          </g>

          <g className={activeNodes.some(n => n.startsWith("r")) ? "container-active" : ""}>
            <rect x={cxRight - containerW/2} y={baseY - containerH/2} width={containerW} height={containerH} rx="24" className="glass"/>
            <circle cx={cxRight} cy={baseY} r={containerW/2 + 25} className="container-halo"/>
            <text x={cxRight} y={baseY - containerH/2 - 50} textAnchor="middle" fill="#a78bfa" fontSize="20" fontWeight="600">On chain settlement</text>
            <text x={cxRight} y={baseY - containerH/2 - 20} textAnchor="middle" fill="#e0d8ff" fontSize="28" fontWeight="800">Blockchain Layer</text>
            <text x={cxRight} y={baseY + containerH/2 + 40} textAnchor="middle" fill="#c4b5fd" fontSize="15" opacity="0.9">
              Ethereum (origin) and BNB + Avalanche (gameplay)
            </text>
          </g>

          {/* Micro nodes */}
          {leftNodes.map(n => (
            <g key={n.id} transform={`translate(${cxLeft},${n.y})`}>
              <rect x={-nodeW/2} y={-nodeH/2} width={nodeW} height={nodeH} className={`node-base ${activeNodes.includes(n.id) ? "node-active" : ""}`}/>
              <text x="0" y="4" textAnchor="middle" fill="#e0d8ff" fontSize="15" fontWeight="700">{n.label}</text>
            </g>
          ))}

          {centerNodes.map(n => (
            <g key={n.id} transform={`translate(${cxCenter},${n.y})`}>
              <rect x={-nodeW/2 - 10} y={-nodeH/2} width={nodeW + 20} height={nodeH} className={`node-base ${activeNodes.includes(n.id) ? "node-active" : ""}`}/>
              <text x="0" y="4" textAnchor="middle" fill="#e0d8ff" fontSize="16" fontWeight="700">{n.label}</text>
            </g>
          ))}

          {rightNodes.map(n => (
            <g key={n.id} transform={`translate(${cxRight},${n.y})`}>
              <rect x={-nodeW/2} y={-nodeH/2} width={nodeW} height={nodeH} className={`node-base ${activeNodes.includes(n.id) ? "node-active" : ""}`}/>
              <text x="0" y="4" textAnchor="middle" fill="#e0d8ff" fontSize="15" fontWeight="700">{n.label}</text>
            </g>
          ))}
        </svg>

        <div
          style={{
            marginTop: "32px",
            padding: "24px",
            background: "rgba(30,20,60,0.5)",
            borderRadius: "20px",
            border: "1px solid rgba(167,139,250,0.3)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", color: "#c4b5fd", marginBottom: "8px" }}>
            {stepIndex > 0 ? `Step ${stepIndex} of ${flows[currentFlow].length}` : "Ready"}
          </div>
          <div style={{ fontSize: "24px", color: "#e0d8ff", fontStyle: "italic" }}>
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};