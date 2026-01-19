export const UAPSupplyAllocationStackedBar = () => {
  const data = [
    {
      label: "Play to Earn Economy",
      value: 50,
      bg: "linear-gradient(90deg, #16A34A 0%, #34D399 100%)",
      swatch: "#22C55E",
      textColor: "#FFFFFF",
      purpose: "Funds PvE reward distribution under capped extraction and claim flow.",
    },
    {
      label: "Community Programs",
      value: 8,
      bg: "linear-gradient(90deg, #0891B2 0%, #0EA5E9 100%)",
      swatch: "#0EA5E9",
      textColor: "#FFFFFF",
      purpose:
        "Funds structured player participation programs and time-boxed campaigns.",
    },
    {
      label: "Ecosystem Development",
      value: 9,
      bg: "linear-gradient(90deg, #0284C7 0%, #3B82F6 100%)",
      swatch: "#3B82F6",
      textColor: "#FFFFFF",
      purpose:
        "Supports integrations, partners, and ecosystem expansion initiatives.",
    },
    {
      label: "Liquidity and Market Access",
      value: 15,
      bg: "linear-gradient(90deg, #1E40AF 0%, #60A5FA 100%)",
      swatch: "#60A5FA",
      textColor: "#FFFFFF",
      purpose:
        "Supports market access and liquidity provisioning for price discovery.",
    },
    {
      label: "Research & Development",
      value: 13,
      bg: "linear-gradient(90deg, #0F172A 0%, #334155 100%)",
      swatch: "#64748B",
      textColor: "#FFFFFF",
      purpose:
        "Supports core development, infrastructure, security, and long-term sustainability.",
    },
    {
      label: "Team and Advisors",
      value: 5,
      bg: "linear-gradient(90deg, #1D4ED8 0%, #2563EB 100%)",
      swatch: "#2563EB",
      textColor: "#FFFFFF",
      purpose: "Long-term contributor and advisor alignment under vesting.",
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

        /* hover sync without React state */
        .uap-row:hover { background: rgba(255,255,255,0.04); }
        .uap-seg { position: relative; }
        .uap-seg::after {
          content: "";
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.10);
          pointer-events: none;
          opacity: 1;
        }
        .uap-seg:hover::after {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.28), 0 0 18px rgba(255,255,255,0.10);
        }
      `}</style>

      <div className="mb-2 text-sm text-gray-300">
        Allocation categories reflect reservation, not circulation.
      </div>

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
                  title={`${d.label}: ${d.value}%\n${d.purpose}`}
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
                <th className="px-3 py-2 text-right font-medium">%</th>
                <th className="hidden px-3 py-2 font-medium md:table-cell">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr
                  key={`${d.label}-row`}
                  className="uap-row border-t border-white/10"
                  title={`${d.label}: ${d.value}%\n${d.purpose}`}
                >
                  <td className="px-3 py-2 text-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: d.swatch }}
                      />
                      <span>{d.label}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-gray-100">
                    {d.value}%
                  </td>
                  <td className="hidden px-3 py-2 text-gray-300 md:table-cell">
                    {d.purpose}
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
