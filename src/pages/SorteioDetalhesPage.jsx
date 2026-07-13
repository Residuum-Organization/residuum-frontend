import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Gift, Info, Leaf, Medal, Sparkles, Trophy } from 'lucide-react'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import InlineAlert from '../components/ui/InlineAlert'
import LoadingState from '../components/ui/LoadingState'
import Button from '../components/ui/Button'
import { getRaffleDetails, buyTicket } from '../services/rewards'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const tabs = [
  { id: 'funciona', label: 'Como funciona' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'premios', label: 'Prêmios' },
]

const isFallbackOrMockData = (data) => ['fallback', 'mock'].includes(data?.__dataOrigin)

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
        active ? 'bg-[#11527A] text-white shadow-sm' : 'bg-white text-slate-500'
      }`}
    >
      {children}
    </button>
  )
}

function Timeline({ etapas }) {
  return (
    <div className="space-y-3">
      {etapas.map((etapa, index) => (
        <div key={etapa} className="flex gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DDF7E9] text-[#0B6B53]">
              <CheckCircle2 size={22} />
            </div>
            {index < etapas.length - 1 ? <div className="mt-2 h-8 w-0.5 rounded-full bg-emerald-100" /> : null}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0B6B53]">Etapa {index + 1}</p>
            <h3 className="mt-1 text-sm font-extrabold text-[var(--color-primary)]">{etapa}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}

function Premios({ premios }) {
  return (
    <div className="space-y-3">
      {premios.map((premio, index) => (
        <article key={premio.posicao} className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${index === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
              <Medal size={28} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{premio.posicao}</p>
              <h3 className="mt-1 text-base font-extrabold text-[var(--color-primary)]">{premio.titulo}</h3>
              <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">{premio.descricao}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function SorteioDetalhesPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('funciona')
  const { data: sorteio, isLoading } = useQuery({
    queryKey: queryKeys.raffleDetails(id),
    queryFn: () => getRaffleDetails(id),
    enabled: Boolean(id),
  })

  const [feedback, setFeedback] = useState('')
  const { invalidateQueries } = require('@tanstack/react-query').useQueryClient()

  const buyTicketMutation = require('@tanstack/react-query').useMutation({
    mutationFn: (sorteioId) => buyTicket(sorteioId),
    onSuccess: () => {
      setFeedback('Bilhete comprado com sucesso!')
      invalidateQueries(queryKeys.raffleDetails(id))
      invalidateQueries(queryKeys.pointsStatement)
    },
    onError: (error) => {
      setFeedback(getApiErrorMessage(error, 'Não foi possível comprar bilhete para este sorteio.'))
    }
  })

  if (isLoading) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
        <LoadingState title="Carregando sorteio..." className="mx-auto mt-10 w-full max-w-md" />
      </RoleShell>
    )
  }

  if (!sorteio) return <Navigate to="/sorteios" replace />

  const showingFallbackData = isFallbackOrMockData(sorteio)

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/sorteios"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-primary)] shadow-sm hover:bg-[var(--color-surface)]"
          >
            <ArrowLeft size={18} /> Voltar para sorteios
          </Link>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#11527A] shadow-sm">
            {sorteio.status === 'ativo' ? 'ATIVO' : 'ENCERRADO'}
          </span>
        </div>

        {showingFallbackData ? (
          <InlineAlert variant="warning">Este sorteio está sendo exibido com dados demonstrativos.</InlineAlert>
        ) : null}

        <section className="overflow-hidden rounded-2xl text-white shadow-lg" style={{ backgroundColor: sorteio.cor }}>
          <div className="p-5 sm:p-6">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15">
              <Trophy size={34} />
            </div>
            <PageHeader
              eyebrow={sorteio.patrocinador}
              title={sorteio.titulo}
              description={sorteio.subtitulo}
              className="[&_h1]:text-white [&_h1]:text-3xl [&_p]:text-white/85 [&_p]:text-sm [&_span]:text-white/70"
            />

            <div className="mt-5 rounded-2xl bg-white/15 p-3">
              <div className="mb-2 flex items-center justify-between text-xs font-bold">
                <span>Progresso da campanha</span>
                <span>{sorteio.progresso}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white" style={{ width: `${sorteio.progresso}%` }} />
              </div>
            </div>
          </div>
        </section>

        <SectionCard title="Navegue pelo sorteio" description="Veja regras, contexto e premiação antes de usar seus pontos.">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </TabButton>
            ))}
          </div>
        </SectionCard>

        {activeTab === 'funciona' ? (
          <div className="space-y-4">
            <SectionCard title="Participe com seus pontos" description="Entenda a dinâmica básica antes de confirmar sua participação.">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF7E9] text-[#0B6B53]">
                  <Leaf size={24} />
                </div>
                <p className="text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">
                  A cada {sorteio.custo_pontos} pontos você ganha uma chance. Quanto mais reciclar, maiores as chances.
                </p>
              </div>
            </SectionCard>
            <Timeline etapas={[]} />
          </div>
        ) : null}

        {activeTab === 'sobre' ? (
          <SectionCard title="Sobre a campanha" description="Contexto, critérios e métricas principais do sorteio.">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#DDF7E9] text-[#0B6B53]">
              <Info size={28} />
            </div>
            <p className="text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">{sorteio.descricao || 'Sem descrição.'}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--color-surface)] p-3">
                <p className="text-xs font-bold text-[var(--color-text-muted)]">Pontos por chance</p>
                <p className="mt-1 text-2xl font-black text-[#0B6B53]">{sorteio.custo_pontos}</p>
              </div>
              <div className="rounded-2xl bg-[var(--color-surface)] p-3">
                <p className="text-xs font-bold text-[var(--color-text-muted)]">Participantes</p>
                <p className="mt-1 text-2xl font-black text-[#0B6B53]">0</p>
              </div>
            </div>
          </SectionCard>
        ) : null}

        {activeTab === 'premios' ? (
          <div className="space-y-4">
            <InlineAlert variant="info" title="Mais pontos, mais chances">
              Quanto maior sua pontuação acumulada, maior sua presença nas campanhas ativas.
            </InlineAlert>
            {feedback && <InlineAlert variant="info" title="Atenção">{feedback}</InlineAlert>}
            <Premios premios={sorteio.premio ? [{ posicao: "1º LUGAR", titulo: sorteio.premio, descricao: "" }] : []} />
            <Button 
              type="button" 
              onClick={() => buyTicketMutation.mutate(sorteio.id)}
              disabled={sorteio.status === 'encerrado' || buyTicketMutation.isPending} 
              className="w-full bg-[#0B6B53] py-4 text-sm font-bold text-white hover:bg-[#0B6B53]/90 disabled:bg-slate-300"
            >
              {buyTicketMutation.isPending ? 'Comprando...' : sorteio.status === 'encerrado' ? 'Campanha encerrada' : 'Participar (Comprar bilhete)'}
            </Button>
          </div>
        ) : null}
      </div>
    </RoleShell>
  )
}
