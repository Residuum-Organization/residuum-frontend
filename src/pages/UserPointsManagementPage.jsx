import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Coins, Users, PackageCheck, Layers, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { getCooperativaDiscards } from "../services/discards";
import { queryKeys } from "../services/queryKeys";
import { useAuth } from "../contexts/AuthContext";

const POINTS_PER_UNIT = 10;

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const formatResidueType = (type) =>
  String(type || "resíduo")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getResidueColor = (type) => {
  const t = String(type || "").toLowerCase();
  if (t.includes("plastico") || t.includes("plástico")) {
    return { bg: "bg-red-50 text-red-700 border-red-200" };
  }
  if (t.includes("papel")) {
    return { bg: "bg-blue-50 text-blue-700 border-blue-200" };
  }
  if (t.includes("vidro")) {
    return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (t.includes("metal")) {
    return { bg: "bg-amber-50 text-amber-800 border-amber-200" };
  }
  if (t.includes("organico") || t.includes("orgânico")) {
    return { bg: "bg-stone-100 text-stone-800 border-stone-200" };
  }
  if (t.includes("eletronico") || t.includes("eletrônico")) {
    return { bg: "bg-orange-50 text-orange-700 border-orange-200" };
  }
  return { bg: "bg-slate-100 text-slate-700 border-slate-200" };
};

export default function UserPointsManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: allDiscards = [], isLoading, isError, error } = useQuery({
    queryKey: ["cooperativa-discartes"],
    queryFn: getCooperativaDiscards,
  });

  const summary = useMemo(() => {
    const grouped = new Map();

    allDiscards.forEach((item) => {
      const key = item.usuario_id || item.usuario_email || item.usuario_nome;
      const current = grouped.get(key) || {
        id: key,
        nome: item.usuario_nome || "Cidadão",
        email: item.usuario_email || "Sem e-mail informado",
        descartes: 0,
        quantidade: 0,
        pontosEstimados: 0,
        tiposResiduosMap: new Map(),
      };

      const quantidade = Number(item.quantidade || 0);
      const tipo = item.tipo_residuo ? item.tipo_residuo.toLowerCase() : "outro";

      current.descartes += 1;
      current.quantidade += quantidade;
      current.pontosEstimados += Math.round(quantidade * POINTS_PER_UNIT);

      const prevQty = current.tiposResiduosMap.get(tipo) || 0;
      current.tiposResiduosMap.set(tipo, prevQty + quantidade);

      grouped.set(key, current);
    });

    return Array.from(grouped.values())
      .map((user) => ({
        ...user,
        tiposResiduosList: Array.from(user.tiposResiduosMap.entries()).map(([tipo, qtd]) => ({
          tipo,
          quantidade: qtd,
        })),
      }))
      .sort((a, b) => b.pontosEstimados - a.pontosEstimados);
  }, [allDiscards]);

  const totalUsuarios = summary.length;
  const totalPontosEstimados = summary.reduce((sum, user) => sum + user.pontosEstimados, 0);

  return (
    <RoleShell variant="operacional" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Pontuação dos Cidadãos"
          title="Gestão de Pontuação"
          description="Acompanhe o volume de resíduos entregues e a pontuação creditada automaticamente aos cidadãos."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              {user?.role !== "ponto_coleta" && (
                <Button type="button" variant="secondary" onClick={() => navigate('/meus-pontos-operacionais')} className="w-full sm:w-auto">
                  Ver Locais e Solicitações
                </Button>
              )}
            </div>
          }
        />

        <section className="grid gap-4 sm:grid-cols-3">
          <MetricCard 
            label="Total de Cidadãos" 
            value={String(totalUsuarios)} 
            icon={Users} 
            subtitle="Engajados no ponto"
          />
          <MetricCard 
            label="Pontos Creditados" 
            value={formatNumber(totalPontosEstimados)} 
            icon={Coins} 
            subtitle="10 pts por unidade"
          />
          <MetricCard 
            label="Entregas Realizadas" 
            value={String(allDiscards.length)} 
            icon={PackageCheck} 
            subtitle="Total de descartes"
          />
        </section>

        <SectionCard
          title="Pontuação Atribuída por Cidadão"
          description="Consulte a discriminação detalhada por tipo de material descartado e os pontos acumulados por cada cidadão."
        >
          {isLoading ? <LoadingState title="Carregando pontuação dos cidadãos..." /> : null}
          {isError ? <ErrorState title={getApiErrorMessage(error, 'Não foi possível carregar a pontuação dos cidadãos.')} /> : null}

          {!isLoading && !isError ? (
            summary.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {summary.map((user) => (
                  <article 
                    key={user.id} 
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300 space-y-4"
                  >
                    <div>
                      {/* Header do Card */}
                      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                            <UserIcon size={20} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-base font-extrabold text-[#1A2C71] truncate">{user.nome}</h3>
                            <p className="text-xs font-medium text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant="success">Creditado</Badge>
                      </div>

                      {/* Discriminação de Quantidades por Tipo de Resíduo com Cores da Lixeira */}
                      <div className="mt-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Layers size={14} className="text-[#0B6B53]" /> Materiais Entregues
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            {user.tiposResiduosList.length} {user.tiposResiduosList.length === 1 ? "tipo" : "tipos"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {user.tiposResiduosList.map(({ tipo, quantidade }) => {
                            const colorCfg = getResidueColor(tipo);
                            return (
                              <span 
                                key={tipo}
                                className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold border ${colorCfg.bg}`}
                              >
                                <strong className="font-black">{quantidade} un.</strong>
                                <span className="uppercase text-[11px]">{formatResidueType(tipo)}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Rodapé do Card: Entregas, Unidades Totais e Pontos */}
                    <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                      <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Entregas</span>
                        <strong className="block text-sm font-black text-[#1A2C71]">{user.descartes}</strong>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Total Un.</span>
                        <strong className="block text-sm font-black text-[#1A2C71]">{formatNumber(user.quantidade)}</strong>
                      </div>

                      <div className="rounded-xl bg-emerald-50 p-2 border border-emerald-100">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-[#0B6B53]">Pontos</span>
                        <strong className="block text-sm font-black text-[#0B6B53]">+{formatNumber(user.pontosEstimados)}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum cidadão pontuou ainda."
                description="Quando os cidadãos realizarem descartes nos seus pontos de coleta, a pontuação creditada aparecerá aqui."
                icon={Users}
              />
            )
          ) : null}
        </SectionCard>
      </div>
    </RoleShell>
  );
}

function MetricCard({ label, value, icon: Icon, subtitle }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-black text-[#1A2C71]">{value}</p>
          <p className="mt-1 text-sm font-extrabold text-slate-700">{label}</p>
          {subtitle && <p className="mt-0.5 text-xs font-semibold text-slate-400">{subtitle}</p>}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1A2C71]/10 text-[#1A2C71]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
