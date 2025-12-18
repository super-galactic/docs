return (
  <div style={{ color: "white" }}>
    ready: {String(ready)} | hasChart:{" "}
    {String(typeof window !== "undefined" && !!window.Chart)}
  </div>
);


import React, { useEffect, useRef, useState } from "react";

export default function EconomyCharts() {
  const supplyRef = useRef(null);
  const burnRef = useRef(null);
  const sinkRef = useRef(null);

  const supplyChart = useRef(null);
  const burnChart = useRef(null);
  const sinkChart = useRef(null);

  const [ready, setReady] = useState(false);

  const TOTAL_SUPPLY = 420000000000;

  const circulatingSupplyExample = [
    { period: "Week 1", circulating: 2000000000 },
    { period: "Week 2", circulating: 2300000000 },
    { period: "Week 3", circulating: 2550000000 },
    { period: "Week 4", circulating: 2700000000 }
  ];

  const spendBurnReserveExample = [
    { label: "Low Activity", burned: 500000, reserve: 500000 },
    { label: "Normal Activity", burned: 1000000, reserve: 1000000 },
    { label: "High Activity", burned: 1750000, reserve: 1750000 }
  ];

  const sinkMixExample = {
    labels: ["Upgrades", "Breeding", "Other Progression"],
    values: [55, 35, 10]
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (window.Chart) {
        setReady(true);
        clearInterval(id);
      }
    }, 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready || !window.Chart) return;

    const Chart = window.Chart;

    const gridColor = "rgba(255,255,255,0.06)";
    const tickColor = "rgba(255,255,255,0.65)";

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800 },
      plugins: {
        legend: { labels: { color: "rgba(255,255,255,0.78)" } },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(10,14,18,0.95)",
          borderColor: "rgba(22,163,74,0.7)",
          borderWidth: 1,
          titleColor: "rgba(255,255,255,0.92)",
          bodyColor: "rgba(255,255,255,0.86)",
          padding: 12
        }
      },
      scales: {
        x: { ticks: { color: tickColor }, grid: { color: gridColor } },
        y: { ticks: { color: tickColor }, grid: { color: gridColor } }
      }
    };

    // Supply chart
    const sctx = supplyRef.current && supplyRef.current.getContext("2d");
    if (sctx) {
      if (supplyChart.current) supplyChart.current.destroy();
      supplyChart.current = new Chart(sctx, {
        type: "line",
        data: {
          labels: circulatingSupplyExample.map((x) => x.period),
          datasets: [
            {
              label: "Total Supply (Fixed Cap)",
              data: circulatingSupplyExample.map(() => TOTAL_SUPPLY),
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.3
            },
            {
              label: "Circulating (Example)",
              data: circulatingSupplyExample.map((x) => x.circulating),
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: { ...baseOptions, interaction: { mode: "index", intersect: false } }
      });
    }

    // Burn vs reserve chart
    const bctx = burnRef.current && burnRef.current.getContext("2d");
    if (bctx) {
      if (burnChart.current) burnChart.current.destroy();
      burnChart.current = new Chart(bctx, {
        type: "bar",
        data: {
          labels: spendBurnReserveExample.map((x) => x.label),
          datasets: [
            { label: "Burned (50%)", data: spendBurnReserveExample.map((x) => x.burned) },
            { label: "Reserve (50%)", data: spendBurnReserveExample.map((x) => x.reserve) }
          ]
        },
        options: {
          ...baseOptions,
          scales: {
            ...baseOptions.scales,
            x: { ...baseOptions.scales.x, stacked: true },
            y: { ...baseOptions.scales.y, stacked: true }
          }
        }
      });
    }

    // Sink mix chart
    const pctx = sinkRef.current && sinkRef.current.getContext("2d");
    if (pctx) {
      if (sinkChart.current) sinkChart.current.destroy();
      sinkChart.current = new Chart(pctx, {
        type: "doughnut",
        data: {
          labels: sinkMixExample.labels,
          datasets: [{ label: "Sink Mix (Example)", data: sinkMixExample.values }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: baseOptions.plugins,
          cutout: "62%"
        }
      });
    }

    return () => {
      if (supplyChart.current) supplyChart.current.destroy();
      if (burnChart.current) burnChart.current.destroy();
      if (sinkChart.current) sinkChart.current.destroy();
      supplyChart.current = null;
      burnChart.current = null;
      sinkChart.current = null;
    };
  }, [ready]);

  if (!ready) return <div>Loading charts...</div>;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ height: 320 }}><canvas ref={supplyRef} /></div>
      <div style={{ height: 320 }}><canvas ref={burnRef} /></div>
      <div style={{ height: 320 }}><canvas ref={sinkRef} /></div>
    </div>
  );
}