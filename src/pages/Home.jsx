import React, { useEffect } from "react";
import "./home.css";

export default function Home() {
  useEffect(() => {
    // animate performance bars after mount
    const bars = document.querySelectorAll(".bar");
    bars.forEach((b) => {
      const v = Number(b.getAttribute("data-value") || 0);
      const fill = b.querySelector("span");
      requestAnimationFrame(() => (fill.style.width = Math.min(100, Math.max(0, v)) + "%"));
    });
  }, []);

  const MiniChart = ({ values = [] }) => {
    const width = 160;
    const height = 90;
    const padding = 10;
    const labelGutter = 18; // space on the right for numeric ticks
    const left = padding;
    const right = width - padding - labelGutter;
    const top = padding + 6;
    const bottom = height - padding - 6;
    // Normalize incoming values to 0..100 so we can display fixed tick labels (0,20,50,80,100)
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const rawRange = rawMax - rawMin || 1;
    const min = 0;
    const max = 100;
    const range = 100;
    const stepX = (right - left) / (values.length - 1 || 1);

    const toPct = (v) => Math.max(0, Math.min(100, ((v - rawMin) / rawRange) * 100));
    const pts = values.map((v, i) => {
      const p = toPct(v);
      return {
        x: left + i * stepX,
        y: bottom - (p / 100) * (bottom - top)
      };
    });

    // Catmull–Rom smoothing to cubic Bezier
    const pathFrom = (p) => {
      if (!p.length) return "";
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
    };

    const d = pathFrom(pts);
    const area = `${d} L ${right} ${bottom} L ${left} ${bottom} Z`;

    // Build month labels (last N months)
    const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const months = values.map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (values.length - 1 - i), 1);
      return names[d.getMonth()];
    });

    // y ticks
    // Fixed y-axis labels as requested
    const tickVals = [0, 20, 50, 80, 100];
    const fmt = (n) => String(n);

    return (
      <svg className="mini-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* grid and y ticks */}
        {tickVals.map((tv, i) => {
          const y = bottom - (tv / 100) * (bottom - top);
          return (
            <g key={i}>
              <line x1={left} y1={y} x2={right} y2={y} className="grid-line" />
              {/* place numbers just outside the plot area on the right */}
              <text x={right + 4} y={y + 3} className="tick-label-y" textAnchor="start">
                {fmt(tv)}
              </text>
            </g>
          );
        })}
        {/* axis */}
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="axis-line" />
        <line x1={left} y1={bottom} x2={left} y2={top} className="axis-line" />
        {/* area + line */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <path d={area} className="area" fill="url(#areaGrad)" />
        <path d={d} className="line" />
        {/* x labels (months) - show ~4 labels */}
        {months.map((m, i) => {
          const step = Math.max(1, Math.ceil(values.length / 4));
          if (i % step !== 0) return null;
          const x = left + i * stepX;
          return (
            <text key={i} x={x} y={Math.min(height - 4, bottom + 10)} className="tick-label" textAnchor="middle">
              {m}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <>
      <section className="grid">
        <article className="card">
          <h3>Messages Card</h3>
          <p className="sub"><img className="icon-s" src="/icons/mail.svg" alt="" /> 12,000 Messages Unread</p>
          <div className="chart"><MiniChart values={[8,10,12,9,13,16,14,18,22,20]} /></div>
        </article>

        <article className="card">
          <h3>Most Viewed</h3>
          <p className="sub"><img className="icon-s" src="/icons/star.svg" alt="" /> 12,000 Viewers</p>
          <div className="chart"><MiniChart values={[6,7,8,9,11,12,12,14,16,17]} /></div>
        </article>

        <article className="card">
          <h3>Project Views</h3>
          <p className="sub"><img className="icon-s" src="/icons/folder.svg" alt="" /> 12,000 Viewers</p>
          <div className="chart"><MiniChart values={[5,6,9,12,11,13,15,17,16,19]} /></div>
        </article>

        <article className="card">
          <h3>Visitors</h3>
          <p className="sub"><img className="icon-s" src="/icons/eye.svg" alt="" /> 12,000 Visitor</p>
          <div className="chart"><MiniChart values={[7,8,7,11,12,15,18,21,23,22]} /></div>
        </article>
      </section>

      <section className="wide">
        <h3>Category Performance</h3>
        <div className="rows">
          <div className="row">
            <span className="label">Graphic Design</span>
            <div className="bar" data-value="30"><span /></div>
            <span className="pct">30%</span>
          </div>
          <div className="row">
            <span className="label">Web Design</span>
            <div className="bar" data-value="40"><span /></div>
            <span className="pct">40%</span>
          </div>
          <div className="row">
            <span className="label">App Design</span>
            <div className="bar" data-value="80"><span /></div>
            <span className="pct">80%</span>
          </div>
          <div className="row">
            <span className="label">3D</span>
            <div className="bar" data-value="70"><span /></div>
            <span className="pct">70%</span>
          </div>
        </div>
      </section>

      <section className="activity wide">
        <h3>Recent Activity</h3>
        <ul>
          <li>
            <span>Updated Zoo Website</span>
            <time>10 min ago</time>
          </li>
          <li>
            <span>Added 3D Project</span>
            <time>1 hour ago</time>
          </li>
          <li>
            <span>Edited Profile Picture</span>
            <time>Yesterday</time>
          </li>
        </ul>
      </section>
    </>
  );
}


