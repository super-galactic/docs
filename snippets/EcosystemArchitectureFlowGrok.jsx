"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  return (
    <div style={{ margin: "40px 0" }}>
      <style>{`
        @keyframes dashFlow {
          to { stroke-dashoffset: -40; }
        }
        @keyframes arrowGlow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .node-card {
          fill: #ffffff;
          stroke: rgba(167, 139, 250, 0.6);
          stroke-width: 2;
          rx: 24;
          filter: drop-shadow(0 8px 24px rgba(139,92,246,0.3));
        }
        .node-title {
          font-size: 28px;
          font-weight: 800;
          fill: #1e1b4b;
        }
        .node-layer {
          font-size: 20px;
          font-weight: 600;
          fill: #6b7280;
        }
        .micro-text {
          font-size: 16px;
          fill: #4b5563;
        }
        .connector-line {
          fill: none;
          stroke: rgba(139,92,246,0.25);
          stroke-width: 4;
        }
        .active-line {
          stroke: url(#activeGrad);
          stroke-width: 5;
          filter: url(#lineGlow);
        }
        .dash-animate {
          stroke-dasharray: 20 20;
          animation: dashFlow 2s linear infinite;
        }
        .arrow-head {
          fill: #a78bfa;
          animation: arrowGlow 2s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          borderRadius: "32px",
          padding: "48px",
          background: "radial-gradient(circle at top left, #6366f1 0%, #8b5cf6 50%, #4c1d95 100%)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg viewBox="0 0 1200 600" width="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="arrow-head"/>
            </marker>
          </defs>

          {/* Subtle background pattern */}
          <g opacity="0.08">
            {Array.from({ length: 150 }).map((_, i) => (
              <circle key={i} cx={Math.random() * 1200} cy={Math.random() * 600} r="1.5" fill="#ffffff"/>
            ))}
          </g>

          {/* Game Client Card */}
          <g transform="translate(100,150)">
            <rect width="300" height="300" className="node-card"/>
            <text x="150" y="50" textAnchor="middle" className="node-title">Game Client (Unity)</text>
            <text x="150" y="80" textAnchor="middle" className="node-layer">Gameplay Layer</text>
            <text x="150" y="120" textAnchor="middle" className="micro-text">Missions and Combat</text>
            <text x="150" y="150" textAnchor="middle" className="micro-text">Progression and Upgrades</text>
            <text x="150" y="180" textAnchor="middle" className="micro-text">Rewards Generated</text>
            <text x="150" y="210" textAnchor="middle" className="micro-text">Local State Cache</text>
          </g>

          {/* Super Galactic Hub Card */}
          <g transform="translate(450,100)">
            <rect width="300" height="400" className="node-card"/>
            <text x="150" y="50" textAnchor="middle" className="node-title">Super Galactic Hub</text>
            <text x="150" y="80" textAnchor="middle" className="node-layer">Application Layer</text>
            <text x="150" y="120" textAnchor="middle" className="micro-text">Sync Router</text>
            <text x="150" y="150" textAnchor="middle" className="micro-text">Asset Manager</text>
            <text x="150" y="180" textAnchor="middle" className="micro-text">UAP Balance</text>
            <text x="150" y="210" textAnchor="middle" className="micro-text">Claim Service</text>
            <text x="150" y="240" textAnchor="middle" className="micro-text">Breeding and NFT Actions</text>
          </g>

          {/* Blockchain Layer Card */}
          <g transform="translate(800,150)">
            <rect width="300" height="300" className="node-card"/>
            <text x="150" y="50" textAnchor="middle" className="node-title">Blockchain Layer</text>
            <text x="150" y="80" textAnchor="middle" className="node-layer">On-Chain Settlement</text>
            <text x="150" y="120" textAnchor="middle" className="micro-text">Tx Verification</text>
            <text x="150" y="150" textAnchor="middle" className="micro-text">UAP Token Contract</text>
            <text x="150" y="180" textAnchor="middle" className="micro-text">NFT Ownership Contract</text>
            <text x="150" y="210" textAnchor="middle" className="micro-text">Burn Execution</text>
            <text x="150" y="240" textAnchor="middle" className="micro-text">Treasury Flows</text>
            <text x="150" y="280" textAnchor="middle" fontSize="14" fill="#6b7280">Ethereum (origin) + BNB/Avalanche (gameplay)</text>
          </g>

          {/* Connectors */}
          <path d="M 400 300 Q 600 200, 600 300" className="active-line" markerEnd="url(#arrow)"/>
          <path d="M 400 300 Q 600 200, 600 300" className="dash-animate connector-line"/>

          <path d="M 750 300 Q 950 200, 950 300" className="active-line" markerEnd="url(#arrow)"/>
          <path d="M 750 300 Q 950 200, 950 300" className="dash-animate connector-line"/>

          <path d="M 950 340 Q 750 440, 750 340" className="active-line" markerEnd="url(#arrow)"/>
          <path d="M 950 340 Q 750 440, 750 340" className="dash-animate connector-line"/>

          <path d="M 600 340 Q 400 440, 400 340" className="active-line" markerEnd="url(#arrow)"/>
          <path d="M 600 340 Q 400 440, 400 340" className="dash-animate connector-line"/>
        </svg>

        <div style={{ marginTop: "40px", textAlign: "center", color: "#e0d8ff" }}>
          <p style={{ fontSize: "26px", fontStyle: "italic", marginBottom: "12px" }}>
            Animated flow lines show data movement across the ecosystem
          </p>
          <p style={{ fontSize: "18px" }}>
            Reward generation → Claiming → Spending/Burn → Asset sync (continuous loop)
          </p>
        </div>
      </div>
    </div>
  );
};