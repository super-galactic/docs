export function DebugBox() {
  return <div style={{ padding: 12, border: "1px solid red" }}>DEBUG RENDERING</div>;
}

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * EconomyCharts.jsx
 * Requires Chart.js to be present on window.Chart (loaded via /chartjs-loader.js).
 * Exports:
 *  - MissionRewardsChart
 *  - GenesisUpgradeCostByRarityChart
 *  - WeaponsUpgradeSinkChart
 *  - AggregateBurnVsTreasuryImpactChart
 *  - GameplayFlywheelChart (custom SVG diagram, animated)
 */

/* ----------------------------- helpers ----------------------------- */

function useChartJsReady() {
  const [ready, setReady] = useState(
    typeof window !== "undefined" && !!window.Chart
  );

  useEffect(() => {
    if (ready) return;
    if (typeof window === "undefined") return;

    const id = setInterval(() => {
      if (window.Chart) {
        setReady(true);
        clearInterval(id);
      }
    }, 50);

    return () => clearInterval(id);
  }, [ready]);

  return ready;
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 16,
        background: "rgba(0,0,0,0.25)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
        margin: "18px 0",
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
        {subtitle ? (
          <div style={{ opacity: 0.75, marginTop: 4, fontSize: 13 }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Canvas({ height = 340, canvasRef }) {
  return (
    <div style={{ width: "100%", height }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}

function formatNumber(n) {
  try {
    return new Intl.NumberFormat("en-US").format(n);
  } catch {
    return String(n);
  }
}

function destroyChart(chartRef) {
  if (chartRef.current) {
    try {
      chartRef.current.destroy();
    } catch {}
    chartRef.current = null;
  }
}

/* ----------------------------- mock data ----------------------------- */
/**
 * You asked for “exact mock numbers” based on the new rarity distribution:
 * Common 68%, Uncommon 30%, Rare 1.8%, Epic 0.2%
 *
 * Assumptions for modeling (Phase 1, no breeding):
 * - 10,000 Genesis (6 body parts each)
 * - 10,000 Weapons
 * - Upgrade costs increase by rarity and by tier
 * - Every upgrade spend splits 50% Burn / 50% Treasury (Reserve)
 *
 * IMPORTANT: these are investor-friendly illustrative numbers (replace later with live econ tables/analytics).
 */

const TOTAL_GENESIS = 10_000;
const PARTS_PER_GENESIS = 6;
const TOTAL_WEAPONS = 10_000;

const RARITY = [
  { key: "Common", pct: 0.68 },
  { key: "Uncommon", pct: 0.30 },
  { key: "Rare", pct: 0.018 },
  { key: "Epic", pct: 0.002 },
];

function allocationByRarity(total) {
  // integer allocation with rounding handled
  const raw = RARITY.map((r) => ({
    rarity: r.key,
    count: Math.round(total * r.pct),
  }));
  // fix rounding drift
  const sum = raw.reduce((a, b) => a + b.count, 0);
  const drift = total - sum;
  if (drift !== 0) raw[0].count += drift;
  return raw;
}

// Upgrade tier costs (UAP) — tuned to create meaningful sinks
// Genesis: per BODY PART, from Tier 1 -> Tier 5 (5 steps)
const GENESIS_PART_TIER_COSTS = {
  Common: [2_000, 3_000, 4_500, 6_500, 9_000],
  Uncommon: [3_000, 4_500, 6_500, 9_500, 13_500],
  Rare: [5_000, 7_500, 11_000, 16_000, 22_500],
  Epic: [8_000, 12_000, 18_000, 26_000, 36_000],
};

// Weapons: per weapon, 5 upgrade steps as well
const WEAPON_TIER_COSTS = {
  Common: [3_500, 5_000, 7_000, 10_000, 14_000],
  Uncommon: [5_000, 7_500, 10_500, 15_000, 21_000],
  Rare: [8_000, 12_000, 17_000, 24_000, 34_000],
  Epic: [12_000, 18_000, 26_000, 37_000, 52_000],
};

// Mission rewards you provided
const MISSION_REWARDS = [
  { level: "L1", reward: 100 },
  { level: "L2", reward: 150 },
  { level: "L3", reward: 250 },
  { level: "L4", reward: 350 },
  { level: "L5", reward: 500 },
];

/* ----------------------------- charts ----------------------------- */

export function MissionRewardsChart() {
  const ready = useChartJsReady();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ready) return;
    if (!canvasRef.current) return;

    destroyChart(chartRef);

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: MISSION_REWARDS.map((x) => x.level),
        datasets: [
          {
            label: "UAP Reward per Mission (by difficulty)",
            data: MISSION_REWARDS.map((x) => x.reward),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900 },
        plugins: {
          legend: { labels: { color: "rgba(255,255,255,0.85)" } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${formatNumber(ctx.parsed.y)} UAP`,
            },
          },
        },
        scales: {
          x: { ticks: { color: "rgba(255,255,255,0.75)" } },
          y: {
            ticks: { color: "rgba(255,255,255,0.75)" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      },
    });

    return () => destroyChart(chartRef);
  }, [ready]);

  return (
    <ChartCard
      title="Mission Rewards"
      subtitle="Higher difficulty missions earn more UAP. Partial objective completion earns partial rewards."
    >
      {!ready ? <div>Loading charts…</div> : <Canvas height={320} canvasRef={canvasRef} />}
    </ChartCard>
  );
}

export function GenesisUpgradeCostByRarityChart() {
  const ready = useChartJsReady();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const rarityCounts = useMemo(() => allocationByRarity(TOTAL_GENESIS), []);

  const avgMaxCostPerGenesisByRarity = useMemo(() => {
    // total cost to max ALL 6 parts for a single Genesis (by rarity)
    // = sum(tiers) per part * 6
    return rarityCounts.map(({ rarity }) => {
      const perPart = GENESIS_PART_TIER_COSTS[rarity].reduce((a, b) => a + b, 0);
      const perGenesisMax = perPart * PARTS_PER_GENESIS;
      return { rarity, perGenesisMax };
    });
  }, [rarityCounts]);

  useEffect(() => {
    if (!ready) return;
    if (!canvasRef.current) return;

    destroyChart(chartRef);

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: avgMaxCostPerGenesisByRarity.map((x) => x.rarity),
        datasets: [
          {
            label: "UAP to max one Genesis (all 6 parts, illustrative)",
            data: avgMaxCostPerGenesisByRarity.map((x) => x.perGenesisMax),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900 },
        plugins: {
          legend: { labels: { color: "rgba(255,255,255,0.85)" } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${formatNumber(ctx.parsed.y)} UAP`,
            },
          },
        },
        scales: {
          x: { ticks: { color: "rgba(255,255,255,0.75)" } },
          y: {
            ticks: {
              color: "rgba(255,255,255,0.75)",
              callback: (v) => formatNumber(v),
            },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      },
    });

    return () => destroyChart(chartRef);
  }, [ready, avgMaxCostPerGenesisByRarity]);

  return (
    <ChartCard
      title="Genesis Upgrade Cost by Rarity"
      subtitle="Illustrative cost to fully upgrade all 6 body parts. Higher rarity = higher upgrade sink."
    >
      {!ready ? <div>Loading charts…</div> : <Canvas height={320} canvasRef={canvasRef} />}
    </ChartCard>
  );
}

export function WeaponsUpgradeSinkChart() {
  const ready = useChartJsReady();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const weaponCounts = useMemo(() => allocationByRarity(TOTAL_WEAPONS), []);
  const maxCostPerWeaponByRarity = useMemo(() => {
    return weaponCounts.map(({ rarity }) => {
      const perWeaponMax = WEAPON_TIER_COSTS[rarity].reduce((a, b) => a + b, 0);
      return { rarity, perWeaponMax };
    });
  }, [weaponCounts]);

  useEffect(() => {
    if (!ready) return;
    if (!canvasRef.current) return;

    destroyChart(chartRef);

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: maxCostPerWeaponByRarity.map((x) => x.rarity),
        datasets: [
          {
            label: "UAP to max one weapon (illustrative)",
            data: maxCostPerWeaponByRarity.map((x) => x.perWeaponMax),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900 },
        plugins: {
          legend: { labels: { color: "rgba(255,255,255,0.85)" } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${formatNumber(ctx.parsed.y)} UAP`,
            },
          },
        },
        scales: {
          x: { ticks: { color: "rgba(255,255,255,0.75)" } },
          y: {
            ticks: {
              color: "rgba(255,255,255,0.75)",
              callback: (v) => formatNumber(v),
            },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      },
    });

    return () => destroyChart(chartRef);
  }, [ready, maxCostPerWeaponByRarity]);

  return (
    <ChartCard
      title="Weapons Upgrade Sink"
      subtitle="Weapons form a second major upgrade sink alongside Genesis progression."
    >
      {!ready ? <div>Loading charts…</div> : <Canvas height={320} canvasRef={canvasRef} />}
    </ChartCard>
  );
}

export function AggregateBurnVsTreasuryImpactChart() {
  const ready = useChartJsReady();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const {
    totalGenesisSpend,
    totalWeaponSpend,
    totalSpend,
    burned,
    treasury,
    scenarioRows,
  } = useMemo(() => {
    const genesisCounts = allocationByRarity(TOTAL_GENESIS);
    const weaponCounts = allocationByRarity(TOTAL_WEAPONS);

    const perGenesisMaxByRarity = genesisCounts.map(({ rarity, count }) => {
      const perPart = GENESIS_PART_TIER_COSTS[rarity].reduce((a, b) => a + b, 0);
      const perGenesisMax = perPart * PARTS_PER_GENESIS;
      return { rarity, count, perGenesisMax };
    });

    const perWeaponMaxByRarity = weaponCounts.map(({ rarity, count }) => {
      const perWeaponMax = WEAPON_TIER_COSTS[rarity].reduce((a, b) => a + b, 0);
      return { rarity, count, perWeaponMax };
    });

    const genesisMaxAll = perGenesisMaxByRarity.reduce(
      (sum, r) => sum + r.count * r.perGenesisMax,
      0
    );
    const weaponsMaxAll = perWeaponMaxByRarity.reduce(
      (sum, r) => sum + r.count * r.perWeaponMax,
      0
    );

    const total = genesisMaxAll + weaponsMaxAll;
    const burned = Math.floor(total * 0.5);
    const treasury = total - burned;

    // Show 3 adoption scenarios (25% / 50% / 100% max-upgrade participation)
    const scenarioRows = [0.25, 0.5, 1].map((p) => ({
      scenario: `${Math.round(p * 100)}% Adoption`,
      totalSpend: Math.floor(total * p),
      burned: Math.floor(total * p * 0.5),
      treasury: Math.floor(total * p * 0.5),
    }));

    return {
      totalGenesisSpend: genesisMaxAll,
      totalWeaponSpend: weaponsMaxAll,
      totalSpend: total,
      burned,
      treasury,
      scenarioRows,
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!canvasRef.current) return;

    destroyChart(chartRef);

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: scenarioRows.map((x) => x.scenario),
        datasets: [
          {
            label: "Total UAP Spent (Upgrades)",
            data: scenarioRows.map((x) => x.totalSpend),
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3,
          },
          {
            label: "Burned (50%)",
            data: scenarioRows.map((x) => x.burned),
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3,
          },
          {
            label: "Treasury (50%)",
            data: scenarioRows.map((x) => x.treasury),
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900 },
        plugins: {
          legend: { labels: { color: "rgba(255,255,255,0.85)" } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${formatNumber(ctx.parsed.y)} UAP`,
            },
          },
        },
        scales: {
          x: { ticks: { color: "rgba(255,255,255,0.75)" } },
          y: {
            ticks: {
              color: "rgba(255,255,255,0.75)",
              callback: (v) => formatNumber(v),
            },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      },
    });

    return () => destroyChart(chartRef);
  }, [ready, scenarioRows]);

  return (
    <ChartCard
      title="Aggregate Burn vs Treasury Impact"
      subtitle="Illustrative: upgrade spending splits 50% burn + 50% treasury. More player progression = more automatic supply reduction."
    >
      <div style={{ marginBottom: 10, opacity: 0.85, fontSize: 13, lineHeight: 1.5 }}>
        <div>
          Estimated max-upgrade spend (Genesis + Weapons):{" "}
          <b>{formatNumber(totalSpend)} UAP</b>
        </div>
        <div>
          Split: <b>{formatNumber(burned)} UAP burned</b> +{" "}
          <b>{formatNumber(treasury)} UAP to treasury</b>
        </div>
      </div>

      {!ready ? <div>Loading charts…</div> : <Canvas height={360} canvasRef={canvasRef} />}
    </ChartCard>
  );
}

/* ----------------------------- flywheel diagram ----------------------------- */

export function GameplayFlywheelChart() {
  // No Chart.js needed — this is a custom SVG that reads clean and looks “premium”.
  // It animates the ring + arrows subtly.
  const steps = [
    { n: 1, t: "Complete missions", d: "Earn UAP" },
    { n: 2, t: "Upgrade Genesis + Weapons", d: "Spend UAP" },
    { n: 3, t: "Automatic split", d: "50% Burn + 50% Treasury" },
    { n: 4, t: "Circulating supply reduces", d: "Scarcity strengthens" },
    { n: 5, t: "Progression feels valuable", d: "More motivation to play" },
    { n: 6, t: "Activity increases", d: "Flywheel accelerates" },
  ];

  return (
    <ChartCard
      title="The Gameplay Flywheel"
      subtitle="Growth strengthens the economy: more gameplay → more spending → more automatic burns → stronger scarcity."
    >
      <style>{`
        @keyframes sg-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sg-pulse { 0%,100% { opacity: .55 } 50% { opacity: .95 } }
        .sg-ring { transform-origin: 50% 50%; animation: sg-spin 24s linear infinite; }
        .sg-grid { animation: sg-pulse 3.2s ease-in-out infinite; }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 14,
          alignItems: "center",
        }}
      >
        {/* Left: diagram */}
        <div style={{ borderRadius: 16, overflow: "hidden" }}>
          <svg
            viewBox="0 0 920 520"
            width="100%"
            height="auto"
            style={{
              display: "block",
              background:
                "radial-gradient(circle at 50% 40%, rgba(0,255,255,0.08), rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.35) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
            }}
          >
            {/* soft grid */}
            <g className="sg-grid" opacity="0.65">
              {Array.from({ length: 16 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={40 + i * 55}
                  y1={20}
                  x2={40 + i * 55}
                  y2={500}
                  stroke="rgba(255,255,255,0.06)"
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={20}
                  y1={40 + i * 45}
                  x2={900}
                  y2={40 + i * 45}
                  stroke="rgba(255,255,255,0.06)"
                />
              ))}
            </g>

            {/* ring */}
            <g className="sg-ring">
              <circle
                cx="460"
                cy="265"
                r="155"
                fill="none"
                stroke="rgba(0,255,255,0.22)"
                strokeWidth="14"
              />
              <circle
                cx="460"
                cy="265"
                r="155"
                fill="none"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="2"
                strokeDasharray="8 10"
              />
              {/* arrows */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI) / 4;
                const x = 460 + Math.cos(angle) * 155;
                const y = 265 + Math.sin(angle) * 155;
                const x2 = 460 + Math.cos(angle + 0.28) * 155;
                const y2 = 265 + Math.sin(angle + 0.28) * 155;
                return (
                  <line
                    key={i}
                    x1={x}
                    y1={y}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(0,255,255,0.35)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>

            {/* center */}
            <circle
              cx="460"
              cy="265"
              r="92"
              fill="rgba(0,0,0,0.55)"
              stroke="rgba(255,255,255,0.10)"
            />
            <text
              x="460"
              y="252"
              textAnchor="middle"
              fill="rgba(255,255,255,0.92)"
              fontSize="26"
              fontWeight="700"
            >
              Super Galactic
            </text>
            <text
              x="460"
              y="286"
              textAnchor="middle"
              fill="rgba(255,255,255,0.70)"
              fontSize="14"
            >
              Self-Reinforcing Economy
            </text>

            {/* nodes */}
            {steps.map((s, i) => {
              const a = (-Math.PI / 2) + (i * (2 * Math.PI)) / steps.length;
              const x = 460 + Math.cos(a) * 250;
              const y = 265 + Math.sin(a) * 190;

              return (
                <g key={s.n}>
                  <circle
                    cx={x}
                    cy={y}
                    r="52"
                    fill="rgba(0,0,0,0.55)"
                    stroke="rgba(0,255,255,0.22)"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.92)"
                    fontSize="16"
                    fontWeight="700"
                  >
                    {s.n}
                  </text>
                  <text
                    x={x}
                    y={y + 16}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.75)"
                    fontSize="12"
                  >
                    {s.d}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: legend text */}
        <div style={{ opacity: 0.92 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
            How the flywheel compounds
          </div>
          <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            <li><b>Missions</b> distribute rewards based on activity.</li>
            <li><b>Upgrades</b> convert rewards into progression (spend).</li>
            <li><b>Every spend</b> triggers an automatic <b>Burn + Treasury</b> split.</li>
            <li><b>Burns</b> steadily reduce circulating supply over time.</li>
            <li><b>Scarcity</b> supports long-term economy health.</li>
            <li><b>Growth</b> increases both gameplay and supply control.</li>
          </ol>
        </div>
      </div>
    </ChartCard>
  );
}
