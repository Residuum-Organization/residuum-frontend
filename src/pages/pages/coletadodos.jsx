import { useState } from "react";

// ── Icons (inline SVG components) ──────────────────────────────────────────
const RecycleIcon = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M32 8 L40 22 H33 L33 38 H31 L31 22 H24 Z" fill={color} />
    <path d="M50 44 L36 44 L39 38 L28 38 L22 50 L36 50 L33 56 Z" fill={color} />
    <path d="M14 44 L20 32 L26 38 L30 28 L18 28 L12 38 Z" fill={color} />
  </svg>
);

const TruckIcon = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect x="4" y="20" width="36" height="22" rx="3" fill={color} />
    <path d="M40 26 L56 26 L60 36 L60 42 H40 Z" fill={color} />
    <circle cx="14" cy="44" r="6" fill={color} opacity="0.3" />
    <circle cx="14" cy="44" r="4" fill={color} />
    <circle cx="50" cy="44" r="6" fill={color} opacity="0.3" />
    <circle cx="50" cy="44" r="4" fill={color} />
  </svg>
);

const UserIcon = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="22" r="12" fill={color} />
    <path d="M8 56 C8 42 56 42 56 56" fill={color} />
  </svg>
);

const PulseIcon = ({ size = 40, color = "#f59e0b" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <polyline points="4,32 14,32 20,16 28,48 36,24 44,40 50,32 60,32" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PinIcon = ({ size = 20, color = "#1a5276" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const HomeIcon = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const MapIcon = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
  </svg>
);

const BarIcon = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M4 6h2v12H4zm3.5 0h1v12h-1zM11 6h2v12h-2zm3.5 0h1v12h-1zM17 6h3v12h-3z" />
  </svg>
);

const StarIcon = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const ServerIcon = ({ color = "#22c55e" }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill={color}>
    <path d="M4 1h16v6H4zm0 8h16v6H4zm0 8h16v6H4z" opacity="0.2" />
    <rect x="3" y="2" width="18" height="5" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
    <rect x="3" y="9.5" width="18" height="5" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="18" cy="4.5" r="1" fill={color} />
    <circle cx="18" cy="12" r="1" fill={color} />
  </svg>
);

const BellIcon = ({ color = "#22c55e" }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill={color} />
  </svg>
);

const DbIcon = ({ color = "#22c55e" }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke={color} strokeWidth="1.5" />
    <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke={color} strokeWidth="1.5" />
    <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke={color} strokeWidth="1.5" />
  </svg>
);

const MobileIcon = ({ color = "#22c55e" }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="18" r="1" fill={color} />
  </svg>
);

const CheckShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#22c55e">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </svg>
);

// ── Pie Chart ──────────────────────────────────────────────────────────────
function PieChart() {
  const data = [
    { label: "Plástico", value: 36, color: "#3b82f6" },
    { label: "Vidro", value: 26, color: "#ef4444" },
    { label: "Papel", value: 22, color: "#22c55e" },
    { label: "Metal", value: 10, color: "#eab308" },
  ];

  let cumulative = 0;
  const cx = 80, cy = 80, r = 70;

  function polarToCartesian(angle) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const slices = data.map((d) => {
    const startAngle = cumulative * 3.6;
    const endAngle = (cumulative + d.value) * 3.6;
    const midAngle = ((startAngle + endAngle) / 2);
    cumulative += d.value;

    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const large = d.value > 50 ? 1 : 0;
    const mid = polarToCartesian(midAngle);

    return { ...d, path: `M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 ${large},1 ${end.x},${end.y} Z`, mid };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2" />
        ))}
        {slices.map((s, i) => (
          <text
            key={i}
            x={s.mid.x}
            y={s.mid.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="11"
            fontWeight="700"
          >
            {s.value}%
          </text>
        ))}
      </svg>
      <div style={{ flex: 1 }}>
        {[
          { label: "Plástico", kg: "450 kg", pct: "36%", color: "#3b82f6" },
          { label: "Vidro", kg: "320 kg", pct: "26%", color: "#ef4444" },
          { label: "Papel", kg: "280 kg", pct: "22%", color: "#22c55e" },
          { label: "Metal", kg: "120 kg", pct: "10%", color: "#eab308" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 14, color: "#1e293b" }}>{item.label}</span>
            <span style={{ fontSize: 14, color: "#475569", minWidth: 55 }}>{item.kg}</span>
            <span style={{ fontSize: 14, color: "#64748b", minWidth: 36, textAlign: "right" }}>{item.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Line Chart ─────────────────────────────────────────────────────────────
function LineChart() {
  const data = [
    { month: "Nov", val: 380 },
    { month: "Dez", val: 450 },
    { month: "Jan", val: 580 },
    { month: "Fev", val: 870 },
    { month: "Mar", val: 730 },
    { month: "Abr", val: 560 },
  ];

  const W = 520, H = 200, padL = 40, padR = 16, padT = 10, padB = 40;
  const maxVal = 1500;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const toX = (i) => padL + (i / (data.length - 1)) * chartW;
  const toY = (v) => padT + chartH - (v / maxVal) * chartH;

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.val) }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath =
    `M${points[0].x},${toY(0)} ` +
    points.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${points[points.length - 1].x},${toY(0)} Z`;

  const yLabels = [0, 300, 600, 900, 1200, 1500];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {yLabels.map((v) => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={toY(v)} y2={toY(v)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={padL - 6} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#94a3b8">
            {v === 0 ? "0" : `${v}`}
          </text>
        </g>
      ))}

      <path d={areaPath} fill="url(#areaGrad)" />
      <polyline points={polyline} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill="#22c55e" stroke="#fff" strokeWidth="2" />
      ))}

      {data.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="12" fill="#64748b">
          {d.month}
        </text>
      ))}
    </svg>
  );
}

// ── Capacity Bar ───────────────────────────────────────────────────────────
function CapacityBar({ pct, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155", minWidth: 36, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");

  const navItems = [
    { id: "map", icon: <PinIcon size={22} color="#94a3b8" /> },
    { id: "recycle", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 4.5L14.5 9H13v5h-2V9H9.5L12 4.5zm-5.7 8.5l-1.3 2.5 1.5.8L5 19l4.5-.5-.8-1.5 2.3-1.2-2.7-3.8-2 .5zm11.4 0l-2 .5-2.7 3.8 2.3 1.2-.8 1.5 4.5.5-1.5-3.2 1.5-.8-1.3-2.5z"/></svg> },
    { id: "dashboard", icon: <HomeIcon size={22} color="#94a3b8" /> },
    { id: "barcode", icon: <BarIcon size={22} color="#94a3b8" /> },
    { id: "star", icon: <StarIcon size={22} color="#94a3b8" /> },
  ];

  const logo = (
    <svg width="52" height="36" viewBox="0 0 52 36" fill="none">
      <rect x="2" y="14" width="6" height="14" rx="1" fill="#22c55e" />
      <rect x="12" y="8" width="6" height="20" rx="1" fill="#22c55e" />
      <rect x="22" y="2" width="6" height="26" rx="1" fill="#22c55e" />
      <path d="M34 6 L44 6 M39 1 L39 11" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="39" cy="6" r="3" fill="none" stroke="#1d4ed8" strokeWidth="2" />
      <circle cx="6" cy="30" r="2" fill="#1d4ed8" />
      <circle cx="16" cy="30" r="2" fill="#1d4ed8" />
    </svg>
  );

  const styles = {
    container: {
      maxWidth: 420,
      margin: "0 auto",
      minHeight: "100vh",
      background: "#f1f5f9",
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
    topBar: {
      background: "#fff",
      padding: "16px 20px 12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e2e8f0",
    },
    card: {
      background: "#fff",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
    statCard: {
      background: "#fff",
      borderRadius: 16,
      padding: "14px 16px",
      flex: 1,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
    iconCircle: (bg) => ({
      width: 52,
      height: 52,
      borderRadius: "50%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }),
    navBar: {
      position: "sticky",
      bottom: 0,
      background: "#1e3a5f",
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0 14px",
      borderRadius: "16px 16px 0 0",
    },
    navBtn: (active) => ({
      background: active ? "rgba(255,255,255,0.15)" : "transparent",
      border: "none",
      cursor: "pointer",
      padding: "8px 16px",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.2s",
    }),
    label: {
      fontSize: 12,
      color: "#64748b",
      marginBottom: 2,
    },
    big: {
      fontSize: 26,
      fontWeight: 800,
      color: "#1e293b",
      lineHeight: 1.1,
    },
    green: { color: "#22c55e", fontSize: 12, fontWeight: 700, marginTop: 6 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 800,
      color: "#1e3a5f",
      marginBottom: 12,
    },
  };

  return (
    <div style={styles.container}>
      {/* ── HEADER ── */}
      <div style={styles.topBar}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#1e293b" }}>Dashboard</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {tab === "dashboard" ? "Visão Geral do sistema de coleta" : "Horários & Pontos de Coleta"}
          </div>
        </div>
        {logo}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 80px" }}>

        {tab === "dashboard" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Stats row 1 */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={styles.statCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={styles.iconCircle("#dcfce7")}>
                    <RecycleIcon size={28} color="#22c55e" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>Total Coletado</span>
                </div>
                <div style={styles.big}>1.250 kg</div>
                <div style={styles.green}>+12,5 vs mês anterior</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={styles.iconCircle("#dbeafe")}>
                    <UserIcon size={28} color="#3b82f6" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>Usuários Únicos</span>
                </div>
                <div style={styles.big}>342</div>
                <div style={styles.green}>+8,2 vs mês anterior</div>
              </div>
            </div>

            {/* Stats row 2 */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={styles.statCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={styles.iconCircle("#1e3a5f")}>
                    <TruckIcon size={28} color="#fff" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>Coletas Realizadas</span>
                </div>
                <div style={styles.big}>128</div>
                <div style={styles.green}>+15,7% vs mês anterior</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={styles.iconCircle("#fef9c3")}>
                    <PulseIcon size={28} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>Status do Sistema</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#22c55e" }}>Ativo</div>
                <div style={{ ...styles.green, marginTop: 4 }}>Todos sistemas operando</div>
              </div>
            </div>

            {/* Line Chart */}
            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Volume de Resíduos Coletados</div>
                <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  Últimos 6 meses
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#22c55e"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>
              <LineChart />
            </div>

            {/* Pie Chart */}
            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Estatística por tipo de material</div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                  Este mês
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#64748b"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>
              <PieChart />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Horários */}
            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={styles.sectionTitle}>Horários de Coleta</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>Ver Agenda</span>
              </div>

              {[
                { label: "Manhã", time: "08:00 - 12:00", status: "Disponível", statusColor: "#dcfce7", textColor: "#16a34a", emoji: "🌤️" },
                { label: "Tarde", time: "13:00 - 17:00", status: "Disponível", statusColor: "#dcfce7", textColor: "#16a34a", emoji: "☀️" },
                { label: "Noite", time: "18:00 - 21:00", status: "Parcial", statusColor: "#fed7aa", textColor: "#ea580c", emoji: "🌙" },
              ].map((slot) => (
                <div key={slot.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {slot.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f" }}>{slot.label}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{slot.time}</div>
                  </div>
                  <div style={{ background: slot.statusColor, color: slot.textColor, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                    {slot.status}
                  </div>
                </div>
              ))}

              <button style={{ marginTop: 16, width: "100%", background: "#22c55e", color: "#fff", border: "none", borderRadius: 28, padding: "14px 0", fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: 0.3 }}>
                Agendar Coleta
              </button>
            </div>

            {/* Pontos */}
            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={styles.sectionTitle}>Disponibilidade dos pontos</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>Ver mapa</span>
              </div>

              {[
                { name: "Ponto - Centro", addr: "Rua das Flores, 123 - Centro", pct: 42, color: "#22c55e" },
                { name: "Ponto - Bairro Norte", addr: "Av. Brasil, 456 - Bairro Norte", pct: 78, color: "#f59e0b" },
                { name: "Ponto - Bairro Sul", addr: "Rua das Palmeiras, 789 - Sul", pct: 98, color: "#ef4444" },
                { name: "Ponto - Industrial", addr: "Rod. BR-050, KM 45 - Industrial", pct: null, color: "#94a3b8" },
              ].map((pt) => (
                <div key={pt.name} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                  <div style={{ marginTop: 2 }}><PinIcon size={18} color="#1e3a5f" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{pt.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{pt.addr}</div>
                    {pt.pct !== null ? (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Capacidade</div>
                        <CapacityBar pct={pt.pct} color={pt.color} />
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>Indisponível</div>
                        <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4 }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Status */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Status do Sistema e Serviços</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {[
                  { label: "Servidor", icon: <ServerIcon /> },
                  { label: "Coletas", icon: <TruckIcon size={28} color="#22c55e" /> },
                  { label: "App Mobile", icon: <MobileIcon /> },
                  { label: "Banco de Dados", icon: <DbIcon /> },
                  { label: "Notificações", icon: <BellIcon /> },
                ].map((s) => (
                  <div key={s.label} style={{ flex: 1, minWidth: 64, background: "#f8fafc", borderRadius: 12, padding: "10px 8px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#22c55e" }}>ONLINE</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <CheckShieldIcon />
                <span style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>Todos os sistemas estão funcionando normalmente</span>
              </div>
            </div>

            {/* FAB */}
            <div style={{ position: "fixed", bottom: 72, right: 24, zIndex: 10 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#22c55e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(34,197,94,0.4)", cursor: "pointer" }}>
                <TruckIcon size={26} color="#fff" />
                <div style={{ fontSize: 8, color: "#fff", fontWeight: 800, lineHeight: 1.2, textAlign: "center" }}>NOVA<br />COLETA</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── NAV BAR ── */}
      <div style={styles.navBar}>
        {tab === "dashboard" ? (
          <>
            {[
              { id: "pin", icon: <PinIcon size={22} color="#fff" /> },
              { id: "recycle-d", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 4.5L14.5 9H13v5h-2V9H9.5L12 4.5zm-5.7 8.5l-1.3 2.5 1.5.8L5 19l4.5-.5-.8-1.5 2.3-1.2-2.7-3.8-2 .5zm11.4 0l-2 .5-2.7 3.8 2.3 1.2-.8 1.5 4.5.5-1.5-3.2 1.5-.8-1.3-2.5z" /></svg> },
              { id: "dashboard", icon: <HomeIcon size={22} color="#fff" /> },
              { id: "barcode", icon: <BarIcon size={22} color="#fff" /> },
              { id: "star", icon: <StarIcon size={22} color="#fff" /> },
            ].map((n) => (
              <button key={n.id} style={styles.navBtn(n.id === "dashboard")} onClick={() => setTab("dashboard")}>
                {n.icon}
              </button>
            ))}
          </>
        ) : (
          <>
            {[
              { id: "home2", icon: <HomeIcon size={22} color="#fff" /> },
              { id: "map2", icon: <PinIcon size={22} color="#fff" /> },
              { id: "truck2", icon: <TruckIcon size={22} color="#fff" /> },
              { id: "bar2", icon: <BarIcon size={22} color="#fff" /> },
              { id: "star2", icon: <StarIcon size={22} color="#fff" /> },
            ].map((n) => (
              <button key={n.id} style={styles.navBtn(false)} onClick={() => setTab("schedule")}>
                {n.icon}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Toggle between screens */}
      <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
        <div style={{ background: "#1e3a5f", borderRadius: 20, display: "flex", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          <button onClick={() => setTab("dashboard")} style={{ padding: "6px 16px", border: "none", background: tab === "dashboard" ? "#22c55e" : "transparent", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>
            Dashboard
          </button>
          <button onClick={() => setTab("schedule")} style={{ padding: "6px 16px", border: "none", background: tab === "schedule" ? "#22c55e" : "transparent", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>
            Coletas
          </button>
        </div>
      </div>
    </div>
  );
}
