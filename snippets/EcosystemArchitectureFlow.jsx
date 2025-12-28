"use client";
import React, { useState, useEffect } from "react";

const GamepadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <line x1="7" y1="9" x2="7" y2="9"/>
    <line x1="17" y1="9" x2="17" y2="9"/>
    <line x1="9" y1="15" x2="9" y2="15"/>
    <line x1="15" y1="15" x2="15" y2="15"/>
    <line x1="8" y1="12" x2="10" y2="12"/>
    <line x1="14" y1="12" x2="16" y2="12"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1 -4 10 15.3 15.3 0 0 1 -4 -10 15.3 15.3 0 0 1 4 -10z"/>
  </svg>
);

const BlocksIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <rect width="7" height="7" x="14" y="3" rx="1"/>
    <rect width="7" height="7" x="14" y="14" rx="1"/>
    <rect width="7" height="7" x="3" y="3" rx="1"/>
    <rect width="7" height="7" x="3" y="14" rx="1"/>
  </svg>
);

export const SuperGalacticArchitectureFlow = () => {
  const [selectedFlow, setSelectedFlow] = useState("reward");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const flows = {
    reward: {
      name: "Reward flow",
      steps: [
        { desc: "Mission completed in Game Client", highlight: ["left"] },
        { desc: "UAP reward generated off chain", highlight: ["left"] },
        { desc: "Reward data sent to Hub", highlight: ["left", "center", "path1"] },
        { desc: "UAP appears as claimable balance", highlight: ["center"] },
      ],
    },
    claim: {
      name: "Claim flow",
      steps: [
        { desc: "Player claims via Hub", highlight: ["center"] },
        { desc: "Claim triggers on chain transaction", highlight: ["center", "right", "path2"] },
        { desc: "Chain confirms", highlight: ["right"] },
        { desc: "UAP balance updates across systems", highlight: ["left", "center", "right"] },
      ],
    },
    spending: {
      name: "Spending and burn flow",
      steps: [
        { desc: "Player spends UAP in Game Client or Hub action", highlight: ["left", "center"] },
        { desc: "Spend triggers burn + treasury allocation", highlight: ["center", "right", "path2"] },
        { desc: "Chain state updates", highlight: ["right"] },
        { desc: "Updated state syncs back to Hub and Game Client", highlight: ["left", "center", "right"] },
      ],
    },
    asset: {
      name: "Asset synchronisation flow",
      steps: [
        { desc: "Upgrades performed in game", highlight: ["left"] },
        { desc: "NFT stats and evolution update in Hub", highlight: ["left", "center", "path1"] },
        { desc: "Breeding initiated in Hub", highlight: ["center"] },
        { desc: "Resulting NFT state reflects in Game Client", highlight: ["left", "center", "path1"] },
      ],
    },
  };

  const flow = flows[selectedFlow];
  const totalSteps = flow.steps.length;

  const playFlow = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex += 1;
      setCurrentStep(stepIndex);
      if (stepIndex >= totalSteps) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 3000);
  };

  const resetFlow = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const isHighlighted = (id) => {
    if (currentStep === 0) return false;
    const step = flow.steps[currentStep - 1];
    return step.highlight.includes(id);
  };

  const activePath = () => {
    if (currentStep === 0) return null;
    const step = flow.steps[currentStep - 1];
    if (step.highlight.includes("path1")) return "path1";
    if (step.highlight.includes("path2")) return "path2";
    return null;
  };

  const dashOffset = isPlaying && activePath() ? 200 - (Date.now() % 3000) / 3000 * 200 : 200;

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <style jsx>{`
        .diagram-container {
          background: linear-gradient(to bottom, #0f172a, #1e293b);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }
        .vignette {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.6);
          pointer-events: none;
        }
        .node-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          transition: all 0.4s ease;
        }
        .node-card.highlighted {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
          border-color: rgba(59, 130, 246, 0.5);
          background: rgba(30, 41, 59, 0.8);
        }
        .connector {
          stroke: rgba(148, 163, 184, 0.3);
          stroke-width: 3;
          fill: none;
          transition: stroke 0.4s ease;
        }
        .connector.active {
          stroke: #60a5fa;
          stroke-width: 4;
          filter: drop-shadow(0 0 8px #60a5fa);
        }
        .connector.inactive {
          stroke: rgba(148, 163, 184, 0.1);
        }
        .pulse {
          stroke: #60a5fa;
          stroke-width: 5;
          fill: none;
          stroke-dasharray: 10 190;
        }
        .step-info {
          background: rgba(30, 41, 59, 0.7);
          border-radius: 0.75rem;
          padding: 1rem;
          margin-top: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }
        @media (prefers-color-scheme: light) {
          .diagram-container {
            background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
          }
          .node-card {
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(100, 100, 100, 0.2);
          }
          .connector {
            stroke: rgba(100, 100, 100, 0.4);
          }
          .connector.active {
            stroke: #3b82f6;
          }
          .pulse {
            stroke: #3b82f6;
          }
        }
      `}</style>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {Object.keys(flows).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedFlow(key);
              resetFlow();
              playFlow();
            }}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              selectedFlow === key
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-200 hover:bg-slate-600"
            }`}
          >
            {flows[key].name}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={playFlow}
          disabled={isPlaying}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
        >
          Play
        </button>
        <button
          onClick={resetFlow}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition"
        >
          Reset
        </button>
      </div>

      <div className="diagram-container relative">
        <div className="vignette"></div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          <path
            d="M 25% 45% Q 50% 20%, 75% 45%"
            className={`connector ${activePath() === "path1" ? "active" : "inactive"}`}
            markerEnd="url(#arrow)"
          />
          <path
            d="M 25% 55% Q 50% 80%, 75% 55%"
            className={`connector ${activePath() === "path2" ? "active" : "inactive"}`}
            markerEnd="url(#arrow)"
          />

          {activePath() && (
            <path
              d={activePath() === "path1" ? "M 25% 45% Q 50% 20%, 75% 45%" : "M 25% 55% Q 50% 80%, 75% 55%"}
              className="pulse"
              style={{ strokeDashoffset: dashOffset }}
            >
              <animate attributeName="stroke-dashoffset" values="200;0" dur="3s" repeatCount="indefinite" />
            </path>
          )}
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className={`node-card ${isHighlighted("left") ? "highlighted" : ""}`}>
            <div className="flex items-center gap-4 mb-4">
              <GamepadIcon />
              <h3 className="text-xl font-bold text-white">Game Client (Unity)</h3>
            </div>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• Player gameplay</li>
              <li>• Missions and combat</li>
              <li>• Progression and upgrades</li>
              <li>• Reward generation</li>
            </ul>
          </div>

          <div className={`node-card ${isHighlighted("center") ? "highlighted" : ""}`}>
            <div className="flex items-center gap-4 mb-4">
              <GlobeIcon />
              <h3 className="text-xl font-bold text-white">Super Galactic Hub</h3>
            </div>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• Unified application layer</li>
              <li>• Asset management</li>
              <li>• UAP balance visibility</li>
              <li>• Reward claiming</li>
              <li>• Breeding and NFT actions</li>
            </ul>
          </div>

          <div className={`node-card ${isHighlighted("right") ? "highlighted" : ""}`}>
            <div className="flex items-center gap-4 mb-4">
              <BlocksIcon />
              <h3 className="text-xl font-bold text-white">Blockchain Layer</h3>
            </div>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• UAP token contracts</li>
              <li>• NFT ownership contracts</li>
              <li>• Burn execution</li>
              <li>• Treasury flows</li>
              <li>• Transaction verification</li>
            </ul>
            <p className="text-xs text-slate-400 mt-4">
              Ethereum (origin chain), BNB + Avalanche (gameplay chains)
            </p>
          </div>
        </div>

        <div className="step-info text-center text-white mt-12">
          {currentStep > 0 ? (
            <>
              <p className="text-sm opacity-80">Step {currentStep} of {totalSteps}</p>
              <p className="text-lg italic mt-2">{flow.steps[currentStep - 1].desc}</p>
            </>
          ) : (
            <p className="text-lg">Select a flow and press Play to start</p>
          )}
        </div>
      </div>
    </div>
  );
};