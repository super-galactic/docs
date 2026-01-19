export const UAPSupplyAllocationStackedBar = () => {
  const React = require("react");
  const { useMemo, useState } = React;

  // Finalised allocation set
  const data = useMemo(
    () => [
      {
        label: "Play to Earn Economy",
        value: 50,
        purpose: "Funds PvE reward distribution under capped extraction and claim flow.",
        bg: "linear-gradient(90deg, rgba(22,163,74,1) 0%, rgba(52,211,153,1) 100%)",
        swatch: "#22C55E",
        textColor: "#FFFFFF",
      },
      {
        label: "Community Programs",
        value: 8,
        purpose: "Funds structured player participation programs and time-boxed campaigns.",
        bg: "linear-gradient(90deg, rgba(8,145,178,1) 0%, rgba(14,165,233,1) 100%)",
        swatch: "#0EA5E9",
        textColor: "#FFFFFF",
      },
      {
        label: "Ecosystem Development",
        value: 9,
        purpose: "Supports integrations, partners, and ecosystem expansion initiatives.",
        bg: "linear-gradient(90deg, rgba(2,132,199,1) 0%, rgba(59,130,246,1) 100%)",
        swatch: "#3B82F6",
        textColor: "#FFFFFF",
      },
      {
        label: "Liquidity and Market Access",
        value: 15,
        purpose: "Supports market access and liquidity provisioning for price discovery.",
        bg: "linear-gradient(90deg, rgba(30,64,175,1) 0%, rgba(96,165,250,1) 100%)",
        swatch: "#60A5FA",
        textColor: "#FFFFFF",
      },
      {
        label: "Research & Development",
        value: 13,
        purpose: "Supports core development, infrastructure, security, and long-term sustainability.",
        bg: "linear-gradient(90deg, rgba(15,23,42,1) 0%, rgba(51,65,85,1) 100%)",
        swatch: "#64748B",
        textColor: "#FFFFFF",
      },
      {
        label: "Team and Advisors",
        value: 5,
        purpose: "Long-term contributor and advisor alignment under vesting-based incentives.",
        bg: "linear-gradient(90deg, rgba(29,78,216,1) 0%, rgba(37,99,235,1) 100%)",
        swatch: "#2563EB",
        textColor: "#FFFFFF",
      },
    ],
    []
  );

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);
  const [active, setActive] = useState(null);

  return (
    <div className="not-prose">
      <style>{`
        @keyframes uapBarIn {
          from { transform: scaleX(0); opacity: 0.9; }
          to { transform: scaleX(1); opacity: 1; }
        }
        @keyframes uapPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.10); }
          50% { box-shadow: 0 0 0 6px rgba(255,255,255,0.06); }
        }
      `}</style>

      <div className="mb-2 text-sm text-gray-300">
        Allocation categories reflect reservation, not circulation.
      </div>

      {/* Top card */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-200">Allocation (stacked)</div>
          <div className="text-xs text-gray-400">Total: {total}%</div>
        </div>

        <div className="h-10 w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
          <div className="flex h-full w-full">
            {data.map((d, idx) => {
              const widthPct = (d.value / total) * 100;
              const isActive = active === d.label;

              return (
                <div
                  key={d.label}
                  role="button"
                  tabIndex={0}
                  aria-label={`${d.label} ${d.value}%`}
                  title={`${d.label}: ${d.value}%`}
                  onMouseEnter={() => setActive(d.label)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(d.label)}
                  onBlur={() => setActive(null)}
                  style={{
                    width: `${widthPct}%`,
                    backgroundImage: d.bg,
                    transformOrigin: "left",
                    transform: "scaleX(0)",
                    animation: "uapBarIn 650ms ease forwards",
                    animationDelay: `${idx * 90}ms`,
                    position: "relative",
                    opacity: active ? (isActive ? 1 : 0.55) : 1,
                    filter: active ? (isActive ? "saturate(1.1)" : "saturate(0.7)") : "none",
                    transition: "opacity 160ms ease, filter 160ms ease",
                  }}
                  className="flex h-full items-center justify-center"
                >
                  <div
                    style={{
                      inset: 0,
                      position: "absolute",
                      pointerEvents: "none",
                      boxShadow: isActive
                        ? "inset 0 0 0 1px rgba(255,255,255,0.25), 0 0 18px rgba(255,255,255,0.10)"
                        : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                      animation: isActive ? "uapPulse 1.6s ease-in-out infinite" : "none",
                    }}
                  />

                  {/* show % only if wide enough */}
                  {widthPct >= 7 ? (
                    <span
                      style={{
                        color: d.textColor,
                        textShadow: "0 1px 10px rgba(0,0,0,0.60)",
                        letterSpacing: "0.2px",
                        position: "relative",
                        zIndex: 1,
                      }}
                      className="px-2 text-xs font-semibold"
                    >
                      {d.value}%
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* analytic readout */}
        <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
          {active ? (
            (() => {
              const d = data.find((x) => x.label === active);
              return (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: d.swatch }}
                      />
                      <span className="text-sm font-semibold text-gray-100">{d.label}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-100">{d.value}%</div>
                  </div>
                  <div className="text-xs text-gray-300">{d.purpose}</div>
                </div>
              );
            })()
          ) : (
            <div className="text-xs text-gray-400">
              Hover a segment to inspect category purpose and allocation.
            </div>
          )}
        </div>
      </div>

      {/* Breakdown card */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 text-sm font-semibold text-gray-200">Breakdown</div>

        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-200">
              <tr>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 text-right font-medium">%</th>
                <th className="hidden px-3 py-2 font-medium md:table-cell">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => {
                const isActive = active === d.label;
                return (
                  <tr
                    key={`${d.label}-row`}
                    className="border-t border-white/10"
                    onMouseEnter={() => setActive(d.label)}
                    onMouseLeave={() => setActive(null)}
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                      transition: "background-color 160ms ease",
                    }}
                  >
                    <td className="px-3 py-2 text-gray-100">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: d.swatch }}
                        />
                        <span className="font-medium">{d.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-100">
                      {d.value}%
                    </td>
                    <td className="hidden px-3 py-2 text-gray-300 md:table-cell">
                      {d.purpose}
                    </td>
                  </tr>
                );
              })}
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
