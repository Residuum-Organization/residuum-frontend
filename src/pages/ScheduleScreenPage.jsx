import React from "react";
import { CalendarClock, Truck } from "lucide-react";
import TimeSlots from "../components/coleta-dados/TimeSlots";
import CollectionPoints from "../components/coleta-dados/CollectionPoints";
import SystemStatus from "../components/coleta-dados/SystemStatus";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import InlineAlert from "../components/ui/InlineAlert";
import Button from "../components/ui/Button";
import { COLLECTION_POINTS, TIME_SLOTS } from "../constants/schedule";

export default function ScheduleScreen() {
  return (
    <RoleShell variant="operacional" shellClassName="bg-[var(--color-surface)]">
      <div className="space-y-5 rounded-2xl bg-[var(--color-surface-soft)] p-4 shadow-sm sm:p-6 lg:min-h-[calc(100vh-4rem)]">
        <PageHeader
          eyebrow="Cooperativa / Empresa de coleta"
          title="Agenda de coletas"
          description="Organize horários, disponibilidade dos pontos e leitura operacional da agenda."
          action={
            <Button
              type="button"
              className="w-full gap-2 sm:w-auto"
              aria-label="Agendar coleta demonstrativa"
            >
              <Truck className="h-4 w-4" aria-hidden="true" />
              Agendar coleta
            </Button>
          }
        />

        <InlineAlert
          variant="warning"
          title="Tela demonstrativa"
          description="Os horários, capacidades e status desta agenda vêm de constantes locais nesta fase. Nenhuma coleta real é criada por estes controles."
        />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
          <div className="space-y-4">
            <TimeSlots />
            <CollectionPoints />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm shadow-slate-200/70">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[var(--color-primary)]">
                  <CalendarClock className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[var(--color-primary)]">
                    Operação do dia
                  </h2>
                  <p className="text-sm font-medium text-[var(--color-text-muted)]">
                    Resumo visual para acompanhamento da agenda.
                  </p>
                </div>
              </div>
              <dl className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-2xl bg-[var(--color-surface)] p-3">
                  <dt className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
                    Janelas
                  </dt>
                  <dd className="mt-1 text-2xl font-black text-[var(--color-primary)]">
                    {TIME_SLOTS.length}
                  </dd>
                </div>
                <div className="rounded-2xl bg-[var(--color-surface)] p-3">
                  <dt className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
                    Pontos
                  </dt>
                  <dd className="mt-1 text-2xl font-black text-[var(--color-primary)]">
                    {COLLECTION_POINTS.length}
                  </dd>
                </div>
                <div className="rounded-2xl bg-[var(--color-surface)] p-3">
                  <dt className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
                    Origem
                  </dt>
                  <dd className="mt-1 text-sm font-black text-amber-700">
                    Demonstração
                  </dd>
                </div>
              </dl>
            </div>

            <SystemStatus />
          </div>
        </section>
      </div>
    </RoleShell>
  );
}
