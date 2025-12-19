"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Chart.js is loaded globally via docs.json customScripts:
 * window.Chart (UMD build)
 */

const RARITY_COUNTS = {
  Genesis: { Common: 6800, Uncommon: 3000, Rare: 180, Epic: 20 },
  Weapons: { Common: 6800, Uncommon: 3000, Rare: 180, Epic: 20 },
};

const MISSION_REWARDS = [
  { level: "L1", reward: 100 },
  { level: "L2", reward: 150 },
  { level: "L3", reward: 250 },
  { level: "L4", reward: 350 },
  { level: "L5", reward: 500 },
];

const GENESIS_PART_TIER_COSTS = {
  Common: [2000, 3000, 4500, 6500, 9000],
  Uncommon: [3000, 4500, 6500, 9500, 13500],
  Rare: [5000, 7500, 11000, 16000, 22500],
  Epic: [8000, 12000, 18000, 26000, 36000],
};

const WEAPON_TIER_COSTS = {
  Common: [3500, 5000, 7000, 10000, 14000],
  Uncommon: [5000, 7500, 10500, 15000, 21000],
  Rare: [8000, 12000, 17000, 24000, 34000],
  Epic: [12000, 18000, 26000, 37000, 52000],
};

// Aggregate “max upgrade” sink math (EXACT)
const GENESIS_TOTAL_SPEND_BY_RARITY = {
  Common: 1020000000,
  Uncommon: 666000000,
  Rare: 66960000,
  Epic: 12000000,
};
const WEAPONS_TOTAL_SPEND_BY_RARITY = {
  Common: 268600000,
  Uncommon: 177000000,
  Rare: 17100000,
  Epic: 2900000,
};
const PHASE1_TOTAL_SPEND = 2230560000;
const PHASE1_BURN = 1115280000;
const PHASE1_TREASURY = 1115280000;

const ADOPTION_SCENARIOS = [
  { label: "25%", total: 557640000, burn: 278820000, treasury: 278820000 },
  { label: "50%", total: 1115280000, burn: 557640000, treasury: 557640000 },
  { label: "100%", total: 2230560000, burn: 1115280000, treasury: 1115280000 },
];

function formatNumber(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function formatCompact(n) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(n);
}

function Card({ title, subtitle, children }) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: 16,
        margin: "12px 0 18px",
        background: "rgba(255,255,255,0.7)",
      }}
    >
      {title ? (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 650 }}>{title}</div>
          {subtitle ? (
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>{subtitle}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function useChartJsReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function check() {
      const ok = typeof window !== "undefined" && typeof window.Chart !== "undefined";
      if (!cancelled) setReady(ok);
    }

    check();
    const t = setInterval(check, 50);
    const timeout = setTimeout(() => clearInterval(t), 4000);

    return () => {
      cancelled = true;
      clearInterval(t);
      clearTimeout(timeout);
    };
  }, []);

  return ready;
}

function useChart(canvasRef, config) {
  const chartRef = useRef(null);
  const ready = useChartJsReady();

  useEffect(() => {
    if (!ready) return;
    if (!canvasRef.current) return;

    const Chart = window.Chart;
    if (!Chart) return;

    // Cleanup any previous instance
    if (chartRef.current) {
      try {
        chartRef.current.destroy();
      } catch (_) {}
      chartRef.current = null;
    }

    chartRef.current = new Chart(canvasRef.current.getContext("2d"), config);

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch (_) {}
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, canvasRef, JSON.stringify(config)]);
}

function ChartCanvas({ height = 320 }) {
  return (
    <div style={{ width: "100%", height }}>
      <canvas style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

function CanvasWithRef({ canvasRef, height = 320 }) {
  return (
    <div style={{ width: "100%", height }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 450 },
  plugins: {
    legend: { position: "top" },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const v = ctx.parsed?.y ?? ctx.parsed;
          if (typeof v === "number") return `${ctx.dataset.label}: ${formatNumber(v)}`;
          return `${ctx.dataset.label}`;
        },
      },
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => formatCompact(value),
      },
    },
  },
};

