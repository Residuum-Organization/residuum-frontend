import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CalendarDays, Gift, Ticket, Trophy, Users } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import { listActiveRaffles, listVouchers, redeemVoucher } from '../services/rewards'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const isFallbackOrMockData = (data) => ['fallback', 'mock'].includes(data?.__dataOrigin)

function SorteioCard({ sorteio }) {
  const encerrado = sorteio.status === 'encerrado'

  return (
    <article className="rounded-[26px] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-white shadow-sm"
          style={{ backgroundColor: sorteio.cor }}
        >
          <Trophy size={30} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-black text-[#12384C]">{sorteio.titulo}</h3>
            {encerrado ? (
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
                ENCERRADO
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-500">{sorteio.patrocinador}</p>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><Gift size={14} /> {sorteio.pontosNecessarios} pts</span>
            <span className="flex items-center gap-1.5"><Users size={14} /> {sorteio.participantes}</span>
            <span className="col-span-2 flex items-center gap-1.5"><CalendarDays size={14} /> até {sorteio.dataFim}</span>
            <span className="col-span-2 flex items-center gap-1.5 text-[#11527A]">
              <Ticket size={14} /> {sorteio.participacaoUsuario || 0} participação(ões)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/sorteios/${sorteio.id}`}
          className="flex-1 rounded-full border-2 border-[#11527A] px-4 py-3 text-center text-xs font-black text-[#11527A]"
        >
          DETALHES
        </Link>
        <button
          type="button"
          disabled
          title={encerrado ? 'Sorteio encerrado.' : 'Participacao em sorteios ainda nao disponivel.'}
          className={`flex-1 rounded-full px-4 py-3 text-xs font-black text-white ${
            encerrado ? 'bg-slate-300' : 'bg-slate-300'
          }`}
        >
          {encerrado ? 'ENCERRADO' : 'EM BREVE'}
        </button>
      </div>
      {!encerrado ? (
        <p className="mt-2 text-[11px] font-semibold text-slate-500">
          Participacao em sorteios ainda nao disponivel.
        </p>
      ) : null}
    </article>
  )
}

function VoucherCard({ voucher, onRedeem }) {
  return (
    <article className="flex items-center justify-between rounded-[24px] border border-emerald-100 bg-[#ECFFF4] p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B6B53]">
          <Ticket size={24} />
        </div>
        <div>
          <h3 className="text-sm font-black text-[#12384C]">{voucher.titulo}</h3>
          <p className="mt-1 text-[11px] font-semibold text-slate-500">{voucher.validade}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRedeem}
        className="rounded-full bg-[#0B6B53] px-4 py-2 text-[11px] font-black text-white"
      >
        Resgatar · {voucher.pontos} pts
      </button>
    </article>
  )
}

export default function SorteiosPage() {
  const queryClient = useQueryClient()
  const [feedback, setFeedback] = React.useState('')

  const {
    data: raffles = [],
    isLoading: rafflesLoading,
    isError: rafflesError,
    error: rafflesQueryError,
  } = useQuery({
    queryKey: queryKeys.raffles,
    queryFn: listActiveRaffles,
  })

  const {
    data: rewardVouchers = [],
    isLoading: vouchersLoading,
    isError: vouchersError,
    error: vouchersQueryError,
  } = useQuery({
    queryKey: queryKeys.vouchers,
    queryFn: listVouchers,
  })

  const redeemMutation = useMutation({
    mutationFn: redeemVoucher,
    onSuccess: () => {
      setFeedback('Resgate solicitado com sucesso.')
      queryClient.invalidateQueries({ queryKey: queryKeys.pointsStatement })
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers })
    },
    onError: (error) => {
      setFeedback(getApiErrorMessage(error, 'Não foi possível resgatar este voucher.'))
    },
  })

  const showingFallbackData = isFallbackOrMockData(raffles) || isFallbackOrMockData(rewardVouchers)

  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#F7FAF9] shadow-2xl">
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
          <div className="mb-5 rounded-[28px] bg-[#11527A] p-5 text-white shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/70">Residuum</p>
            <h1 className="mt-2 text-3xl font-black leading-tight">Sorteios</h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              Troque seus pontos por chances e acompanhe campanhas disponíveis.
            </p>
          </div>

          {feedback ? <p className="mb-4 text-sm font-semibold text-[#11527A]">{feedback}</p> : null}
          {showingFallbackData ? (
            <div className="mb-4 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-relaxed text-amber-800">
              Dados demonstrativos. Nao foi possivel carregar sorteios reais do servidor.
            </div>
          ) : null}

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-[#12384C]">Sorteios ativos</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
              {raffles.filter((item) => item.status === 'ativo').length} ativos
            </span>
          </div>

          {rafflesLoading ? <p className="text-sm text-slate-500">Carregando sorteios...</p> : null}
          {rafflesError ? (
            <p className="text-sm text-red-600">
              {getApiErrorMessage(rafflesQueryError, 'Não foi possível carregar os sorteios.')}
            </p>
          ) : null}

          <div className="space-y-3">
            {raffles.map((sorteio) => (
              <SorteioCard key={sorteio.id} sorteio={sorteio} />
            ))}
          </div>

          <div className="mb-4 mt-7 flex items-center justify-between">
            <h2 className="text-lg font-black text-[#12384C]">Vouchers</h2>
            <span className="text-xs font-black text-[#11527A]">Resgatar pontos</span>
          </div>

          {vouchersLoading ? <p className="text-sm text-slate-500">Carregando vouchers...</p> : null}
          {vouchersError ? (
            <p className="text-sm text-red-600">
              {getApiErrorMessage(vouchersQueryError, 'Não foi possível carregar os vouchers.')}
            </p>
          ) : null}

          <div className="space-y-3">
            {rewardVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                onRedeem={() => redeemMutation.mutate(voucher)}
              />
            ))}
          </div>
        </div>
        <Navbar />
      </section>
    </main>
  )
}
