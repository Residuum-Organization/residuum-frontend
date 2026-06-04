import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignLayout, {
  BotaoVoltar,
  LogoResiduum,
} from "../components/campanhas/CampaignLayout";

const estadoInicial = {
  nome: "",
  empresa: "",
  periodo: "",
  locais: "",
  residuo: "",
  premiacao: "",
};

export default function NovaCampanhaPage() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function salvarCampanha(event) {
    event.preventDefault();

    if (
      !formulario.nome ||
      !formulario.empresa ||
      !formulario.periodo ||
      !formulario.locais ||
      !formulario.residuo ||
      !formulario.premiacao
    ) {
      setErro("Preencha todos os campos antes de salvar a campanha.");
      return;
    }

    const novaCampanha = {
      id: Date.now(),
      nome: formulario.nome,
      empresa: formulario.empresa,
      status: "Planejada",
      periodo: formulario.periodo,
      locais: formulario.locais,
      residuo: formulario.residuo,
      premiacao: formulario.premiacao,
      progresso: 0,
      tipo: "personalizada",
    };

    const campanhasSalvas =
      JSON.parse(localStorage.getItem("campanhasCriadas")) || [];

    const campanhasAtualizadas = [...campanhasSalvas, novaCampanha];

    localStorage.setItem(
      "campanhasCriadas",
      JSON.stringify(campanhasAtualizadas)
    );

    setErro("");
    setSucesso(true);
    setFormulario(estadoInicial);

    setTimeout(() => {
      navigate("/campanhas");
    }, 1200);
  }

  return (
    <CampaignLayout>
      <Topo onVoltar={() => navigate("/campanhas")} />

      {erro && (
        <div className="mb-5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-[12px] font-black text-red-700">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="mb-5 rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-[12px] font-black text-green-700">
          Campanha cadastrada com sucesso! Redirecionando...
        </div>
      )}

      <form
        onSubmit={salvarCampanha}
        className="rounded-[24px] border-2 border-[#5644ce] bg-[#f3f2fb] px-4 py-5"
      >
        <div className="space-y-4">
          <Campo
            label="Nome da campanha"
            name="nome"
            value={formulario.nome}
            onChange={atualizarCampo}
            placeholder="Ex: Campanha Heineken"
          />

          <Campo
            label="Empresa parceira"
            name="empresa"
            value={formulario.empresa}
            onChange={atualizarCampo}
            placeholder="Ex: Heineken"
          />

          <Campo
            label="Período da campanha"
            name="periodo"
            value={formulario.periodo}
            onChange={atualizarCampo}
            placeholder="Ex: 01/04/2026 - 30/04/2026"
          />

          <Campo
            label="Regiões participantes"
            name="locais"
            value={formulario.locais}
            onChange={atualizarCampo}
            placeholder="Ex: Norte, Sul e Leste"
          />

          <Campo
            label="Tipo de resíduo"
            name="residuo"
            value={formulario.residuo}
            onChange={atualizarCampo}
            placeholder="Ex: Garrafas PET"
          />

          <div>
            <label className="mb-2 block text-[12px] font-black text-[#062d61]">
              Premiação
            </label>

            <textarea
              name="premiacao"
              value={formulario.premiacao}
              onChange={atualizarCampo}
              placeholder="Descreva os prêmios da campanha"
              className="h-28 w-full resize-none rounded-2xl border-2 border-[#5644ce] bg-white px-4 py-3 text-[13px] font-bold text-[#062d61] outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={sucesso}
          className="mt-6 w-full rounded-full bg-[#3020a0] py-4 text-[15px] font-black text-white transition active:scale-[0.98] disabled:opacity-60"
        >
          {sucesso ? "Salvando..." : "Salvar campanha"}
        </button>
      </form>
    </CampaignLayout>
  );
}

function Topo({ onVoltar }) {
  return (
    <header className="mb-6 flex items-start justify-between">
      <div>
        <BotaoVoltar onClick={onVoltar} />

        <h1 className="text-[28px] font-black leading-none text-[#0c1187]">
          Nova Campanha
        </h1>

        <p className="mt-3 text-[13px] font-black leading-5 text-[#062d61]">
          Preencha as informações da empresa parceira, período, tipos de
          resíduos e premiação.
        </p>
      </div>

      <LogoResiduum />
    </header>
  );
}

function Campo({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-black text-[#062d61]">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-[#5644ce] bg-white px-4 py-3 text-[13px] font-bold text-[#062d61] outline-none placeholder:text-slate-400"
      />
    </div>
  );
}