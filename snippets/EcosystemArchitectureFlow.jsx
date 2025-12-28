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
  // Define the flows and their step sequences. Each step contains a
  // description and a map of highlighted elements: the nodes to
  // highlight and any arrows to animate.
  const flows = {
    reward: {
      label: "Reward flow",
      steps: [
        {
          desc: "Player completes mission in Game Client",
          highlight: { game: true }
        },
        {
          desc: "UAP reward is generated off chain",
          highlight: { game: true }
        },
        {
          desc: "Reward data is sent to the Super Galactic Hub",
          highlight: { game: true, arrow: "game-hub" }
        },
        {
          desc: "UAP appears as claimable balance in Hub",
          highlight: { hub: true }
        }
      ]
    },
    claim: {
      label: "Claim flow",
      steps: [
        {
          desc: "Player claims UAP via the Hub",
          highlight: { hub: true }
        },
        {
          desc: "Claim triggers on‑chain transaction",
          highlight: { hub: true, arrow: "hub-chain" }
        },
        {
          desc: "Blockchain confirms transaction",
          highlight: { chain: true }
        },
        {
          desc: "UAP balance updates across systems",
          highlight: { chain: true, arrow: "chain-hub", hub: true }
        }
      ]
    },
    spending: {
      label: "Spending & burn flow",
      steps: [
        {
          desc: "Player spends UAP (upgrade, breeding, progression)",
          highlight: { game: true }
        },
        {
          desc: "Spend action triggers automated burn and treasury allocation",
          highlight: { game: true, arrow: "game-hub" }
        },
        {
          desc: "Blockchain state updates",
          highlight: { hub: true, arrow: "hub-chain", chain: true }
        },
        {
          desc: "Updated asset state syncs back to Hub and Game Client",
          highlight: { chain: true, arrow: "chain-hub", hub: true, arrow2: "hub-game" }
        }
      ]
    },
    asset: {
      label: "Asset synchronisation flow",
      steps: [
        {
          desc: "Upgrades performed in game",
          highlight: { game: true }
        },
        {
          desc: "NFT stats and evolution update in Hub",
          highlight: { game: true, arrow: "game-hub", hub: true }
        },
        {
          desc: "Breeding initiated in Hub",
          highlight: { hub: true }
        },
        {
          desc: "Resulting NFT state reflects in Game Client",
          highlight: { hub: true, arrow: "hub-game", game: true }
        }
      ]
    }
  };

  const [selectedFlow, setSelectedFlow] = useState("reward");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // When the selected flow changes, reset to the first step and stop
  // playback.
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [selectedFlow]);

  // Auto advance through the steps when playing is true. The interval
  // clears itself when the component unmounts or when playback stops.
  useEffect(() => {
    if (!playing) return;
    const currentFlow = flows[selectedFlow];
    const interval = setInterval(() => {
      setStepIndex((idx) => {
        if (idx < currentFlow.steps.length - 1) {
          return idx + 1;
        } else {
          // Stop at the last step and reset playing
          setPlaying(false);
          return idx;
        }
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [playing, selectedFlow]);

  const currentFlow = flows[selectedFlow];
  const currentStep = currentFlow.steps[stepIndex];

  // Helper to decide whether a specific arrow should be active. We map
  // secondary arrow names (arrow2) to their actual target. This allows
  // multiple arrows in one step.
  const isArrowActive = (name) => {
    if (!currentStep || !currentStep.highlight) return false;
    return currentStep.highlight.arrow === name || currentStep.highlight.arrow2 === name;
  };

  return (
    <div className="flex flex-col items-stretch gap-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        {Object.keys(flows).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedFlow(key)}
            className={`px-3 py-1 rounded-md border text-sm transition-all ${
              selectedFlow === key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {flows[key].label}
          </button>
        ))}
        <button
          onClick={() => setPlaying(!playing)}
          className="px-3 py-1 rounded-md border text-sm bg-green-600 text-white border-green-600 hover:bg-green-700 ml-auto"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            setStepIndex(0);
            setPlaying(false);
          }}
          className="px-3 py-1 rounded-md border text-sm bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Diagram */}
      <div className="relative mt-4 flex items-stretch justify-between px-2">
        {/* Game Client Node */}
        <div
          className={`relative w-1/3 p-4 border rounded-lg transition-colors ${
            currentStep.highlight?.game ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="font-semibold mb-2">Game Client (Unity)</h3>
          <ul className="text-sm leading-relaxed list-disc list-inside space-y-0.5">
            <li>Player gameplay</li>
            <li>Missions and combat</li>
            <li>Progression & upgrades</li>
            <li>Reward generation</li>
          </ul>
        </div>

        {/* Super Galactic Hub Node */}
        <div
          className={`relative w-1/3 p-4 border rounded-lg transition-colors ${
            currentStep.highlight?.hub ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="font-semibold mb-2">Super Galactic Hub</h3>
          <ul className="text-sm leading-relaxed list-disc list-inside space-y-0.5">
            <li>Unified application layer</li>
            <li>Asset management</li>
            <li>UAP balance & rewards</li>
            <li>Breeding & NFT actions</li>
            <li>Progression & stats</li>
          </ul>
        </div>

        {/* Blockchain Layer Node */}
        <div
          className={`relative w-1/3 p-4 border rounded-lg transition-colors ${
            currentStep.highlight?.chain ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="font-semibold mb-2">Blockchain Layer</h3>
          <ul className="text-sm leading-relaxed list-disc list-inside space-y-0.5">
            <li>UAP token & NFT contracts</li>
            <li>Burn & treasury flows</li>
            <li>Transaction verification</li>
            <li>Multi‑chain support</li>
          </ul>
        </div>

        {/* Arrow: Game → Hub */}
        <div
          className={`absolute left-[16.66%] top-[50%] h-px bg-gray-300 overflow-hidden transform -translate-y-1/2 ${
            isArrowActive("game-hub") ? "bg-blue-400" : ""
          }`}
          style={{ width: isArrowActive("game-hub") ? "33.33%" : "0%", transition: "width 0.6s ease" }}
        >
          {/* Arrow head */}
          <div
            className="absolute right-0 -top-1 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent"
            style={{ borderLeftColor: isArrowActive("game-hub") ? "#60a5fa" : "transparent" }}
          ></div>
        </div>

        {/* Arrow: Hub → Game */}
        <div
          className={`absolute right-[16.66%] top-[60%] h-px bg-gray-300 overflow-hidden transform -translate-y-1/2 ${
            isArrowActive("hub-game") ? "bg-blue-400" : ""
          }`}
          style={{ width: isArrowActive("hub-game") ? "33.33%" : "0%", transition: "width 0.6s ease" }}
        >
          <div
            className="absolute left-0 -top-1 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent"
            style={{ borderRightColor: isArrowActive("hub-game") ? "#60a5fa" : "transparent" }}
          ></div>
        </div>

        {/* Arrow: Hub → Chain */}
        <div
          className={`absolute left-[50%] top-[50%] h-px bg-gray-300 overflow-hidden transform -translate-y-1/2 ${
            isArrowActive("hub-chain") ? "bg-blue-400" : ""
          }`}
          style={{ width: isArrowActive("hub-chain") ? "33.33%" : "0%", transition: "width 0.6s ease" }}
        >
          <div
            className="absolute right-0 -top-1 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent"
            style={{ borderLeftColor: isArrowActive("hub-chain") ? "#60a5fa" : "transparent" }}
          ></div>
        </div>

        {/* Arrow: Chain → Hub */}
        <div
          className={`absolute right-[50%] top-[60%] h-px bg-gray-300 overflow-hidden transform -translate-y-1/2 ${
            isArrowActive("chain-hub") ? "bg-blue-400" : ""
          }`}
          style={{ width: isArrowActive("chain-hub") ? "33.33%" : "0%", transition: "width 0.6s ease" }}
        >
          <div
            className="absolute left-0 -top-1 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent"
            style={{ borderRightColor: isArrowActive("chain-hub") ? "#60a5fa" : "transparent" }}
          ></div>
        </div>
      </div>

      {/* Step description */}
      <div className="mt-6 text-sm">
        <div className="font-medium text-gray-700 mb-1">Step {stepIndex + 1} of {currentFlow.steps.length}</div>
        <div className="text-gray-800 italic">{currentStep.desc}</div>
      </div>
    </div>
  );
};