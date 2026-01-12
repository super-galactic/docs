"use client";
import React from "react";

export const UAPSupplyAllocationWaffle = () => {
  const data = [
    { label: "Play to Earn Economy", value: 50, color: "#34D399" },
    { label: "Liquidity and Listing", value: 25, color: "#38BDF8" },
    { label: "Ecosystem Growth", value: 15, color: "#A78BFA" },
    { label: "Team and Advisors", value: 5, color: "#FBBF24" },
    { label: "Development Fund", value: 5, color: "#FB7185" },
  ];

  const rows = 10;
  const cols = 10;

  // Build 100 cells, each cell is 1%
  const cells = [];
  for (const d of data) {
    for (let i = 0; i < d.value; i += 1) cells.push(d);
  }

  // Bottom-up fill
  const cellAt = (r, c) => {
    const bottomUpRow = rows - 1 - r;
    const idx = bottomUpRow * cols + c;
    return cells[idx];
  };

  const cell = 18;
  const gap = 4;
  const pad = 12;

  const svgW = pad * 2 + cols * cell + (cols - 1) * gap;
  const svgH = pad * 2 + rows * cell + (rows - 1) * gap;

  return (
    <div style={{ width: "100%", maxWidth: 380 }}>
      <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
        UAP Supply Allocation
      </div>

      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        role="img"
        aria-label="UAP supply allocation waffle chart. Each block represents 1 percent."
        style={{
          display: "block",
          borderRadius: 12,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const d = cellAt(r, c);
            const x = pad + c * (cell + gap);
            const y = pad + r * (cell + gap);

            return (
              <rect
                key={`${r}-${c}`}
                x={x}
                y={y}
                width={cell}
                height={cell}
                rx={4}
                fill={d ? d.color : "transparent"}
                stroke="rgba(255,255,255,0.12)"
              />
            );
          })
        )}
      </svg>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        Percentages reflect total supply allocation. Each block represents 1%.
      </div>
    </div>
  );
};
