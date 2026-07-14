import React from "react";
import { MapPin } from "lucide-react";
import SectionCard from "../ui/SectionCard";

function CapacityBar({ pct, barColor }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-xs font-bold text-slate-600">
        {pct}%
      </span>
    </div>
  );
}

export default function CollectionPoints({ points = [] }) {
  return (
    <SectionCard
      title="Disponibilidade dos pontos"
      description="Capacidade exibida para leitura rápida da operação."
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
        {points.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">
            Nenhum ponto de coleta cadastrado.
          </div>
        ) : (
          points.map((pt) => {
            let barColor = "bg-green-500";
            if (pt.percentual_ocupacao >= 90) barColor = "bg-red-500";
            else if (pt.percentual_ocupacao >= 70) barColor = "bg-yellow-500";

            return (
              <article
                key={pt.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
              >
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[#1e3a5f]"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#1e3a5f]">{pt.nome}</div>
                    <div className="mb-2 text-sm font-medium text-slate-500">
                      {pt.endereco}
                    </div>
                    {pt.percentual_ocupacao !== null && pt.percentual_ocupacao !== undefined ? (
                      <div>
                        <div className="mb-1 text-xs font-bold uppercase text-slate-600">
                          Capacidade
                        </div>
                        <CapacityBar pct={pt.percentual_ocupacao} barColor={barColor} />
                      </div>
                    ) : (
                      <div>
                        <div className="mb-1 text-xs font-bold uppercase text-slate-400">
                          Indisponível
                        </div>
                        <div className="h-2 rounded-full bg-slate-200" />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </SectionCard>
  );
}
