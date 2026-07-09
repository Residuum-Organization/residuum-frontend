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
import { getPointsStatement } from '../services/points'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const STATUS_CONFIG = {
  pendente: {
    label: 'PENDENTE',
    border: 'border-amber-200 bg-amber-50',
    icon: 'bg-amber-100 text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    Icon: Clock3,
  },
  confirmado: {
    label: 'CONFIRMADO',
    border: 'border-emerald-100 bg-white',
    icon: 'bg-emerald-100 text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    Icon: CheckCircle2,
  },
  rejeitado: {
    label: 'REJEITADO',
    border: 'border-rose-200 bg-rose-50',
    icon: 'bg-rose-100 text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    Icon: XCircle,
  },
  revertido: {
    label: 'ESTORNADO',
    border: 'border-slate-200 bg-slate-50',
    icon: 'bg-slate-200 text-slate-700',
    badge: 'bg-slate-200 text-slate-700',
    Icon: XCircle,
  },
  resgatado: {
    label: 'RESGATADO',
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
  const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.confirmado
  const StatusIcon = config.Icon
  const points = Number(item.pontos || 0)
  const hasQuantity = item.quantidade != null
  const quantityLabel = hasQuantity
    ? Number(item.quantidade).toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : null
  const title = item.inventario_item_descricao || item.descricao || formatResidueType(item.tipo_residuo)

  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${config.border}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.icon}`}>
            <Recycle size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="break-words text-sm font-black text-[#12384C]">{title}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {hasQuantity ? `${quantityLabel} kg | ` : ''}
              {formatHistoryDate(item.data_evento)}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {item.ponto_coleta_nome || item.referencia || 'Evento de pontuacao'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          <p className="text-lg font-black text-[#0B6B53]">
            {points >= 0 ? '+' : ''}
            {points}
          </p>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${config.badge}`}>
            <StatusIcon size={12} />
            {config.label}
          </span>
        </div>
      </div>
    </article>
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
    .filter((item) => item.status === 'pendente')
    .reduce((sum, item) => sum + Math.max(Number(item.pontos || 0), 0), 0)
  const confirmados = histórico
    .filter((item) => item.status === 'confirmado')
    .reduce((sum, item) => sum + Math.max(Number(item.pontos || 0), 0), 0)
  const resgatados = histórico
    .filter((item) => item.status === 'resgatado')
    .reduce((sum, item) => sum + Math.abs(Number(item.pontos || 0)), 0)

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-6">
        <PageHeader
          title="Extrato de Pontos"
          description="Acompanhe seu saldo e o status das entregas confirmadas ou pendentes."
          action={
            <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          }
        />

        <section className="rounded-2xl bg-[#DDF7E9] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-[#0B6B53]/80">Total disponível</p>
              <h2 className="mt-2 text-5xl font-black leading-none text-[#0B6B53] sm:text-6xl">{total}</h2>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 text-[#0B6B53] shadow-sm">
              <Wallet size={32} />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryCard icon={<Clock3 size={16} />} label="Pendentes" value={pendentes} className="text-amber-700" />
            <SummaryCard icon={<TrendingUp size={16} />} label="Confirmados" value={confirmados} className="text-emerald-700" />
            <SummaryCard icon={<TrendingDown size={16} />} label="Resgatados" value={resgatados} className="text-sky-700" />
          </div>
        </section>

        <InlineAlert variant="info">
          Pontos pendentes ainda dependem da confirmação e pesagem real pela cooperativa.
        </InlineAlert>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-black text-[#12384C]">Histórico</h2>
            <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-[#11527A] shadow-sm">
              {histórico.length} registros
            </span>
          </div>

          {isLoading ? (
            <LoadingState title="Carregando histórico de pontos..." />
          ) : isError ? (
            <ErrorState title={getApiErrorMessage(error, 'Não foi possível carregar o extrato de pontos.')} />
          ) : histórico.length ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {histórico.map((item) => (
                <HistoricoCard key={item.id_descarte || item.id_resgate} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Seu extrato ainda está vazio."
              description="Suas entregas e resgates vão aparecer aqui assim que houver movimentação."
            />
          )}
        </section>
      </div>
    </RoleShell>
  )
}

function SummaryCard({ icon, label, value, className = '' }) {
  return (
    <div className="rounded-2xl bg-white/80 p-3">
      <div className={`flex items-center gap-2 text-xs font-black ${className}`}>
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-black text-[#12384C]">{value}</p>
    </div>
  )
}
