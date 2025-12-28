"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  return (
    <div style={{ margin: "40px 0" }}>
      <style>{`
        @keyframes flowDash {
          to { stroke-dashoffset: -30; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .table-box {
          fill: #1e1e1e;
          stroke: #00ff00;
          stroke-width: 1;
          rx: 4;
          filter: url(#tableGlow);
        }
        .table-header {
          fill: #00ff00;
          font-size: 18px;
          font-weight: bold;
        }
        .field-text {
          fill: #cccccc;
          font-size: 14px;
        }
        .relation-line {
          fill: none;
          stroke: #00ff00;
          stroke-width: 3;
          marker-mid: url(#cardinality);
          opacity: 0.6;
        }
        .animated-dash {
          stroke-dasharray: 10 20;
          animation: flowDash 3s linear infinite;
          stroke: #00ff00;
          stroke-width: 4;
        }
      `}</style>

      <div
        style={{
          borderRadius: "16px",
          padding: "32px",
          background: "linear-gradient(to bottom, #0a0a0a, #1a1a1a)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg viewBox="0 0 1200 600" width="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="tableGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <marker id="cardinality" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="none" stroke="#00ff00" stroke-width="2" />
            </marker>
          </defs>

          {/* Game Client Table */}
          <g transform="translate(100,150)">
            <rect width="280" height="240" className="table-box"/>
            <text x="140" y="30" textAnchor="middle" className="table-header">Game Client (Unity)</text>
            <line x1="0" y1="40" x2="280" y2="40" stroke="#00ff00" stroke-width="1"/>
            <text x="20" y="60" className="field-text">• Missions and Combat</text>
            <text x="20" y="90" className="field-text">• Progression and Upgrades</text>
            <text x="20" y="120" className="field-text">• Rewards Generated</text>
            <text x="20" y="150" className="field-text">• Local State Cache</text>
            <text x="140" y="210" textAnchor="middle" className="field-text">Gameplay Layer</text>
          </g>

          {/* Super Galactic Hub Table */}
          <g transform="translate(450,100)">
            <rect width="280" height="300" className="table-box"/>
            <text x="140" y="30" textAnchor="middle" className="table-header">Super Galactic Hub</text>
            <line x1="0" y1="40" x2="280" y2="40" stroke="#00ff00" stroke-width="1"/>
            <text x="20" y="60" className="field-text">• Sync Router</text>
            <text x="20" y="90" className="field-text">• Asset Manager</text>
            <text x="20" y="120" className="field-text">• UAP Balance</text>
            <text x="20" y="150" className="field-text">• Claim Service</text>
            <text x="20" y="180" className="field-text">• Breeding and NFT Actions</text>
            <text x="140" y="270" textAnchor="middle" className="field-text">Application Layer</text>
          </g>

          {/* Blockchain Layer Table */}
          <g transform="translate(800,150)">
            <rect width="280" height="240" className="table-box"/>
            <text x="140" y="30" textAnchor="middle" className="table-header">Blockchain Layer</text>
            <line x1="0" y1="40" x2="280" y2="40" stroke="#00ff00" stroke-width="1"/>
            <text x="20" y="60" className="field-text">• Tx Verification</text>
            <text x="20" y="90" className="field-text">• UAP Token Contract</text>
            <text x="20" y="120" className="field-text">• NFT Ownership Contract</text>
            <text x="20" y="150" className="field-text">• Burn Execution</text>
            <text x="20" y="180" className="field-text">• Treasury Flows</text>
            <text x="140" y="210" textAnchor="middle" className="field-text">On-Chain Settlement</text>
            <text x="140" y="230" textAnchor="middle" fontSize="12" fill="#cccccc">Ethereum (origin) + BNB/Avalanche (gameplay)</text>
          </g>

          {/* Animated Relations */}
          {/* Client to Hub */}
          <path d="M 380 300 Q 580 200, 450 300" className="relation-line" markerMid="url(#cardinality)" />
          <path d="M 380 300 Q 580 200, 450 300" className="animated-dash" />
          <text x="480" y="220" textAnchor="middle" fill="#00ff00" fontSize="14">reward data (1:n)</text>

          {/* Hub to Blockchain */}
          <path d="M 730 300 Q 930 200, 800 300" className="relation-line" markerMid="url(#cardinality)" />
          <path d="M 730 300 Q 930 200, 800 300" className="animated-dash" />
          <text x="830" y="220" textAnchor="middle" fill="#00ff00" fontSize="14">claim/spend (1:n)</text>

          {/* Blockchain to Hub */}
          <path d="M 800 340 Q 600 440, 730 340" className="relation-line" markerMid="url(#cardinality)" />
          <path d="M 800 340 Q 600 440, 730 340" className="animated-dash" />
          <text x="700" y="420" textAnchor="middle" fill="#00ff00" fontSize="14">confirmed (n:1)</text>

          {/* Hub to Client */}
          <path d="M 450 340 Q 250 440, 380 340" className="relation-line" markerMid="url(#cardinality)" />
          <path d="M 450 340 Q 250 440, 380 340" className="animated-dash" />
          <text x="350" y="420" textAnchor="middle" fill="#00ff00" fontSize="14">sync (n:1)</text>
        </svg>

        <div style={{ marginTop: "32px", textAlign: "center", color: "#00ff00" }}>
          <p style={{ fontSize: "24px", fontStyle: "italic" }}>
            Animated flow lines show data movement across the ecosystem
          </p>
          <p style={{ fontSize: "18px", color: "#cccccc" }}>
            Reward generation → Claiming → Spending/Burn → Asset sync (continuous loop)
          </p>
        </div>
      </div>
    </div>
  );
};