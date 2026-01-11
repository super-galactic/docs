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

  const total = 100;

  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const [revealCount, setRevealCount] = React.useState(prefersReducedMotion ? total : 0);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setRevealCount(total);
      return;
    }

    let current = 0;
    const step = 3;
    const intervalMs = 18;

    const id = setInterval(() => {
      current = Math.min(total, current + step);
      setRevealCount(current);
      if (current >= total) clearInterval(id);
    }, intervalMs);

    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  // Build 100 cells (each cell = 1%)
  const cells = React.useMemo(() => {
    const out = [];
    data.forEach((d) => {
      for (let i = 0; i < d.value; i += 1) {
        out.push({ label: d.label, color: d.color });
      }
    });
    return out.slice(0, total);
  }, []);

  // Display as 10x10 grid, bottom-up (common waffle style)
  const rows = 10;
  const cols = 10;

  const indexForRowCol = (r, c) => {
    // r=0 is top. For bottom-up, map to reversed row.
    const bottomUpRow = rows - 1 - r;
    return bottomUpRow * cols + c;
  };

  return (
    <div className="not-prose">
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
                const cell = cells[idx];
                const isVisible = idx < revealCount;

                return (
                  <div
                    key={`${r}-${c}`}
                    title={cell ? `${cell.label} (1%)` : "1%"}
                    className="aspect-square rounded-md border border-white/10"
                    style={{
                      backgroundColor: cell ? cell.color : "transparent",
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "scale(1)" : "scale(0.82)",
                      transition: "opacity 220ms ease, transform 220ms ease",
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

          <div className="space-y-3">
            {data.map((d) => (
              <div key={d.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-100">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: d.color }}
                  />
                  <span>{d.label}</span>
                </div>
                <div className="text-sm font-semibold text-gray-100">{d.value}%</div>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-200">
                <tr>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={`${d.label}-row`} className="border-t border-white/10">
                    <td className="px-3 py-2 text-gray-100">{d.label}</td>
                    <td className="px-3 py-2 text-gray-100">{d.value}%</td>
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
