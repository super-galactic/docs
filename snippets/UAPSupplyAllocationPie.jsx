import React, { useMemo } from "react";

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, endAngle);
  const endInner = polarToCartesian(cx, cy, rInner, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  // Donut slice (outer arc + inner arc)
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

export function UAPSupplyAllocationPie({
  size = 260,
  donutWidth = 46,
  title = "UAP Supply Allocation",
}) {
  const data = useMemo(
    () => [
      { label: "Play to Earn Economy", value: 50 },
      { label: "Liquidity and Listing", value: 25 },
      { label: "Ecosystem Growth", value: 15 },
      { label: "Team and Advisors", value: 5 },
      { label: "Development Fund", value: 5 },
    ],
    []
  );

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Muted palette that works on dark backgrounds
  const colors = ["#16A34A", "#0EA5E9", "#A855F7", "#F59E0B", "#EF4444"];

  const cx = 100;
  const cy = 100;
  const rOuter = 82;
  const rInner = Math.max(0, rOuter - donutWidth);

  let currentAngle = 0;

  const slices = data.map((d, idx) => {
    const sliceAngle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    return {
      ...d,
      color: colors[idx % colors.length],
      startAngle,
      endAngle,
      path: arcPath(cx, cy, rOuter, rInner, startAngle, endAngle),
    };
  });

  return (
    <div className="not-prose">
      <div className="mb-3 text-sm font-semibold text-gray-200">{title}</div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div
          className="rounded-xl border border-white/10 bg-white/5 p-4"
          style={{ width: size }}
          aria-label="UAP supply allocation pie chart"
          role="img"
        >
          <svg viewBox="0 0 200 200" className="h-auto w-full">
            {slices.map((s) => (
              <path
                key={s.label}
                d={s.path}
                fill={s.color}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="0.75"
              />
            ))}

            <circle
              cx={cx}
              cy={cy}
              r={rInner}
              fill="rgba(0,0,0,0.25)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />

            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              className="fill-gray-100"
              fontSize="12"
              fontWeight="600"
            >
              Total Supply
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              className="fill-gray-200"
              fontSize="12"
            >
              100%
            </text>
          </svg>
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
                {slices.map((s) => (
                  <tr key={s.label} className="border-t border-white/10">
                    <td className="px-3 py-2 text-gray-100">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: s.color }}
                        />
                        <span>{s.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-100">{s.value}%</td>
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
}