export function MissionRewardsChart() {
  const canvasRef = useRef(null);

  const labels = useMemo(() => MISSION_REWARDS.map((m) => m.level), []);
  const data = useMemo(() => MISSION_REWARDS.map((m) => m.reward), []);

  const config = useMemo(
    () => ({
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Reward (UAP)",
            data,
            borderWidth: 1,
          },
        ],
      },
      options: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) => `Reward: ${formatNumber(ctx.parsed.y)} UAP`,
            },
          },
        },
        scales: {
          ...baseOptions.scales,
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: "UAP per mission completion" },
          },
          x: {
            title: { display: true, text: "Mission level" },
          },
        },
      },
    }),
    [labels, data]
  );

  useChart(canvasRef, config);

  return (
    <Card title="Mission Rewards (Mock)" subtitle="Simple baseline rewards per mission level (UAP).">
      <CanvasWithRef canvasRef={canvasRef} height={300} />
    </Card>
  );
}

export function GenesisUpgradeCostByRarityChart() {
  const canvasRef = useRef(null);

  const labels = useMemo(() => ["Tier1", "Tier2", "Tier3", "Tier4", "Tier5"], []);
  const rarities = useMemo(() => ["Common", "Uncommon", "Rare", "Epic"], []);

  const datasets = useMemo(
    () =>
      rarities.map((r) => ({
        label: `${r} (per body part)`,
        data: GENESIS_PART_TIER_COSTS[r],
        tension: 0.25,
        fill: false,
        borderWidth: 2,
        pointRadius: 2.5,
      })),
    [rarities]
  );

  const config = useMemo(
    () => ({
      type: "line",
      data: { labels, datasets },
      options: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)} UAP`,
            },
          },
        },
        scales: {
          ...baseOptions.scales,
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: "UAP cost per tier (per body part)" },
          },
          x: {
            title: { display: true, text: "Upgrade step" },
          },
        },
      },
    }),
    [labels, datasets]
  );

  useChart(canvasRef, config);

  const perPartSums = useMemo(() => {
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    return {
      Common: sum(GENESIS_PART_TIER_COSTS.Common), // 25,000
      Uncommon: sum(GENESIS_PART_TIER_COSTS.Uncommon), // 37,000
      Rare: sum(GENESIS_PART_TIER_COSTS.Rare), // 62,000
      Epic: sum(GENESIS_PART_TIER_COSTS.Epic), // 100,000
    };
  }, []);

  return (
    <Card
      title="Genesis Upgrade Costs by Rarity"
      subtitle="Per BODY PART tier costs (Tier1→Tier5)."
    >
      <CanvasWithRef canvasRef={canvasRef} height={320} />
      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85, lineHeight: 1.45 }}>
        <div>
          <strong>Sum per part (maxing one part):</strong>{" "}
          Common {formatNumber(perPartSums.Common)}, Uncommon {formatNumber(perPartSums.Uncommon)}, Rare{" "}
          {formatNumber(perPartSums.Rare)}, Epic {formatNumber(perPartSums.Epic)} UAP
        </div>
        <div>
          <strong>Maxing 1 Genesis (all 6 parts):</strong> Common {formatNumber(perPartSums.Common * 6)}, Uncommon{" "}
          {formatNumber(perPartSums.Uncommon * 6)}, Rare {formatNumber(perPartSums.Rare * 6)}, Epic{" "}
          {formatNumber(perPartSums.Epic * 6)} UAP
        </div>
      </div>
    </Card>
  );
}

export function WeaponsUpgradeSinkChart() {
  const canvasRef = useRef(null);

  const labels = useMemo(() => ["Common", "Uncommon", "Rare", "Epic"], []);

  const totalByRarity = useMemo(
    () => [
      WEAPONS_TOTAL_SPEND_BY_RARITY.Common,
      WEAPONS_TOTAL_SPEND_BY_RARITY.Uncommon,
      WEAPONS_TOTAL_SPEND_BY_RARITY.Rare,
      WEAPONS_TOTAL_SPEND_BY_RARITY.Epic,
    ],
    []
  );

  const config = useMemo(
    () => ({
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Weapons total spend if all 10,000 are maxed (UAP)",
            data: totalByRarity,
            borderWidth: 1,
          },
        ],
      },
      options: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) => `${formatNumber(ctx.parsed.y)} UAP`,
            },
          },
        },
        scales: {
          ...baseOptions.scales,
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: "Total UAP sink (weapons)" },
          },
          x: {
            title: { display: true, text: "Rarity" },
          },
        },
      },
    }),
    [labels, totalByRarity]
  );

  useChart(canvasRef, config);

  const weaponSums = useMemo(() => {
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    return {
      Common: sum(WEAPON_TIER_COSTS.Common), // 39,500
      Uncommon: sum(WEAPON_TIER_COSTS.Uncommon), // 59,000
      Rare: sum(WEAPON_TIER_COSTS.Rare), // 95,000
      Epic: sum(WEAPON_TIER_COSTS.Epic), // 145,000
    };
  }, []);

  const totalWeapons = useMemo(
    () =>
      WEAPONS_TOTAL_SPEND_BY_RARITY.Common +
      WEAPONS_TOTAL_SPEND_BY_RARITY.Uncommon +
      WEAPONS_TOTAL_SPEND_BY_RARITY.Rare +
      WEAPONS_TOTAL_SPEND_BY_RARITY.Epic,
    []
  );

  return (
    <Card
      title="Weapons Upgrade Sink"
      subtitle="Total upgrade spend by rarity if all 10,000 weapons are maxed."
    >
      <CanvasWithRef canvasRef={canvasRef} height={300} />
      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85, lineHeight: 1.45 }}>
        <div>
          <strong>Sum per weapon (maxing one weapon):</strong>{" "}
          Common {formatNumber(weaponSums.Common)}, Uncommon {formatNumber(weaponSums.Uncommon)}, Rare{" "}
          {formatNumber(weaponSums.Rare)}, Epic {formatNumber(weaponSums.Epic)} UAP
        </div>
        <div>
          <strong>Weapons total:</strong> {formatNumber(totalWeapons)} UAP
        </div>
      </div>
    </Card>
  );
}

export function AggregateBurnVsTreasuryImpactChart() {
  const canvasRef = useRef(null);

  const labels = useMemo(() => ADOPTION_SCENARIOS.map((s) => s.label), []);
  const burnData = useMemo(() => ADOPTION_SCENARIOS.map((s) => s.burn), []);
  const treasuryData = useMemo(() => ADOPTION_SCENARIOS.map((s) => s.treasury), []);

  const config = useMemo(
    () => ({
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Burned (UAP)",
            data: burnData,
            borderWidth: 1,
            stack: "stack1",
          },
          {
            label: "Treasury (UAP)",
            data: treasuryData,
            borderWidth: 1,
            stack: "stack1",
          },
        ],
      },
      options: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)} UAP`,
              footer: (items) => {
                const i = items?.[0]?.dataIndex ?? 0;
                const total = ADOPTION_SCENARIOS[i]?.total ?? 0;
                return `Total: ${formatNumber(total)} UAP`;
              },
            },
          },
        },
        scales: {
          ...baseOptions.scales,
          x: { stacked: true, title: { display: true, text: "Adoption (share of players maxing upgrades)" } },
          y: {
            stacked: true,
            ...baseOptions.scales.y,
            title: { display: true, text: "UAP split (50% burn / 50% treasury)" },
          },
        },
      },
    }),
    [labels, burnData, treasuryData]
  );

  useChart(canvasRef, config);

  return (
    <Card
      title="Aggregate Burn vs Treasury Impact"
      subtitle="Phase 1 upgrades (Genesis + Weapons) with a 50/50 burn vs reserve wallet split."
    >
      <CanvasWithRef canvasRef={canvasRef} height={320} />
      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85, lineHeight: 1.45 }}>
        <div>
          <strong>100% adoption totals:</strong> Total {formatNumber(PHASE1_TOTAL_SPEND)} UAP • Burn{" "}
          {formatNumber(PHASE1_BURN)} • Treasury {formatNumber(PHASE1_TREASURY)}
        </div>
      </div>
    </Card>
  );
}

