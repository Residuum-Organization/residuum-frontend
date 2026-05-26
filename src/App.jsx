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

const moradorRoutes = [
  { path: "/welcome", Component: WelcomePage },
  { path: "/login", Component: LoginPage },
  { path: "/cadastro", Component: RegisterPage },
  { path: "/recuperar-senha", Component: ForgotPasswordPage },
  { path: "/welcome-residuum", Component: WelcomeResiduum },
  { path: "/mapa", Component: MapPage },
  { path: "/meu-estoque", Component: MeuEstoquePage },
  { path: "/cadastrar-residuo", Component: CadastrarResiduoPage },
  { path: "/validacao-presenca", Component: ValidacaoPresencaPage },
  { path: "/escanear-qr", Component: EscanearQrCodePage },
  { path: "/extrato", Component: ExtratoPage },
  { path: "/sorteios", Component: SorteiosPage },
  { path: "/sorteios/:id", Component: SorteioDetalhesPage },
  { path: "/perfil", Component: ProfilePage },
  { path: "/dashboard", Component: DashboardScreen },
  { path: "/schedule", Component: ScheduleScreen },
];

const parceiroRoutes = [
  { path: "/cadastro-ponto-coleta", Component: RegisterPontoColetaPage },
  { path: "/empresa", Component: Company },
  { path: "/confirmacao", Component: Confirmation },
];

const adminRoutes = [
  { path: "/admin", Component: AdminPage },
  { path: "/aprovacao", Component: Aprovacao },
  { path: "/campanha-heineken", Component: CampanhaHeineken },
  { path: "/usuarios", Component: PageUsers },
  { path: "/admin-pontos", Component: AdminPoints },
];

export default function App() {
  return (
    <Routes>
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
  );
}
