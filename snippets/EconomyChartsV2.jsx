"use client";
import React from "react";

export const GameplayFlywheelChart = () => {
  const W = 920;
  const H = 520;
  const cx = 460;
  const cy = 270;

  // Use more of the canvas
  const ringR = 235;
  const nodeR = 60;

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

  // Arc path on the ring
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

  // Manual arrowhead (triangle) placed at an angle on the ring.
  // This avoids SVG marker issues entirely.
  const ArrowHead = ({ angleDeg }) => {
    const a = (angleDeg * Math.PI) / 180;
    const x = cx + ringR * Math.cos(a);
    const y = cy + ringR * Math.sin(a);

    // Tangent direction (clockwise)
    const tx = -Math.sin(a);
    const ty = Math.cos(a);

    // Size of the arrowhead
    const len = 16;
    const wid = 10;

    // Tip points forward along tangent
    const tipX = x + tx * len;
    const tipY = y + ty * len;

    // Base center slightly behind
    const baseX = x - tx * 6;
    const baseY = y - ty * 6;

    // Normal vector for width
    const nx = Math.cos(a);
    const ny = Math.sin(a);

    const p1x = baseX + nx * wid;
    const p1y = baseY + ny * wid;
    const p2x = baseX - nx * wid;
    const p2y = baseY - ny * wid;

    return (
      <path
        d={`M ${tipX} ${tipY} L ${p1x} ${p1y} L ${p2x} ${p2y} Z`}
        fill="rgba(34,211,238,.95)"
        opacity="0.95"
      />
    );
  };

  return (
    <div style={{ marginTop: 16, marginBottom: 24 }}>
      <style>{`
        @keyframes sgSpin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes sgDash { to { stroke-dashoffset: -260; } }
        @keyframes sgPulse { 0%,100% { transform: scale(1); opacity: .97; } 50% { transform: scale(1.03); opacity: 1; } }
      `}</style>

      <div
        style={{
          border: "1px solid rgba(34,211,238,.18)",
          borderRadius: 16,
          padding: 10, // less padding = bigger graphic
          background:
            "radial-gradient(1200px 600px at 50% 30%, rgba(34,211,238,.08), transparent 55%), linear-gradient(180deg, rgba(2,6,23,.55), rgba(2,6,23,.25))",
          boxShadow: "0 0 0 1px rgba(34,211,238,.06) inset",
        }}
      >
        <div style={{ width: "100%", height: 560 }}>
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
            </defs>

            {/* Grid (slightly dim) */}
            <g opacity="0.06">
              {Array.from({ length: 15 }).map((_, i) => (
                <line key={i} x1={40} y1={40 + i * 30} x2={880} y2={40 + i * 30} stroke="#fff" />
              ))}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={i} x1={40 + i * 40} y1={40} x2={40 + i * 40} y2={480} stroke="#fff" />
              ))}
            </g>

            {/* Outer ring */}
            <g transform={`translate(${cx} ${cy})`} opacity="0.95">
              <g style={{ transformOrigin: "0px 0px", animation: "sgSpin 30s linear infinite" }}>
                <circle
                  cx="0"
                  cy="0"
                  r={ringR}
                  fill="none"
                  stroke="rgba(34,211,238,.18)"
                  strokeWidth="2"
                  strokeDasharray="16 12"
                  style={{ animation: "sgDash 9s linear infinite" }}
                />
                <circle
                  cx="0"
                  cy="0"
                  r={ringR + 20}
                  fill="none"
                  stroke="rgba(96,165,250,.10)"
                  strokeWidth="14"
                />
              </g>
            </g>

            {/* Flow arcs */}
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
                stroke="rgba(34,211,238,.78)"
                strokeWidth="3.6"
                strokeLinecap="round"
              />
            ))}

            {/* Manual arrowheads (placed mid-arc) */}
            {[-60, 0, 55, 120, 178, 238].map((ang, i) => (
              <ArrowHead key={i} angleDeg={ang} />
            ))}

            {/* Center panel */}
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
              <text x={cx} y={cy - 18} textAnchor="middle" fill="#e5e7eb" fontSize="26" fontWeight="900">
                Super Galactic Flywheel
              </text>
              <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(229,231,235,.90)" fontSize="13">
                Activity → Spend → Burn → Scarcity → Stronger Incentives
              </text>
              <text x={cx} y={cy + 38} textAnchor="middle" fill="rgba(229,231,235,.78)" fontSize="12">
                Growth strengthens the economy instead of diluting it
              </text>
            </g>

            {/* Nodes */}
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
          </svg>
        </div>
      </div>
    </div>
  );
};
