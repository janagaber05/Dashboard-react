// moved from components/dashboard.js
// Animate performance bars from their data-value attributes
window.addEventListener("DOMContentLoaded", () => {
  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar) => {
    const value = Number(bar.getAttribute("data-value") || 0);
    const fill = bar.querySelector("span");
    requestAnimationFrame(() => {
      fill.style.width = Math.max(0, Math.min(100, value)) + "%";
    });
  });

  // Menu bar behavior moved to public/components/nav.js

  // Render realistic mini charts
  document.querySelectorAll(".mini-chart").forEach((svg, index) => {
    const valuesAttr = svg.getAttribute("data-values");
    const values = (valuesAttr ? valuesAttr.split(",").map(Number) : []).filter(
      (n) => !Number.isNaN(n)
    );
    const data = values.length ? values : generateSeries(12, { start: 10, volatility: 2.2, trend: 0.4 });
    renderMiniChart(svg, data, { padding: 10, showPoints: false });
  });
});

function generateSeries(length, { start = 10, volatility = 2, trend = 0.2 } = {}) {
  const arr = [];
  let v = start;
  for (let i = 0; i < length; i++) {
    const drift = (Math.random() - 0.5) * volatility + trend;
    v = Math.max(1, v + drift);
    arr.push(Number(v.toFixed(2)));
  }
  return arr;
}

function renderMiniChart(svg, series, { padding = 8, showPoints = false } = {}) {
  const width = 160;
  const height = 90;
  // Clear previous
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // Chart area
  const left = padding;
  const right = width - padding;
  const top = padding + 6;
  const bottom = height - padding - 6;

  // Make a "nice" y-scale for realistic ticks
  const rawMin = Math.min(...series);
  const rawMax = Math.max(...series);
  const pad = (rawMax - rawMin || 1) * 0.15;
  const { niceMin, niceMax, tickSpacing, ticks } = niceScale(rawMin - pad, rawMax + pad, 4);
  const min = niceMin;
  const max = niceMax;
  const range = max - min || 1;

  const stepX = (right - left) / (series.length - 1);
  const points = series.map((v, i) => {
    const x = left + i * stepX;
    const y = bottom - ((v - min) / range) * (bottom - top);
    return { x, y };
  });

  // X-axis month labels (left to right, older -> newer)
  const monthsAttr = svg.getAttribute("data-months");
  const monthLabels = monthsAttr
    ? monthsAttr.split(",").map((s) => s.trim())
    : getMonthLabels(series.length);

  // Defs: gradient for area
  const defs = el("defs");
  const gradId = "areaGrad-" + Math.random().toString(36).slice(2);
  const grad = el("linearGradient", { id: gradId, x1: "0", y1: "0", x2: "0", y2: "1" });
  grad.appendChild(el("stop", { offset: "0%", "stop-color": "rgba(255,255,255,0.35)" }));
  grad.appendChild(el("stop", { offset: "100%", "stop-color": "rgba(255,255,255,0)" }));
  defs.appendChild(grad);
  svg.appendChild(defs);

  // Grid lines + y tick labels
  ticks.forEach((tv, i) => {
    const y = bottom - ((tv - min) / range) * (bottom - top);
    svg.appendChild(
      el("line", {
        x1: left,
        y1: y,
        x2: right,
        y2: y,
        class: "grid-line",
      })
    );
    svg.appendChild(
      el("text", { x: right - 2, y: y + 3, class: "tick-label", "text-anchor": "end" }, formatNumber(tv))
    );
  });
  // Axis (baseline)
  svg.appendChild(el("line", { x1: left, y1: bottom, x2: right, y2: bottom, class: "axis-line" }));
  // Y axis
  svg.appendChild(el("line", { x1: left, y1: bottom, x2: left, y2: top, class: "axis-line" }));

  // X tick labels (months) - not every point to avoid clutter
  const labelStep = Math.max(1, Math.ceil(series.length / 4));
  monthLabels.forEach((label, i) => {
    if (i % labelStep !== 0) return;
    const x = left + i * stepX;
    const y = Math.min(height - 4, bottom + 10);
    svg.appendChild(
      el("text", { x, y, class: "tick-label", "text-anchor": "middle" }, label)
    );
  });

  // Smooth path and area
  const linePath = pathFromPoints(points);
  const areaPath = `${linePath} L ${right} ${bottom} L ${left} ${bottom} Z`;
  svg.appendChild(el("path", { d: areaPath, class: "area", fill: `url(#${gradId})` }));
  const glow = el("path", { d: linePath, class: "line", opacity: "0.35" });
  glow.setAttribute("stroke-width", "5");
  svg.appendChild(glow);
  const mainLine = el("path", { d: linePath, class: "line" });
  svg.appendChild(mainLine);

  // Animate line draw
  [glow, mainLine].forEach((p, idx) => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = String(L);
    p.style.strokeDashoffset = String(L);
    requestAnimationFrame(() => {
      p.style.transition = "stroke-dashoffset 900ms ease-out";
      p.style.strokeDashoffset = "0";
    });
  });

  // Points
  if (showPoints) {
    points.forEach((p) => {
      svg.appendChild(el("circle", { cx: p.x, cy: p.y, r: 2.2, class: "point" }));
    });
  }
}

function el(name, attrs = {}, text) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  if (text != null) n.textContent = String(text);
  return n;
}

// Catmull–Rom to Bezier conversion for a smooth path
function pathFromPoints(pts) {
  if (!pts.length) return "";
  const p = pts;
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p[i + 1];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// Compute a nice scale like chart libs do
function niceScale(min, max, maxTicks = 5) {
  const niceRange = niceNum(max - min, false);
  const tickSpacing = niceNum(niceRange / (maxTicks - 1), true);
  const niceMin = Math.floor(min / tickSpacing) * tickSpacing;
  const niceMax = Math.ceil(max / tickSpacing) * tickSpacing;
  const ticks = [];
  for (let v = niceMin; v <= niceMax + 1e-9; v += tickSpacing) {
    ticks.push(roundDec(v));
  }
  return { niceMin, niceMax, tickSpacing, ticks };
}

function niceNum(range, round) {
  const exp = Math.floor(Math.log10(range));
  const f = range / Math.pow(10, exp);
  let nf;
  if (round) {
    if (f < 1.5) nf = 1;
    else if (f < 3) nf = 2;
    else if (f < 7) nf = 5;
    else nf = 10;
  } else {
    if (f <= 1) nf = 1;
    else if (f <= 2) nf = 2;
    else if (f <= 5) nf = 5;
    else nf = 10;
  }
  return nf * Math.pow(10, exp);
}

function roundDec(n) {
  return Math.round(n * 100) / 100;
}

function formatNumber(n) {
  const abs = Math.abs(n);
  if (abs >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(Math.round(n));
}

function getMonthLabels(count) {
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  const labels = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(names[d.getMonth()]);
  }
  return labels;
}


