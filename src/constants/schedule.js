export const TIME_SLOTS = [
  {
    id: "manha",
    label: "Manhã",
    time: "08:00 - 12:00",
    status: "Disponível",
    statusBg: "bg-green-100",
    statusText: "text-green-700",
    emoji: "🌤️",
  },
  {
    id: "tarde",
    label: "Tarde",
    time: "13:00 - 17:00",
    status: "Disponível",
    statusBg: "bg-green-100",
    statusText: "text-green-700",
    emoji: "☀️",
  },
  {
    id: "noite",
    label: "Noite",
    time: "18:00 - 21:00",
    status: "Parcial",
    statusBg: "bg-orange-100",
    statusText: "text-orange-600",
    emoji: "🌙",
  },
];

export const COLLECTION_POINTS = [
  {
    id: "centro",
    name: "Ponto - Centro",
    address: "Rua das Flores, 123 - Centro",
    pct: 42,
    barColor: "bg-green-500",
  },
  {
    id: "norte",
    name: "Ponto - Bairro Norte",
    address: "Av. Brasil, 456 - Bairro Norte",
    pct: 78,
    barColor: "bg-yellow-500",
  },
  {
    id: "sul",
    name: "Ponto - Bairro Sul",
    address: "Rua das Palmeiras, 789 - Sul",
    pct: 98,
    barColor: "bg-red-500",
  },
  {
    id: "industrial",
    name: "Ponto - Industrial",
    address: "Rod. BR-050, KM 45 - Industrial",
    pct: null,
    barColor: "bg-slate-300",
  },
];

export const SYSTEM_SERVICES = [
  { id: "server",   label: "Servidor",      icon: "Server" },
  { id: "coletas",  label: "Coletas",        icon: "Truck" },
  { id: "app",      label: "App Mobile",     icon: "Smartphone" },
  { id: "db",       label: "Banco de Dados", icon: "Database" },
  { id: "notif",    label: "Notificações",   icon: "Bell" },
];
