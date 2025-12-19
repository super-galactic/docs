"use client";
import React from "react";

export const GameplayFlywheelChart = () => {
  const W = 920;
  const H = 520;
  const cx = 460;
  const cy = 270;

  // Tuned for readability + spacing
  const ringR = 220;  // push nodes outward
  const nodeR = 58;   // slightly smaller nodes for center clarity

  const nodes = [
    { a: -90,  title: "Missions",       sub: "Earn UAP by playing" },
    { a: -25,  title: "Spend UAP",      sub: "Upgrades + progression" },
    { a:  25,  title: "Auto Burn",      sub: "Supply reduces via usage" },
    { a:  90,  title: "Scarcity",       sub: "Higher value per UAP" },
    { a: 155,  title: "Better Rewards", sub: "More reasons to play" },
    { a: -155, title: "More Players",   sub: "Engagement increases" },
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
        @keyframes sgSpin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes sgDash { to { stroke-dashoffset: -240; } }
        @keyframes sgPulse { 0%,100% { transform: scale(1); opacity: .97; } 50% { transform: scale(1.03); opacity: 1; } }
      `}</style>

      <div
        style={{
          border: "1px solid rgba(34,211,238,.18)",
          borderRadius: 16,
          padding: 18,
          background:
            "radial-gradient(1200px 600px at 50% 30%, rgba(34,211,238,.08), transparent 55%), linear-gradient(180deg, rgba(2,6,23,.55), rgba(2,6,23,.25))",
          boxShadow: "0 0 0 1px rgba(34,211,238,.06) inset",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>
          The Gameplay Flywheel
        </div>

        <div style={{ opacity: 0.78, marginBottom: 14, lineHeight: 1.45 }}>
          A self-reinforcing loop where <b>activity increases demand</b> and{" "}
          <b>automatic burns reduce circulating supply</b>.
        </div>

        <div style={{ width: "100%", height: 520 }}>
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

              {/* Glow for shapes */}
              <filter id="sgGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="
                    0 0 0 0 0.13
                    0 0 0 0 0.83
                    0 0 0 0 0.93
                    0 0 0 .7 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Subtle text shadow for readability */}
              <filter id="sgTextShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,.65)" />
              </filter>

              {/* BIGGER arrow marker so it’s visible */}
              <marker
                id="sgArrow"
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="10"
                markerHeight="10"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M 0 0 L 12 6 L 0 12 z" fill="rgba(34,211,238,.95)" />
              </marker>
            </defs>

            {/* Dimmer grid (readability) */}
            <g opacity="0.06">
              {Array.from({ length: 15 }).map((_, i) => (
                <line key={i} x1={40} y1={40 + i * 30} x2={880} y2={40 + i * 30} stroke="#fff" />
              ))}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={i} x1={40 + i * 40} y1={40} x2={40 + i * 40} y2={480} stroke="#fff" />
              ))}
            </g>

            {/* Outer ring */}
            <g transform={`translate(${cx} ${cy})`} opacity="0.9">
              <g style={{ transformOrigin: "0px 0px", animation: "sgSpin 28s linear infinite" }}>
                <circle
                  cx="0"
                  cy="0"
                  r={ringR}
                  fill="none"
                  stroke="rgba(34,211,238,.18)"
                  strokeWidth="2"
                  strokeDasharray="16 12"
                  style={{ animation: "sgDash 8s linear infinite" }}
                />
                <circle
                  cx="0"
                  cy="0"
                  r={ringR + 18}
                  fill="none"
                  stroke="rgba(96,165,250,.10)"
                  strokeWidth="12"
                />
              </g>
            </g>

            {/* FLOW ARCS (draw ABOVE ring so arrows show) */}
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
                stroke="rgba(34,211,238,.75)"
                strokeWidth="3.5"
                strokeLinecap="round"
                markerEnd="url(#sgArrow)"
              />
            ))}

            {/* Center panel (more contrast) */}
            <g filter="url(#sgGlow)">
              <rect
                x={cx - 190}
                y={cy - 68}
                width="380"
                height="136"
                rx="18"
                fill="rgba(2,6,23,.86)"
                stroke="rgba(34,211,238,.38)"
              />
              <text x={cx} y={cy - 18} textAnchor="middle" fill="#e5e7eb" fontSize="26" fontWeight="900" filter="url(#sgTextShadow)">
                Super Galactic Flywheel
              </text>
              <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(229,231,235,.9)" fontSize="13" filter="url(#sgTextShadow)">
                Activity → Spend → Burn → Scarcity → Stronger Incentives
              </text>
              <text x={cx} y={cy + 38} textAnchor="middle" fill="rgba(229,231,235,.78)" fontSize="12" filter="url(#sgTextShadow)">
                Growth strengthens the economy instead of diluting it
              </text>
            </g>

            {/* Nodes (darker fill + bigger text) */}
            {nodes.map((n, idx) => {
              const accent = idx % 2 === 0 ? "sgCyan" : "sgBlue";
              const boxW = nodeR * 2 - 14;
              const boxH = nodeR * 2 - 14;

              return (
                <g
                  key={idx}
                  filter="url(#sgGlow)"
                  style={{ animation: "sgPulse 3.6s ease-in-out infinite", animationDelay: `${idx * 0.14}s` }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={nodeR}
                    fill="rgba(2,6,23,.92)"
                    stroke={`url(#${accent})`}
                    strokeWidth="3.5"
                  />

                  {/* Wrapped text INSIDE circles */}
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
                        lineHeight: 1.15,
                        userSelect: "none",
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,.55))",
                      }}
                    >
                      <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 5 }}>{n.title}</div>
                      <div style={{ fontSize: 11.5, opacity: 0.82 }}>{n.sub}</div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Footer (moved up so it doesn’t clip) */}
            <text x="40" y="492" fill="rgba(229,231,235,.65)" fontSize="12" filter="url(#sgTextShadow)">
              Note: UAP supply is capped (no unlimited minting). Circulating supply is managed by sinks + automatic burns.
            </text>
          </svg>
        </div>
      </div>