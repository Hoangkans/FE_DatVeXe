import PropTypes from "prop-types";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import PlaceIcon from "@mui/icons-material/Place";
import "../../styles/AdminDashboard.css";

/* ---- Local UI helpers inlined to keep dashboard self-contained ---- */

function StatCard({ title, value, trend = null, trendType = "up", icon = null }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">{icon}</div>
      <div className="admin-stat-title">{title}</div>
      <div className="admin-stat-value">{value}</div>
      {trend && (
        <div className={
          "admin-stat-trend " + (trendType === "down" ? "is-down" : trendType === "neutral" ? "is-neutral" : "is-up")
        }>
          {trend}
        </div>
      )}
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]).isRequired,
  trend: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  trendType: PropTypes.oneOf(["up", "down", "neutral"]),
  icon: PropTypes.node,
};

// defaultProps removed for function component — using default parameters instead

function BarChart({ title, data = [], labels = [] }) {
  const w = 600; const h = 240; const pad = 28; const innerW = w - pad * 2; const innerH = h - pad * 2;
  const max = Math.max(1, ...data);
  const barW = (innerW / (data.length || 1)) * 0.6;
  return (
    <div className="chart-root">
      <div className="admin-panel-title">{title}</div>
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`}>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} className="chart-axis" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} className="chart-axis" />
        {data.map((v, i) => {
          const x = pad + (innerW / data.length) * i + (innerW / data.length - barW) / 2;
          const barH = (v / max) * (innerH - 10);
          const y = h - pad - barH;
          return <rect key={i} x={x} y={y} width={barW} height={barH} rx="6" className="chart-bar" />;
        })}
        {labels.map((t, i) => {
          const x = pad + (innerW / labels.length) * (i + 0.5);
          return (
            <text key={i} x={x} y={h - pad + 16} fontSize="10" textAnchor="middle" fill="#64748b">{t}</text>
          );
        })}
      </svg>
    </div>
  );
}

BarChart.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  data: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
};

function LineChart({ title, data = [], labels = [] }) {
  const w = 600; const h = 240; const pad = 28; const innerW = w - pad * 2; const innerH = h - pad * 2;
  const max = Math.max(1, ...data);
  const points = data.map((v, i) => {
    const x = pad + (innerW / Math.max(1, data.length - 1)) * i;
    const y = pad + (innerH - (v / max) * (innerH - 6));
    return [x, y];
  });
  const path = points.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <div className="chart-root">
      <div className="admin-panel-title">{title}</div>
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`}>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} className="chart-axis" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} className="chart-axis" />
        {points.length > 1 && <polyline points={path} className="chart-line" />}
        {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" className="chart-dot" />)}
        {labels.map((t, i) => {
          const x = pad + (innerW / Math.max(1, labels.length - 1)) * i;
          return <text key={i} x={x} y={h - pad + 16} fontSize="10" textAnchor="middle" fill="#64748b">{t}</text>;
        })}
      </svg>
    </div>
  );
}

LineChart.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  data: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
};

