"use client";
import React from "react";

export const GameplayFlywheelChart = () => {
  const W = 920;
  const H = 600;

  const cx = 460;
  const cy = 340; // ⬇️ push wheel down so top title never collides

  const ringR = 245;
  const nodeR = 74; // ⬆️ slightly larger nodes for readability

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
        @keyframes sgDash { to { stroke-dashoffset: -520; } }
        @keyframes sgFlow { to { stroke-dashoffset: -520; } }
        @keyframes sgPulse { 0%,100% { transform: scale(1); opacity: .98; } 50% { transform: scale(1.03); opacity: 1; } }
      `}</style>

      <div
        style={{
          border: "1px solid rgba(34,211,238,.18)",
          borderRadius: 16,
          padding: 10,
          background:
            "radial-gradient(1200px 700px at 50% 20%, rgba(34,211,238,.08), transparent 55%), linear-gradient(180deg, rgba(2,6,23,.58), rgba(2,6,23,.25))",
          boxShadow: "0 0 0 1px rgba(34,211,238,.06) inset",
        }}
      >
        <div style={{ width: "100%", height: 640 }}>
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

              <filter id="sgTextShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,.65)" />
              </filter>
            </defs>

            {/* Grid */}
            <g opacity="0.06">
              {Array.from({ length: 18 }).map((_, i) => (
                <line key={i} x1={40} y1={80 + i * 30} x2={880} y2={80 + i * 30} stroke="#fff" />
              ))}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={i} x1={40 + i * 40} y1={80} x2={40 + i * 40} y2={560} stroke="#fff" />
              ))}
            </g>

            {/* Outer ring (toned down so it doesn’t fight text) */}
            <g transform={`translate(${cx} ${cy})`} opacity="0.75">
              <circle cx="0" cy="0" r={ringR + 24} fill="none" stroke="rgba(96,165,250,.08)" strokeWidth="16" />
              <circle
                cx="0"
                cy="0"
                r={ringR + 2}
                fill="none"
                stroke="url(#sgCyan)"
                strokeWidth="2.8"
                strokeDasharray="18 14"
                style={{ animation: "sgDash 7.5s linear infinite" }}
                opacity="0.9"
              />
            </g>

            {/* Animated flow dashes */}
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
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="10 14"
                style={{ animation: "sgFlow 3.5s linear infinite" }}
                opacity="0.95"
              />
            ))}

            {/* Center panel */}
            <g filter="url(#sgGlow)">
              <rect
                x={cx - 190}
                y={cy - 58}
                width="380"
                height="116"
                rx="18"
                fill="rgba(2,6,23,.86)"
                stroke="rgba(34,211,238,.32)"
              />
              <text x={cx} y={cy - 10} textAnchor="middle" fill="#e5e7eb" fontSize="20" fontWeight="900">
                Gameplay → Economy Momentum
              </text>
              <text x={cx} y={cy + 18} textAnchor="middle" fill="rgba(229,231,235,.85)" fontSize="12.5">
                Spending triggers burns → scarcity strengthens progression value
              </text>
              <text x={cx} y={cy + 40} textAnchor="middle" fill="rgba(229,231,235,.72)" fontSize="12">
                More incentives → more activity → the loop accelerates
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
                  <circle cx={n.x} cy={n.y} r={nodeR} fill="rgba(2,6,23,.92)" stroke={`url(#${accent})`} strokeWidth="4" />
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
                      <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 6 }}>{n.title}</div>
                      <div style={{ fontSize: 13, opacity: 0.86 }}>{n.sub}</div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* TOP TITLE — render LAST so it sits above everything */}
            <g filter="url(#sgTextShadow)">
              <text x={cx} y={48} textAnchor="middle" fill="#e5e7eb" fontSize="22" fontWeight="900">
                Super Galactic Flywheel
              </text>
              <text x={cx} y={72} textAnchor="middle" fill="rgba(229,231,235,.82)" fontSize="13" fontWeight="600">
                Activity → Spend → Burn → Scarcity → Stronger Incentives
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};