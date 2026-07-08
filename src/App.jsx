import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

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
import Certificadodecoleta from "./pages/Certificadodecoleta";
const moradorRoutes = [
  {
    path: "/welcome-residuum",
    label: "Welcome Residuum",
    Component: WelcomeResiduum,
  },
  {
    path: "/certificado-coleta",
    label: "Certificado de Coleta",
    Component: Certificadodecoleta,
  },
  { path: "/inicio", label: "Início", Component: ComingSoonPage },
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
  { path: "/escanear-qr", label: "QR Code", Component: EscanearQrCodePage },
  {
    path: "/extrato",
    label: "Extrato",
    Component: ExtratoPage,
    integratedApi: true,
  },
  {
    path: "/sorteios",
    label: "Sorteios",
    Component: SorteiosPage,
    integratedApi: true,
  },
  { path: "/sorteios/:id", Component: SorteioDetalhesPage, sidebar: false },
  {
    path: "/perfil",
    label: "Perfil",
    Component: ProfilePage,
    integratedApi: true,
  },
];

const authRoutes = [
  { path: "/welcome", label: "Boas-vindas", Component: WelcomePage },
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
];

const adminRoutes = [
  { path: "/admin", label: "Painel admin", Component: AdminPage },
  {
    path: "/aprovacao",
    label: "Aprovação",
    Component: Aprovacao,
    integratedApi: true,
  },

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

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
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
