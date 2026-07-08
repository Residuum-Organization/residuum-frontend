import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, FileText, MapPin, QrCode, Recycle, Warehouse } from "lucide-react";
import Navbar from "../components/ui/Navbar";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import Button from "../components/ui/Button";

const shortcuts = [
  {
    title: "Cadastrar residuo",
    description: "Adicione o material separado em casa.",
    to: "/cadastrar-residuo",
    Icon: ClipboardList,
    primary: true,
  },
  {
    title: "Meu estoque",
    description: "Veja os residuos ja cadastrados.",
    to: "/meu-estoque",
    Icon: Warehouse,
  },
  {
    title: "Mapa",
    description: "Encontre um ponto de coleta.",
    to: "/mapa",
    Icon: MapPin,
  },
  {
    title: "Validar presenca",
    description: "Use GPS ou QR Code no ponto.",
    to: "/validacao-presenca",
    Icon: QrCode,
  },
  {
    title: "Extrato",
    description: "Acompanhe pontos confirmados.",
    to: "/extrato",
    Icon: FileText,
  },
];

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <PageContainer className="bg-[var(--color-surface)] font-sans" innerClassName="pb-28">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Inicio"
          title="O que voce quer fazer?"
          description="Acesse rapidamente as principais etapas do descarte."
          action={
            <Button type="button" onClick={() => navigate("/cadastrar-residuo")}>
              Cadastrar residuo
            </Button>
          }
        />

        <InlineAlert variant="info" title="Fluxo do morador">
          Cadastre o residuo, leve ate um ponto de coleta e valide sua presenca
          fisica por GPS ou QR Code. A pontuacao depende da confirmacao e
          pesagem da cooperativa.
        </InlineAlert>

        <section className="rounded-2xl bg-[#1F4E79] p-5 text-white sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-white/70">Residuum</p>
              <h2 className="mt-1 text-2xl font-extrabold">Comece pelo cadastro</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-white/80">
                O estoque ajuda voce a organizar o que sera entregue. Depois,
                escolha um ponto no mapa e faca a validacao presencial.
              </p>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/12">
              <Recycle className="h-9 w-9" aria-hidden="true" />
            </div>
          </div>
        </section>

        <SectionCard title="Atalhos principais" description="Sem dados falsos ou pontuacao simulada.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shortcuts.map(({ title, description, to, Icon, primary }) => (
              <button
                key={to}
                type="button"
                onClick={() => navigate(to)}
                className={`flex min-h-[120px] items-start gap-3 rounded-2xl border p-4 text-left transition focus-visible:ring-2 focus-visible:ring-[#1F4E79]/30 ${
                  primary
                    ? "border-[#1F4E79] bg-[#1F4E79] text-white hover:bg-[#173B5C]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[#1F4E79] hover:border-[#1F4E79]/40 hover:bg-white"
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    primary ? "bg-white/15" : "bg-white"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-extrabold">{title}</span>
                  <span
                    className={`mt-1 block text-sm font-medium leading-relaxed ${
                      primary ? "text-white/80" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
      <Navbar />
    </PageContainer>
  );
}
