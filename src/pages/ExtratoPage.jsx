import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock3, Recycle, TrendingDown, TrendingUp, Wallet, XCircle } from 'lucide-react'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
import InlineAlert from '../components/ui/InlineAlert'
import LoadingState from '../components/ui/LoadingState'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import SectionCard from '../components/ui/SectionCard'
import { getPointsStatement } from '../services/points'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const STATUS_CONFIG = {
  pendente: {
    label: 'Pendente',
    border: 'border-amber-200 bg-amber-50',
    icon: 'bg-amber-100 text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    Icon: Clock3,
  },
  confirmado: {
    label: 'Confirmado',
    border: 'border-emerald-100 bg-white',
    icon: 'bg-emerald-100 text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    Icon: CheckCircle2,
  },
  rejeitado: {
    label: 'Rejeitado',
    border: 'border-rose-200 bg-rose-50',
    icon: 'bg-rose-100 text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    Icon: XCircle,
  },
  revertido: {
    label: 'Estornado',
    border: 'border-slate-200 bg-slate-50',
    icon: 'bg-slate-200 text-slate-700',
    badge: 'bg-slate-200 text-slate-700',
    Icon: XCircle,
  },
  resgatado: {
    label: 'Resgatado',
    border: 'border-sky-200 bg-sky-50',
    icon: 'bg-sky-100 text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
    Icon: Wallet,
  },
}

const formatResidueType = (tipo) =>
  String(tipo || 'resíduo')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatHistoryDate = (value) => {
  if (!value) return 'Data indisponível'
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function HistoricoCard({ item }) {
  const status = item.status || 'pendente'
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.confirmado
  const StatusIcon = config.Icon
  const points = Number(item.pontos || item.pontos_recebidos || 0)
  
  const quantidadeValue = item.quantidade_confirmada ?? item.quantidade ?? 0
  const hasQuantity = quantidadeValue > 0
  const quantityLabel = hasQuantity
    ? Number(quantidadeValue).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    : null
    
  const title = item.inventario_item_descricao || item.descricao || formatResidueType(item.tipo_residuo)
  const dataEvento = item.data_desc || item.data_evento

  return (
    <article className={`rounded-2xl border p-5 shadow-sm transition-colors hover:border-[#1F4E79]/40 ${config.border}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${config.icon}`}>
            <Recycle size={28} />
          </div>
          <div className="min-w-0">
            <h3 className="break-words text-base font-bold text-[#1a3a4a]">{title}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {hasQuantity ? `${quantityLabel} kg | ` : ''}
              {formatHistoryDate(dataEvento)}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500 line-clamp-1">
              {item.ponto_coleta_nome || item.referencia || 'Evento de pontuação'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          <p className={`text-2xl font-black ${points >= 0 ? 'text-[#2EA44F]' : 'text-rose-600'}`}>
            {points >= 0 ? '+' : ''}
            {points}
          </p>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${config.badge}`}>
            <StatusIcon size={14} />
            {config.label}
          </span>
        </div>
      </div>
    </article>
  )
}

function SummaryCard({ icon, label, value, colorClass }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className={`flex items-center gap-2 text-sm font-bold uppercase ${colorClass}`}>
        {icon}
        {label}
      </div>
      <p className="mt-2 text-3xl font-black text-[#1a3a4a]">{value}</p>
    </div>
  )
}

export default function ExtratoPage() {
  const navigate = useNavigate()
  const { data: extrato, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.pointsStatement,
    queryFn: getPointsStatement,
  })

  const histórico = extrato?.itens || []
  const total = Number(extrato?.pontuacao_total || 0)
  
  const pendentes = histórico
    .filter((item) => (item.status || 'pendente') === 'pendente')
    .reduce((sum, item) => sum + Math.max(Number(item.pontos || item.pontos_recebidos || 0), 0), 0)
    
  const confirmados = histórico
    .filter((item) => item.status === 'confirmado')
    .reduce((sum, item) => sum + Math.max(Number(item.pontos || item.pontos_recebidos || 0), 0), 0)
    
  const resgatados = histórico
    .filter((item) => item.status === 'resgatado')
    .reduce((sum, item) => sum + Math.abs(Number(item.pontos || item.pontos_recebidos || 0)), 0)

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-36 sm:px-6 sm:py-6 lg:px-8 lg:pb-56">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Extrato"
          title="Extrato de Pontos"
          description="Acompanhe seu saldo e o status das entregas confirmadas ou pendentes."
          action={
            <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          }
        />

        <SectionCard className="p-5 sm:p-8 bg-[#f4f7fa] border-[#1F4E79]/20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#1F4E79]">Saldo Atual Disponível</p>
              <h2 className="mt-2 text-6xl font-black tracking-tight text-[#1a3a4a] sm:text-7xl">
                {total} <span className="text-2xl font-bold text-slate-400">pts</span>
              </h2>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#1F4E79] text-white shadow-md">
              <Wallet size={40} />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard icon={<TrendingUp size={18} />} label="Confirmados" value={confirmados} colorClass="text-[#2EA44F]" />
            <SummaryCard icon={<Clock3 size={18} />} label="Em Análise" value={pendentes} colorClass="text-amber-600" />
            <SummaryCard icon={<TrendingDown size={18} />} label="Resgatados" value={resgatados} colorClass="text-sky-600" />
          </div>
        </SectionCard>

        {pendentes > 0 && (
          <InlineAlert variant="info">
            Pontos pendentes ainda dependem da conferência e pesagem pelo ponto de coleta.
          </InlineAlert>
        )}

        <SectionCard
          title="Histórico de Transações"
          description="Consulte todas as suas movimentações de pontos."
          action={
            <span className="inline-flex min-h-10 items-center rounded-full bg-[#1F4E79] px-4 text-sm font-bold text-white">
              {histórico.length} registros
            </span>
          }
        >
          {isLoading ? (
            <LoadingState title="Carregando histórico de pontos..." />
          ) : isError ? (
            <ErrorState title={getApiErrorMessage(error, 'Não foi possível carregar o extrato de pontos.')} />
          ) : histórico.length ? (
            <div className="grid gap-4 lg:grid-cols-2 mt-2">
              {histórico.map((item) => (
                <HistoricoCard key={`${item.origem}-${item.id_descarte || item.id_resgate || item.id_inscricao || item.referencia}`} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Seu extrato ainda está vazio."
              description="Suas entregas e resgates vão aparecer aqui assim que houver movimentação."
              icon={Wallet}
              className="bg-white"
            />
          )}
        </SectionCard>
      </div>
    </RoleShell>
  )
}
