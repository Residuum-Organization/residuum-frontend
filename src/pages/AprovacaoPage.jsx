import React, { useState } from "react";
import ApprovalCard from "../components/coleta-dados/ApprovalCard";
import AdminShell from "../components/admin/AdminShell";

const solicitacoes = [
  {
    id: 1,
    empresa: "EcoPlast Ind. Ltda",
    cnpj: "12.345.678/0001-99",
    endereco: "Av. Brasil, 2200",
    material: "PET",
    quantidade: "500 kg/semana",
    funcionamento: "Seg-Sex, 08h às 18h",
    frequencia: "Semanal",
    confiabilidade: "Alta",
    observacoes: "Empresa ativa há 5 anos no programa.",
    data: "08/01/2025",
  },
  {
    id: 2,
    empresa: "GreenCycle",
    cnpj: "98.765.432/0001-10",
    endereco: "Rua das Flores, 450",
    material: "Vidro",
    quantidade: "300 kg/semana",
    funcionamento: "Seg-Sáb, 09h às 17h",
    frequencia: "Quinzenal",
    confiabilidade: "Média",
    observacoes: "Novo parceiro em avaliação.",
    data: "10/01/2025",
  },
  {
    id: 3,
    empresa: "Recicla Norte",
    cnpj: "11.222.333/0001-44",
    endereco: "Av. Amazonas, 900",
    material: "Metal",
    quantidade: "700 kg/semana",
    funcionamento: "Seg-Sex, 07h às 16h",
    frequencia: "Diária",
    confiabilidade: "Alta",
    observacoes: "Grande capacidade de armazenamento.",
    data: "12/01/2025",
  },
];

export default function Aprovacao() {
  const [cards, setCards] = useState(solicitacoes);

  const aprovar = (id) => setCards((prev) => prev.filter((c) => c.id !== id));
  const rejeitar = (id) => setCards((prev) => prev.filter((c) => c.id !== id));

  return (
    <AdminShell contentClassName="px-5 pt-5">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#1F4E79]">
            Painel Administrativo
          </p>
          <h1 className="mt-1 text-3xl font-bold leading-tight text-gray-800">
            Aprovação de
            <br />
            Pontos de Coleta
          </h1>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.lMsrniFpgibNNL_T3pNjqwHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Logo Residuum"
            className="w-10 object-contain"
          />
        </div>
      </header>

      <p className="mb-6 flex items-center gap-2 font-medium text-yellow-500">
        <span className="inline-block h-3 w-3 rounded-full bg-yellow-500"></span>
        {cards.length} solicitações pendentes
      </p>

      {cards.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          Nenhuma solicitação pendente
        </p>
      )}

      {cards.map((item) => (
        <ApprovalCard
          key={item.id}
          item={item}
          onAprovar={() => aprovar(item.id)}
          onRejeitar={() => rejeitar(item.id)}
        />
      ))}
    </AdminShell>
  );
}
