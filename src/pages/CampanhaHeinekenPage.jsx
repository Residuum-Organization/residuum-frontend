import React, { useState } from "react";
import campaignLogo from "../asset/campaign-logo.jpg";
import iconDot from "../asset/icon-dot.png";
import iconPrizeBase from "../asset/icon-prize-base.png";
import iconPrizeVector from "../asset/icon-prize-vector.png";
import iconRecycle from "../asset/icon-recycle.png";
import iconStar from "../asset/icon-star.png";
import navEnterprise from "../asset/nav-enterprise.png";
import navHome from "../asset/nav-home.png";
import navMap from "../asset/nav-map.png";
import navUser from "../asset/nav-user.png";
import {
  BriefcaseBusiness,
  CalendarDays,
  Flower2,
  Gift,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";

const abas = [
  { id: "funciona", label: "Como funciona" },
  { id: "sobre", label: "Sobre a Heineken" },
  { id: "premios", label: "Prêmios" },
];

export default function CampanhaHeinekenPage() {
  const [tela, setTela] = useState("funciona");

  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#fbfbff] shadow-2xl">
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-5">
          <Topo />

          <div className="rounded-[18px] border-2 border-[#5644ce] bg-[#fbfbff] px-3 pb-5 pt-4">
            <CabecalhoCampanha />
            <Progresso />
            <Abas tela={tela} setTela={setTela} />

            <div className="pt-5">
              {tela === "funciona" && <ComoFunciona />}
              {tela === "sobre" && <Sobre />}
              {tela === "premios" && <Premios />}
            </div>
          </div>
        </div>

        <MenuInferior />
      </section>
    </main>
  );
}

function Topo() {
  return (
    <header className="flex items-start justify-between pb-4">
      <h1 className="mt-2 text-[19px] font-black leading-none text-[#0c1187]">
        Campanha Heineken
      </h1>

      <img
        src={campaignLogo}
        alt="Logo da campanha"
        className="h-[62px] w-[63px] shrink-0 bg-transparent object-contain mix-blend-multiply"
      />
    </header>
  );
}

