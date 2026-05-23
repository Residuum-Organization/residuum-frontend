import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Confirmation() {
  const navigate = useNavigate();

  const [residuosSelecionados, setResiduosSelecionados] = useState([]);

  const residuos = ["Plástico", "Metal", "Vidro", "Papelão"];

  function adicionarResiduo(residuo) {
    if (!residuosSelecionados.includes(residuo)) {
      setResiduosSelecionados([...residuosSelecionados, residuo]);
    }
  }

  function removerResiduo(residuo) {
    setResiduosSelecionados(
      residuosSelecionados.filter((item) => item !== residuo)
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10">

        <div className="flex justify-center -mt-16 -mb-12">
          <img src="/logo.jpeg" alt="Logo Residuum" className="w-80 h-80 object-contain" />
        </div>

        <h1 className="text-4xl font-bold text-blue-900 text-center mb-8">
          Endereço de Coleta
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Tipo de Resíduo
          </h2>

          <div className="min-h-24 border-2 border-blue-900 rounded-3xl p-4 flex flex-wrap gap-3 mb-4">
            {residuosSelecionados.length === 0 ? (
              <p className="text-gray-400 text-lg">
                Clique nos resíduos abaixo para adicionar
              </p>
            ) : (
              residuosSelecionados.map((residuo) => (
                <button
                  key={residuo}
                  type="button"
                  onClick={() => removerResiduo(residuo)}
                  className="bg-blue-900 text-white px-4 py-2 rounded-full text-base font-semibold cursor-pointer"
                >
                  {residuo} ×
                </button>
              ))
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {residuos.map((residuo) => (
              <button
                key={residuo}
                type="button"
                onClick={() => adicionarResiduo(residuo)}
                className="border-2 border-blue-900 text-blue-900 rounded-full py-3 text-lg font-semibold hover:bg-blue-900 hover:text-white transition cursor-pointer"
              >
                {residuo}
              </button>
            ))}
          </div>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block mb-2 text-lg font-semibold text-blue-900">
              Quantidade
            </label>
            <input
              type="text"
              placeholder="Ex: 10 kg, 5 sacolas, 2 caixas"
              className="w-full border-2 border-blue-900 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg font-semibold text-blue-900">
              Data
            </label>
            <input
              type="date"
              className="w-full border-2 border-blue-900 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg font-semibold text-blue-900">
              Horário
            </label>
            <input
              type="time"
              className="w-full border-2 border-blue-900 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg font-semibold text-blue-900">
              Observações
            </label>
            <textarea
              placeholder="Digite alguma observação"
              rows="4"
              className="w-full border-2 border-blue-900 rounded-2xl shadow-sm px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-blue-900 text-white px-12 py-4 rounded-full text-xl font-semibold hover:bg-blue-950 transition cursor-pointer flex items-center gap-3"
            >
              Finalizar Cadastro
              <span className="text-2xl">→</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}