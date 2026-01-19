export const UAPSupplyAllocationStackedBar = () => {
  const data = [
    {
      label: "Play to Earn Economy",
      shortLabel: "Play to Earn Economy",
      value: 50,
      bg: "linear-gradient(90deg, #16A34A 0%, #34D399 100%)",
      swatch: "#22C55E",
      textColor: "#FFFFFF",
    },
    {
      label: "Community Programs",
      shortLabel: "Community Programs",
      value: 8,
      bg: "linear-gradient(90deg, #0B5ED7 0%, #2EA8FF 100%)",
      swatch: "#2EA8FF",
      textColor: "#FFFFFF",
    },
    {
      label: "Ecosystem Development",
      shortLabel: "Ecosystem Development",
      value: 9,
      bg: "linear-gradient(90deg, #0A3D91 0%, #3B82F6 100%)",
      swatch: "#3B82F6",
      textColor: "#FFFFFF",
    },
    {
      label: "Liquidity and Market Access",
      shortLabel: "Liquidity and Market Access",
      value: 15,
      bg: "linear-gradient(90deg, #0B2A55 0%, #1D4ED8 100%)",
      swatch: "#1D4ED8",
      textColor: "#FFFFFF",
    },
    {
      label: "Research & Development",
      shortLabel: "Research & Development",
      value: 13,
      // fix grey by keeping the same blue grading family
      bg: "linear-gradient(90deg, #07223F 0%, #0EA5E9 100%)",
      swatch: "#0EA5E9",
      textColor: "#FFFFFF",
    },
    {
      label: "Team and Advisors",
      shortLabel: "Team and Advisors",
      value: 5,
      bg: "linear-gradient(90deg, #08306B 0%, #2563EB 100%)",
      swatch: "#2563EB",
      textColor: "#FFFFFF",
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

        .uap-row:hover { background: rgba(255,255,255,0.04); }

        .uap-seg { position: relative; }
        .uap-seg::after {
          content: "";
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.10);
          pointer-events: none;
        }
        .uap-seg:hover::after {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.28), 0 0 18px rgba(255,255,255,0.10);
        }

        /* ensure % column alignment */
        .uap-pct {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-200">
            Allocation (stacked)
          </div>
          <div className="text-xs text-gray-400">Total: {total}%</div>
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
                  className="uap-seg flex h-full items-center justify-center"
                >
                  <span
                    style={{
                      color: d.textColor,
                      textShadow: "0 1px 8px rgba(0,0,0,0.55)",
                      letterSpacing: "0.2px",
                    }}
                    className="px-2 text-xs font-semibold"
                  >
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
                <th className="px-3 py-2 font-medium uap-pct">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr
                  key={`${d.label}-row`}
                  className="uap-row border-t border-white/10"
                  title={`${d.label}: ${d.value}%`}
                >
                  <td className="px-3 py-2 text-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: d.swatch }}
                      />
                      <span className="font-medium">{d.shortLabel}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-100 uap-pct font-semibold">
                    {d.value}%
                  </td>
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
