---
title: "Snippets Economy Charts"
---

import React, { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    Chart?: any;
  }
}

type Props = {
  totalSupply?: number;

  circulatingExample?: Array<{ period: string; circulating: number }>;

  spendBurnReserveExample?: Array<{
    period: string;
    totalSpend: number;
    burned: number;
    reserved: number;
  }>;

  sinkMixExample?: Array<{ name: string; value: number }>;

  height?: number;
};

function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat("en-US").format(n);
  } catch {
    return String(n);
  }
}

export default function EconomyCharts({
  totalSupply = 420000000000,
  circulatingExample = [
    { period: "Week 1", circulating: 2000000000 },
    { period: "Week 2", circulating: 2300000000 },
    { period: "Week 3", circulating: 2550000000 },
    { period: "Week 4", circulating: 2700000000 }
  ],
  spendBurnReserveExample = [
    { period: "Low Activity", totalSpend: 1000000, burned: 500000, reserved: 500000 },
    { period: "Normal Activity", totalSpend: 2000000, burned: 1000000, reserved: 1000000 },
    { period: "High Activity", totalSpend: 3500000, burned: 1750000, reserved: 1750000 }
  ],
  sinkMixExample = [
    { name: "Upgrades", value: 55 },
    { name: "Breeding", value: 35 },
    { name: "Other Progression", value: 10 }
  ],
  height = 320
}: Props) {
  const supplyRef = useRef<HTMLCanvasElement | null>(null);
  const burnRef = useRef<HTMLCanvasElement | null>(null);
  const sinkRef = useRef<HTMLCanvasElement | null>(null);

  const supplyChartInstance = useRef<any>(null);
  const burnChartInstance = useRef<any>(null);
  const sinkChartInstance = useRef<any>(null);

  const [ready, setReady] = useState(false);

  const supplyLabels = useMemo(() => circulatingExample.map((x) => x.period), [circulatingExample]);
  const circulatingSeries = useMemo(() => circulatingExample.map((x) => x.circulating), [circulatingExample]);
  const totalSeries = useMemo(() => circulatingExample.map(() => totalSupply), [circulatingExample, totalSupply]);

  const burnLabels = useMemo(() => spendBurnReserveExample.map((x) => x.period), [spendBurnReserveExample]);
  const burnedSeries = useMemo(() => spendBurnReserveExample.map((x) => x.burned), [spendBurnReserveExample]);
  const reservedSeries = useMemo(() => spendBurnReserveExample.map((x) => x.reserved), [spendBurnReserveExample]);

  const sinkLabels = useMemo(() => sinkMixExample.map((x) => x.name), [sinkMixExample]);
  const sinkValues = useMemo(() => sinkMixExample.map((x) => x.value), [sinkMixExample]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (window.Chart) {
        setReady(true);
        window.clearInterval(id);
      }
    }, 50);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready || !window.Chart) return;

    const Chart = window.Chart;

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: "easeOutQuart" },
      plugins: {
        legend: {
          labels: {
            color: "rgba(255,255,255,0.78)"
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(10, 14, 18, 0.95)",
          borderColor: "rgba(22, 163, 74, 0.7)",
          borderWidth: 1,
          titleColor: "rgba(255,255,255,0.92)",
          bodyColor: "rgba(255,255,255,0.86)",
          padding: 12,
          displayColors: true
        }
      },
      scales: {
        x: {
          ticks: { color: "rgba(255,255,255,0.65)" },
          grid: { color: "rgba(255,255,255,0.06)" }
        },
        y: {
          ticks: {
            color: "rgba(255,255,255,0.65)",
            callback: (value: any) => formatNumber(Number(value))
          },
          grid: { color: "rgba(255,255,255,0.06)" }
        }
      }
    };

    // 1) Supply chart
    const supplyCtx = supplyRef.current?.getContext("2d");
    if (supplyCtx) {
      if (supplyChartInstance.current) supplyChartInstance.current.destroy();

      supplyChartInstance.current = new Chart(supplyCtx, {
        type: "line",
        data: {
          labels: supplyLabels,
          datasets: [
            {
              label: "Total Supply (Fixed Cap)",
              data: totalSeries,
              borderColor: "rgba(22, 163, 74, 0.9)",
              backgroundColor: "rgba(22, 163, 74, 0.12)",
              pointRadius: 0,
              borderWidth: 2,
              tension: 0.3
            },
            {
              label: "Circulating (Example)",
              data: circulatingSeries,
              borderColor: "rgba(56, 189, 248, 0.9)",
              backgroundColor: "rgba(56, 189, 248, 0.10)",
              pointRadius: 3,
              pointHoverRadius: 5,
              borderWidth: 2,
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          ...commonOptions,
          interaction: { mode: "index", intersect: false }
        }
      });
    }

    // 2) Burn vs reserve chart
    const burnCtx = burnRef.current?.getContext("2d");
    if (burnCtx) {
      if (burnChartInstance.current) burnChartInstance.current.destroy();

      burnChartInstance.current = new Chart(burnCtx, {
        type: "bar",
        data: {
          labels: burnLabels,
          datasets: [
            {
              label: "Burned (50%)",
              data: burnedSeries,
              backgroundColor: "rgba(248, 113, 113, 0.65)",
              borderColor: "rgba(248, 113, 113, 0.95)",
              borderWidth: 1
            },
            {
              label: "Reserve (50%)",
              data: reservedSeries,
              backgroundColor: "rgba(22, 163, 74, 0.55)",
              borderColor: "rgba(22, 163, 74, 0.9)",
              borderWidth: 1
            }
          ]
        },
        options: {
          ...commonOptions,
          scales: {
            ...commonOptions.scales,
            x: { ...commonOptions.scales.x, stacked: true },
            y: { ...commonOptions.scales.y, stacked: true }
          }
        }
      });
    }

    // 3) Sink mix chart
    const sinkCtx = sinkRef.current?.getContext("2d");
    if (sinkCtx) {
      if (sinkChartInstance.current) sinkChartInstance.current.destroy();

      sinkChartInstance.current = new Chart(sinkCtx, {
        type: "doughnut",
        data: {
          labels: sinkLabels,
          datasets: [
            {
              label: "Sink Mix (Example)",
              data: sinkValues,
              backgroundColor: [
                "rgba(56, 189, 248, 0.70)",
                "rgba(22, 163, 74, 0.65)",
                "rgba(167, 139, 250, 0.65)"
              ],
              borderColor: "rgba(255,255,255,0.10)",
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800, easing: "easeOutQuart" },
          plugins: {
            legend: { labels: { color: "rgba(255,255,255,0.78)" } },
            tooltip: commonOptions.plugins.tooltip
          },
          cutout: "62%"
        }
      });
    }

    return () => {
      if (supplyChartInstance.current) supplyChartInstance.current.destroy();
      if (burnChartInstance.current) burnChartInstance.current.destroy();
      if (sinkChartInstance.current) sinkChartInstance.current.destroy();
      supplyChartInstance.current = null;
      burnChartInstance.current = null;
      sinkChartInstance.current = null;
    };
  }, [
    ready,
    supplyLabels,
    circulatingSeries,
    totalSeries,
    burnLabels,
    burnedSeries,
    reservedSeries,
    sinkLabels,
    sinkValues
  ]);

  if (!ready) {
    return (
      <div style={{ padding: 12, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
        Loading charts…
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Capped Supply vs Circulating Supply</div>
        <div style={{ width: "100%", height }}>
          <canvas ref={supplyRef} />
        </div>
        <div style={{ marginTop: 8, opacity: 0.75, fontSize: 13 }}>
          Note: Circulating supply is illustrative. Total supply remains fixed.
        </div>
      </div>

      <div>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>In-Game Spending Drives Automatic Burns</div>
        <div style={{ width: "100%", height }}>
          <canvas ref={burnRef} />
        </div>
        <div style={{ marginTop: 8, opacity: 0.75, fontSize: 13 }}>
          Each in-game spend follows the fixed split. Higher activity increases total burns because burns are triggered by usage.
        </div>
      </div>

      <div>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Where UAP Gets Spent</div>
        <div style={{ width: "100%", height }}>
          <canvas ref={sinkRef} />
        </div>
        <div style={{ marginTop: 8, opacity: 0.75, fontSize: 13 }}>
          Note: This sink mix is illustrative. Replace values with live analytics when available.
        </div>
      </div>
    </div>
  );
}
