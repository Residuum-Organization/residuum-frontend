import React, { useState } from "react";
import ApprovalCard from "../components/coleta-dados/ApprovalCard";
import BottomNav from "../components/ui/BottomNav";

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
    <div className="bg-[#f5f7f8] min-h-screen p-6 pb-28 relative">
      <div className="max-w-sm mx-auto">
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 leading-tight mb-2">
          Aprovação de
          <br />
          Pontos de Coleta
        </h1>

        {/* Pendências */}
        <p className="flex items-center text-yellow-500 font-medium mb-6 gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
          {cards.length} solicitações pendentes
        </p>

        {/* Mensagem caso não haja cards */}
        {cards.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Nenhuma solicitação pendente
          </p>
        )}

        {/* Cards */}
        {cards.map((item) => (
          <ApprovalCard
            key={item.id}
            item={item}
            onAprovar={() => aprovar(item.id)}
            onRejeitar={() => rejeitar(item.id)}
          />
        ))}
      </div>

      {/* Logo fixa no canto superior direito */}
      <img
        src="https://tse3.mm.bing.net/th/id/OIP.lMsrniFpgibNNL_T3pNjqwHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
        alt="Logo do projeto"
        className="fixed top-4 right-4 w-16 h-16 object-contain z-50"
      />

      {/* Rodapé responsivo (apenas mobile) */}
      <BottomNav />
    </div>
  );
}
