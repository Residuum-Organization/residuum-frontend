import {
  CalendarDays,
  CheckCircle2,
  Home,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Star,
  User,
  Users,
  Warehouse,
} from "lucide-react";

export const roleNavigation = {
  morador: [
    { to: "/inicio", label: "Início", Icon: Home },
    { to: "/mapa", label: "Mapa", Icon: MapPin },
    { to: "/meu-estoque", label: "Estoque", Icon: Warehouse },
    { to: "/sorteios", label: "Sorteios", Icon: Star },
    { to: "/perfil", label: "Perfil", Icon: User },
  ],
  operacional: [
    { to: "/dashboard", label: "Painel", Icon: LayoutDashboard },
    { to: "/schedule", label: "Agenda", Icon: CalendarDays },
    { to: "/aprovacao", label: "Aprovação", Icon: CheckCircle2 },
    { to: "/pontuacao-usuarios", label: "Pontuação", Icon: Users },
  ],
  admin: [
    { to: "/admin", label: "Painel", Icon: LayoutDashboard },
    { to: "/aprovacao", label: "Aprovação", Icon: CheckCircle2 },
    { to: "/admin-pontos", label: "Pontos", Icon: MapPin },
    { to: "/usuarios", label: "Usuários", Icon: Users },
    { to: "/campanhas", label: "Campanhas", Icon: Megaphone },
    { to: "/admin-sorteios", label: "Sorteios", Icon: Star },
  ],
};
