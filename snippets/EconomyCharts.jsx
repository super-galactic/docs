"use client";
import React from "react";

export const GameplayFlywheelChart = () => {
  const W = 920;
  const H = 620;

  const cx = 460;
  const cy = 360; // gives room for title + keeps wheel centered

  // Bigger + readable
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
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
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

            {/* Softer grid (less distracting) */}
            <g opacity="0.045">
              {Array.from({ length: 18 }).map((_, i) => (
                <line key={i} x1={40} y1={90 + i * 30} x2={880} y2={90 + i * 30} stroke="#fff" />
              ))}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={i} x1={40 + i * 40} y1={90} x2={40 + i * 40} y2={590} stroke="#fff" />
              ))}
            </g>

            {/* Outer “halo” ring */}
            <circle
              cx={cx}
              cy={cy}
              r={ringR + 28}
              fill="none"
              stroke="rgba(96,165,250,.08)"
              strokeWidth="18"
              opacity="0.9"
            />

            {/* Animated dashed ring (the ----- that moves) */}
            <circle
              cx={cx}
              cy={cy}
              r={ringR + 4}
              fill="none"
              stroke="url(#sgCyan)"
              strokeWidth="3.2"
              strokeDasharray="22 16"
              style={{ animation: "sgDash 6.8s linear infinite" }}
              opacity="0.95"
            />

            {/* Animated flow arcs */}
            {[
              [-90, -25],
              [-25, 25],
              [25, 90],
              [90, 155],
              [155, 205],
              [205, 270],
            ].map(([a1, a2], i) => (
              <path
                key={i}
                d={arc(a1, a2)}
                fill="none"
                stroke="url(#sgBlue)"
                strokeWidth="4.2"
                strokeLinecap="round"
                strokeDasharray="12 16"
                style={{ animation: "sgFlow 3.2s linear infinite" }}
                opacity="0.95"
              />
            ))}

            {/* Center “energy core” instead of rectangle */}
            <g filter="url(#sgGlow)">
              <circle cx={cx} cy={cy} r="26" fill="rgba(34,211,238,.18)" />
              <circle cx={cx} cy={cy} r="10" fill="rgba(34,211,238,.65)" />
              <circle
                cx={cx}
                cy={cy}
                r="40"
                fill="none"
                stroke="rgba(34,211,238,.22)"
                strokeWidth="2"
                style={{ animation: "sgHalo 2.6s ease-in-out infinite" }}
              />
            </g>

            {/* Nodes */}
            {nodes.map((n, idx) => {
              const accent = idx % 2 === 0 ? "sgCyan" : "sgBlue";
              const boxW = nodeR * 2 - 18;
              const boxH = nodeR * 2 - 18;

              return (
                <g
                  key={idx}
                  filter="url(#sgGlow)"
                  style={{
                    animation: "sgPulse 3.6s ease-in-out infinite",
                    animationDelay: `${idx * 0.14}s`,
                  }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={nodeR}
                    fill="rgba(2,6,23,.95)"
                    stroke={`url(#${accent})`}
                    strokeWidth="5"
                  />

                  <foreignObject x={n.x - boxW / 2} y={n.y - boxH / 2} width={boxW} height={boxH}>
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#e5e7eb",
                        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
                        lineHeight: 1.18,
                        userSelect: "none",
                        filter: "drop-shadow(0 2px 3px rgba(0,0,0,.65))",
                        padding: 6,
                      }}
                    >
                      <div style={{ fontWeight: 950, fontSize: 18, marginBottom: 7 }}>{n.title}</div>
                      <div style={{ fontSize: 14, opacity: 0.9 }}>{n.sub}</div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* TOP TITLE ONLY — moved to bottom so it always renders on top */}
            <g filter="url(#sgTextShadow)">
              <text
                x={cx}
                y={24}
                textAnchor="middle"
                fill="#e5e7eb"
                fontSize="26"
                fontWeight="950"
              >
                Super Galactic Flywheel
              </text>
            
              <text
                x={cx}
                y={46}
                textAnchor="middle"
                fill="rgba(229,231,235,.9)"
                fontSize="15"
                fontWeight="700"
              >
                Activity → Spend → Burn → Scarcity → Stronger Incentives
              </text>
            
              <text
                x={cx}
                y={66}
                textAnchor="middle"
                fill="rgba(229,231,235,.75)"
                fontSize="13"
                fontWeight="500"
              >
                Growth strengthens the economy instead of diluting it
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
