import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  FileText,
  MapPin,
  QrCode,
  Recycle,
  Warehouse,
} from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";

const actions = [
  {
    title: "Cadastrar residuo",
    description: "Informe o material que voce ja separou em casa.",
    to: "/cadastrar-residuo",
    Icon: ClipboardList,
  },
  {
    title: "Ver estoque",
    description: "Acompanhe os itens cadastrados antes da entrega.",
    to: "/meu-estoque",
    Icon: Warehouse,
  },
  {
    title: "Encontrar ponto",
    description: "Veja pontos de coleta no mapa demonstrativo.",
    to: "/mapa",
    Icon: MapPin,
  },
  {
    title: "Validar descarte",
    description: "Confirme presenca somente por GPS ou QR Code.",
    to: "/validacao-presenca",
    Icon: QrCode,
  },
  {
    title: "Acompanhar extrato",
    description: "Consulte pontos depois da confirmacao da cooperativa.",
    to: "/extrato",
    Icon: FileText,
  },
];

export default function WelcomeResiduum() {
  const navigate = useNavigate();

  return (
    <PageContainer className="bg-[var(--color-surface)] font-sans" innerClassName="pb-8">
      <div className="space-y-6">
        <section className="rounded-2xl bg-[#1F4E79] p-5 text-white shadow-sm sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12">
                <Recycle className="h-8 w-8" aria-hidden="true" />
              </div>
              <PageHeader
                eyebrow="Area do morador"
                title="Bem-vindo ao Residuum"
                description="Organize seus residuos, encontre pontos de coleta e acompanhe seu extrato com um fluxo simples e seguro."
                className="[&_h1]:text-white [&_p]:text-white/80"
              />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/cadastrar-residuo")}
                  className="w-full bg-white text-[#1F4E79] hover:bg-white/90 sm:w-auto"
                >
                  Comecar a reciclar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/mapa")}
                  className="w-full border border-white/30 sm:w-auto"
                >
                  Ver mapa
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-sm font-bold text-white">Como os pontos funcionam</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Seus pontos nao sao liberados no deposito. Eles dependem da
                confirmacao e pesagem real feita pela cooperativa.
              </p>
            </div>
          </div>
        </section>

        <SectionCard
          title="O que voce pode fazer agora"
          description="Use os atalhos abaixo para continuar o fluxo principal do morador."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map(({ title, description, to, Icon }) => (
              <button
                key={to}
                type="button"
                onClick={() => navigate(to)}
                className="flex min-h-[132px] flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left transition hover:border-[#1F4E79]/40 hover:bg-white focus-visible:ring-2 focus-visible:ring-[#1F4E79]/30"
              >
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F4E79] text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-base font-extrabold text-[#1F4E79]">{title}</span>
                <span className="mt-1 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
                  {description}
                </span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Fluxo seguro de descarte"
          description="Separe, cadastre, leve ao ponto e valide sua presenca fisica."
        >
          <div className="grid gap-3 md:grid-cols-3">
            <Step number="1" title="Cadastre" text="Registre o residuo que esta separado." />
            <Step number="2" title="Leve ao ponto" text="Use o mapa para escolher um local." />
            <Step number="3" title="Valide" text="Confirme por GPS ou QR Code no ponto." />
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2EA44F] text-sm font-black text-white">
        {number}
      </span>
      <h3 className="mt-3 text-base font-extrabold text-[#1F4E79]">{title}</h3>
      <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
        {text}
      </p>
    </div>
  );
}