function CabecalhoCampanha() {
  return (
    <div className="grid grid-cols-[52px_1fr] items-center gap-3">
      <div className="relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-[#00843d] text-[8px] font-black leading-none text-white before:absolute before:top-[10px] before:h-[10px] before:w-[10px] before:bg-red-600 before:[clip-path:polygon(50%_0%,62%_35%,100%_35%,69%_57%,82%_100%,50%_74%,18%_100%,31%_57%,0%_35%,38%_35%)]">
        Heineken
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="text-[15px] font-black leading-none text-[#062d61]">
            Campanha Heineken
          </h2>

          <span className="rounded-full border border-[#48d554] bg-[#c7ffc4] px-2 py-1 text-[9px] font-black leading-none text-[#079628]">
            Ativa
          </span>
        </div>

        <div className="mt-2 grid gap-2">
          <Meta icon={<CalendarDays />} text="01/04/2026 - 30/04/2026" />
          <Meta
            icon={<MapPin className="fill-red-600 text-red-600" />}
            text="Norte, Sul e Leste"
          />
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-black leading-none text-[#062d61]">
      <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Progresso() {
  return (
    <div className="mt-4 rounded-full border border-[#6456dd] px-3 py-3">
      <p className="mb-2 text-[11px] font-black leading-none text-black">
        Progresso da campanha
      </p>

      <div className="h-2 overflow-hidden rounded-full bg-[#d7d7d7]">
        <div className="h-full w-[67%] rounded-full bg-[#139928]" />
      </div>

      <p className="mt-2 text-right text-[9px] font-black leading-none text-black">
        67% do período concluído
      </p>
    </div>
  );
}

function Abas({ tela, setTela }) {
  return (
    <nav className="mt-5 flex items-end justify-center gap-5 border-b border-[#ddd]">
      {abas.map((aba) => (
        <button
          key={aba.id}
          type="button"
          onClick={() => setTela(aba.id)}
          className={[
            "relative shrink-0 pb-3 text-[10px] font-black leading-none transition-colors",
            aba.id === "funciona" ? "-translate-x-1" : "",
            aba.id === "premios" ? "translate-x-1" : "",
            tela === aba.id
              ? "text-[#079628] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[3px] after:rounded-full after:bg-[#079628]"
              : "text-black hover:text-[#079628]",
          ].join(" ")}
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
        icon={<IconPng src={iconRecycle} alt="Reciclagem" />}
        titulo="Separe seus resíduos"
        texto="Separe e leve suas garrafas PET até um ponto de coleta participante"
      />

      <Linha
        icon={<IconPng src={iconDot} alt="Ponto de coleta" className="h-5 w-5" />}
        titulo="Deposite e registre"
        texto="No ponto de coleta, seus materiais serão pesados e registrados no app"
      />

      <Linha
        icon={<IconPng src={iconStar} alt="Pontos" />}
        titulo="Ganhe pontos"
        texto="Você acumula pontos a cada entrega realizada de acordo com a tabela de campanha"
      />

      <Linha
        icon={<PrizeStepIcon />}
        titulo="Concorra a prêmios"
        texto="No final da campanha, os pontos se transformam em números da sorte para concorrer a prêmios incríveis"
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

function Sobre() {
  return (
    <div>
      <SectionTitle>Sobre a Heineken</SectionTitle>

      <p className="mb-4 text-[11px] font-extrabold leading-4 text-[#062d61]">
        Com mais de 150 anos de história, a Heineken acredita que pequenas atitudes podem gerar grandes mudanças.
      </p>

      <Linha
        icon={<Flower2 fill="#078b23" />}
        titulo="Compromisso com o planeta"
        texto="Investimos continuamente em iniciativas sustentáveis para reduzir nosso impacto ambiental."
      />

      <Linha
        icon={<Star fill="#078b23" />}
        titulo="Economia circular"
        texto="Apoiamos a reciclagem e o descarte correto de materiais, promovendo um ciclo mais responsável."
      />

      <Linha
        icon={<BriefcaseBusiness fill="#078b23" />}
        titulo="Parceria que transforma"
        texto="Essa campanha é mais uma forma de estarmos próximos de você, incentivando a mudança real na comunidade."
        ultimo
      />

      <div className="mt-2 rounded-[14px] border border-[#4fc354] bg-[#ddf7df] px-4 py-3">
        <h3 className="mb-3 text-[12px] font-black leading-none text-[#241aa3]">
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

      <p className="mb-4 text-[11px] font-extrabold leading-4 text-[#062d61]">
        Quanto mais pontos, mais chances de ganhar!
      </p>

      <CardPremio
        icon={<Trophy fill="#f2b516" className="text-[#f2b516]" />}
        titulo="1° Prêmio"
        texto="1 ano de produtos Heineken + kit exclusivo"
      />

      <CardPremio
        icon={<Gift fill="#079628" />}
        titulo="2° Prêmio"
        texto="Vale-compras R$1.000,00"
      />

      <CardPremio
        icon={<BriefcaseBusiness fill="#079628" />}
        titulo="3° Prêmio"
        texto="Vale-compras R$500,00"
      />

      <div className="mt-4 grid grid-cols-[28px_1fr] items-start gap-3 rounded-[14px] bg-[#f7f7ff] p-3">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-[#d9d6f6] text-[16px] font-black leading-none text-[#241aa3]">
          !
        </div>

        <div>
          <h3 className="mb-1 text-[13px] font-black leading-none text-[#241aa3]">
            Importante
          </h3>

          <p className="text-[11px] font-extrabold leading-4 text-[#062d61]">
            Os sorteios serão realizados em 02/05/2026 e os vencedores divulgados em nossos canais oficiais.
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="mb-4 text-[18px] font-black leading-none text-[#241aa3]">
      {children}
    </h2>
  );
}

function Linha({ icon, titulo, texto, ultimo = false }) {
  return (
    <div className="relative grid grid-cols-[42px_1fr] gap-3 pb-4">
      {!ultimo && (
        <div className="absolute left-5 top-[42px] h-[calc(100%-12px)] w-[2px] bg-[#a9eba3]" />
      )}

      <div className="z-10 grid h-10 w-10 place-items-center rounded-full bg-[#86e17b] text-[#079628] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:stroke-[3]">
        {icon}
      </div>

      <div className="pt-0.5">
        <h3 className="text-[12px] font-black leading-4 text-[#062d61]">
          {titulo}
        </h3>

        <p className="mt-1 text-[11px] font-extrabold leading-4 text-[#062d61]">
          {texto}
        </p>
      </div>
    </div>
  );
}

function IconPng({ src, alt, className = "h-5 w-5" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`block object-contain ${className}`}
      draggable="false"
    />
  );
}

function PrizeStepIcon() {
  return (
    <span className="flex w-5 flex-col items-center justify-center gap-[2px]">
      <IconPng src={iconPrizeVector} alt="Prêmios" className="h-[12px] w-5" />
      <IconPng src={iconPrizeBase} alt="" className="h-[6px] w-5 object-fill" />
    </span>
  );
}

function CardPremio({ icon, titulo, texto }) {
  return (
    <div className="mb-3 flex min-h-[72px] flex-col items-center justify-center rounded-[14px] border border-[#6456dd] bg-[#f7f7ff] px-3 py-3 text-center">
      <div className="mb-1 text-[#079628] [&_svg]:h-6 [&_svg]:w-6">
        {icon}
      </div>

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

function MenuInferior() {
  return (
    <footer className="grid h-[68px] w-full grid-cols-4 place-items-center bg-[#33658f] text-white">
      <NavIcon src={navHome} alt="Início" />
      <NavIcon src={navEnterprise} alt="Empresas" />
      <NavIcon src={navMap} alt="Localização" />
      <NavIcon src={navUser} alt="Perfil" />
    </footer>
  );
}

function NavIcon({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="block h-7 w-7 object-contain"
      draggable="false"
    />
  );
}