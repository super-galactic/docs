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

  // Build exactly 100 cells (each = 1%)
  const cells = [];
  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < data[i].value; j += 1) {
      cells.push(data[i]);
    }
  }

  const cellSize = 18;
  const gap = 4;
  const pad = 12;

  const svgW = pad * 2 + cols * cellSize + (cols - 1) * gap;
  const svgH = pad * 2 + rows * cellSize + (rows - 1) * gap;

  // Build rects as a flat array (no nested arrays)
  const rects = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      // bottom-up fill
      const bottomUpRow = rows - 1 - r;
      const idx = bottomUpRow * cols + c;

      const d = cells[idx];
      const x = pad + c * (cellSize + gap);
      const y = pad + r * (cellSize + gap);

      rects.push(
        <rect
          key={`cell-${r}-${c}`}
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          rx={4}
          fill={d ? d.color : "transparent"}
          stroke="rgba(255,255,255,0.12)"
        >
          <title>{d ? `${d.label} (1%)` : "1%"}</title>
        </rect>
      );
    }
  }

  return (
    <div className="not-prose">
      <div className="mb-3 text-sm font-semibold text-gray-200">
        UAP Supply Allocation
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="w-full max-w-[420px] rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-200">
              Waffle (1 block = 1%)
            </div>
            <div className="text-xs text-gray-400">Total: 100%</div>
          </div>

          <svg
            width={svgW}
            height={svgH}
            viewBox={`0 0 ${svgW} ${svgH}`}
            role="img"
            aria-label="UAP supply allocation waffle chart. Each block represents 1 percent."
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {rects}
          </svg>

          <div className="mt-3 text-xs text-gray-400">
            Percentages reflect total supply allocation.
          </div>
        </div>

        <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-sm font-semibold text-gray-200">Breakdown</div>

          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-200">
                <tr>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.label} className="border-t border-white/10">
                    <td className="px-3 py-2 text-gray-100">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: d.color }}
                        />
                        <span>{d.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-100">{d.value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            Percentages reflect total supply allocation.
          </div>
        </div>
      </div>
    </div>
  );
};
