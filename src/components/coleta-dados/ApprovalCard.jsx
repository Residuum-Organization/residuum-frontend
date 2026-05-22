import React, { useState } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaRecycle,
  FaBox,
  FaClock,
  FaSyncAlt,
  FaStar,
  FaClipboardList,
  FaRegCalendarAlt,
} from "react-icons/fa";

function ApprovalCard({ item, onAprovar, onRejeitar }) {
  const [removing, setRemoving] = useState(false);

  const handleAprovar = () => {
    setRemoving(true);
    setTimeout(() => onAprovar(), 300);
  };

  const handleRejeitar = () => {
    setRemoving(true);
    setTimeout(() => onRejeitar(), 300);
  };

  return (
    <div
      className={`bg-white rounded-[30px] p-5 shadow-sm mb-6 transform transition-all duration-300 hover:shadow-lg
        ${removing ? "opacity-0 -translate-y-5" : "opacity-100 translate-y-0"}`}
    >
      {/* Cabeçalho */}
      <div className="flex gap-4 items-center">
        <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl">
          <FaBuilding className="text-gray-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{item.empresa || "-"}</h2>
          <p className="text-blue-500 font-semibold mt-1">
            CNPJ <span className="text-gray-400 ml-2">{item.cnpj || "-"}</span>
          </p>
        </div>
      </div>

      {/* Informações adicionais */}
      <p className="text-gray-500 mt-4 flex items-center gap-2">
        <FaMapMarkerAlt /> {item.endereco || "-"}
      </p>
      <p className="text-gray-500 mt-2 flex items-center gap-2">
        <FaRecycle className="text-green-500" /> {item.material || "-"}
      </p>
      <p className="text-gray-500 mt-2 flex items-center gap-2">
        <FaBox className="text-orange-400" /> {item.quantidade || "-"}
      </p>

      {/* Dados comportamentais */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Dados comportamentais</h3>
        <div className="space-y-2 text-gray-500 flex flex-col">
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-400" />
            <span>Funcionamento: <span className="text-gray-700">{item.funcionamento || "-"}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <FaSyncAlt className="text-purple-400" />
            <span>Frequência: <span className="text-gray-700">{item.frequencia || "-"}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span>Confiabilidade: <span className="text-gray-700">{item.confiabilidade || "-"}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <FaClipboardList className="text-gray-500" />
            <span>Observações: <span className="text-gray-700">{item.observacoes || "-"}</span></span>
          </div>
        </div>
      </div>

      {/* Rodapé com data e botões */}
      <div className="border-t mt-5 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <span className="flex items-center text-gray-400 gap-2">
          <FaRegCalendarAlt /> {item.data || "-"}
        </span>
        <div className="flex gap-3">
          <button
            onClick={handleRejeitar}
            className="border border-red-400 text-red-500 px-4 py-2 rounded-2xl font-medium hover:bg-red-50 transition"
          >
            Rejeitar
          </button>
          <button
            onClick={handleAprovar}
            className="bg-green-500 text-white px-4 py-2 rounded-2xl font-medium hover:bg-green-600 transition"
          >
            Aprovar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApprovalCard;