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

function DemoPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-lg md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Residuum
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Fluxo de demonstracao
        </h1>
        <p className="mt-2 text-slate-600">
          Navegue pelas telas para apresentar o produto ponta a ponta.
        </p>

        <ol className="mt-6 space-y-3 text-slate-700">
          <li className="rounded-xl border border-slate-200 p-4">
            1. Perfil do usuario
          </li>
          <li className="rounded-xl border border-slate-200 p-4">
            2. Cadastro de residuo
          </li>
          <li className="rounded-xl border border-slate-200 p-4">
            3. Gestao do estoque
          </li>
          <li className="rounded-xl border border-slate-200 p-4">
            4. Busca de ponto no mapa
          </li>
          <li className="rounded-xl border border-slate-200 p-4">
            5. Dashboard de coleta de dados
          </li>
          <li className="rounded-xl border border-slate-200 p-4">
            6. Agenda de coletas (schedule)
          </li>
          <li className="rounded-xl border border-slate-200 p-4">
            7. Escanear QR Code no ponto
          </li>
          <li className="rounded-xl border border-slate-200 p-4">
            8. Validacao de presenca no local
          </li>
        </ol>
      </section>
    </main>
  );
}

function DemoNav() {
  const links = [
    { to: "/demo", label: "Demo" },
    { to: "/perfil", label: "Perfil" },
    { to: "/cadastrar-residuo", label: "Cadastrar" },
    { to: "/meu-estoque", label: "Estoque" },
    { to: "/mapa", label: "Mapa" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/schedule", label: "Schedule" },
    { to: "/escanear-qr", label: "QR Code" },
    { to: "/validacao-presenca", label: "Presenca" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-2">
        {links.map((link) => (
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
        <Route path="/" element={<Navigate to="/demo" replace />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/cadastrar-residuo" element={<CadastrarResiduoPage />} />
        <Route path="/meu-estoque" element={<MeuEstoquePage />} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/schedule" element={<ScheduleScreen />} />
        <Route path="/escanear-qr" element={<EscanearQrCodePage />} />
        <Route path="/validacao-presenca" element={<ValidacaoPresencaPage />} />
        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </>
  );
}
