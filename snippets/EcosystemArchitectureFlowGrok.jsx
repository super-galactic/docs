"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  return (
    <div style={{ margin: "40px 0" }}>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes arrowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .node {
          fill: #ffffff;
          stroke: #c4b5fd;
          stroke-width: 3;
          filter: drop-shadow(0 8px 20px rgba(139,92,246,0.4));
          rx: 20;
          ry: 20;
        }
        .node-icon {
          font-size: 28px;
        }
        .node-title {
          font-weight: 700;
          font-size: 20px;
          fill: #1e1b4b;
        }
        .node-subtitle {
          font-size: 15px;
          fill: #6b7280;
        }
        .connector {
          fill: none;
          stroke: rgba(139,92,246,0.3);
          stroke-width: 5;
        }
        .connector-active {
          stroke: url(#gradActive);
          stroke-width: 6;
          filter: url(#glow);
        }
        .dashline {
          stroke: url(#gradActive);
          stroke-width: 6;
          stroke-dasharray: 12 18;
          animation: dash 4s linear infinite;
        }
        .arrowhead {
          fill: #c4b5fd;
          animation: arrowPulse 2s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          borderRadius: "32px",
          padding: "48px",
          background: "radial-gradient(circle at top left, #6366f1 0%, #8b5cf6 30%, #4c1d95 100%)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg viewBox="0 0 1280 720" width="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gradActive" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c4b5fd"/>
              <stop offset="50%" stopColor="#a78bfa"/>
              <stop offset="100%" stopColor="#818cf8"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <marker id="arrow" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,12 L12,6 z" className="arrowhead"/>
            </marker>
          </defs>

          {/* Background subtle dots */}
          <g opacity="0.1">
            {Array.from({ length: 200 }).map((_, i) => (
              <circle key={i} cx={Math.random() * 1280} cy={Math.random() * 720} r="1" fill="#ffffff"/>
            ))}
          </g>

          {/* Nodes */}
          {/* Game Client */}
          <g transform="translate(140,360)">
            <rect x="-140" y="-180" width="280" height="360" className="node"/>
            <text x="0" y="-140" textAnchor="middle" className="node-title">Game Client (Unity)</text>
            <text x="0" y="-110" textAnchor="middle" className="node-subtitle">Gameplay Layer</text>
            <text x="-80" y="-50" className="node-subtitle">Missions and Combat</text>
            <text x="-80" y="0" className="node-subtitle">Progression and Upgrades</text>
            <text x="-80" y="50" className="node-subtitle">Rewards Generated</text>
            <text x="-80" y="100" className="node-subtitle">Local State Cache</text>
          </g>

          {/* Super Galactic Hub */}
          <g transform="translate(640,360)">
            <rect x="-160" y="-220" width="320" height="440" className="node"/>
            <text x="0" y="-180" textAnchor="middle" className="node-title">Super Galactic Hub</text>
            <text x="0" y="-150" textAnchor="middle" className="node-subtitle">Application Layer</text>
            <text x="-80" y="-80" className="node-subtitle">Sync Router</text>
            <text x="-80" y="-30" className="node-subtitle">Asset Manager</text>
            <text x="-80" y="20" className="node-subtitle">UAP Balance</text>
            <text x="-80" y="70" className="node-subtitle">Claim Service</text>
            <text x="-80" y="120" className="node-subtitle">Breeding and NFT Actions</text>
          </g>

          {/* Blockchain Layer */}
          <g transform="translate(1140,360)">
            <rect x="-140" y="-180" width="280" height="360" className="node"/>
            <text x="0" y="-140" textAnchor="middle" className="node-title">Blockchain Layer</text>
            <text x="0" y="-110" textAnchor="middle" className="node-subtitle">On-Chain Settlement</text>
            <text x="-80" y="-50" className="node-subtitle">Tx Verification</text>
            <text x="-80" y="0" className="node-subtitle">UAP Token Contract</text>
            <text x="-80" y="50" className="node-subtitle">NFT Ownership Contract</text>
            <text x="-80" y="100" className="node-subtitle">Burn Execution</text>
            <text x="-80" y="150" className="node-subtitle">Treasury Flows</text>
            <text x="0" y="200" textAnchor="middle" fontSize="14" fill="#e0d8ff">
              Ethereum (origin) · BNB + Avalanche (gameplay)
            </text>
          </g>

          {/* Connectors with animated flowing arrows */}
          {/* Reward flow: Client → Hub */}
          <path d="M 280 360 Q 480 200, 480 360" className="connector-active" markerEnd="url(#arrow)">
            <animate attributeName="stroke-dashoffset" from="30" to="-30" dur="3s" repeatCount="indefinite"/>
          </path>
          <path d="M 280 360 Q 480 200, 480 360" className="dashline"/>

          {/* Claim / Spending: Hub → Blockchain */}
          <path d="M 800 360 Q 1000 200, 1000 360" className="connector-active" markerEnd="url(#arrow)">
            <animate attributeName="stroke-dashoffset" from="30" to="-30" dur="3.5s" repeatCount="indefinite"/>
          </path>
          <path d="M 800 360 Q 1000 200, 1000 360" className="dashline"/>

          {/* Sync back: Blockchain → Hub */}
          <path d="M 1000 400 Q 800 600, 640 400" className="connector-active" markerEnd="url(#arrow)">
            <animate attributeName="stroke-dashoffset" from="30" to="-30" dur="4s" repeatCount="indefinite"/>
          </path>
          <path d="M 1000 400 Q 800 600, 640 400" className="dashline"/>

          {/* Sync back: Hub → Client */}
          <path d="M 480 400 Q 280 600, 140 400" className="connector-active" markerEnd="url(#arrow)">
            <animate attributeName="stroke-dashoffset" from="30" to="-30" dur="3.2s" repeatCount="indefinite"/>
          </path>
          <path d="M 480 400 Q 280 600, 140 400" className="dashline"/>
        </svg>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "24px", color: "#e0d8ff", fontStyle: "italic" }}>
            Animated flow lines show data movement across the ecosystem
          </p>
          <p style={{ fontSize: "18px", color: "#c4b5fd", marginTop: "12px" }}>
            Reward generation → Claiming → Spending/Burn → Asset sync (continuous loop)
          </p>
        </div>
      </div>
    </div>
  );
};