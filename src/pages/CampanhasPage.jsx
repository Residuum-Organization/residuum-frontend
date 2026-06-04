import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignLayout, {
  LogoResiduum,
} from "../components/campanhas/CampaignLayout";

const campanhasPadrao = [
  {
    id: 1,
    nome: "Campanha Heineken",
    empresa: "Heineken",
    status: "Ativa",
    periodo: "01/04/2026 - 30/04/2026",
    locais: "Norte, Sul e Leste",
    progresso: 67,
    tipo: "heineken",
  },
  {
    id: 2,
    nome: "Campanha Coca-Cola",
    empresa: "Coca-Cola",
    status: "Planejada",
    periodo: "01/05/2026 - 30/05/2026",
    locais: "Todos os pontos",
    progresso: 0,
    tipo: "coca",
  },
];

export default function CampanhasPage() {
  const navigate = useNavigate();
  const [campanhasCriadas, setCampanhasCriadas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const campanhasSalvas =
      JSON.parse(localStorage.getItem("campanhasCriadas")) || [];

    setCampanhasCriadas(campanhasSalvas);
  }, []);

  const todasCampanhas = [...campanhasPadrao, ...campanhasCriadas];

  function abrirCampanha(campanha) {
    if (campanha.tipo === "heineken") {
      navigate("/campanha-heineken");
      return;
    }

    if (campanha.tipo === "personalizada") {
      navigate(`/campanhas/${campanha.id}`);
      return;
    }

    setMensagem("A tela de detalhes dessa campanha ainda não foi criada.");

    setTimeout(() => {
      setMensagem("");
    }, 2500);
  }

  function excluirCampanha(id) {
    const campanhasAtualizadas = campanhasCriadas.filter(
      (campanha) => campanha.id !== id
    );

    setCampanhasCriadas(campanhasAtualizadas);

    localStorage.setItem(
      "campanhasCriadas",
      JSON.stringify(campanhasAtualizadas)
    );

    setMensagem("Campanha removida com sucesso.");

    setTimeout(() => {
      setMensagem("");
    }, 2500);
  }

  return (
    <CampaignLayout>
      <Topo />

      {mensagem && (
        <div className="mb-5 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-[12px] font-black text-[#3020a0]">
          {mensagem}
        </div>
      )}

      <div className="space-y-5">
        {todasCampanhas.map((campanha) => (
          <CardCampanha
            key={campanha.id}
            campanha={campanha}
            onClick={() => abrirCampanha(campanha)}
            onDelete={
              campanha.tipo === "personalizada"
                ? () => excluirCampanha(campanha.id)
                : null
            }
          />
        ))}
      </div>

      <CampanhasEncerradas />

      <NovaCampanhaSugerida onClick={() => navigate("/nova-campanha")} />
    </CampaignLayout>
  );
}

function Topo() {
  return (
    <header className="mb-7 flex items-start justify-between">
      <div>
        <h1 className="text-[30px] font-black leading-none text-[#0c1187]">
          Campanhas
        </h1>

        <p className="mt-2 text-[14px] font-black leading-4 text-[#0c1187]">
          Gerencie promoções e engajamento
        </p>
      </div>

      <LogoResiduum />
    </header>
  );
}

function CardCampanha({ campanha, onClick, onDelete }) {
  const temProgresso = campanha.progresso > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-[24px] border-2 border-[#5644ce] bg-[#f3f2fb] px-4 py-4 text-left transition active:scale-[0.99]"
      >
        <div className="grid grid-cols-[58px_1fr] gap-3">
          <LogoCampanha tipo={campanha.tipo} empresa={campanha.empresa} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 pr-8">
              <h2 className="text-[18px] font-black leading-5 text-[#062d61]">
                {campanha.nome}
              </h2>

              <StatusBadge status={campanha.status} />
            </div>

            <p className="mt-2 text-[11px] font-black text-[#079628]">
              {campanha.empresa}
            </p>

            <div className="mt-3 space-y-2">
              <InfoLinha icone="📅" texto={campanha.periodo} />
              <InfoLinha icone="📍" texto={campanha.locais} />

              {campanha.residuo && (
                <InfoLinha icone="♻️" texto={campanha.residuo} />
              )}
            </div>
          </div>
        </div>

        {temProgresso && <BarraProgresso progresso={campanha.progresso} />}
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-red-100 text-[14px] font-black text-red-600"
          title="Excluir campanha"
        >
          ×
        </button>
      )}
    </div>
  );
}

