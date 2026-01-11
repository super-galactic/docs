"use client";
import React from "react";

export const UAPSupplyAllocation = () => {
  const data = [
    { label: "Play to Earn Economy", value: 50, color: "#34D399" },
    { label: "Liquidity and Listing", value: 25, color: "#38BDF8" },
    { label: "Ecosystem Growth", value: 15, color: "#A78BFA" },
    { label: "Team and Advisors", value: 5, color: "#FBBF24" },
    { label: "Development Fund", value: 5, color: "#FB7185" },
  ];

  const rows = 10;
  const cols = 10;
  const total = rows * cols;

  // Build 100 cells (1 cell = 1%)
  const cells = [];
  data.forEach((d) => {
    for (let i = 0; i < d.value; i += 1) {
      cells.push({ label: d.label, color: d.color });
    }
  });

  // Bottom-up waffle layout
  const indexForRowCol = (r, c) => {
    const bottomUpRow = rows - 1 - r;
    return bottomUpRow * cols + c;
  };

  return (
    <div className="not-prose">
      <style>{`
        @keyframes uapWaffleWave {
          0%   { transform: scale(1); filter: brightness(0.92); }
          55%  { transform: scale(1.06); filter: brightness(1.10); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .uap-waffle-cell {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mb-3 text-sm font-semibold text-gray-200">UAP Supply Allocation</div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="w-full max-w-[380px] rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-200">Waffle (1 block = 1%)</div>
            <div className="text-xs text-gray-400">Total: 100%</div>
          </div>

          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            role="img"
            aria-label="UAP supply allocation waffle chart. Each block represents 1 percent of total supply."
          >
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const idx = indexForRowCol(r, c);
                const cell = cells[idx] || { label: "Unallocated", color: "transparent" };

                // Staggered wave timing without hiding blocks
                const delayMs = idx * 10;

                return (
                  <div
                    key={`${r}-${c}`}
                    title={`${cell.label} (1%)`}
                    className="uap-waffle-cell aspect-square rounded-md border border-white/10"
                    style={{
                      backgroundColor: cell.color,
                      animation: "uapWaffleWave 520ms ease both",
                      animationDelay: `${delayMs}ms`,
                    }}
                  />
                );
              })
            )}
          </div>

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

          <div className="mt-3 text-xs text-gray-400">Percentages reflect total supply allocation.</div>
        </div>
      </div>
    </div>
  );
};