function PieChart({ title, segments = [] }) {
  function arcPath(cx, cy, r, startAngle, endAngle) {
    const start = { x: cx + r * Math.cos(startAngle), y: cy + r * Math.sin(startAngle) };
    const end = { x: cx + r * Math.cos(endAngle), y: cy + r * Math.sin(endAngle) };
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  }
  const w = 600; const h = 240; const cx = w / 2; const cy = h / 2; const r = 70;
  const total = segments.reduce((s, it) => s + it.value, 0) || 1;
  let angle = -Math.PI / 2; // start at top
  const parts = segments.map((s, i) => {
    const delta = (s.value / total) * Math.PI * 2;
    const d = arcPath(cx, cy, r, angle, angle + delta);
    const mid = angle + delta / 2;
    angle += delta;
    const labelRadius = r + 50;
    const lx = cx + labelRadius * Math.cos(mid);
    const ly = cy + (r + 10) * Math.sin(mid);
    const label = `${s.label} ${Math.round((s.value / total) * 100)}%`;
    const anchor = lx < w / 2 - 1 ? 'end' : lx > w / 2 + 1 ? 'start' : 'middle';
    return { d, color: s.color, key: i, lx, ly, label, anchor };
  });
  return (
    <div className="chart-root">
      <div className="admin-panel-title">{title}</div>
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`}>
        <g>
          {parts.map(p => (
            <path key={p.key} d={p.d} fill={p.color} stroke="#fff" strokeWidth="1" />
          ))}
        </g>
        {parts.map(p => (
          <text key={`t-${p.key}`} x={p.lx} y={p.ly} fontSize="11" textAnchor={p.anchor} fill="#64748b">{p.label}</text>
        ))}
      </svg>
    </div>
  );
}

PieChart.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  segments: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.number.isRequired, color: PropTypes.string })
  ),
};

function TopVehicles({ title, items = [] }) {
  return (
    <div>
      <div className="admin-panel-title">{title}</div>
      <div className="top-list">
        {items.map((it) => (
          <div className="top-item" key={it.plate}>
            <div className="top-rank">{items.findIndex(x => x.plate === it.plate) + 1}</div>
            <div>
              <div style={{ fontSize: 12, color: '#0f172a' }}>{it.plate}</div>
              <div className="top-meta">{it.trips} chuyến</div>
              <div className="top-progress"><span style={{ width: `${it.percent}%` }} /></div>
            </div>
            <div className="top-spacer" />
            <div className="top-value">{it.revenue}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

TopVehicles.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({ plate: PropTypes.string.isRequired, trips: PropTypes.number, percent: PropTypes.number, revenue: PropTypes.string })
  ),
};

export default function Dashboard() {
  const monthly = [45, 50, 48, 62, 53, 68];
  const months = ["T1", "T2", "T3", "T4", "T5", "T6"];
  const weekly = [45, 50, 47, 60, 58, 70, 65];
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const vehicleTypes = [
    { label: "Xe khách", value: 45, color: "#22c55e" },
    { label: "Xe giường nằm", value: 25, color: "#f59e0b" },
    { label: "Xe limousine", value: 30, color: "#3b82f6" },
  ];
  const topVehicles = [
    { plate: "29A-12345", trips: 156, percent: 95, revenue: "45tr" },
    { plate: "29B-67890", trips: 148, percent: 92, revenue: "42tr" },
    { plate: "29C-11111", trips: 142, percent: 90, revenue: "40tr" },
    { plate: "29D-22222", trips: 138, percent: 88, revenue: "38tr" },
    { plate: "29E-33333", trips: 135, percent: 87, revenue: "37tr" },
  ];

  return (
    <>
      <div className="admin-stats-grid">
        <StatCard
          title="Tổng doanh thu"
          value="328 triệu VND"
          trend="+12.5%"
          trendType="up"
          icon={<AttachMoneyIcon fontSize="small" />}
        />
        <StatCard
          title="Tổng số chuyến"
          value="905 chuyến"
          trend="+8.2%"
          trendType="up"
          icon={<TrendingUpIcon fontSize="small" />}
        />
        <StatCard
          title="Số xe hoạt động"
          value="87/100 xe"
          trend="87%"
          trendType="down"
          icon={<DirectionsBusFilledIcon fontSize="small" />}
        />
        <StatCard
          title="Số bến xe"
          value="12 bến"
          trend="+2 bến mới"
          trendType="neutral"
          icon={<PlaceIcon fontSize="small" />}
        />
      </div>

      <div className="admin-panels-grid">
        <div className="admin-panel">
          <BarChart title="Doanh thu theo tháng" data={monthly} labels={months} />
        </div>
        <div className="admin-panel">
          <PieChart title="Phân bố loại xe" segments={vehicleTypes} />
        </div>
        <div className="admin-panel">
          <LineChart title="Số chuyến trong tuần" data={weekly} labels={days} />
        </div>
        <div className="admin-panel">
          <TopVehicles title="Top xe hoạt động nhiều nhất" items={topVehicles} />
        </div>
      </div>
    </>
  );
}