function LogoCampanha({ tipo, empresa }) {
  if (tipo === "heineken") {
    return (
      <div className="relative grid h-[58px] w-[58px] place-items-center rounded-full bg-[#00843d] text-[8px] font-black leading-none text-white">
        <span className="absolute top-[9px] h-[12px] w-[12px] bg-red-600 [clip-path:polygon(50%_0%,62%_35%,100%_35%,69%_57%,82%_100%,50%_74%,18%_100%,31%_57%,0%_35%,38%_35%)]" />
        <span className="mt-3">Heineken</span>
      </div>
    );
  }

  if (tipo === "coca") {
    return (
      <div className="grid h-[58px] w-[58px] place-items-center rounded-full bg-red-600 text-[20px] font-black text-white">
        C
      </div>
    );
  }

  return (
    <div className="grid h-[58px] w-[58px] place-items-center rounded-full bg-[#3020a0] text-[20px] font-black text-white">
      {empresa ? empresa.charAt(0).toUpperCase() : "N"}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles =
    status === "Ativa"
      ? "border-[#48d554] bg-[#c7ffc4] text-[#079628]"
      : "border-orange-300 bg-orange-100 text-orange-600";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-black leading-none ${styles}`}
    >
      {status}
    </span>
  );
}

function InfoLinha({ icone, texto }) {
  return (
    <div className="flex items-center gap-2 text-[12px] font-black leading-none text-[#062d61]">
      <span>{icone}</span>
      <span>{texto}</span>
    </div>
  );
}

function BarraProgresso({ progresso }) {
  return (
    <div className="mt-4 rounded-full border border-[#6456dd] bg-white px-3 py-3">
      <p className="mb-2 text-[11px] font-black leading-none text-[#062d61]">
        Progresso da campanha
      </p>

      <div className="h-2 overflow-hidden rounded-full bg-[#d7d7d7]">
        <div
          className="h-full rounded-full bg-[#139928]"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <p className="mt-2 text-right text-[9px] font-black leading-none text-[#062d61]">
        {progresso}% do período concluído
      </p>
    </div>
  );
}

function CampanhasEncerradas() {
  return (
    <div className="mt-6 rounded-[24px] border-2 border-[#5644ce] bg-[#fbfbff] px-4 py-4">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#efedff] text-[24px]">
          🎁
        </div>

        <div>
          <h3 className="text-[15px] font-black leading-4 text-black">
            Nenhuma campanha encerrada
          </h3>

          <p className="mt-1 text-[12px] font-black leading-4 text-[#062d61]">
            Campanhas finalizadas aparecerão aqui
          </p>
        </div>
      </div>
    </div>
  );
}

function NovaCampanhaSugerida({ onClick }) {
  return (
    <section className="mt-8 border-t border-slate-300 pt-6">
      <h2 className="text-[23px] font-black leading-none text-[#062d61]">
        Nova Campanha sugerida
      </h2>

      <p className="mt-3 text-[13px] font-black leading-5 text-[#062d61]">
        Crie uma nova campanha de patrocínio em poucos passos
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 flex w-full items-center gap-4 rounded-[24px] border-2 border-[#5644ce] bg-[#f3f2fb] px-4 py-5 text-left transition active:scale-[0.99]"
      >
        <IconeNovaCampanha />

        <div className="flex-1">
          <h3 className="text-[17px] font-black leading-5 text-[#062d61]">
            Crie uma nova campanha
          </h3>

          <p className="mt-2 text-[12px] font-black leading-4 text-[#062d61]">
            Preencha as informações da empresa parceira, período, tipos de
            resíduos e premiação
          </p>
        </div>

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#3020a0] text-xl font-black text-white">
          →
        </div>
      </button>
    </section>
  );
}

function IconeNovaCampanha() {
  return (
    <div className="relative h-[78px] w-[66px] shrink-0">
      <div className="absolute left-0 top-2 h-[60px] w-[42px] rounded-xl border-2 border-[#00843d]" />
      <div className="absolute left-4 top-0 h-[66px] w-[42px] rounded-xl border-2 border-[#00843d] bg-[#f3f2fb]" />
      <div className="absolute bottom-1 right-0 grid h-7 w-7 place-items-center rounded-full bg-[#00843d] text-lg font-black text-white">
        +
      </div>
    </div>
  );
}