import React from "react";
import { ArrowLeft, Clock3, FileBarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";

const reports = [
  {
    id: "pesagens",
    title: "Histórico de Pesagens",
    description: "Exportação detalhada de todo o volume de materiais recicláveis recebidos, com data, horário e peso em kg.",
  },
  {
    id: "inventario",
    title: "Relatório de Inventário",
    description: "Balanço atualizado das unidades aguardando coleta e material já abatido por pesagem avulsa.",
  },
  {
    id: "moradores",
    title: "Fluxo de Moradores",
    description: "Métricas de engajamento dos moradores no seu ponto de coleta, com volume depositado por indivíduo.",
  },
];

export default function CooperativaReportsPage() {
  const navigate = useNavigate();

  return (
    <RoleShell variant="operacional">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Operacional"
          title="Relatórios e Exportações"
          description="Acesse o histórico completo das atividades da sua cooperativa ou ponto de coleta para auditoria e controle."
          action={
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <SectionCard key={report.id} className="flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#1A2C71]">
                <FileBarChart />
              </div>
              <h2 className="mt-4 text-lg font-black text-[var(--color-primary)]">
                {report.title}
              </h2>
              <p className="mt-1 flex-1 text-sm text-[var(--color-text-muted)]">
                {report.description}
              </p>
              <div className="mt-5 w-full">
                <Button
                  type="button"
                  variant="secondary"
                  disabled
                  className="w-full opacity-60 cursor-not-allowed"
                >
                  <Clock3 className="mr-2 h-4 w-4" /> Em breve
                </Button>
              </div>
            </SectionCard>
          ))}
        </section>
      </div>
    </RoleShell>
  );
}
