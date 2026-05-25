import React from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import CadastrarResiduoPage from "./pages/CadastrarResiduoPage";
import MeuEstoquePage from "./pages/MeuEstoquePage";
import DashboardScreen from "./pages/DashboardScreen";
import ScheduleScreen from "./pages/ScheduleScreen";
import EscanearQrCodePage from "./pages/EscanearQrCodePage";
import ValidacaoPresencaPage from "./pages/ValidacaoPresencaPage";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SorteiosPage from "./pages/SorteiosPage";
import SorteioDetalhesPage from "./pages/SorteioDetalhesPage";
import ExtratoPage from "./pages/ExtratoPage";
import CampanhaHeineken from "./pages/CampanhaHeineken";
import Aprovacao from "./pages/Aprovacao";
import AdminPage from "./pages/AdminPage";
import WelcomeResiduum from "./pages/WelcomeResiduum";
import PageUsers from "./pages/PageUsers";
import AdminPoints from "./pages/AdminPoints";

function DemoNav() {
  const demoNavLinks = [
    { to: "/welcome", label: "Welcome" },
    { to: "/welcome-residuum", label: "Welcome-residuum" },
    { to: "/login", label: "Login" },
    { to: "/recuperar-senha", label: "Recuperar Senha" },
    { to: "/cadastro", label: "Cadastro" },
    { to: "/perfil", label: "Perfil" },
    { to: "/cadastrar-residuo", label: "Cadastrar" },
    { to: "/meu-estoque", label: "Estoque" },
    { to: "/mapa", label: "Mapa" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/schedule", label: "Schedule" },
    { to: "/escanear-qr", label: "QR Code" },
    { to: "/validacao-presenca", label: "Presenca" },
    { to: "/sorteios", label: "Sorteios" },
    { to: "/extrato", label: "Extrato" },
    { to: "/aprovacao", label: "Aprovação" },
    { to: "/admin", label: "Admin" },
    { to: "/usuarios", label: "Usuários" },
    { to: "/admin-pontos", label: "Admin Points" },
  ];
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-2">
        {demoNavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <DemoNav />
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/demo" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/welcome-residuum" element={<WelcomeResiduum />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/cadastrar-residuo" element={<CadastrarResiduoPage />} />
        <Route path="/meu-estoque" element={<MeuEstoquePage />} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/aprovacao" element={<Aprovacao />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/schedule" element={<ScheduleScreen />} />
        <Route path="/escanear-qr" element={<EscanearQrCodePage />} />
        <Route path="/validacao-presenca" element={<ValidacaoPresencaPage />} />
        <Route path="/sorteios" element={<SorteiosPage />} />
        <Route path="/sorteios/:id" element={<SorteioDetalhesPage />} />
        <Route path="/extrato" element={<ExtratoPage />} />
        <Route path="/campanha-heineken" element={<CampanhaHeineken />} />
        <Route path="/usuarios" element={<PageUsers />} />
        <Route path="/admin-pontos" element={<AdminPoints />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </>
  );
}
