"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  return (
    <div style={{ margin: "40px 0" }}>
      <style>{`
        @keyframes dashTravel {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulseGlow {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        .glass-container {
          fill: rgba(25, 15, 55, 0.7);
          stroke: rgba(139, 92, 246, 0.4);
          stroke-width: 2;
          filter: url(#glow);
        }
        .micro-node {
          fill: rgba(50, 30, 100, 0.8);
          stroke: rgba(167, 139, 250, 0.3);
          rx: 16;
          ry: 16;
        }
        .node-active {
          stroke: #c4b5fd;
          stroke-width: 3;
          filter: url(#nodeGlow);
        }
        .path-inactive {
          stroke: rgba(139, 92, 246, 0.15);
          stroke-width: 4;
        }
        .path-active {
          stroke: url(#pathGrad);
          stroke-width: 6;
          filter: url(#glow);
        }
        .travel-dot {
          animation: dashTravel 2s linear forwards;
        }
      `}</style>

      <div
        style={{
          borderRadius: "32px",
          padding: "40px",
          background: "radial-gradient(ellipse at top, #2a1a4a 0%, #0f0b1e 80%)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8), inset 0 0 160px rgba(0,0,0,0.6)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "40px", fontWeight: "800", color: "#e0d8ff", marginBottom: "60px" }}>
          Super Galactic Architecture Flow
        </h2>

        <svg viewBox="0 0 1200 800" width="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa"/>
              <stop offset="100%" stopColor="#60a5fa"/>
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur"/>
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
          </defs>

          {/* Global paths (inactive base) */}
          <path d="M 300 300 Q 600 100, 900 300" className="path-inactive"/>
          <path d="M 300 400 Q 600 600, 900 400" className="path-inactive"/>
          <path d="M 900 350 Q 600 150, 300 350" className="path-inactive"/>
          <path d="M 900 450 Q 600 650, 300 450" className="path-inactive"/>

          {/* Example animated path - Reward flow: Client -> Hub */}
          <path d="M 300 300 Q 600 100, 900 300" className="path-active">
            <animate attributeName="stroke-dasharray" values="0,1000;10,990" dur="8s" repeatCount="indefinite"/>
          </path>
          <circle cx="0" cy="0" r="12" fill="#e0d8ff" filter="url(#nodeGlow)">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 300 300 Q 600 100, 900 300"/>
          </circle>
          <circle cx="0" cy="0" r="24" fill="none" stroke="#c4b5fd" strokeWidth="6" opacity="0.6">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 300 300 Q 600 100, 900 300"/>
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>

          {/* Containers */}
          <g transform="translate(200,200)">
            <rect x="0" y="0" width="300" height="400" rx="32" className="glass-container"/>
            <text x="150" y="-40" textAnchor="middle" fill="#a78bfa" fontSize="24" fontWeight="700">Gameplay Layer</text>
            <text x="150" y="-10" textAnchor="middle" fill="#e0d8ff" fontSize="32" fontWeight="800">Game Client (Unity)</text>
            {/* Micro nodes left */}
            <rect x="40" y="40" width="220" height="60" className="micro-node node-active"/>
            <text x="150" y="80" textAnchor="middle" fill="#e0d8ff" fontSize="18">Missions and Combat</text>
            <rect x="40" y="120" width="220" height="60" className="micro-node"/>
            <text x="150" y="160" textAnchor="middle" fill="#e0d8ff" fontSize="18">Progression and Upgrades</text>
            <rect x="40" y="200" width="220" height="60" className="micro-node node-active"/>
            <text x="150" y="240" textAnchor="middle" fill="#e0d8ff" fontSize="18">Rewards Generated</text>
            <rect x="40" y="280" width="220" height="60" className="micro-node"/>
            <text x="150" y="320" textAnchor="middle" fill="#e0d8ff" fontSize="18">Local State Cache</text>
          </g>

          <g transform="translate(500,150)">
            <rect x="0" y="0" width="340" height="500" rx="36" className="glass-container"/>
            <text x="170" y="-50" textAnchor="middle" fill="#a78bfa" fontSize="26" fontWeight="700">Application Layer</text>
            <text x="170" y="-15" textAnchor="middle" fill="#e0d8ff" fontSize="36" fontWeight="800">Super Galactic Hub</text>
            {/* Center nodes */}
            <rect x="60" y="40" width="220" height="60" className="micro-node"/>
            <text x="170" y="80" textAnchor="middle" fill="#e0d8ff" fontSize="18">Sync Router</text>
            <rect x="60" y="120" width="220" height="60" className="micro-node"/>
            <text x="170" y="160" textAnchor="middle" fill="#e0d8ff" fontSize="18">Asset Manager</text>
            <rect x="60" y="200" width="220" height="60" className="micro-node node-active"/>
            <text x="170" y="240" textAnchor="middle" fill="#e0d8ff" fontSize="18">UAP Balance</text>
            <rect x="60" y="280" width="220" height="60" className="micro-node"/>
            <text x="170" y="320" textAnchor="middle" fill="#e0d8ff" fontSize="18">Claim Service</text>
            <rect x="60" y="360" width="220" height="60" className="micro-node"/>
            <text x="170" y="400" textAnchor="middle" fill="#e0d8ff" fontSize="18">Breeding and NFT Actions</text>
          </g>

          <g transform="translate(800,200)">
            <rect x="0" y="0" width="300" height="400" rx="32" className="glass-container"/>
            <text x="150" y="-40" textAnchor="middle" fill="#a78bfa" fontSize="24" fontWeight="700">On-Chain Settlement</text>
            <text x="150" y="-10" textAnchor="middle" fill="#e0d8ff" fontSize="32" fontWeight="800">Blockchain Layer</text>
            <text x="150" y="440" textAnchor="middle" fill="#c4b5fd" fontSize="16">Ethereum (origin) and BNB + Avalanche (gameplay)</text>
            {/* Right nodes */}
            <rect x="40" y="40" width="220" height="60" className="micro-node"/>
            <text x="150" y="80" textAnchor="middle" fill="#e0d8ff" fontSize="18">Tx Verification</text>
            <rect x="40" y="120" width="220" height="60" className="micro-node"/>
            <text x="150" y="160" textAnchor="middle" fill="#e0d8ff" fontSize="18">UAP Token Contract</text>
            <rect x="40" y="200" width="220" height="60" className="micro-node"/>
            <text x="150" y="240" textAnchor="middle" fill="#e0d8ff" fontSize="18">NFT Ownership Contract</text>
            <rect x="40" y="280" width="220" height="60" className="micro-node"/>
            <text x="150" y="320" textAnchor="middle" fill="#e0d8ff" fontSize="18">Burn Execution</text>
            <rect x="40" y="360" width="220" height="60" className="micro-node"/>
            <text x="150" y="400" textAnchor="middle" fill="#e0d8ff" fontSize="18">Treasury Flows</text>
          </g>
        </svg>

        <div style={{ marginTop: "40px", fontSize: "24px", color: "#c4b5fd", fontStyle: "italic" }}>
          Reward flow example: Missions → Rewards Generated → Sync to Hub (animated path and glowing dot)
        </div>
        <div style={{ marginTop: "12px", fontSize: "18px", color: "#a78bfa" }}>
          The diagram auto-animates on load with smooth traveling glow and node highlights.
        </div>
      </div>
    </div>
  );
};