import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import CadastrarResiduoPage from "./pages/CadastrarResiduoPage";
import MeuEstoquePage from "./pages/MeuEstoquePage";
import DashboardScreen from "./pages/DashboardScreenPage";
import ScheduleScreen from "./pages/ScheduleScreenPage";
import ValidacaoPresencaPage from "./pages/ValidacaoPresencaPage";
import TransferenciaConcluidaPage from "./pages/TransferenciaConcluidaPage";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserPointsManagementPage from "./pages/UserPointsManagementPage";
import LojaPage from "./pages/LojaPage";
import SorteioDetalhesPage from "./pages/SorteioDetalhesPage";
import ExtratoPage from "./pages/ExtratoPage";
import CampanhaHeineken from "./pages/CampanhaHeinekenPage";
import Aprovacao from "./pages/AprovacaoPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import WelcomeOnboardingPage from "./pages/WelcomeOnboardingPage";
import PageUsers from "./pages/PageUsersPage";
import AdminPoints from "./pages/AdminPointsPage";
import Company from "./pages/CompanyPage";
import Confirmation from "./pages/ConfirmationPage";
import RegisterPontoColetaPage from "./pages/RegisterPontoColetaPage";
import AcessoNegadoPage from "./pages/AcessoNegadoPage";

import CampanhasPage from "./pages/CampanhasPage";
import NovaCampanhaPage from "./pages/NovaCampanhaPage";
import CampanhaDetalhesPage from "./pages/CampanhaDetalhesPage";
import Certificadodecoleta from "./pages/Certificadodecoleta";
import LogoutPage from "./pages/LogoutPage";
import LandingPage from "./pages/LandingPage";
import AdminSorteiosPage from "./pages/AdminSorteiosPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import OperationalPointsPage from "./pages/OperationalPointsPage";
import EntradaPesoCooperativaPage from "./pages/EntradaPesoCooperativaPage";

const moradorRoutes = [
  {
    path: "/inicio",
    label: "Início",
    Component: HomePage,
  },
  {
    path: "/certificado-coleta",
    label: "Certificado de Coleta",
    Component: Certificadodecoleta,
  },

  { path: "/mapa", label: "Mapa", Component: MapPage },
  {
    path: "/meu-estoque",
    label: "Meu estoque",
    Component: MeuEstoquePage,
    integratedApi: true,
  },
  {
    path: "/cadastrar-residuo",
    label: "Cadastrar resíduo",
    Component: CadastrarResiduoPage,
    integratedApi: true,
  },
  {
    path: "/validacao-presenca",
    label: "Validação",
    Component: ValidacaoPresencaPage,
    integratedApi: true,
  },
  {
    path: "/extrato",
    label: "Extrato",
    Component: ExtratoPage,
    integratedApi: true,
  },
  {
    path: "/sorteios",
    label: "Sorteios",
    Component: () => <Navigate to="/loja?aba=sorteios" replace />,
    integratedApi: true,
  },
  {
    path: "/loja",
    label: "Loja",
    Component: LojaPage,
    integratedApi: true,
  },
  {
    path: "/transferencia-concluida",
    label: "Envio concluído",
    Component: TransferenciaConcluidaPage,
  },
  {
    path: "/campanhas-ativas",
    label: "Campanhas",
    Component: () => <Navigate to="/loja?aba=campanhas" replace />,
    integratedApi: true,
  },
  { path: "/sorteios/:id", Component: SorteioDetalhesPage, sidebar: false },
  {
    path: "/perfil",
    label: "Perfil",
    Component: ProfilePage,
    integratedApi: true,
  },
  {
    path: "/configuracoes",
    label: "Configurações",
    Component: ConfiguracoesPage,
    integratedApi: true,
  },
];

const authRoutes = [
  { path: "/welcome", label: "Boas-vindas", Component: WelcomePage },
  { path: "/boas-vindas", label: "Boas-vindas Pós-Cadastro", Component: WelcomeOnboardingPage },
  {
    path: "/login",
    label: "Login",
    Component: LoginPage,
    integratedApi: true,
  },
  { path: "/cadastro", label: "Cadastro morador", Component: RegisterPage },
  {
    path: "/cadastro-ponto-coleta",
    label: "Cadastro ponto",
    Component: RegisterPontoColetaPage,
    integratedApi: true,
  },
  {
    path: "/empresa",
    label: "Endereço ponto",
    Component: Company,
    integratedApi: true,
  },
  {
    path: "/confirmacao",
    label: "Confirmação ponto",
    Component: Confirmation,
    integratedApi: true,
  },
  {
    path: "/recuperar-senha",
    label: "Recuperar senha",
    Component: ForgotPasswordPage,
  },
];

const parceiroRoutes = [
  {
    path: "/dashboard",
    label: "Dashboard",
    Component: DashboardScreen,
    integratedApi: true,
  },
  { path: "/schedule", label: "Agenda", Component: ScheduleScreen },
  { path: "/meus-pontos-operacionais", label: "Meus pontos", Component: OperationalPointsPage, integratedApi: true },
  { path: "/pontuacao-usuarios", label: "Pontuação", Component: UserPointsManagementPage, integratedApi: true },
];

const cooperativaRoutes = [
  { path: "/registro-coleta", label: "Registrar Coleta", Component: EntradaPesoCooperativaPage },
  { path: "/perfil", label: "Perfil", Component: ProfilePage, integratedApi: true },
];

const aprovacaoRoute = {
  path: "/aprovacao",
  label: "Aprovação",
  Component: Aprovacao,
  integratedApi: true,
};

const adminRoutes = [
  { path: "/admin", label: "Painel admin", Component: AdminPage },
  { path: "/admin-sorteios", label: "Sorteios", Component: AdminSorteiosPage },
  { path: "/admin-relatorios", label: "Relatorios", Component: AdminReportsPage },
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
  { path: "/admin-pontos", label: "Pontos de coleta", Component: AdminPoints },
];

export default function App() {
  const renderRoleRoute = (path, Component, allowedRoles) => (
    <Route
      key={path}
      path={path}
      element={
        <RoleRoute allowedRoles={allowedRoles}>
          <Component />
        </RoleRoute>
      }
    />
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <Routes>
        {authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {moradorRoutes.map(({ path, Component }) => (
          renderRoleRoute(path, Component, ["usuario", "morador"])
        ))}

        {parceiroRoutes.map(({ path, Component }) => (
          renderRoleRoute(path, Component, ["parceiro"])
        ))}

        {cooperativaRoutes.map(({ path, Component }) => (
          renderRoleRoute(path, Component, ["cooperativa"])
        ))}

        {renderRoleRoute(aprovacaoRoute.path, aprovacaoRoute.Component, [
          "cooperativa",
          "parceiro",
          "admin",
        ])}

        {adminRoutes.map(({ path, Component }) => (
          renderRoleRoute(path, Component, ["admin"])
        ))}

        <Route
          path="/acesso-negado"
          element={
            <ProtectedRoute>
              <AcessoNegadoPage />
            </ProtectedRoute>
          }
        />

        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<Navigate to="/welcome" replace />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </div>
  );
}
