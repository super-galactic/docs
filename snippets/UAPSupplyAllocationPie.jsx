"use client";
import React from "react";

export const UAPSupplyAllocationPie = () => {
  const data = [
    { label: "Play to Earn Economy", value: 50, color: "#34D399" }, // emerald
    { label: "Liquidity and Listing", value: 25, color: "#38BDF8" }, // sky
    { label: "Ecosystem Growth", value: 15, color: "#A78BFA" }, // violet
    { label: "Team and Advisors", value: 5, color: "#FBBF24" }, // amber
    { label: "Development Fund", value: 5, color: "#FB7185" }, // rose
  ];

  const cx = 100;
  const cy = 100;
  const rOuter = 82;
  const donutWidth = 46;
  const rInner = Math.max(0, rOuter - donutWidth);

  const depth = 10; // 3D thickness
  const [progress, setProgress] = React.useState(0);
  const [hovered, setHovered] = React.useState(null);

  const total = React.useMemo(() => data.reduce((sum, d) => sum + d.value, 0), []);

  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const hexToRgb = (hex) => {
    const h = hex.replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const num = parseInt(full, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgbToHex = (r, g, b) => {
    const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
    const toHex = (n) => clamp(n).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const darken = (hex, amount = 0.22) => {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
  };

  const lighten = (hex, amount = 0.18) => {
    const { r, g, b } = hexToRgb(hex);
    const mix = (c) => c + (255 - c) * amount;
    return rgbToHex(mix(r), mix(g), mix(b));
  };

  const polarToCartesian = (ccx, ccy, r, angleDeg) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return { x: ccx + r * Math.cos(angleRad), y: ccy + r * Math.sin(angleRad) };
  };

  const arcPath = (ccx, ccy, rOuter, rInner, startAngle, endAngle) => {
    const startOuter = polarToCartesian(ccx, ccy, rOuter, endAngle);
    const endOuter = polarToCartesian(ccx, ccy, rOuter, startAngle);
    const startInner = polarToCartesian(ccx, ccy, rInner, endAngle);
    const endInner = polarToCartesian(ccx, ccy, rInner, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${rInner} ${rInner} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
      "Z",
    ].join(" ");
  };

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    let rafId = 0;
    const durationMs = 900;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(easeOutCubic(t));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion]);

  const slices = React.useMemo(() => {
    let currentAngle = 0;

    return data.map((d, idx) => {
      const fullAngle = (d.value / total) * 360;
      const animatedAngle = fullAngle * progress;

      const startAngle = currentAngle;
      const endAngle = currentAngle + animatedAngle;

      // advance using full angle so later slices keep their intended position even during animation
      currentAngle += fullAngle;

      const midAngle = startAngle + animatedAngle / 2;
      const pop = hovered === d.label ? 5 : 0;
      const midRad = ((midAngle - 90) * Math.PI) / 180;

      const tx = pop * Math.cos(midRad);
      const ty = pop * Math.sin(midRad);

      const gradId = `uapGrad_${idx}`;

      return {
        ...d,
        gradId,
        startAngle,
        endAngle,
        midAngle,
        tx,
        ty,
        topPath: arcPath(cx, cy, rOuter, rInner, startAngle, endAngle),
        bottomPath: arcPath(cx, cy + depth, rOuter, rInner, startAngle, endAngle),
        sideColor: darken(d.color, 0.28),
        gradFrom: lighten(d.color, 0.18),
        gradTo: d.color,
      };
    });
  }, [data, total, progress, hovered]);

  return (
    <div className="not-prose">
      <div className="mb-3 text-sm font-semibold text-gray-200">UAP Supply Allocation</div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="w-full max-w-[340px] rounded-xl border border-white/10 bg-white/5 p-4">
          <svg viewBox="0 0 200 210" className="h-auto w-full" role="img" aria-label="UAP supply allocation pie chart">
            <defs>
              <filter id="uapShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.45)" />
              </filter>

              {slices.map((s) => (
                <linearGradient key={s.gradId} id={s.gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={s.gradFrom} />
                  <stop offset="100%" stopColor={s.gradTo} />
                </linearGradient>
              ))}
            </defs>

            {/* 3D bottom layer */}
            <g filter="url(#uapShadow)">
              {slices.map((s) => (
                <path key={`${s.label}_bottom`} d={s.bottomPath} fill={s.sideColor} opacity="0.95" />
              ))}
            </g>

            {/* top layer */}
            {slices.map((s) => (
              <g
                key={s.label}
                transform={`translate(${s.tx} ${s.ty})`}
                style={{ transition: "transform 160ms ease" }}
                onMouseEnter={() => setHovered(s.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <path d={s.topPath} fill={`url(#${s.gradId})`} stroke="rgba(0,0,0,0.28)" strokeWidth="0.8" />
              </g>
            ))}

            {/* donut hole */}
            <circle
              cx={cx}
              cy={cy}
              r={rInner}
              fill="rgba(0,0,0,0.28)"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
            />

            <text x={cx} y={cy - 4} textAnchor="middle" className="fill-gray-100" fontSize="12" fontWeight="600">
              Total Supply
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-200" fontSize="12">
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
                {data.map((d) => (
                  <tr key={d.label} className="border-t border-white/10">
                    <td className="px-3 py-2 text-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                        <span>{d.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-100">{d.value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-gray-400">Percentages reflect total supply allocation.</div>
        </div>
      </div>
    </div>
  );
};
