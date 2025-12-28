"use client";
import React, { useState, useEffect } from "react";

// This component renders a high‑level architecture flow diagram for the Super
// Galactic ecosystem. It showcases three core systems (Game Client,
// Super Galactic Hub and Blockchain Layer) and animates directional
// arrows to illustrate how data flows between them. Four different flows
// (reward, claim, spending/burn and asset synchronisation) can be toggled
// and played through step‑by‑step. Each flow is broken down into a
// sequence of steps defined in the `flows` object below.
//
// The diagram uses Tailwind CSS for styling. Arrows animate via CSS
// transitions: when a step requires an arrow, its corresponding bar
// expands from 0% to 100% width over a short duration. Cards change
// colour to indicate focus during each step. Feel free to adjust
// timings or colours to fit your documentation theme.
export const SuperGalacticArchitectureFlow = () => {
  /**
   * The definition of each flow. Every flow contains a human‑readable label
   * and an ordered list of steps. Each step describes what is happening
   * at that moment and which nodes and paths should be highlighted.
   */
  const flows = {
    reward: {
      label: "Reward flow",
      steps: [
        {
          desc: "Player completes mission in the Game Client",
          nodes: { game: true },
          paths: []
        },
        {
          desc: "UAP reward is generated off chain",
          nodes: { game: true },
          paths: []
        },
        {
          desc: "Reward data is sent to the Super Galactic Hub",
          nodes: { game: true, hub: true },
          paths: ["game-hub"]
        },
        {
          desc: "UAP appears as claimable balance in the Hub",
          nodes: { hub: true },
          paths: []
        }
      ]
    },
    claim: {
      label: "Claim flow",
      steps: [
        {
          desc: "Player claims UAP via the Hub",
          nodes: { hub: true },
          paths: []
        },
        {
          desc: "Claim triggers an on‑chain transaction",
          nodes: { hub: true, chain: true },
          paths: ["hub-chain"]
        },
        {
          desc: "Blockchain confirms transaction",
          nodes: { chain: true },
          paths: []
        },
        {
          desc: "UAP balance updates across systems",
          nodes: { chain: true, hub: true },
          paths: ["chain-hub"]
        }
      ]
    },
    spending: {
      label: "Spending & burn flow",
      steps: [
        {
          desc: "Player spends UAP (upgrade, breeding, progression)",
          nodes: { game: true },
          paths: []
        },
        {
          desc: "Spend action triggers automated burn and treasury allocation",
          nodes: { game: true, hub: true },
          paths: ["game-hub"]
        },
        {
          desc: "Blockchain state updates",
          nodes: { hub: true, chain: true },
          paths: ["hub-chain"]
        },
        {
          desc: "Updated asset state syncs back to Hub and Game Client",
          nodes: { chain: true, hub: true, game: true },
          paths: ["chain-hub", "hub-game"]
        }
      ]
    },
    asset: {
      label: "Asset synchronisation flow",
      steps: [
        {
          desc: "Upgrades performed in game",
          nodes: { game: true },
          paths: []
        },
        {
          desc: "NFT stats and evolution update in Hub",
          nodes: { game: true, hub: true },
          paths: ["game-hub"]
        },
        {
          desc: "Breeding initiated in Hub",
          nodes: { hub: true },
          paths: []
        },
        {
          desc: "Resulting NFT state reflects in Game Client",
          nodes: { hub: true, game: true },
          paths: ["hub-game"]
        }
      ]
    }
  };

  // State management for the currently selected flow, active step and
  // playback. When playing, steps auto‑advance every few seconds.
  const [selectedFlow, setSelectedFlow] = useState("reward");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Reset step and stop playing when the flow changes.
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [selectedFlow]);

  // Auto advance steps while playing. When the last step is reached
  // playback stops automatically.
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setStepIndex((idx) => {
        const max = flows[selectedFlow].steps.length - 1;
        if (idx < max) return idx + 1;
        setPlaying(false);
        return idx;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [playing, selectedFlow, flows]);

  // Extract the current step definition for convenience.
  const currentFlow = flows[selectedFlow];
  const currentStep = currentFlow.steps[stepIndex];

  // Determine if a given node or path should be highlighted.
  const isNodeActive = (name) => !!currentStep.nodes?.[name];
  const isPathActive = (name) => currentStep.paths?.includes(name);

  /**
   * Colours for active and inactive elements on the dark background. These
   * values can be adjusted to better align with your brand palette. The
   * palette uses light blue highlights against a dark purple gradient.
   */
  const colours = {
    nodeBgActive: "bg-[#20124d]", // deep purple for active nodes
    nodeBgInactive: "bg-[#110a2d]", // darker purple for inactive nodes
    nodeBorderActive: "border-[#5b35fc]", // violet border for active
    nodeBorderInactive: "border-[#262254]", // subtle border for inactive
    pathActive: "#7c3aed", // purple highlight for active path
    pathInactive: "rgba(255,255,255,0.25)", // faint white for inactive path
    textActive: "text-white",
    textInactive: "text-gray-400"
  };

  return (
    <div className="w-full flex flex-col gap-6 text-sm">
      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        {Object.keys(flows).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedFlow(key)}
            className={`px-3 py-1.5 rounded-full transition-colors border ${
              selectedFlow === key
                ? "bg-[#7c3aed] border-[#7c3aed] text-white shadow-md"
                : "bg-transparent border-[#423180] text-gray-300 hover:bg-[#2a215a]"
            }`}
          >
            {flows[key].label}
          </button>
        ))}
        <div className="flex-grow"></div>
        <button
          onClick={() => setPlaying(!playing)}
          className={
            playing
              ? "px-3 py-1.5 rounded-full bg-[#10b981] text-white border border-[#10b981] hover:bg-[#059669]"
              : "px-3 py-1.5 rounded-full bg-[#2563eb] text-white border border-[#2563eb] hover:bg-[#1d4ed8]"
          }
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            setStepIndex(0);
            setPlaying(false);
          }}
          className="px-3 py-1.5 rounded-full bg-[#374151] text-gray-200 border border-[#4b5563] hover:bg-[#4b5563] ml-2"
        >
          Reset
        </button>
      </div>

      {/* Diagram container with dark gradient background */}
      <div className="relative p-6 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, #120940, #1f113d)" }}>
        {/* Horizontal arrangement of nodes */}
        <div className="flex items-start justify-between relative z-10">
          {/* Game Node */}
          <div
            className={`flex flex-col items-center w-1/3 px-4 py-6 border rounded-xl transition-colors ${
              isNodeActive("game") ? `${colours.nodeBgActive} ${colours.nodeBorderActive}` : `${colours.nodeBgInactive} ${colours.nodeBorderInactive}`
            }`}
          >
            <div className="text-4xl mb-2">🎮</div>
            <h3 className={`mb-3 font-semibold text-center ${isNodeActive("game") ? colours.textActive : colours.textInactive}`}>Game Client</h3>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li className={isNodeActive("game") ? colours.textActive : colours.textInactive}>Player gameplay</li>
              <li className={isNodeActive("game") ? colours.textActive : colours.textInactive}>Missions & combat</li>
              <li className={isNodeActive("game") ? colours.textActive : colours.textInactive}>Progression & upgrades</li>
              <li className={isNodeActive("game") ? colours.textActive : colours.textInactive}>Reward generation</li>
            </ul>
          </div>

          {/* Hub Node */}
          <div
            className={`flex flex-col items-center w-1/3 px-4 py-6 border rounded-xl transition-colors ${
              isNodeActive("hub") ? `${colours.nodeBgActive} ${colours.nodeBorderActive}` : `${colours.nodeBgInactive} ${colours.nodeBorderInactive}`
            }`}
          >
            <div className="text-4xl mb-2">🪐</div>
            <h3 className={`mb-3 font-semibold text-center ${isNodeActive("hub") ? colours.textActive : colours.textInactive}`}>Super Galactic Hub</h3>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li className={isNodeActive("hub") ? colours.textActive : colours.textInactive}>Unified application layer</li>
              <li className={isNodeActive("hub") ? colours.textActive : colours.textInactive}>Asset management</li>
              <li className={isNodeActive("hub") ? colours.textActive : colours.textInactive}>UAP balance & rewards</li>
              <li className={isNodeActive("hub") ? colours.textActive : colours.textInactive}>Breeding & NFT actions</li>
              <li className={isNodeActive("hub") ? colours.textActive : colours.textInactive}>Progression & stats</li>
            </ul>
          </div>

          {/* Blockchain Node */}
          <div
            className={`flex flex-col items-center w-1/3 px-4 py-6 border rounded-xl transition-colors ${
              isNodeActive("chain") ? `${colours.nodeBgActive} ${colours.nodeBorderActive}` : `${colours.nodeBgInactive} ${colours.nodeBorderInactive}`
            }`}
          >
            <div className="text-4xl mb-2">⛓️</div>
            <h3 className={`mb-3 font-semibold text-center ${isNodeActive("chain") ? colours.textActive : colours.textInactive}`}>Blockchain Layer</h3>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li className={isNodeActive("chain") ? colours.textActive : colours.textInactive}>UAP token & NFT contracts</li>
              <li className={isNodeActive("chain") ? colours.textActive : colours.textInactive}>Burn & treasury flows</li>
              <li className={isNodeActive("chain") ? colours.textActive : colours.textInactive}>Transaction verification</li>
              <li className={isNodeActive("chain") ? colours.textActive : colours.textInactive}>Multi‑chain support</li>
            </ul>
          </div>
        </div>

        {/* SVG overlay for paths and arrows */}
        <svg className="absolute inset-0 pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0 0 L6 3 L0 6 z" fill={colours.pathActive} />
            </marker>
          </defs>
          {/* game → hub */}
          <path
            d="M20 40 L45 40"
            stroke={isPathActive("game-hub") ? colours.pathActive : colours.pathInactive}
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
            style={{ transition: "stroke 0.6s ease" }}
          />
          {/* hub → game */}
          <path
            d="M45 60 L20 60"
            stroke={isPathActive("hub-game") ? colours.pathActive : colours.pathInactive}
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
            style={{ transition: "stroke 0.6s ease" }}
          />
          {/* hub → chain */}
          <path
            d="M55 40 L80 40"
            stroke={isPathActive("hub-chain") ? colours.pathActive : colours.pathInactive}
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
            style={{ transition: "stroke 0.6s ease" }}
          />
          {/* chain → hub */}
          <path
            d="M80 60 L55 60"
            stroke={isPathActive("chain-hub") ? colours.pathActive : colours.pathInactive}
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
            style={{ transition: "stroke 0.6s ease" }}
          />
        </svg>

        {/* Subtle glow effect behind active node */}
        {/* We render a blurred circle behind whichever node is active to create a halo effect. */}
        {isNodeActive("game") && (
          <div className="absolute" style={{ left: "8%", top: "42%", width: "16%", height: "16%", background: "#7c3aed", filter: "blur(60px)", opacity: 0.4, borderRadius: "50%" }}></div>
        )}
        {isNodeActive("hub") && (
          <div className="absolute" style={{ left: "42%", top: "42%", width: "16%", height: "16%", background: "#7c3aed", filter: "blur(60px)", opacity: 0.4, borderRadius: "50%" }}></div>
        )}
        {isNodeActive("chain") && (
          <div className="absolute" style={{ left: "76%", top: "42%", width: "16%", height: "16%", background: "#7c3aed", filter: "blur(60px)", opacity: 0.4, borderRadius: "50%" }}></div>
        )}
      </div>

      {/* Step indicator and description */}
      <div className="px-4">
        <div className="mb-1 text-gray-300">Step {stepIndex + 1} of {currentFlow.steps.length}</div>
        <div className="text-gray-100 text-base italic">{currentStep.desc}</div>
      </div>
    </div>
  );
};