import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignLayout, {
  LogoResiduum,
  BotaoVoltar,
} from "../components/campanhas/CampaignLayout";

const abas = [
  { id: "funciona", label: "Como funciona" },
  { id: "sobre", label: "Sobre a Heineken" },
  { id: "premios", label: "Prêmios" },
];

export default function CampanhaHeinekenPage() {
  const [abaAtual, setAbaAtual] = useState("funciona");
  const navigate = useNavigate();

  return (
    <CampaignLayout>
      <Topo onVoltar={() => navigate("/campanhas")} />

      <div className="rounded-[20px] border-2 border-[#5644ce] bg-[#fbfbff] px-3 pb-5 pt-4">
        <CabecalhoCampanha />

        <Progresso />

        <Abas abaAtual={abaAtual} setAbaAtual={setAbaAtual} />

        <div className="pt-5">
          {abaAtual === "funciona" && <ComoFunciona />}
          {abaAtual === "sobre" && <SobreHeineken />}
          {abaAtual === "premios" && <Premios />}
        </div>
      </div>
    </CampaignLayout>
  );
}

function Topo({ onVoltar }) {
  return (
    <header className="mb-4 flex items-start justify-between">
      <div>
        <BotaoVoltar onClick={onVoltar} />

        <h1 className="text-[22px] font-black leading-none text-[#0c1187]">
          Campanha Heineken
        </h1>
      </div>

      <LogoResiduum />
    </header>
  );
}

function CabecalhoCampanha() {
  return (
    <div className="grid grid-cols-[58px_1fr] items-center gap-3">
      <LogoHeineken />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[16px] font-black leading-5 text-[#062d61]">
            Campanha Heineken
          </h2>

          <span className="rounded-full border border-[#48d554] bg-[#c7ffc4] px-3 py-1 text-[10px] font-black leading-none text-[#079628]">
            Ativa
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <Meta icone="📅" texto="01/04/2026 - 30/04/2026" />
          <Meta icone="📍" texto="Norte, Sul e Leste" />
        </div>
      </div>
    </div>
  );
}

function LogoHeineken() {
  return (
    <div className="relative grid h-[58px] w-[58px] place-items-center rounded-full bg-[#00843d] text-[8px] font-black leading-none text-white">
      <span className="absolute top-[9px] h-[12px] w-[12px] bg-red-600 [clip-path:polygon(50%_0%,62%_35%,100%_35%,69%_57%,82%_100%,50%_74%,18%_100%,31%_57%,0%_35%,38%_35%)]" />
      <span className="mt-3">Heineken</span>
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
        <div className="h-full w-[67%] rounded-full bg-[#139928]" />
      </div>

      <p className="mt-2 text-right text-[9px] font-black leading-none text-[#062d61]">
        67% do período concluído
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

function ComoFunciona() {
  return (
    <div>
      <SectionTitle>Como funciona</SectionTitle>

      <Linha
        icone="♻️"
        titulo="Separe seus resíduos"
        texto="Separe e leve suas garrafas PET até um ponto de coleta participante."
      />

      <Linha
        icone="📍"
        titulo="Deposite e registre"
        texto="No ponto de coleta, seus materiais serão pesados e registrados no app."
      />

      <Linha
        icone="⭐"
        titulo="Ganhe pontos"
        texto="Você acumula pontos a cada entrega realizada de acordo com a tabela da campanha."
      />

      <Linha
        icone="🎁"
        titulo="Concorra a prêmios"
        texto="No final da campanha, os pontos se transformam em números da sorte para concorrer a prêmios incríveis."
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

function SobreHeineken() {
  return (
    <div>
      <SectionTitle>Sobre a Heineken</SectionTitle>

      <p className="mb-4 text-[12px] font-extrabold leading-5 text-[#062d61]">
        Com mais de 150 anos de história, a Heineken acredita que pequenas
        atitudes podem gerar grandes mudanças.
      </p>

      <Linha
        icone="🌱"
        titulo="Compromisso com o planeta"
        texto="Investimos continuamente em iniciativas sustentáveis para reduzir nosso impacto ambiental."
      />

      <Linha
        icone="⭐"
        titulo="Economia circular"
        texto="Apoiamos a reciclagem e o descarte correto de materiais, promovendo um ciclo mais responsável."
      />

      <Linha
        icone="💼"
        titulo="Parceria que transforma"
        texto="Essa campanha é mais uma forma de incentivar a mudança real na comunidade."
        ultimo
      />

      <div className="mt-2 rounded-[16px] border border-[#4fc354] bg-[#ddf7df] px-4 py-3">
        <h3 className="mb-3 text-[13px] font-black leading-none text-[#241aa3]">
          Impacto positivo
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center">
          <Estatistica numero="35,0t" texto="Resíduos coletados" />
          <Estatistica numero="2.847" texto="Pessoas engajadas" />
          <Estatistica numero="18" texto="Pontos de coleta" />
        </div>
      </div>
    </div>
  );
}

function Premios() {
  return (
    <div>
      <SectionTitle>Prêmios</SectionTitle>

      <p className="mb-4 text-[12px] font-extrabold leading-5 text-[#062d61]">
        Quanto mais pontos, mais chances de ganhar!
      </p>

      <CardPremio
        icone="🏆"
        titulo="1° Prêmio"
        texto="1 ano de produtos Heineken + kit exclusivo"
      />

      <CardPremio
        icone="🎁"
        titulo="2° Prêmio"
        texto="Vale-compras R$1.000,00"
      />

      <CardPremio
        icone="🎁"
        titulo="3° Prêmio"
        texto="Vale-compras R$500,00"
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
            Os sorteios serão realizados em 02/05/2026 e os vencedores serão
            divulgados em nossos canais oficiais.
          </p>
        </div>
      </div>
    </div>
  );
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