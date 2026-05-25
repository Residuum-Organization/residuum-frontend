import React, { useState } from "react";
import campaignLogo from "../assets/campaign-logo.jpg";
import iconDot from "../assets/icon-dot.png";
import iconPrizeBase from "../assets/icon-prize-base.png";
import iconPrizeVector from "../assets/icon-prize-vector.png";
import iconRecycle from "../assets/icon-recycle.png";
import iconStar from "../assets/icon-star.png";
import navEnterprise from "../assets/nav-enterprise.png";
import navHome from "../assets/nav-home.png";
import navMap from "../assets/nav-map.png";
import navUser from "../assets/nav-user.png";
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

export default function CampanhaHeineken() {
  const [tela, setTela] = useState("funciona");

  return (
    <main className="min-h-screen bg-[#f1f3ff]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <Topo />

        <section className="flex-1 rounded-[18px] border-2 border-[#5644ce] bg-[#fbfbff] px-4 pb-6 pt-5 shadow-sm sm:px-6 lg:px-8 lg:py-8">
          <CabecalhoCampanha />
          <Progresso />
          <Abas tela={tela} setTela={setTela} />

          <div className="pt-5 lg:pt-8">
            {tela === "funciona" && <ComoFunciona />}
            {tela === "sobre" && <Sobre />}
            {tela === "premios" && <Premios />}
          </div>
        </section>

        <MenuInferior />
      </div>
    </main>
  );
}

function Topo() {
  return (
    <header className="-mx-4 flex w-[calc(100%+32px)] items-start justify-between pb-5 pl-4 pr-1 pt-0 sm:-mx-6 sm:w-[calc(100%+48px)] sm:pl-6 sm:pr-6 lg:mx-0 lg:w-full lg:px-0 lg:pb-8">
      <h1 className="mt-2 text-[22px] font-black leading-none text-[#0c1187] sm:text-3xl lg:text-4xl">
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
    <div className="grid grid-cols-[56px_1fr] items-center gap-3 lg:grid-cols-[86px_1fr_auto] lg:gap-5">
      <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] border-red-600 bg-[#00843d] text-[9px] font-black leading-none text-white before:absolute before:top-[11px] before:h-[10px] before:w-[10px] before:bg-red-600 before:[clip-path:polygon(50%_0%,62%_35%,100%_35%,69%_57%,82%_100%,50%_74%,18%_100%,31%_57%,0%_35%,38%_35%)] lg:h-[86px] lg:w-[86px] lg:text-sm lg:before:top-[18px] lg:before:h-4 lg:before:w-4">
        Heineken
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="text-[17px] font-black leading-none text-[#062D61] sm:text-xl lg:text-3xl">
            Campanha Heineken
          </h2>
          <span className="rounded-full border border-[#48d554] bg-[#c7ffc4] px-2 py-1 text-[10px] font-black leading-none text-[#079628] lg:text-sm">
            Ativa
          </span>
        </div>

        <div className="mt-3 grid gap-3 lg:flex lg:items-center lg:gap-7">
          <Meta icon={<CalendarDays />} text="01/04/2026 - 30/04/2026" />
          <Meta icon={<MapPin className="fill-red-600 text-red-600" />} text="Norte, Sul e Leste" />
        </div>
      </div>

      <div className="hidden rounded-[18px] border border-[#4fc354] bg-[#ddf7df] px-5 py-4 text-right lg:block">
        <p className="text-sm font-black leading-none text-[#241AA3]">Impacto atual</p>
        <p className="mt-2 text-2xl font-black leading-none text-[#079628]">35,0t</p>
        <p className="mt-1 text-xs font-extrabold text-[#062D61]">resíduos coletados</p>
      </div>
    </div>
  );
}

