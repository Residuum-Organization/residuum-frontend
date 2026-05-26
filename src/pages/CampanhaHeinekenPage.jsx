import React, { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Recycle,
  Gift,
  Star,
  Leaf,
  Handshake,
  Trophy,
  CircleDollarSign,
} from "lucide-react";
import AdminShell from "../components/admin/AdminShell";

export default function CampanhaHeineken() {
  const [tela, setTela] = useState("funciona");

  return (
    <AdminShell
      shellClassName="bg-[#fbfbff]"
      contentClassName="px-4 pt-0 sm:px-6"
    >
        <Topo />

        <section className="mx-auto w-full max-w-[430px] rounded-[18px] border-2 border-[#119cff] bg-[#fbfbff] px-4 pb-5 pt-5 shadow-sm sm:px-5">
          <CabecalhoCampanha />
          <Progresso />
          <Abas tela={tela} setTela={setTela} />

          <div>
            {tela === "funciona" && <ComoFunciona />}
            {tela === "sobre" && <Sobre />}
            {tela === "premios" && <Premios />}
          </div>

          <div className="hidden">
            <ComoFunciona />
            <Sobre />
            <Premios />
          </div>
        </section>
    </AdminShell>
  );
}

function Topo() {
  return (
    <header className="w-full max-w-[430px] mx-auto px-4 pt-8 pb-5 flex items-start justify-between sm:px-5">
      <h1 className="text-[22px] sm:text-2xl leading-none font-extrabold text-[#2319a3]">
        Campanha Heineken
      </h1>

      <div className="relative w-[44px] h-[36px] -mt-1">
        <span className="absolute left-0 top-[6px] text-[30px] font-black text-[#39b54a] rotate-12">♻</span>
        <span className="absolute right-0 top-0 text-[24px] font-black text-[#39b54a] rotate-12">♻</span>
      </div>
    </header>
  );
}

