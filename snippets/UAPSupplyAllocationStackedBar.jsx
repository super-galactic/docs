export const UAPSupplyAllocationStackedBar = () => {
  const data = [
    {
      label: "Play to Earn Economy",
      value: 50,
      bg: "linear-gradient(90deg, #16A34A 0%, #34D399 100%)",
      swatch: "#22C55E",
      text: "text-black/80",
    },
    {
      label: "Liquidity and Listing",
      value: 25,
      bg: "linear-gradient(90deg, #0B5ED7 0%, #2EA8FF 100%)",
      swatch: "#2EA8FF",
      text: "text-black/80",
    },
    {
      label: "Ecosystem Growth",
      value: 15,
      bg: "linear-gradient(90deg, #0A3D91 0%, #3B82F6 100%)",
      swatch: "#3B82F6",
      text: "text-black/80",
    },
    {
      label: "Team and Advisors",
      value: 5,
      bg: "linear-gradient(90deg, #0B2A55 0%, #1D4ED8 100%)",
      swatch: "#1D4ED8",
      text: "text-white/90",
    },
    {
      label: "Development Fund",
      value: 5,
      bg: "linear-gradient(90deg, #07223F 0%, #0EA5E9 100%)",
      swatch: "#0EA5E9",
      text: "text-white/90",
    },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

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
                    animation: "uapBarIn 650ms ease forwards",
                    animationDelay: `${idx * 90}ms`,
                  }}
                  className="flex h-full items-center justify-center"
                >
                  {/* All labels fit */}
                  <span className={`px-2 text-xs font-semibold ${d.text}`}>
                    {d.value}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-400">
          Hover any segment for full details.
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
                  <td className="px-3 py-2 text-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: d.swatch }}
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
  );
};
