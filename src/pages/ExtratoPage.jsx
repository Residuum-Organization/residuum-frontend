import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Clock3, Loader2, Recycle, TrendingDown, TrendingUp, Wallet, XCircle } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
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
  if (!value) {
    return 'Data indisponível'
  }

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
    <article className={`rounded-[24px] border p-4 shadow-sm ${config.border}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${config.icon}`}>
            <Recycle size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#12384C]">{title}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {hasQuantity ? `${quantityLabel} kg • ` : ''}
              {formatHistoryDate(item.data_evento)}
            </p>
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              {item.ponto_coleta_nome || item.referencia || 'Evento de pontuação'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-[#0B6B53]">
            {points >= 0 ? '+' : ''}
            {points}
          </p>
          <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${config.badge}`}>
            <StatusIcon size={12} />
            {config.label}
          </span>
        </div>
      </div>
    </article>
  )
}

export default function ExtratoPage() {
  const {
    data: extrato,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.pointsStatement,
    queryFn: getPointsStatement,
  })

  const historico = extrato?.itens || []
  const total = Number(extrato?.pontuacao_total || 0)
  const pendentes = historico
    .filter((item) => item.status === 'pendente')
    .reduce((sum, item) => sum + Math.max(Number(item.pontos || 0), 0), 0)
  const confirmados = historico
    .filter((item) => item.status === 'confirmado')
    .reduce((sum, item) => sum + Math.max(Number(item.pontos || 0), 0), 0)
  const resgatados = historico
    .filter((item) => item.status === 'resgatado')
    .reduce((sum, item) => sum + Math.abs(Number(item.pontos || 0)), 0)

  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#F7FAF9] shadow-2xl">
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
          <h1 className="text-3xl font-black text-[#12384C]">
            Extrato de <span className="text-[#E5B900]">Pontos</span>
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">Acompanhe seu saldo e o status das suas entregas.</p>

          <section className="mt-5 rounded-[32px] bg-[#DDF7E9] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0B6B53]/80">Total disponível</p>
                <h2 className="mt-2 text-6xl font-black leading-none text-[#0B6B53]">{total}</h2>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 text-[#0B6B53] shadow-sm">
                <Wallet size={32} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/80 p-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-700">
                  <Clock3 size={15} /> Pendentes
                </div>
                <p className="mt-2 text-2xl font-black text-[#12384C]">{pendentes}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-700">
                  <TrendingUp size={15} /> Confirmados
                </div>
                <p className="mt-2 text-2xl font-black text-[#12384C]">{confirmados}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3">
                <div className="flex items-center gap-2 text-xs font-black text-sky-700">
                  <TrendingDown size={15} /> Resgatados
                </div>
                <p className="mt-2 text-2xl font-black text-[#12384C]">{resgatados}</p>
              </div>
            </div>
          </section>

          <div className="mb-4 mt-7 flex items-center justify-between">
            <h2 className="text-lg font-black text-[#12384C]">Histórico</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#11527A] shadow-sm">
              {historico.length} registros
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-600 shadow-sm">
              <Loader2 size={18} className="animate-spin" />
              Carregando histórico de pontos...
            </div>
          ) : isError ? (
            <div className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm">
              {getApiErrorMessage(error, 'Não foi possível carregar o extrato de pontos.')}
            </div>
          ) : historico.length ? (
            <div className="space-y-3">
              {historico.map((item) => (
                <HistoricoCard key={item.id_descarte || item.id_resgate} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-sm font-semibold text-[#12384C]">Nenhum evento de pontuação registrado ainda.</p>
              <p className="mt-2 text-xs text-slate-500">
                Entregas confirmadas, pendências e resgates aparecem aqui automaticamente.
              </p>
            </div>
          )}
        </div>
        <Navbar />
      </section>
    </main>
  )
}