function Meta({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-[13px] font-black leading-none text-[#062D61] lg:text-lg">
      <span className="[&_svg]:h-4 [&_svg]:w-4 lg:[&_svg]:h-6 lg:[&_svg]:w-6">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Progresso() {
  return (
    <div className="mt-5 rounded-full border border-[#6456dd] px-4 py-3 lg:px-6 lg:py-4">
      <p className="mb-3 text-[13px] font-black leading-none text-black lg:text-lg">
        Progresso da campanha
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-[#d7d7d7] lg:h-3">
        <div className="h-full w-[67%] rounded-full bg-[#079628]" />
      </div>
      <p className="mt-2 text-right text-[11px] font-black leading-none text-black lg:text-base">
        67% do período concluído
      </p>
    </div>
  );
}

function Abas({ tela, setTela }) {
  return (
    <nav className="mt-6 flex items-end justify-center gap-10 overflow-x-auto border-b border-[#ddd] sm:gap-14 lg:gap-16">
      {abas.map((aba) => (
        <button
          key={aba.id}
          type="button"
          onClick={() => setTela(aba.id)}
          className={[
            "relative shrink-0 pb-3 text-[13px] font-black leading-none transition-colors lg:text-base",
            aba.id === "funciona" ? "-translate-x-2 sm:-translate-x-4 lg:-translate-x-6" : "",
            aba.id === "premios" ? "translate-x-2 sm:translate-x-4 lg:translate-x-6" : "",
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
    <div className="lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:items-start lg:gap-10">
      <div>
        <SectionTitle>Como funciona</SectionTitle>
        <div className="grid gap-0 lg:grid-cols-2 lg:gap-x-8">
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
        </div>
      </div>

      <aside className="mt-3 rounded-[18px] border border-[#6456dd] bg-[#f7f7ff] px-5 py-5 lg:mt-0">
        <h3 className="text-lg font-black text-[#241AA3]">Participe da campanha</h3>
        <p className="mt-3 text-sm font-extrabold leading-5 text-[#062D61] lg:text-base lg:leading-6">
          Entregue materiais recicláveis nos pontos participantes e acompanhe seus pontos durante todo o período da campanha.
        </p>
        <button
          type="button"
          className="mt-5 grid h-[50px] w-full place-items-center rounded-full bg-[#3020a0] text-[18px] font-black leading-none text-white transition-transform active:scale-[0.98]"
        >
          Quero participar
        </button>
      </aside>
    </div>
  );
}

function Sobre() {
  return (
    <div className="lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">
      <div>
        <SectionTitle>Sobre a Heineken</SectionTitle>
        <p className="mb-5 max-w-3xl text-sm font-extrabold leading-5 text-[#062D61] lg:text-base lg:leading-6">
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
      </div>

      <div className="mt-2 rounded-[14px] border border-[#4fc354] bg-[#ddf7df] px-4 py-4 lg:mt-0 lg:rounded-[18px] lg:p-6">
        <h3 className="mb-4 text-sm font-black leading-none text-[#241AA3] lg:text-xl">
          Impacto positivo
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center lg:grid-cols-1 lg:text-left">
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
      <p className="mb-5 text-sm font-extrabold leading-5 text-[#062D61] lg:text-base">
        Quanto mais pontos, mais chances de ganhar!
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
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
      </div>

      <div className="mt-5 grid grid-cols-[30px_1fr] items-start gap-3 rounded-[14px] bg-[#f7f7ff] p-4 lg:max-w-2xl">
        <div className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#d9d6f6] text-[18px] font-black leading-none text-[#241AA3]">
          !
        </div>
        <div>
          <h3 className="mb-2 text-[15px] font-black leading-none text-[#241AA3] lg:text-lg">
            Importante
          </h3>
          <p className="text-[13px] font-extrabold leading-5 text-[#062D61] lg:text-base lg:leading-6">
            Os sorteios serão realizados em 02/05/2026 e os vencedores divulgados em nossos canais oficiais.
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="mb-5 text-[22px] font-black leading-none text-[#241AA3] lg:text-3xl">
      {children}
    </h2>
  );
}

function IconPng({ src, alt, className = "h-6 w-6" }) {
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
    <span className="flex w-6 flex-col items-center justify-center gap-[2px]">
      <IconPng src={iconPrizeVector} alt="Prêmios" className="h-[14px] w-6" />
      <IconPng src={iconPrizeBase} alt="" className="h-[6px] w-6 object-fill" />
    </span>
  );
}

function Linha({ icon, titulo, texto, ultimo = false }) {
  return (
    <div className="relative grid grid-cols-[50px_1fr] gap-4 pb-5">
      {!ultimo && (
        <div className="absolute left-6 top-[50px] h-[calc(100%-18px)] w-[2px] bg-[#a9eba3] lg:hidden" />
      )}
      <div className="z-10 grid h-12 w-12 place-items-center rounded-full bg-[#86e17b] text-[#079628] [&_svg]:h-6 [&_svg]:w-6 [&_svg]:stroke-[3]">
        {icon}
      </div>
      <div className="pt-1">
        <h3 className="text-[15px] font-black leading-5 text-[#062D61] lg:text-lg">
          {titulo}
        </h3>
        <p className="mt-1 text-sm font-extrabold leading-5 text-[#062D61] lg:text-base lg:leading-6">
          {texto}
        </p>
      </div>
    </div>
  );
}

function CardPremio({ icon, titulo, texto }) {
  return (
    <div className="flex min-h-[76px] flex-col items-center justify-center rounded-[14px] border border-[#6456dd] bg-[#f7f7ff] px-3 py-4 text-center lg:min-h-[150px]">
      <div className="mb-1 text-[#079628] [&_svg]:h-[26px] [&_svg]:w-[26px] lg:[&_svg]:h-9 lg:[&_svg]:w-9">
        {icon}
      </div>
      <h3 className="mb-2 text-[17px] font-black leading-none text-[#241AA3] lg:text-xl">
        {titulo}
      </h3>
      <p className="text-[13px] font-extrabold leading-5 text-[#062D61] lg:text-base">
        {texto}
      </p>
    </div>
  );
}

function Estatistica({ numero, texto }) {
  return (
    <div className="lg:border-b lg:border-[#b6e6b8] lg:pb-4 lg:last:border-b-0 lg:last:pb-0">
      <strong className="block text-base font-black leading-none text-[#079628] lg:text-3xl">
        {numero}
      </strong>
      <span className="mt-1 block text-[10px] font-extrabold leading-3 text-[#062D61] lg:text-sm lg:leading-5">
        {texto}
      </span>
    </div>
  );
}

function MenuInferior() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 mx-auto grid h-16 max-w-[1180px] grid-cols-4 place-items-center rounded-t-[18px] bg-[#33658F] text-white shadow-[0_-8px_20px_rgba(0,0,0,0.08)] lg:static lg:mt-5 lg:max-w-none lg:rounded-[18px] lg:shadow-none">
      <img src={navHome} alt="Início" className="h-7 w-7 object-contain" />
      <img src={navEnterprise} alt="Campanhas" className="h-7 w-7 object-contain" />
      <img src={navMap} alt="Mapa" className="h-7 w-7 object-contain" />
      <img src={navUser} alt="Perfil" className="h-7 w-7 object-contain" />
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
