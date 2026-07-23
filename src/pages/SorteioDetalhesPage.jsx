import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Gift,
  Info,
  Leaf,
  Medal,
  Sparkles,
  Trophy,
  Calendar,
} from "lucide-react";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import Button from "../components/ui/Button";
import { getRaffleDetails, buyTicket } from "../services/rewards";
import { getPointsStatement } from "../services/points";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";
import { formatCalendarDate } from "../utils/dates";
import TermosPrivacidadeModal from "../components/ui/TermosPrivacidadeModal";

function Timeline({ etapas }) {
  return (
    <div className="space-y-3">
      {etapas.map((etapa, index) => (
        <div
          key={etapa}
          className="flex gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DDF7E9] text-[#0B6B53]">
              <CheckCircle2 size={22} />
            </div>
            {index < etapas.length - 1 ? (
              <div className="mt-2 h-8 w-0.5 rounded-full bg-emerald-100" />
            ) : null}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0B6B53]">
              Etapa {index + 1}
            </p>
            <h3 className="mt-1 text-sm font-extrabold text-[var(--color-primary)]">
              {etapa}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

function Premios({ premios }) {
  return (
    <div className="space-y-3">
      {premios.map((premio, index) => (
        <article
          key={premio.posicao}
          className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-3xl ${
                index === 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Medal size={28} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                {premio.posicao}
              </p>
              <h3 className="mt-1 text-base font-extrabold text-[var(--color-primary)]">
                {premio.titulo}
              </h3>
              <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">
                {premio.descricao}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function SorteioDetalhesPage() {
  const { id } = useParams();
  const { data: sorteio, isLoading: isLoadingSorteio } = useQuery({
    queryKey: queryKeys.raffleDetails(id),
    queryFn: () => getRaffleDetails(id),
    enabled: Boolean(id),
  });

  const { data: pointsStatement } = useQuery({
    queryKey: queryKeys.pointsStatement,
    queryFn: getPointsStatement,
  });

  const availablePoints = pointsStatement?.pontuacao_total || 0;

  const [feedback, setFeedback] = useState(null);
  const [aceitouLGPD, setAceitouLGPD] = useState(false);
  const [isTermosModalOpen, setIsTermosModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const buyTicketMutation = useMutation({
    mutationFn: (sorteioId) => buyTicket(sorteioId),
    onSuccess: () => {
      setFeedback({ type: 'success', text: 'Bilhete garantido com sucesso! Boa sorte!' });
      queryClient.invalidateQueries({ queryKey: queryKeys.raffleDetails(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pointsStatement });
    },
    onError: (error) => {
      let errorMsg = getApiErrorMessage(error, 'Não foi possível garantir o bilhete.');
      errorMsg = errorMsg.replace('Pontuacao', 'Pontuação');
      setFeedback({ type: 'error', text: errorMsg });
    },
  });

  if (isLoadingSorteio) {
    return (
      <RoleShell
        variant="morador"
        shellClassName="bg-[var(--color-surface)]"
        contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28"
      >
        <LoadingState
          title="Carregando sorteio..."
          className="mx-auto mt-10 w-full max-w-md"
        />
      </RoleShell>
    );
  }

  if (!sorteio) return <Navigate to="/loja?aba=sorteios" replace />;

  return (
    <RoleShell
      variant="morador"
      shellClassName="bg-[var(--color-surface)]"
      contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/loja?aba=sorteios"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-primary)] shadow-sm hover:bg-[var(--color-surface)]"
          >
            <ArrowLeft size={18} /> Voltar para a loja
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
            <Sparkles size={16} />
            {availablePoints} pts
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl bg-[#1F4E79] text-white shadow-lg">
          <div className="p-5 sm:p-6">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15">
              <Trophy size={34} />
            </div>
            <PageHeader
              eyebrow={sorteio.patrocinador ? `Oferecido por ${sorteio.patrocinador}` : "Sorteio Exclusivo Residuum"}
              title={sorteio.titulo}
              description="Transforme seus pontos de reciclagem em chances reais de ganhar."
              className="[&_h1]:text-white [&_h1]:text-3xl [&_p]:text-white/85 [&_p]:text-sm [&_span]:text-white/70"
            />
          </div>
        </section>

        {sorteio.resultado ? (
          <SectionCard title="Resultado publicado" description="Apuracao oficial registrada pela Residuum.">
            <div className="rounded-3xl bg-amber-50 p-6 text-center">
              <Trophy className="mx-auto text-amber-600" size={42} />
              <p className="mt-3 text-sm font-black uppercase tracking-wider text-amber-700">Bilhete vencedor #{sorteio.resultado.numero}</p>
              <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">{sorteio.resultado.vencedor_nome}</h2>
              <p className="mt-1 text-sm text-slate-500">Premio: {sorteio.resultado.premio}</p>
            </div>
          </SectionCard>
        ) : null}

        <SectionCard title="Tudo o que você precisa saber" description="Entenda como garantir seu bilhete e qual é o prêmio em jogo.">
          <div className="space-y-6">
            {/* Como Funciona */}
            <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Leaf size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--color-primary)]">Gere seus bilhetes da sorte</h4>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
                  Com <strong className="text-emerald-600">{sorteio.custo_pontos} pontos</strong> acumulados, voce garante seu bilhete. Cada pessoa pode adquirir somente 1 bilhete por sorteio e precisa ter ao menos um descarte presencial confirmado.
                </p>
              </div>
            </div>

            {/* Período de Participação */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Início</p>
                  <p className="text-sm font-extrabold text-[var(--color-primary)]">
                    {sorteio.data_inicio ? formatCalendarDate(sorteio.data_inicio) : 'Imediato'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Data do sorteio</p>
                  <p className="text-sm font-extrabold text-[var(--color-primary)]">
                    {sorteio.data_fim ? formatCalendarDate(sorteio.data_fim) : 'Indeterminada'}
                  </p>
                </div>
              </div>
            </div>

            {/* Premiação */}
            <div>
              <h4 className="mb-3 text-sm font-bold text-[var(--color-primary)]">O grande prêmio</h4>
              <Premios premios={sorteio.premio ? [{ posicao: "Prêmio Único", titulo: sorteio.premio, descricao: "O ganhador será anunciado após o encerramento do sorteio." }] : []} />
            </div>

            {/* Ação */}
            <div className="pt-2">
              {feedback && (
                <InlineAlert 
                  variant={feedback.type} 
                  title={feedback.type === 'error' ? 'Atenção' : 'Sucesso!'} 
                  className="mb-4"
                >
                  {feedback.text}
                </InlineAlert>
              )}

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 cursor-pointer mb-5 shadow-sm">
                <input
                  type="checkbox"
                  checked={aceitouLGPD}
                  onChange={(e) => setAceitouLGPD(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-sm font-medium text-slate-600 leading-snug">
                  Li e aceito os{" "}
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); setIsTermosModalOpen(true); }} 
                    className="font-bold text-[var(--color-primary)] underline"
                  >
                    Termos de Uso e Política de Privacidade
                  </button>
                  .
                </span>
              </label>

              <Button
                type="button"
                onClick={() => {
                  setFeedback(null);
                  buyTicketMutation.mutate(sorteio.id);
                }}
                disabled={
                  sorteio.status === "encerrado" || buyTicketMutation.isPending || !aceitouLGPD
                }
                className="w-full bg-[#1F4E79] py-4 text-sm font-bold text-white hover:bg-[#1a3a4a] disabled:bg-slate-300"
              >
                {buyTicketMutation.isPending
                  ? "Gerando bilhete..."
                  : sorteio.status === "encerrado"
                  ? "Sorteio encerrado"
                  : `Garantir Bilhete por ${sorteio.custo_pontos} pontos`}
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>

      <TermosPrivacidadeModal 
        isOpen={isTermosModalOpen} 
        onClose={() => setIsTermosModalOpen(false)} 
      />
    </RoleShell>
  );
}