export function GameplayFlywheelChart() {
  // Simple SVG flywheel (no Chart.js needed)
  return (
    <Card
      title="The Gameplay Flywheel"
      subtitle="Phase 1 loop: upgrades + missions driving spend (burn/treasury) and progression."
    >
      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          width="980"
          height="360"
          viewBox="0 0 980 360"
          role="img"
          aria-label="Gameplay flywheel diagram"
          style={{ display: "block", maxWidth: "100%" }}
        >
          {/* Nodes */}
          {[
            { x: 110, y: 85, t: "Play Missions", s: "Earn UAP rewards\n(L1–L5)" },
            { x: 390, y: 45, t: "Upgrade Genesis", s: "6 body parts\nTier1→Tier5" },
            { x: 680, y: 85, t: "Upgrade Weapons", s: "Tier1→Tier5\nrarity-scaled" },
            { x: 680, y: 225, t: "Spend UAP", s: "50% burn\n50% treasury" },
            { x: 390, y: 265, t: "Power + Progression", s: "Higher performance\nunlocks more" },
            { x: 110, y: 225, t: "More Missions", s: "Repeat loop\nmore engagement" },
          ].map((n, idx) => (
            <g key={idx}>
              <rect
                x={n.x}
                y={n.y}
                rx="18"
                ry="18"
                width="220"
                height="86"
                fill="white"
                stroke="rgba(0,0,0,0.14)"
              />
              <text x={n.x + 14} y={n.y + 30} fontSize="16" fontWeight="650">
                {n.t}
              </text>
              {String(n.s)
                .split("\n")
                .map((line, i) => (
                  <text key={i} x={n.x + 14} y={n.y + 52 + i * 18} fontSize="13" opacity="0.75">
                    {line}
                  </text>
                ))}
            </g>
          ))}

          {/* Arrows */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(0,0,0,0.5)" />
            </marker>
          </defs>

          {[
            // missions -> upgrade genesis
            { x1: 330, y1: 128, x2: 390, y2: 88 },
            // upgrade genesis -> upgrade weapons
            { x1: 610, y1: 88, x2: 680, y2: 128 },
            // upgrade weapons -> spend
            { x1: 790, y1: 171, x2: 790, y2: 225 },
            // spend -> power
            { x1: 680, y1: 268, x2: 610, y2: 308 },
            // power -> more missions
            { x1: 390, y1: 308, x2: 330, y2: 268 },
            // more missions -> missions
            { x1: 220, y1: 225, x2: 220, y2: 171 },
          ].map((a, idx) => (
            <path
              key={idx}
              d={`M ${a.x1} ${a.y1} L ${a.x2} ${a.y2}`}
              fill="none"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="2.5"
              markerEnd="url(#arrow)"
            />
          ))}

          {/* Caption */}
          <text x="20" y="350" fontSize="12.5" opacity="0.7">
            Notes: Upgrade spend uses the fixed mock sink totals (Genesis: {formatCompact(
              GENESIS_TOTAL_SPEND_BY_RARITY.Common +
                GENESIS_TOTAL_SPEND_BY_RARITY.Uncommon +
                GENESIS_TOTAL_SPEND_BY_RARITY.Rare +
                GENESIS_TOTAL_SPEND_BY_RARITY.Epic
            )} UAP, Weapons: {formatCompact(
              WEAPONS_TOTAL_SPEND_BY_RARITY.Common +
                WEAPONS_TOTAL_SPEND_BY_RARITY.Uncommon +
                WEAPONS_TOTAL_SPEND_BY_RARITY.Rare +
                WEAPONS_TOTAL_SPEND_BY_RARITY.Epic
            )} UAP).
          </text>
        </svg>
      </div>
    </Card>
  );
}

// Named exports already done above; keep a default export optional for convenience.
export default {
  MissionRewardsChart,
  GenesisUpgradeCostByRarityChart,
  WeaponsUpgradeSinkChart,
  AggregateBurnVsTreasuryImpactChart,
  GameplayFlywheelChart,
};

export function SnippetPing() {
  return <div style={{ padding: 16, border: "2px dashed red" }}>SNIPPET LOADED ✅</div>;
}
  