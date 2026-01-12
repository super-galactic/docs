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

  // Create flat array of cells (100 items)
  const cells: typeof data[number][] = [];
  data.forEach((category) => {
    for (let i = 0; i < category.value; i++) {
      cells.push(category);
    }
  });

  // Bottom → top filling (most natural reading direction for many people)
  const getCategoryAt = (row: number, col: number) => {
    const bottomUpRow = rows - 1 - row;
    const index = bottomUpRow * cols + col;
    return cells[index] ?? null;
  };

  // Layout calculations
  const cellSize = 18;
  const gap = 4;
  const padding = 10;
  const svgWidth = padding * 2 + cols * cellSize + (cols - 1) * gap;
  const svgHeight = padding * 2 + rows * cellSize + (rows - 1) * gap;

  return (
    <div className="not-prose">
      <div className="mb-3 text-sm font-semibold text-gray-200">
        UAP Supply Allocation
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Waffle Chart Card */}
        <div className="w-full max-w-[380px] rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-200">
              Waffle Chart (1 block = 1%)
            </div>
            <div className="text-xs text-gray-400">100%</div>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="h-auto w-full"
            role="img"
            aria-label="UAP token supply allocation waffle chart"
          >
            {/* Background rounded rect */}
            <rect
              x="0"
              y="0"
              width={svgWidth}
              height={svgHeight}
              rx="12"
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.08)"
            />

            {Array.from({ length: rows }, (_, row) =>
              Array.from({ length: cols }, (_, col) => {
                const category = getCategoryAt(row, col);
                const x = padding + col * (cellSize + gap);
                const y = padding + row * (cellSize + gap);

                return (
                  <rect
                    key={`${row}-${col}`}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={5}
                    fill={category?.color ?? "rgba(255,255,255,0.06)"}
                    stroke="rgba(255,255,255,0.09)"
                  >
                    <title>
                      {category
                        ? `${category.label} — ${category.value}%`
                        : "Unallocated"}
                    </title>
                  </rect>
                );
              })
            )}
          </svg>
        </div>

        {/* Legend / Table */}
        <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 text-sm font-semibold text-gray-200">
            Allocation Breakdown
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Percent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.map((item) => (
                  <tr key={item.label}>
                    <td className="px-4 py-3 text-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-100">
                      {item.value}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};