import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampaignLayout, {
  BotaoVoltar,
  LogoResiduum,
} from "../components/Campanhas/CampaignLayout";

const abas = [
  { id: "funciona", label: "Como funciona" },
  { id: "sobre", label: "Sobre a marca" },
  { id: "premios", label: "Prêmios" },
];

export default function CampanhaDetalhesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [abaAtual, setAbaAtual] = useState("funciona");

  const campanhasSalvas =
    JSON.parse(localStorage.getItem("campanhasCriadas")) || [];

  const campanha = campanhasSalvas.find(
    (item) => String(item.id) === String(id)
  );

  if (!campanha) {
    return (
      <CampaignLayout>
        <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
          <h1 className="text-[24px] font-black text-[#0c1187]">
            Campanha não encontrada
          </h1>

          <p className="mt-3 text-[13px] font-black leading-5 text-[#062d61]">
            Essa campanha pode ter sido removida ou não existe mais.
          </p>

          <button
            type="button"
            onClick={() => navigate("/campanhas")}
            className="mt-6 rounded-full bg-[#3020a0] px-8 py-3 text-[14px] font-black text-white"
          >
            Voltar para campanhas
          </button>
        </div>
      </CampaignLayout>
    );
  }

  return (
    <CampaignLayout>
      <Topo campanha={campanha} onVoltar={() => navigate("/campanhas")} />

      <div className="rounded-[20px] border-2 border-[#5644ce] bg-[#fbfbff] px-3 pb-5 pt-4">
        <CabecalhoCampanha campanha={campanha} />

        <Progresso />

        <Abas abaAtual={abaAtual} setAbaAtual={setAbaAtual} />

        <div className="pt-5">
          {abaAtual === "funciona" && <ComoFunciona campanha={campanha} />}
          {abaAtual === "sobre" && <SobreMarca campanha={campanha} />}
          {abaAtual === "premios" && <Premios campanha={campanha} />}
        </div>
      </div>
    </CampaignLayout>
  );
}

function Topo({ campanha, onVoltar }) {
  return (
    <header className="mb-4 flex items-start justify-between">
      <div className="min-w-0 flex-1 pr-4">
        <BotaoVoltar onClick={onVoltar} />

        <h1 className="text-[22px] font-black leading-6 text-[#0c1187]">
          {campanha.nome}
        </h1>
      </div>

      <LogoResiduum />
    </header>
  );
}

