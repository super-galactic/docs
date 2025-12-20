"use client";
import React from "react";

export const GameplayFlywheelChart = () => {
  const W = 920;
  const H = 620;

  const cx = 460;
  const cy = 360; // wheel stays exactly where it is

  const ringR = 255;
  const nodeR = 82;

  const nodes = [
    { a: -90, title: "Missions", sub: "Earn UAP by playing" },
    { a: -25, title: "Spend UAP", sub: "Upgrades + progression" },
    { a: 25, title: "Auto Burn", sub: "Supply reduces via usage" },
    { a: 90, title: "Scarcity", sub: "Higher value per UAP" },
    { a: 155, title: "Better Rewards", sub: "More reasons to play" },
    { a: -155, title: "More Players", sub: "Engagement increases" },
  ].map((n) => {
    const rad = (n.a * Math.PI) / 180;
    return { ...n, x: cx + ringR * Math.cos(rad), y: cy + ringR * Math.sin(rad) };
  });

  const arc = (a1, a2) => {
    const rad1 = (a1 * Math.PI) / 180;
    const rad2 = (a2 * Math.PI) / 180;
    const x1 = cx + ringR * Math.cos(rad1);
    const y1 = cy + ringR * Math.sin(rad1);
    const x2 = cx + ringR * Math.cos(rad2);
    const y2 = cy + ringR * Math.sin(rad2);
    const largeArc = Math.abs(a2 - a1) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${ringR} ${ringR} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  return (
    <div style={{ marginTop: 16, marginBottom: 24 }}>
      <style>{`
        @keyframes sgDash { to { stroke-dashoffset: -680; } }
        @keyframes sgFlow { to { stroke-dashoffset: -520; } }
        @keyframes sgPulse { 0%,100% { transform: scale(1); opacity: .99; } 50% { transform: scale(1.03); opacity: 1; } }
        @keyframes sgHalo { 0%,100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.08); opacity: .78; } }
      `}</style>

      <div
        style={{
          border: "1px solid rgba(34,211,238,.18)",
          borderRadius: 16,
          padding: 10,
          background:
            "radial-gradient(1200px 760px at 50% 18%, rgba(34,211,238,.10), transparent 58%), linear-gradient(180deg, rgba(2,6,23,.60), rgba(2,6,23,.25))",
          boxShadow: "0 0 0 1px rgba(34,211,238,.06) inset",
        }}
      >
        <div style={{ width: "100%", height: 680 }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMin meet"
          >
            <defs>
              <linearGradient id="sgCyan" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#22d3ee" />
                <stop offset="1" stopColor="#0ea5e9" />
              </linearGradient>
              <linearGradient id="sgBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>

              <filter id="sgGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="
                    0 0 0 0 0.13
                    0 0 0 0 0.83
                    0 0 0 0 0.93
                    0 0 0 .8 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="sgTextShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2.2" floodColor="rgba(0,0,0,.72)" />
              </filter>
            </defs>

            {/* TOP TITLE — now truly in the red zone */}
            <g filter="url(#sgTextShadow)">
              <text x={cx} y={6} textAnchor="middle" fill="#e5e7eb" fontSize="30" fontWeight="950">
                Super Galactic Flywheel
              </text>
              <text x={cx} y={28} textAnchor="middle" fill="rgba(229,231,235,.92)" fontSize="17" fontWeight="750">
                Activity → Spend → Burn → Scarcity → Stronger Incentives
              </text>
              <text x={cx} y={48} textAnchor="middle" fill="rgba(229,231,235,.78)" fontSize="14" fontWeight="550">
                Growth strengthens the economy instead of diluting it
              </text>
            </g>

            {/* Everything below remains unchanged */}
            {/* (grid, rings, arcs, nodes, core) */}
            {/* ... existing code continues exactly as before ... */}

          </svg>
        </div>
      </div>
    </div>
  );
};
