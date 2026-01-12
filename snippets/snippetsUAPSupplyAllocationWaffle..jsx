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

  const cells: typeof data[number][] = [];
  data.forEach((d) => {
    for (let i = 0; i < d.value; i++) {
      cells.push(d);
    }
  });

  const cellAt = (r: number, c: number) => {
    const bottomUpRow = rows - 1 - r;
    const idx = bottomUpRow * cols + c;
    return cells[idx] ?? null;
  };

  const cellSize = 18;
  const gap = 4;
  const padding = 10;
  const width = padding * 2 + cols * cellSize + (cols - 1) * gap;
  const height = padding * 2 + rows * cellSize + (rows - 1) * gap;

  return (
    <div className="not-prose">
      <div className="mb-3 text-sm font-semibold text-gray-200">
        UAP Supply Allocation
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="w-full max-w-[380px] rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-200">Waffle Chart (1 block = 1%)</span>
            <span className="text-gray-400">100%</span>
          </div>

          <div className="w-full aspect-square max-w-[380px] mx-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="UAP supply allocation waffle chart"
            >
              <rect
                x="0"
                y="0"
                width={width}
                height={height}
                rx="12"
                fill="rgba(255,255,255,0.02)"
                stroke="rgba(255,255,255,0.08)"
              />

              {Array.from({ length: rows }, (_, r) =>
                Array.from({ length: cols }, (_, c) => {
                  const d = cellAt(r, c);
                  const x = padding + c * (cellSize + gap);
                  const y = padding + r * (cellSize + gap);

                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={x}
                      y={y}
                      width={cellSize}
                      height={cellSize}
                      rx={5}
                      fill={d ? d.color : "rgba(255,255,255,0.07)"}
                      stroke="rgba(255,255,255,0.12)"
                    >
                      <title>{d ? `${d.label} — ${d.value}%` : "Empty"}</title>
                    </rect>
                  );
                })
              )}
            </svg>
          </div>
        </div>

        {/* Legend - keeping simple */}
        <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 text-sm font-semibold text-gray-200">Breakdown</div>
          <div className="space-y-2.5">
            {data.map((d) => (
              <div key={d.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-200">{d.label}</span>
                </div>
                <span className="font-medium text-gray-100">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};