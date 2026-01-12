export const UAPSupplyAllocationStackedBar = () => {
  const data = [
    {
      label: "Play to Earn Economy",
      value: 50,
      bg: "linear-gradient(90deg, #22C55E 0%, #34D399 100%)",
    },
    {
      label: "Liquidity and Listing",
      value: 25,
      bg: "linear-gradient(90deg, #0284C7 0%, #38BDF8 100%)",
    },
    {
      label: "Ecosystem Growth",
      value: 15,
      bg: "linear-gradient(90deg, #1D4ED8 0%, #60A5FA 100%)",
    },
    {
      label: "Team and Advisors",
      value: 5,
      bg: "linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)",
    },
    {
      label: "Development Fund",
      value: 5,
      bg: "linear-gradient(90deg, #0EA5E9 0%, #22D3EE 100%)",
    },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // For positioning the small labels above the bar
  let running = 0;
  const markers = data.map((d) => {
    const start = (running / total) * 100;
    const width = (d.value / total) * 100;
    const center = start + width / 2;
    running += d.value;
    return { label: d.label, value: d.value, center };
  });

  return (
    <div className="not-prose">
      <style>{`
        @keyframes uapBarIn {
          from { transform: scaleX(0); opacity: 0.9; }
          to { transform: scaleX(1); opacity: 1; }
        }
      `}</style>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-200">
            Allocation (stacked)
          </div>
          <div className="text-xs text-gray-400">Total: 100%</div>
        </div>

        <div className="relative">
          {/* Labels for small segments shown above the bar */}
          <div className="pointer-events-none absolute -top-6 left-0 right-0 h-5">
            {markers
              .filter((m) => m.value < 10)
              .map((m) => (
                <div
                  key={m.label}
                  className="absolute text-[11px] font-semibold text-gray-200/90"
                  style={{ left: `${m.center}%`, transform: "translateX(-50%)" }}
                >
                  {m.value}%
                </div>
              ))}
          </div>

          <div className="h-10 w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
            <div className="flex h-full w-full">
              {data.map((d, idx) => {
                const widthPct = (d.value / total) * 100;

                return (
                  <div
                    key={d.label}
                    title={`${d.label}: ${d.value}%`}
                    style={{
                      width: `${widthPct}%`,
                      backgroundImage: d.bg,
                      transformOrigin: "left",
                      transform: "scaleX(0)",
                      animation: "uapBarIn 700ms ease forwards",
                      animationDelay: `${idx * 90}ms`,
                    }}
                    className="relative flex h-full items-center justify-center"
                  >
                    {/* Only show inside labels when there is enough space */}
                    {d.value >= 10 ? (
                      <span className="px-2 text-xs font-semibold text-black/80">
                        {d.value}%
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-400">
          Small segments are labeled above the bar. Hover any segment for full details.
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
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
                  <td className="px-3 py-2 text-gray-100">{d.label}</td>
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
  );
};
