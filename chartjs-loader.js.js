// chartjs-loader.js
(function () {
  if (typeof window === "undefined") return;
  if (window.Chart) return;

  const existing = document.querySelector('script[data-chartjs="true"]');
  if (existing) return;

  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
  s.async = true;
  s.setAttribute("data-chartjs", "true");
  document.head.appendChild(s);
})();
