"use client";
import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Globe, Blocks } from "lucide-react";

export const SuperGalacticArchitectureFlow = () => {
  const [selectedFlow, setSelectedFlow] = useState("reward");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);
  const pulseProgressRef = useRef(0);

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

  const startAnimation = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    pulseProgressRef.current = 0;
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const playFlow = () => {
    stopAnimation();
    startAnimation();
  };

  const resetFlow = () => {
    stopAnimation();
    setCurrentStep(0);
    pulseProgressRef.current = 0;
  };

  useEffect(() => {
    if (isPlaying) {
      let startTime = null;
      const stepDuration = 3000; // 3s per step
      const pulseSpeed = 0.3; // fraction per second

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        const stepIndex = Math.floor(elapsed / stepDuration);
        if (stepIndex >= totalSteps) {
          stopAnimation();
          setCurrentStep(totalSteps);
          return;
        }

        setCurrentStep(stepIndex + 1);

        const stepElapsed = elapsed % stepDuration;
        pulseProgressRef.current = (stepElapsed / stepDuration) * pulseSpeed;

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      pulseProgressRef.current = 0;
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, totalSteps]);

  const isHighlighted = (id) => {
    if (currentStep === 0) return false;
    const step = flow.steps[currentStep - 1];
    return step.highlight.includes(id);
  };

  const getActivePathId = () => {
    if (currentStep === 0) return null;
    const step = flow.steps[currentStep - 1];
    if (step.highlight.includes("path1")) return "path1";
    if (step.highlight.includes("path2")) return "path2";
    return null;
  };

  const activePathId = getActivePathId();

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
        }
        .connector.inactive {
          stroke: rgba(148, 163, 184, 0.1);
        }
        .pulse-circle {
          filter: drop-shadow(0 0 10px #60a5fa);
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
        }
      `}</style>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {Object.keys(flows).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedFlow(key);
              stopAnimation();
              resetFlow();
              startAnimation();
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
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
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
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <path
            id="path1"
            d="M 25% 45% Q 50% 20%, 75% 45%"
            className={`connector ${activePathId === "path1" ? "active" : "inactive"}`}
            markerEnd="url(#arrow)"
          />
          <path
            id="path2"
            d="M 25% 55% Q 50% 80%, 75% 55%"
            className={`connector ${activePathId === "path2" ? "active" : "inactive"}`}
            markerEnd="url(#arrow)"
          />

          {activePathId && (
            <PulseOnPath pathId={activePathId} progress={pulseProgressRef.current} />
          )}
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className={`node-card ${isHighlighted("left") ? "highlighted" : ""}`}>
            <div className="flex items-center gap-4 mb-4">
              <Gamepad2 size={40} className="text-blue-400" />
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
              <Globe size={40} className="text-blue-400" />
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
              <Blocks size={40} className="text-blue-400" />
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

const PulseOnPath = ({ pathId, progress }) => {
  const pathRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (pathRef.current && progress > 0) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      const point = path.getPointAtLength(progress * length);
      setPosition({ x: point.x, y: point.y });
    } else {
      setPosition({ x: -100, y: -100 }); // hide when not active
    }
  }, [progress]);

  return (
    <>
      <path ref={pathRef} id={pathId} d={pathId === "path1" ? "M 25% 45% Q 50% 20%, 75% 45%" : "M 25% 55% Q 50% 80%, 75% 55%"} opacity="0" />
      <circle cx={position.x} cy={position.y} r="10" fill="#60a5fa" className="pulse-circle">
        <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.6;1" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx={position.x} cy={position.y} r="6" fill="#ffffff" />
    </>
  );
};