function CabecalhoCampanha() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[56px] h-[56px] rounded-full bg-[#00843d] border-[3px] border-red-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
        Heineken
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-[17px] font-extrabold text-[#062d61] leading-none">
            Campanha Heineken
          </h2>
          <span className="text-[10px] font-extrabold text-[#11a329] border border-[#48d554] bg-[#c7ffc4] rounded-full px-2 py-1">
            Ativa
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[13px] font-extrabold text-[#062d61] leading-none">
          <CalendarDays size={16} />
          <span>01/04/2026 - 30/04/2026</span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[13px] font-extrabold text-[#062d61] leading-none">
          <MapPin size={18} className="text-red-600 fill-red-600" />
          <span>Norte, Sul e Leste</span>
        </div>
      </div>
    </div>
  );
}

function Progresso() {
  return (
    <div className="mt-5 border border-[#6456dd] rounded-full px-4 pt-3 pb-3">
      <p className="text-[13px] font-extrabold text-black leading-none mb-3">
        Progresso da campanha
      </p>
      <div className="h-[8px] bg-[#d7d7d7] rounded-full overflow-hidden">
        <div className="h-full w-[67%] bg-[#139928] rounded-full" />
      </div>
      <p className="text-[11px] text-right font-extrabold text-black leading-none mt-2">
        67% do período concluído
      </p>
    </div>
  );
}

function Abas({ tela, setTela }) {
  const abas = [
    ["funciona", "Como funciona"],
    ["sobre", "Sobre a Heineken"],
    ["premios", "Prêmios"],
  ];

  return (
    <nav className="mt-6 border-b border-[#dddddd] flex justify-between">
      {abas.map(([id, label]) => (
        <button
          key={id}
          onClick={() => setTela(id)}
          className={`relative pb-3 text-[13px] font-extrabold leading-none ${
            tela === id ? "text-[#05991e]" : "text-black"
          }`}
        >
          {label}
          {tela === id && (
            <span className="absolute left-0 right-0 bottom-[-1px] h-[3px] rounded-full bg-[#05991e]" />
          )}
        </button>
      ))}
    </nav>
  );
}

function ComoFunciona() {
  return (
    <div className="pt-5">
      <h3 className="text-[22px] font-extrabold text-[#241aa3] leading-none mb-5">
        Como funciona
      </h3>

      <Linha icon={<Recycle size={24} fill="#078b23" />} titulo="Separe seus resíduos" texto="Separe e leve suas garrafas PET até um ponto de coleta participante" />
      <Linha icon={<span className="w-[20px] h-[20px] rounded-full bg-[#079628] block" />} titulo="Deposite e registre" texto="No ponto de coleta, seus materiais serão pesados e registrados no app" />
      <Linha icon={<Star size={24} fill="#078b23" />} titulo="Ganhe pontos" texto="Você acumula pontos a cada entrega realizada de acordo com a tabela de campanha" />
      <Linha icon={<Gift size={24} fill="#078b23" />} titulo="Concorra a prêmios" texto="No final da campanha, os pontos se transformam em números da sorte para concorrer a prêmios incríveis" ultimo />

      <button className="mt-5 mx-auto block w-full max-w-[260px] h-[50px] rounded-full bg-[#3020a0] text-white text-[18px] font-extrabold">
        Quero participar
      </button>
    </div>
  );
}

function Sobre() {
  return (
    <div className="pt-5">
      <h3 className="text-[22px] font-extrabold text-[#241aa3] leading-none mb-3">
        Sobre a Heineken
      </h3>

      <p className="text-[14px] font-bold text-[#062d61] leading-5 mb-5">
        Com mais de 150 anos de história, a Heineken acredita que pequenas atitudes podem gerar grandes mudanças.
      </p>

      <Linha icon={<Leaf size={24} fill="#078b23" />} titulo="Compromisso com o planeta" texto="Investimos continuamente em iniciativas sustentáveis para reduzir nosso impacto ambiental." />
      <Linha icon={<Recycle size={24} fill="#078b23" />} titulo="Economia circular" texto="Apoiamos a reciclagem e o descarte correto de materiais, promovendo um ciclo mais responsável." />
      <Linha icon={<Handshake size={24} />} titulo="Parceria que transforma" texto="Essa campanha é mais uma forma de estarmos próximos de você, incentivando a mudança real na comunidade." ultimo />

      <div className="mt-5 rounded-[14px] border border-[#4fc354] bg-[#ddf7df] px-4 py-3">
        <h4 className="text-[14px] font-extrabold text-[#241aa3] mb-3">Impacto positivo</h4>
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
    <div className="pt-5">
      <h3 className="text-[22px] font-extrabold text-[#241aa3] leading-none mb-2">
        Prêmios
      </h3>
      <p className="text-[14px] font-bold text-[#062d61] leading-5 mb-5">
        Quanto mais pontos, mais chances de ganhar!
      </p>

      <CardPremio icon={<Trophy size={26} fill="#f2b516" className="text-[#f2b516]" />} titulo="1° Prêmio" texto="1 ano de produtos Heineken + kit exclusivo" />
      <CardPremio icon={<Gift size={26} fill="#079628" />} titulo="2° Prêmio" texto="Vale-compras R$1.000,00" />
      <CardPremio icon={<CircleDollarSign size={26} />} titulo="3° Prêmio" texto="Vale-compras R$500,00" />

      <div className="mt-5 flex gap-3 items-start">
        <div className="w-[30px] h-[30px] rounded-full bg-[#d9d6f6] text-[#241aa3] flex items-center justify-center text-[18px] font-black shrink-0">
          !
        </div>
        <div>
          <h4 className="text-[15px] font-extrabold text-[#241aa3] leading-none mb-2">Importante</h4>
          <p className="text-[13px] font-bold text-[#062d61] leading-5">
            Os sorteios serão realizados em 02/05/2026 e os vencedores divulgados em nossos canais oficiais.
          </p>
        </div>
      </div>
    </div>
  );
}

function Linha({ icon, titulo, texto, ultimo }) {
  return (
    <div className="flex gap-4 relative pb-5">
      <div className="w-[50px] flex justify-center relative shrink-0">
        {!ultimo && <div className="absolute top-[48px] w-[2px] h-full bg-[#a9eba3]" />}
        <div className="w-[48px] h-[48px] rounded-full bg-[#86e17b] flex items-center justify-center text-[#078b23] z-10">
          {icon}
        </div>
      </div>
      <div className="pt-1">
        <h4 className="text-[15px] font-extrabold text-[#062d61] leading-5">{titulo}</h4>
        <p className="text-[14px] font-bold text-[#062d61] leading-5 mt-1">{texto}</p>
      </div>
    </div>
  );
}

function CardPremio({ icon, titulo, texto }) {
  return (
    <div className="border border-[#6456dd] rounded-[14px] bg-[#f7f7ff] min-h-[76px] mb-4 flex flex-col items-center justify-center text-center px-3">
      <div className="text-[#079628] leading-none mb-1">{icon}</div>
      <h4 className="text-[17px] font-extrabold text-[#241aa3] leading-none mb-2">{titulo}</h4>
      <p className="text-[13px] font-bold text-[#062d61] leading-5">{texto}</p>
    </div>
  );
}

function Estatistica({ numero, texto }) {
  return (
    <div>
      <p className="text-[16px] font-extrabold text-[#079628] leading-none">{numero}</p>
      <p className="text-[10px] font-bold text-[#062d61] leading-3 mt-1">{texto}</p>
    </div>
  );
}

