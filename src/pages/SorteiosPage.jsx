import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Gift, Ticket, Trophy, Users, ArrowLeft } from 'lucide-react'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import InlineAlert from '../components/ui/InlineAlert'
import LoadingState from '../components/ui/LoadingState'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { listActiveRaffles, listVouchers, redeemVoucher } from '../services/rewards'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const isFallbackOrMockData = (data) => ['fallback', 'mock'].includes(data?.__dataOrigin)

function SorteioCard({ sorteio }) {
  const encerrado = sorteio.status === 'encerrado'

  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: sorteio.cor }}>
          <Trophy size={26} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-extrabold text-[var(--color-primary)]">{sorteio.titulo}</h3>
            {encerrado ? (
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">ENCERRADO</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">{sorteio.patrocinador}</p>

          <div className="mt-3 grid gap-2 text-xs font-semibold text-[var(--color-text-muted)] sm:grid-cols-2">
            <span className="flex items-center gap-1.5"><Gift size={14} /> {sorteio.pontosNecessarios} pts</span>
            <span className="flex items-center gap-1.5"><Users size={14} /> {sorteio.participantes}</span>
            <span className="flex items-center gap-1.5 sm:col-span-2"><CalendarDays size={14} /> até {sorteio.dataFim}</span>
            <span className="flex items-center gap-1.5 font-bold text-[var(--color-primary)] sm:col-span-2">
              <Ticket size={14} /> {sorteio.participacaoUsuario || 0} participação(ões)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          to={`/sorteios/${sorteio.id}`}
          className="flex-1 rounded-full border border-[var(--color-primary)] px-4 py-3 text-center text-sm font-bold text-[var(--color-primary)]"
        >
          Ver detalhes
        </Link>
        <button
          type="button"
          disabled
          title={encerrado ? 'Sorteio encerrado.' : 'Participação em sorteios ainda não disponível.'}
          className="flex-1 rounded-full bg-slate-300 px-4 py-3 text-sm font-bold text-white"
        >
          {encerrado ? 'Encerrado' : 'Em breve'}
        </button>
      </div>
    </article>
  )
}

function VoucherCard({ voucher, onRedeem, disabled }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-[#ECFFF4] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B6B53]">
          <Ticket size={22} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-[var(--color-primary)]">{voucher.titulo}</h3>
          <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">{voucher.validade}</p>
        </div>
      </div>
      <Button
        type="button"
        onClick={onRedeem}
        disabled={disabled}
        className="w-full bg-[#0B6B53] px-4 py-3 text-sm font-bold sm:w-auto"
      >
        Resgatar · {voucher.pontos} pts
      </Button>
    </article>
  )
}

export default function SorteiosPage() {
  const navigate = useNavigate()
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
  const activeRafflesCount = raffles.filter((item) => item.status === 'ativo').length

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Recompensas"
          title="Sorteios e vouchers"
          description="Troque seus pontos por chances, acompanhe campanhas e resgate benefícios disponíveis."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <span className="inline-flex min-h-10 items-center rounded-full bg-[#1F4E79] px-4 text-sm font-bold text-white">
                {activeRafflesCount} ativos
              </span>
            </div>
          }
        />

        {feedback ? <InlineAlert variant="success">{feedback}</InlineAlert> : null}
        {showingFallbackData ? (
          <InlineAlert variant="warning" title="Dados demonstrativos">
            Não foi possível carregar sorteios reais do servidor. Parte deste conteúdo está usando fallback local.
          </InlineAlert>
        ) : null}

          <SectionCard title="Sorteios ativos" description="Confira regras, pontos necessários e andamento de cada campanha.">
          {rafflesLoading ? <LoadingState title="Carregando sorteios..." /> : null}
          {rafflesError ? (
            <ErrorState title={getApiErrorMessage(rafflesQueryError, 'Não foi possível carregar os sorteios.')} />
          ) : null}
          {!rafflesLoading && !rafflesError ? (
            raffles.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {raffles.map((sorteio) => (
                  <SorteioCard key={sorteio.id} sorteio={sorteio} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum sorteio disponível."
                description="Quando houver campanhas ativas, elas aparecerão aqui para participação."
                className="bg-white"
              />
            )
          ) : null}
        </SectionCard>

          <SectionCard title="Vouchers" description="Use seus pontos para resgatar benefícios já disponíveis na plataforma.">
          {vouchersLoading ? <LoadingState title="Carregando vouchers..." /> : null}
          {vouchersError ? (
            <ErrorState title={getApiErrorMessage(vouchersQueryError, 'Não foi possível carregar os vouchers.')} />
          ) : null}
          {!vouchersLoading && !vouchersError ? (
            rewardVouchers.length ? (
              <div className="grid gap-4">
                {rewardVouchers.map((voucher) => (
                  <VoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    disabled={redeemMutation.isPending}
                    onRedeem={() => redeemMutation.mutate(voucher)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum voucher disponível."
                description="Os vouchers aparecerão aqui assim que forem publicados e liberados para resgate."
                className="bg-white"
              />
            )
          ) : null}
        </SectionCard>
      </div>
    </RoleShell>
  )
}
