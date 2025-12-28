"use client";
import React from "react";

export const SuperGalacticArchitectureFlow = () => {
  const flows = {
    reward: {
      label: "Reward flow",
      steps: [
        { desc: "Player completes mission in the Game Client", nodes: { game: true }, paths: [] },
        { desc: "UAP reward is generated off chain", nodes: { game: true }, paths: [] },
        { desc: "Reward data is sent to the Super Galactic Hub", nodes: { game: true, hub: true }, paths: ["game-hub"] },
        { desc: "UAP appears as claimable balance in the Hub", nodes: { hub: true }, paths: [] }
      ]
    },
    claim: {
      label: "Claim flow",
      steps: [
        { desc: "Player claims UAP via the Hub", nodes: { hub: true }, paths: [] },
        { desc: "Claim triggers an on chain transaction", nodes: { hub: true, chain: true }, paths: ["hub-chain"] },
        { desc: "Blockchain confirms transaction", nodes: { chain: true }, paths: [] },
        { desc: "UAP balance updates across systems", nodes: { chain: true, hub: true }, paths: ["chain-hub"] }
      ]
    },
    spending: {
      label: "Spending & burn flow",
      steps: [
        { desc: "Player spends UAP (upgrade, breeding, progression)", nodes: { game: true }, paths: [] },
        { desc: "Spend action triggers automated burn and treasury allocation", nodes: { game: true, hub: true }, paths: ["game-hub"] },
        { desc: "Blockchain state updates", nodes: { hub: true, chain: true }, paths: ["hub-chain"] },
        { desc: "Updated asset state syncs back to Hub and Game Client", nodes: { chain: true, hub: true, game: true }, paths: ["chain-hub", "hub-game"] }
      ]
    },
    asset: {
      label: "Asset synchronisation flow",
      steps: [
        { desc: "Upgrades performed in game", nodes: { game: true }, paths: [] },
        { desc: "NFT stats and evolution update in Hub", nodes: { game: true, hub: true }, paths: ["game-hub"] },
        { desc: "Breeding initiated in Hub", nodes: { hub: true }, paths: [] },
        { desc: "Resulting NFT state reflects in Game Client", nodes: { hub: true, game: true }, paths: ["hub-game"] }
      ]
    }
  };

  const [selectedFlow, setSelectedFlow] = React.useState("reward");
  const [stepIndex, setStepIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [selectedFlow]);

  React.useEffect(() => {
    if (playing === false) return;

    const interval = setInterval(() => {
      setStepIndex((idx) => {
        const max = flows[selectedFlow].steps.length - 1;
        if (idx < max) return idx + 1;
        setPlaying(false);
        return idx;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [playing, selectedFlow]);

  const currentFlow = flows[selectedFlow];
  const currentStep = currentFlow.steps[stepIndex];

  const isNodeActive = (name) => Boolean(currentStep.nodes && currentStep.nodes[name]);
  const isPathActive = (name) => Array.isArray(currentStep.paths) && currentStep.paths.includes(name);

  return (
    <div className="w-full flex flex-col gap-6 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        {Object.keys(flows).map((key) => (
          <button
            key={key}
            onClick={() => {
              if (selectedFlow === key) {
                setStepIndex(0);
                setPlaying(true);
              } else {
                setSelectedFlow(key);
                setPlaying(true);
              }
            }}
            className={`px-3 py-1.5 rounded-full transition-colors border text-xs md:text-sm ${
              selectedFlow === key
                ? "bg-purple-600 border-purple-600 text-white shadow-md"
                : "bg-transparent border-purple-700 text-purple-200 hover:bg-purple-900"
            }`}
          >
            {flows[key].label}
          </button>
        ))}
        <div className="flex-grow"></div>
        <button
          onClick={() => setPlaying((p) => (p ? false : true))}
          className="px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors bg-green-600 border-green-600 text-white hover:bg-green-700"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            setStepIndex(0);
            setPlaying(false);
          }}
          className="px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors bg-gray-600 border-gray-600 text-white hover:bg-gray-700"
        >
          Reset
        </button>
      </div>

      <div className="relative mt-2 p-6 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, #130a40, #1a114c)" }}>
        {isNodeActive("game") ? (
          <div className="absolute" style={{ left: "7%", top: "35%", width: "20%", height: "20%", background: "#7c3aed", filter: "blur(50px)", opacity: 0.35, borderRadius: "50%" }}></div>
        ) : null}
        {isNodeActive("hub") ? (
          <div className="absolute" style={{ left: "40%", top: "35%", width: "20%", height: "20%", background: "#7c3aed", filter: "blur(50px)", opacity: 0.35, borderRadius: "50%" }}></div>
        ) : null}
        {isNodeActive("chain") ? (
          <div className="absolute" style={{ left: "73%", top: "35%", width: "20%", height: "20%", background: "#7c3aed", filter: "blur(50px)", opacity: 0.35, borderRadius: "50%" }}></div>
        ) : null}

        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className={`flex flex-col items-center w-1/3 px-4 py-5 border rounded-xl shadow-md transition-colors ${isNodeActive("game") ? "bg-purple-700 border-purple-500" : "bg-purple-900 border-purple-800"}`}>
            <IconGame active={isNodeActive("game")} />
            <h3 className={`mb-3 font-semibold text-center ${isNodeActive("game") ? "text-white" : "text-purple-200"}`}>Game Client</h3>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li className={isNodeActive("game") ? "text-purple-100" : "text-purple-400"}>Player gameplay</li>
              <li className={isNodeActive("game") ? "text-purple-100" : "text-purple-400"}>Missions and combat</li>
              <li className={isNodeActive("game") ? "text-purple-100" : "text-purple-400"}>Progression and upgrades</li>
              <li className={isNodeActive("game") ? "text-purple-100" : "text-purple-400"}>Reward generation</li>
            </ul>
          </div>

          <div className={`flex flex-col items-center w-1/3 px-4 py-5 border rounded-xl shadow-md transition-colors ${isNodeActive("hub") ? "bg-purple-700 border-purple-500" : "bg-purple-900 border-purple-800"}`}>
            <IconHub active={isNodeActive("hub")} />
            <h3 className={`mb-3 font-semibold text-center ${isNodeActive("hub") ? "text-white" : "text-purple-200"}`}>Super Galactic Hub</h3>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li className={isNodeActive("hub") ? "text-purple-100" : "text-purple-400"}>Unified application layer</li>
              <li className={isNodeActive("hub") ? "text-purple-100" : "text-purple-400"}>Asset management</li>
              <li className={isNodeActive("hub") ? "text-purple-100" : "text-purple-400"}>UAP balance visibility</li>
              <li className={isNodeActive("hub") ? "text-purple-100" : "text-purple-400"}>Reward claiming</li>
              <li className={isNodeActive("hub") ? "text-purple-100" : "text-purple-400"}>Breeding and NFT actions</li>
              <li className={isNodeActive("hub") ? "text-purple-100" : "text-purple-400"}>Progression and stat visibility</li>
            </ul>
          </div>

          <div className={`flex flex-col items-center w-1/3 px-4 py-5 border rounded-xl shadow-md transition-colors ${isNodeActive("chain") ? "bg-purple-700 border-purple-500" : "bg-purple-900 border-purple-800"}`}>
            <IconChain active={isNodeActive("chain")} />
            <h3 className={`mb-3 font-semibold text-center ${isNodeActive("chain") ? "text-white" : "text-purple-200"}`}>Blockchain Layer</h3>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li className={isNodeActive("chain") ? "text-purple-100" : "text-purple-400"}>UAP token contracts</li>
              <li className={isNodeActive("chain") ? "text-purple-100" : "text-purple-400"}>NFT ownership contracts</li>
              <li className={isNodeActive("chain") ? "text-purple-100" : "text-purple-400"}>Burn execution</li>
              <li className={isNodeActive("chain") ? "text-purple-100" : "text-purple-400"}>Treasury flows</li>
              <li className={isNodeActive("chain") ? "text-purple-100" : "text-purple-400"}>Transaction verification</li>
              <li className="text-purple-500 italic text-[10px] mt-1">Ethereum (origin) / BNB + Avalanche (gameplay)</li>
            </ul>
          </div>
        </div>

        <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="static-arrow" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0 0 L6 3 L0 6 z" fill="#a78bfa" />
            </marker>
          </defs>

          {[
            { id: "game-hub", d: "M20 40 C 30 35 35 35 45 40" },
            { id: "hub-game", d: "M45 60 C 35 65 30 65 20 60" },
            { id: "hub-chain", d: "M55 40 C 65 35 70 35 80 40" },
            { id: "chain-hub", d: "M80 60 C 70 65 65 65 55 60" }
          ].map((cfg) => (
            <AnimatedConnector key={cfg.id} d={cfg.d} active={isPathActive(cfg.id)} />
          ))}
        </svg>
      </div>

      <div className="px-4">
        <div className="mb-1 text-purple-300">Step {stepIndex + 1} of {currentFlow.steps.length}</div>
        <div className="text-purple-100 text-base italic">{currentStep.desc}</div>
      </div>
    </div>
  );
};