function CabecalhoCampanha({ campanha }) {
  return (
    <div className="grid grid-cols-[58px_1fr] items-center gap-3">
      <LogoCampanha empresa={campanha.empresa} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[16px] font-black leading-5 text-[#062d61]">
            {campanha.nome}
          </h2>

          <span className="rounded-full border border-orange-300 bg-orange-100 px-3 py-1 text-[10px] font-black leading-none text-orange-600">
            {campanha.status}
          </span>
        </div>

        <p className="mt-2 text-[11px] font-black text-[#079628]">
          {campanha.empresa}
        </p>

        <div className="mt-3 space-y-2">
          <Meta icone="📅" texto={campanha.periodo} />
          <Meta icone="📍" texto={campanha.locais} />
          <Meta icone="♻️" texto={campanha.residuo} />
        </div>
      </div>
    </div>
  );
}

function LogoCampanha({ empresa }) {
  return (
    <div className="grid h-[58px] w-[58px] place-items-center rounded-full bg-[#3020a0] text-[22px] font-black text-white">
      {empresa ? empresa.charAt(0).toUpperCase() : "C"}
    </div>
  );
}

function Meta({ icone, texto }) {
  return (
    <div className="flex items-center gap-2 text-[12px] font-black leading-none text-[#062d61]">
      <span>{icone}</span>
      <span>{texto}</span>
    </div>
  );
}

function Progresso() {
  return (
    <div className="mt-4 rounded-full border border-[#6456dd] bg-white px-3 py-3">
      <p className="mb-2 text-[11px] font-black leading-none text-[#062d61]">
        Progresso da campanha
      </p>

      <div className="h-2 overflow-hidden rounded-full bg-[#d7d7d7]">
        <div className="h-full w-[0%] rounded-full bg-[#139928]" />
      </div>

      <p className="mt-2 text-right text-[9px] font-black leading-none text-[#062d61]">
        0% do período concluído
      </p>
    </div>
  );
}

function Abas({ abaAtual, setAbaAtual }) {
  return (
    <nav className="mt-5 flex items-end justify-between border-b border-[#ddd]">
      {abas.map((aba) => (
        <button
          key={aba.id}
          type="button"
          onClick={() => setAbaAtual(aba.id)}
          className={`relative pb-3 text-[10px] font-black leading-none transition-colors ${
            abaAtual === aba.id
              ? "text-[#079628] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[3px] after:rounded-full after:bg-[#079628]"
              : "text-black"
          }`}
        >
          {aba.label}
        </button>
      ))}
    </nav>
  );
}

function ComoFunciona({ campanha }) {
  return (
    <div>
      <SectionTitle>Como funciona</SectionTitle>

      <Linha
        icone="♻️"
        titulo="Separe seus resíduos"
        texto={`Separe corretamente o material da campanha: ${campanha.residuo}.`}
      />

      <Linha
        icone="📍"
        titulo="Leve até um ponto participante"
        texto={`Entregue seus resíduos nos pontos de coleta participantes da região: ${campanha.locais}.`}
      />

      <Linha
        icone="⭐"
        titulo="Registre sua participação"
        texto="No ponto de coleta, seus materiais serão registrados para contabilizar sua participação na campanha."
      />

      <Linha
        icone="🎁"
        titulo="Concorra aos prêmios"
        texto="Ao participar da campanha, você aumenta suas chances de concorrer aos prêmios definidos pela empresa parceira."
        ultimo
      />

      <button
        type="button"
        className="mx-auto mt-2 grid h-[42px] w-full max-w-[220px] place-items-center rounded-full bg-[#3020a0] text-[14px] font-black leading-none text-white transition-transform active:scale-[0.98]"
      >
        Quero participar
      </button>
    </div>
  );
}

function SobreMarca({ campanha }) {
  return (
    <div>
      <SectionTitle>Sobre a marca</SectionTitle>

      <p className="mb-4 text-[12px] font-extrabold leading-5 text-[#062d61]">
        A campanha <strong>{campanha.nome}</strong> foi criada em parceria com a
        empresa <strong>{campanha.empresa}</strong>, incentivando práticas mais
        sustentáveis e o descarte correto de resíduos.
      </p>

      <Linha
        icone="🌱"
        titulo="Compromisso ambiental"
        texto="A empresa parceira apoia ações voltadas à sustentabilidade e à redução de impactos ambientais."
      />

      <Linha
        icone="♻️"
        titulo="Incentivo à reciclagem"
        texto={`A campanha estimula a coleta e o descarte correto de ${campanha.residuo}.`}
      />

      <Linha
        icone="💼"
        titulo="Parceria com a comunidade"
        texto="A proposta é aproximar empresas, pontos de coleta e moradores por meio de ações sustentáveis."
        ultimo
      />

      <div className="mt-2 rounded-[16px] border border-[#4fc354] bg-[#ddf7df] px-4 py-3">
        <h3 className="mb-3 text-[13px] font-black leading-none text-[#241aa3]">
          Informações da campanha
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center">
          <Estatistica numero="0%" texto="Concluído" />
          <Estatistica numero="Nova" texto="Campanha" />
          <Estatistica numero="1" texto="Marca parceira" />
        </div>
      </div>
    </div>
  );
}

function Premios({ campanha }) {
  const premios = separarPremios(campanha.premiacao);

  return (
    <div>
      <SectionTitle>Prêmios</SectionTitle>

      <p className="mb-4 text-[12px] font-extrabold leading-5 text-[#062d61]">
        Quanto mais você participa, maiores são suas chances de ganhar.
      </p>

      <CardPremio
        icone="🏆"
        titulo="1° Prêmio"
        texto={premios[0] || "Prêmio principal da campanha"}
      />

      <CardPremio
        icone="🎁"
        titulo="2° Prêmio"
        texto={premios[1] || "Segundo prêmio a definir"}
      />

      <CardPremio
        icone="🎁"
        titulo="3° Prêmio"
        texto={premios[2] || "Terceiro prêmio a definir"}
      />

      <div className="mt-4 grid grid-cols-[28px_1fr] items-start gap-3 rounded-[16px] bg-[#f7f7ff] p-3">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-[#d9d6f6] text-[16px] font-black leading-none text-[#241aa3]">
          !
        </div>

        <div>
          <h3 className="mb-1 text-[13px] font-black leading-none text-[#241aa3]">
            Importante
          </h3>

          <p className="text-[11px] font-extrabold leading-4 text-[#062d61]">
            As regras, datas e premiações podem ser ajustadas pela empresa
            parceira responsável pela campanha.
          </p>
        </div>
      </div>
    </div>
  );
}

function separarPremios(textoPremiacao) {
  if (!textoPremiacao) {
    return [];
  }

  return textoPremiacao
    .split(/\n|;|\|/)
    .map((premio) => premio.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function SectionTitle({ children }) {
  return (
    <h2 className="mb-4 text-[19px] font-black leading-none text-[#241aa3]">
      {children}
    </h2>
  );
}

function Linha({ icone, titulo, texto, ultimo = false }) {
  return (
    <div className="relative grid grid-cols-[42px_1fr] gap-3 pb-4">
      {!ultimo && (
        <div className="absolute left-5 top-[42px] h-[calc(100%-12px)] w-[2px] bg-[#a9eba3]" />
      )}

      <div className="z-10 grid h-10 w-10 place-items-center rounded-full bg-[#86e17b] text-[19px]">
        {icone}
      </div>

      <div className="pt-0.5">
        <h3 className="text-[13px] font-black leading-4 text-[#062d61]">
          {titulo}
        </h3>

        <p className="mt-1 text-[11px] font-extrabold leading-4 text-[#062d61]">
          {texto}
        </p>
      </div>
    </div>
  );
}

function CardPremio({ icone, titulo, texto }) {
  return (
    <div className="mb-3 flex min-h-[76px] flex-col items-center justify-center rounded-[16px] border border-[#6456dd] bg-[#f7f7ff] px-3 py-3 text-center">
      <div className="mb-1 text-[24px]">{icone}</div>

      <h3 className="mb-1 text-[14px] font-black leading-none text-[#241aa3]">
        {titulo}
      </h3>

      <p className="text-[11px] font-extrabold leading-4 text-[#062d61]">
        {texto}
      </p>
    </div>
  );
}

function Estatistica({ numero, texto }) {
  return (
    <div>
      <strong className="block text-[13px] font-black leading-none text-[#079628]">
        {numero}
      </strong>

      <span className="mt-1 block text-[9px] font-extrabold leading-3 text-[#062d61]">
        {texto}
      </span>
    </div>
  );
}
