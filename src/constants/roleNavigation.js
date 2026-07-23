import {
  CalendarDays,
  CheckCircle2,
  Home,
  LayoutDashboard,
  MapPin,
  Megaphone,
  ShoppingBag,
  Star,
  User,
  Users,
  Warehouse,
  FileBarChart,
  Weight,
} from "lucide-react";

export const roleNavigation = {
  morador: [
    { to: "/inicio", label: "Início", Icon: Home },
    { to: "/mapa", label: "Mapa", Icon: MapPin },
    { to: "/meu-estoque", label: "Estoque", Icon: Warehouse },
    { to: "/loja", label: "Loja", Icon: ShoppingBag },
    { to: "/perfil", label: "Perfil", Icon: User },
  ],
  operacional: [
    { to: "/dashboard", label: "Painel", Icon: LayoutDashboard },
    { to: "/meus-pontos-operacionais", label: "Meus Locais", Icon: MapPin },
    { to: "/aprovacao", label: "Aprovação", Icon: CheckCircle2 },
    { to: "/pontuacao-usuarios", label: "Pontuação", Icon: Users },
    { to: "/entrada-peso", label: "Lançar Peso", Icon: Weight },
  ],
  admin: [
    { to: "/admin", label: "Painel", Icon: LayoutDashboard },
    { to: "/admin-pontos", label: "Pontos de Coleta", Icon: MapPin },
    { to: "/usuarios", label: "Usuários", Icon: Users },
    { to: "/campanhas", label: "Campanhas", Icon: Megaphone },
    { to: "/aprovacao", label: "Validar Descartes", Icon: Warehouse },
    { to: "/admin-sorteios", label: "Sorteios", Icon: Star },
    { to: "/admin-relatorios", label: "Relatórios", Icon: FileBarChart },
  ],
};
