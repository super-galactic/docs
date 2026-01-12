"use client";
import React from "react";

export const UAPSupplyAllocationStackedBar = () => {
  const data = [
    { label: "Play to Earn Economy", value: 50, color: "#34D399" },
    { label: "Liquidity and Listing", value: 25, color: "#38BDF8" },
    { label: "Ecosystem Growth", value: 15, color: "#A78BFA" },
    { label: "Team and Advisors", value: 5, color: "#FBBF24" },
    { label: "Development Fund", value: 5, color: "#FB7185" },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="not-prose">
      <div className="mb-3 text-sm font-semibold text-gray-200">
        UAP Supply Allocation
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-200">
              Allocation (stacked)
            </div>
            <div className="text-xs text-gray-400">Total: 100%</div>
          </div>

          <div className="h-10 w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
            <div className="flex h-full w-full">
              {data.map((d) => {
                const widthPct = (d.value / total) * 100;

                return (
                  <div
                    key={d.label}
                    title={`${d.label}: ${d.value}%`}
                    style={{ width: `${widthPct}%`, backgroundColor: d.color }}
                    className="relative flex h-full items-center justify-center"
                  >
                    {d.value >= 8 ? (
                      <span className="px-2 text-xs font-semibold text-black/80">
                        {d.value}%
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            Labels are shown inside segments where space allows.
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
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
                  <tr key={`${d.label}-row`} className="border-t border-white/10">
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
