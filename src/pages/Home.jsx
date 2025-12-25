import React, { useEffect, useState } from "react";
import "./home.css";
import { supabase } from "../utils/supabase";

export default function Home() {
  const [stats, setStats] = useState({
    messages: { total: 0, unread: 0, chart: [] },
    projects: { total: 0, chart: [] },
    skills: { total: 0 },
    experiences: { total: 0 },
    categories: {}
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    // Update bar animations when stats load
    const bars = document.querySelectorAll(".bar");
    bars.forEach((b) => {
      const v = Number(b.getAttribute("data-value") || 0);
      const fill = b.querySelector("span");
      if (fill) {
        requestAnimationFrame(() => (fill.style.width = Math.min(100, Math.max(0, v)) + "%"));
      }
    });
  }, [stats.categories]);

  const loadStats = async () => {
    try {
      // Load messages
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('id, status, created_at')
        .order('created_at', { ascending: false });
      
      if (msgError) throw msgError;
      const unreadCount = (messages || []).filter(m => m.status === "New" || m.status === "Unread" || !m.status).length;
      const messagesChart = generateMonthlyChart(messages || [], 10);

      // Load projects
      const { data: projects, error: projError } = await supabase
        .from('projects')
        .select('id, category, created_at')
        .order('created_at', { ascending: false });
      
      if (projError) throw projError;
      const projectsChart = generateMonthlyChart(projects || [], 10);
      
      // Calculate category distribution
      const categoryCounts = {};
      (projects || []).forEach(p => {
        const cat = p.category || 'Uncategorized';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      const totalProjects = (projects || []).length;
      const categoryPercentages = {};
      Object.keys(categoryCounts).forEach(cat => {
        categoryPercentages[cat] = totalProjects > 0 
          ? Math.round((categoryCounts[cat] / totalProjects) * 100) 
          : 0;
      });

      // Load skills
      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('id');
      if (skillsError) throw skillsError;

      // Load experiences
      const { data: experiences, error: expError } = await supabase
        .from('experience')
        .select('id');
      if (expError) throw expError;

      // Generate recent activity (combine messages, projects, experiences)
      const activities = [];
      (messages || []).slice(0, 5).forEach(m => {
        activities.push({
          text: `New message received`,
          time: new Date(m.created_at),
          type: 'message'
        });
      });
      (projects || []).slice(0, 3).forEach(p => {
        activities.push({
          text: `Project "${p.title || 'Untitled'}" added`,
          time: new Date(p.created_at),
          type: 'project'
        });
      });
      // Sort by date descending
      activities.sort((a, b) => b.time - a.time);
      // Format times for display
      const formattedActivities = activities.slice(0, 5).map(a => ({
        ...a,
        time: formatTimeAgo(a.time)
      }));
      setRecentActivity(formattedActivities);

      setStats({
        messages: { total: messages?.length || 0, unread: unreadCount, chart: messagesChart },
        projects: { total: totalProjects, chart: projectsChart },
        skills: { total: skills?.length || 0 },
        experiences: { total: experiences?.length || 0 },
        categories: categoryPercentages
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyChart = (data, count = 10) => {
    const now = new Date();
    const months = [];
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const countInMonth = data.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= monthStart && itemDate <= monthEnd;
      }).length;
      
      months.push(countInMonth);
    }
    return months;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const MiniChart = ({ values = [] }) => {
    const width = 160;
    const height = 90;
    const padding = 10;
    const labelGutter = 18; 
    const left = padding;
    const right = width - padding - labelGutter;
    const top = padding + 6;
    const bottom = height - padding - 6;
   
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

    
    const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const months = values.map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (values.length - 1 - i), 1);
      return names[d.getMonth()];
    });

  
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
              {}
              <text x={right + 4} y={y + 3} className="tick-label-y" textAnchor="start">
                {fmt(tv)}
              </text>
            </g>
          );
        })}
        {}
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="axis-line" />
        <line x1={left} y1={bottom} x2={left} y2={top} className="axis-line" />
        {}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <path d={area} className="area" fill="url(#areaGrad)" />
        <path d={d} className="line" />
        {}
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

  const categoryEntries = Object.entries(stats.categories || {}).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading dashboard...</div>;
  }

  return (
    <>
      <section className="grid">
        <article className="card">
          <h3>Messages</h3>
          <p className="sub">
            <img className="icon-s" src="/icons/mail.svg" alt="" /> 
            {stats.messages.unread} Unread of {stats.messages.total} Total
          </p>
          <div className="chart">
            <MiniChart values={stats.messages.chart.length > 0 ? stats.messages.chart : [0,0,0,0,0,0,0,0,0,0]} />
          </div>
        </article>

        <article className="card">
          <h3>Skills</h3>
          <p className="sub">
            <img className="icon-s" src="/icons/star.svg" alt="" /> 
            {stats.skills.total} Skills
          </p>
          <div className="chart">
            <MiniChart values={stats.projects.chart.length > 0 ? stats.projects.chart : [0,0,0,0,0,0,0,0,0,0]} />
          </div>
        </article>

        <article className="card">
          <h3>Projects</h3>
          <p className="sub">
            <img className="icon-s" src="/icons/folder.svg" alt="" /> 
            {stats.projects.total} Projects
          </p>
          <div className="chart">
            <MiniChart values={stats.projects.chart.length > 0 ? stats.projects.chart : [0,0,0,0,0,0,0,0,0,0]} />
          </div>
        </article>

        <article className="card">
          <h3>Experience</h3>
          <p className="sub">
            <img className="icon-s" src="/icons/eye.svg" alt="" /> 
            {stats.experiences.total} Experiences
          </p>
          <div className="chart">
            <MiniChart values={stats.projects.chart.length > 0 ? stats.projects.chart : [0,0,0,0,0,0,0,0,0,0]} />
          </div>
        </article>
      </section>

      {categoryEntries.length > 0 && (
        <section className="wide">
          <h3>Category Performance</h3>
          <div className="rows">
            {categoryEntries.map(([category, percentage]) => (
              <div key={category} className="row">
                <span className="label">{category || 'Uncategorized'}</span>
                <div className="bar" data-value={percentage}><span /></div>
                <span className="pct">{percentage}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="activity wide">
        <h3>Recent Activity</h3>
        <ul>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <li key={idx}>
                <span>{activity.text}</span>
                <time>{activity.time}</time>
              </li>
            ))
          ) : (
            <li><span>No recent activity</span></li>
          )}
        </ul>
      </section>
    </>
  );
}