function AnimatedConnector({ d, active }) {
  const pathRef = React.useRef(null);
  const dotRef = React.useRef(null);
  const animationRef = React.useRef(null);

  React.useEffect(() => {
    const pathEl = pathRef.current;
    const dotEl = dotRef.current;
    if (pathEl === null || dotEl === null) return;

    const length = pathEl.getTotalLength();
    let startTime;

    function animate(time) {
      if (startTime === undefined) startTime = time;
      const progress = Math.min((time - startTime) / 1500, 1);
      const point = pathEl.getPointAtLength(progress * length);
      dotEl.setAttribute("cx", String(point.x));
      dotEl.setAttribute("cy", String(point.y));
      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    }

    if (active) {
      dotEl.style.display = "block";
      animationRef.current = requestAnimationFrame(animate);
    } else {
      dotEl.style.display = "none";
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [active, d]);

  return (
    <g>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={active ? "#c084fc" : "rgba(255,255,255,0.2)"}
        strokeWidth="1.5"
        markerEnd="url(#static-arrow)"
        style={{ transition: "stroke 0.3s ease" }}
      />
      <circle
        ref={dotRef}
        cx="0"
        cy="0"
        r="1.6"
        fill="#f5d0fe"
        style={{ display: "none", filter: "drop-shadow(0 0 4px #c084fc)" }}
      />
    </g>
  );
}

function IconGame({ active }) {
  const stroke = active ? "#ffffff" : "#a78bfa";
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
      <rect x="3" y="7" width="18" height="10" rx="3" ry="3"></rect>
      <line x1="8" y1="12" x2="10" y2="12"></line>
      <line x1="9" y1="11" x2="9" y2="13"></line>
      <circle cx="15.5" cy="11.5" r="1"></circle>
      <circle cx="17.5" cy="12.5" r="1"></circle>
    </svg>
  );
}

function IconHub({ active }) {
  const stroke = active ? "#ffffff" : "#a78bfa";
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
      <circle cx="12" cy="12" r="3.5"></circle>
      <ellipse cx="12" cy="12" rx="8" ry="3.5"></ellipse>
      <path d="M5 12c0 4 3 7 7 7"></path>
    </svg>
  );
}

function IconChain({ active }) {
  const stroke = active ? "#ffffff" : "#a78bfa";
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
      <rect x="3" y="3" width="6" height="6" rx="1"></rect>
      <rect x="15" y="3" width="6" height="6" rx="1"></rect>
      <rect x="9" y="15" width="6" height="6" rx="1"></rect>
      <path d="M9 6h6"></path>
      <path d="M12 9v6"></path>
    </svg>
  );
}
