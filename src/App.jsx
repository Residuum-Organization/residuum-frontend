import React from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";

import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import CadastrarResiduoPage from "./pages/CadastrarResiduoPage";
import MeuEstoquePage from "./pages/MeuEstoquePage";
import DashboardScreen from "./pages/DashboardScreenPage";
import ScheduleScreen from "./pages/ScheduleScreenPage";
import EscanearQrCodePage from "./pages/EscanearQrCodePage";
import ValidacaoPresencaPage from "./pages/ValidacaoPresencaPage";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SorteiosPage from "./pages/SorteiosPage";
import SorteioDetalhesPage from "./pages/SorteioDetalhesPage";
import ExtratoPage from "./pages/ExtratoPage";
import CampanhaHeineken from "./pages/CampanhaHeinekenPage";
import Aprovacao from "./pages/AprovacaoPage";
import AdminPage from "./pages/AdminPage";
import WelcomeResiduum from "./pages/WelcomeResiduumPage";
import PageUsers from "./pages/PageUsersPage";
import AdminPoints from "./pages/AdminPointsPage";
import Company from "./pages/CompanyPage";
import Confirmation from "./pages/ConfirmationPage";
import RegisterPontoColetaPage from "./pages/RegisterPontoColetaPage";
import ComingSoonPage from "./pages/ComingSoonPage";

import CampanhasPage from "./pages/CampanhasPage";
import NovaCampanhaPage from "./pages/NovaCampanhaPage";
import CampanhaDetalhesPage from "./pages/CampanhaDetalhesPage";

const moradorRoutes = [
  {
    path: "/welcome-residuum",
    label: "Welcome Residuum",
    Component: WelcomeResiduum,
  },
  { path: "/inicio", label: "Início", Component: ComingSoonPage },
  { path: "/mapa", label: "Mapa", Component: MapPage },
  { path: "/meu-estoque", label: "Meu estoque", Component: MeuEstoquePage },
  {
    path: "/cadastrar-residuo",
    label: "Cadastrar resíduo",
    Component: CadastrarResiduoPage,
  },
  {
    path: "/validacao-presenca",
    label: "Validação",
    Component: ValidacaoPresencaPage,
  },
  { path: "/escanear-qr", label: "QR Code", Component: EscanearQrCodePage },
  { path: "/extrato", label: "Extrato", Component: ExtratoPage },
  { path: "/sorteios", label: "Sorteios", Component: SorteiosPage },
  { path: "/sorteios/:id", Component: SorteioDetalhesPage, sidebar: false },
  { path: "/perfil", label: "Perfil", Component: ProfilePage },
];

const authRoutes = [
  { path: "/welcome", label: "Boas-vindas", Component: WelcomePage },
  { path: "/login", label: "Login", Component: LoginPage },
  { path: "/cadastro", label: "Cadastro morador", Component: RegisterPage },
  {
    path: "/cadastro-ponto-coleta",
    label: "Cadastro ponto",
    Component: RegisterPontoColetaPage,
  },
  { path: "/empresa", label: "Endereço ponto", Component: Company },
  { path: "/confirmacao", label: "Confirmação ponto", Component: Confirmation },
  {
    path: "/recuperar-senha",
    label: "Recuperar senha",
    Component: ForgotPasswordPage,
  },
];

const parceiroRoutes = [
  { path: "/dashboard", label: "Dashboard", Component: DashboardScreen },
  { path: "/schedule", label: "Agenda", Component: ScheduleScreen },
];

const adminRoutes = [
  { path: "/admin", label: "Painel admin", Component: AdminPage },
  { path: "/aprovacao", label: "Aprovação", Component: Aprovacao },

  {
    path: "/campanhas",
    label: "Campanhas",
    Component: CampanhasPage,
  },
  {
    path: "/nova-campanha",
    label: "Nova Campanha",
    Component: NovaCampanhaPage,
    sidebar: false,
  },
  {
    path: "/campanha-heineken",
    label: "Campanha Heineken",
    Component: CampanhaHeineken,
    sidebar: false,
  },
  {
    path: "/campanhas/:id",
    label: "Detalhes da Campanha",
    Component: CampanhaDetalhesPage,
    sidebar: false,
  },

  { path: "/usuarios", label: "Usuários", Component: PageUsers },
  { path: "/admin-pontos", label: "Pontos", Component: AdminPoints },
];

const navigationGroups = [
  { title: "Autenticação", routes: authRoutes },
  { title: "Morador", routes: moradorRoutes },
  { title: "Parceiro", routes: parceiroRoutes },
  { title: "Admin", routes: adminRoutes },
];

function PresentationSidebar() {
  const [collapsedGroups, setCollapsedGroups] = React.useState({});

  function toggleGroup(title) {
    setCollapsedGroups((current) => ({
      ...current,
      [title]: !current[title],
    }));
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-[2000] hidden w-72 flex-col border-r border-slate-200 bg-slate-50 px-5 py-6 shadow-xl lg:flex">
      <div className="mb-6 flex items-center gap-3 rounded-3xl bg-[var(--color-welcome-blue)] p-4 text-white shadow-lg shadow-blue-950/10">
        <img
          src="/logo.jpeg"
          alt="Residuum"
          className="h-11 w-11 rounded-2xl object-contain"
        />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
            Residuum
          </p>
          <h1 className="text-lg font-black leading-tight">Apresentação</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
        {navigationGroups.map((group) => (
          <section
            key={group.title}
            className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggleGroup(group.title)}
              className="mb-3 flex w-full items-center gap-3 px-1 text-left"
              aria-expanded={!collapsedGroups[group.title]}
            >
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-welcome-blue)]">
                {group.title}
              </h2>

              <span className="h-0.5 flex-1 rounded-full bg-[var(--color-welcome-blue)]/35" />

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-[var(--color-welcome-blue)]">
                {collapsedGroups[group.title] ? "+" : "−"}
              </span>
            </button>

            {!collapsedGroups[group.title] ? (
              <div className="space-y-1.5">
                {group.routes
                  .filter((route) => route.sidebar !== false)
                  .map((route) => (
                    <NavLink
                      key={route.path}
                      to={route.path}
                      className={({ isActive }) =>
                        `block rounded-2xl border px-3 py-2.5 text-sm font-bold transition ${
                          isActive
                            ? "border-[var(--color-welcome-blue)] bg-[var(--color-welcome-blue)] text-white shadow-sm"
                            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-[var(--color-welcome-blue)]"
                        }`
                      }
                    >
                      {route.label}
                    </NavLink>
                  ))}
              </div>
            ) : null}
          </section>
        ))}
      </nav>
    </aside>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 lg:pl-72">
      <PresentationSidebar />

      <Routes>
        {authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {moradorRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {parceiroRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {adminRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/demo" element={<Navigate to="/welcome" replace />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </div>
  );
}