"use client";
import React from "react";

export function GameplayFlywheelChart() {
  return (
    <div style={{ marginTop: 16, marginBottom: 24 }}>
      <style>{`
        @keyframes sgSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sgPulse { 0%,100% { transform: scale(1); opacity: .95; } 50% { transform: scale(1.04); opacity: 1; } }
        @keyframes sgDash { to { stroke-dashoffset: -120; } }
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
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>
          The Gameplay Flywheel
        </div>

        <div style={{ width: "100%", height: 520 }}>
          <svg viewBox="0 0 920 520" width="100%" height="100%">
            <defs>
              <linearGradient id="sgCyan" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="1" stopColor="#0ea5e9" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="sgBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#60a5fa" stopOpacity="1" />
                <stop offset="1" stopColor="#22d3ee" stopOpacity="1" />
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

              <marker id="sgArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(34,211,238,.85)" />
              </marker>
            </defs>

            {/* Background grid */}
            <g opacity="0.08">
              {Array.from({ length: 15 }).map((_, i) => (
                <line key={i} x1={40} y1={40 + i * 30} x2={880} y2={40 + i * 30} stroke="#ffffff" />
              ))}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={i} x1={40 + i * 40} y1={40} x2={40 + i * 40} y2={480} stroke="#ffffff" />
              ))}
            </g>

            {/* Spin ring */}
            <g transform="translate(460 270)">
              <g style={{ transformOrigin: "0px 0px", animation: "sgSpin 20s linear infinite" }}>
                <circle
                  cx="0"
                  cy="0"
                  r="168"
                  fill="none"
                  stroke="rgba(34,211,238,.25)"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  style={{ animation: "sgDash 6s linear infinite" }}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="194"
                  fill="none"
                  stroke="rgba(96,165,250,.12)"
                  strokeWidth="10"
                />
              </g>
            </g>

            {/* Curved arrows */}
            <path d="M 460 108 C 560 118, 640 160, 690 230" fill="none" stroke="rgba(34,211,238,.55)" strokeWidth="3" markerEnd="url(#sgArrow)" />
            <path d="M 720 270 C 720 355, 680 415, 600 440" fill="none" stroke="rgba(34,211,238,.55)" strokeWidth="3" markerEnd="url(#sgArrow)" />
            <path d="M 510 455 C 420 465, 340 440, 300 390" fill="none" stroke="rgba(34,211,238,.55)" strokeWidth="3" markerEnd="url(#sgArrow)" />
            <path d="M 270 330 C 245 265, 250 210, 290 170" fill="none" stroke="rgba(34,211,238,.55)" strokeWidth="3" markerEnd="url(#sgArrow)" />
            <path d="M 340 120 C 390 100, 425 96, 460 100" fill="none" stroke="rgba(34,211,238,.55)" strokeWidth="3" markerEnd="url(#sgArrow)" />

            {/* Center card */}
            <g filter="url(#sgGlow)">
              <rect x="330" y="210" width="260" height="120" rx="18" fill="rgba(2,6,23,.78)" stroke="rgba(34,211,238,.35)" />
              <text x="460" y="252" textAnchor="middle" fill="#e5e7eb" fontSize="22" fontWeight="800">
                Super Galactic Flywheel
              </text>
              <text x="460" y="282" textAnchor="middle" fill="rgba(229,231,235,.8)" fontSize="13">
                Activity → Spend → Burn → Scarcity → Stronger Incentives
              </text>
              <text x="460" y="306" textAnchor="middle" fill="rgba(229,231,235,.7)" fontSize="12">
                Growth strengthens the economy instead of diluting it
              </text>
            </g>

            {/* Nodes */}
            {[
              { x: 460, y: 90,  title: "Missions", sub: "Earn UAP by playing", accent: "sgCyan" },
              { x: 700, y: 230, title: "Spend UAP", sub: "Upgrades + progression", accent: "sgBlue" },
              { x: 720, y: 350, title: "Auto Burn", sub: "Supply reduces via usage", accent: "sgCyan" },
              { x: 540, y: 455, title: "Scarcity", sub: "Higher value per UAP", accent: "sgBlue" },
              { x: 260, y: 340, title: "Better Rewards", sub
