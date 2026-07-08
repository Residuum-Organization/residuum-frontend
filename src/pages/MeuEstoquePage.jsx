import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookText, CircleDot, FlaskConical, Trash2, Wine } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Button from '../components/ui/Button'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/ui/PageHeader'
import LoadingState from '../components/ui/LoadingState'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import InlineAlert from '../components/ui/InlineAlert'
import { listInventory, removeInventoryItem, updateInventoryItem } from '../services/inventory'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const POINTS_PER_KG = 10

const getItemIcon = (tipo) => {
  const normalizedType = String(tipo || '').toLowerCase()
  if (normalizedType === 'metal' || normalizedType === 'aluminio') return CircleDot
  if (normalizedType === 'papel' || normalizedType === 'papelao') return BookText
  if (normalizedType === 'plastico') return FlaskConical
  return Wine
}

const formatResidueType = (tipo) =>
  String(tipo || 'residuo')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatQuantity = (value) => {
  const quantity = Number(value || 0)
  return quantity.toLocaleString('pt-BR', {
    minimumFractionDigits: Number.isInteger(quantity) ? 0 : 1,
    maximumFractionDigits: 2,
  })
}

const getEstimatedPoints = (quantity) => Math.round(Number(quantity || 0) * POINTS_PER_KG)

export default function MeuEstoquePage() {
  const [feedback, setFeedback] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: itens = [], isLoading, isError, error } = useQuery({
    queryKey: queryKeys.inventory,
    queryFn: () => listInventory(),
    select: (items) =>
      items.filter(
        (item) =>
          item.status !== 'cancelado' &&
          (Number(item.quantidade || 0) > 0 || Number(item.quantidade_reservada || 0) > 0)
      ),
  })

  const updateMutation = useMutation({
    mutationFn: ({ itemId, payload }) => updateInventoryItem(itemId, payload),
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Estoque atualizado com sucesso.' })
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory })
    },
    onError: (mutationError) => {
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(mutationError, 'Nao foi possivel atualizar o item.'),
      })
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeInventoryItem,
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Item removido do estoque.' })
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory })
    },
    onError: (mutationError) => {
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(mutationError, 'Nao foi possivel remover o item.'),
      })
    },
  })

  const isSubmitting = updateMutation.isPending || removeMutation.isPending

  const incrementar = (item) => {
    setFeedback(null)
    updateMutation.mutate({
      itemId: item.id,
      payload: { quantidade: Number(item.quantidade || 0) + 1 },
    })
  }

  const decrementar = (item) => {
    const reservedQuantity = Number(item.quantidade_reservada || 0)
    const currentQuantity = Number(item.quantidade || 0)
    const minimumAllowed = Math.max(reservedQuantity, 1)
    const nextQuantity = Math.max(minimumAllowed, currentQuantity - 1)
    if (nextQuantity === currentQuantity) return

    setFeedback(null)
    updateMutation.mutate({
      itemId: item.id,
      payload: { quantidade: nextQuantity },
    })
  }

  const remover = (id) => {
    setFeedback(null)
    removeMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <PageContainer innerClassName="pb-24">
        <LoadingState title="Carregando estoque..." className="mx-auto mt-10 w-full max-w-md" />
        <Navbar />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer innerClassName="pb-24">
        <div className="space-y-5">
          <PageHeader title="Meu Estoque" description="Acompanhe os residuos cadastrados para entrega." />
          <ErrorState title={getApiErrorMessage(error, 'Nao foi possivel carregar o estoque.')} />
        </div>
        <Navbar />
      </PageContainer>
    )
  }

  return (
    <PageContainer innerClassName="pb-28">
      <div className="space-y-5">
        <PageHeader
          title="Meu Estoque"
          description="Cadastre seus residuos antes de ir ao ponto de coleta."
          action={
            <span className="rounded-full bg-[#1F4E79] px-4 py-2 text-sm font-semibold text-white">
              {itens.length} itens
            </span>
          }
        />

        {feedback ? <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert> : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-[#1a3a4a]">Itens no estoque</h2>
          <Button type="button" onClick={() => navigate('/cadastrar-residuo')} className="w-full sm:w-auto">
            Adicionar residuo
          </Button>
        </div>

        {itens.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {itens.map((item) => {
              const ItemIcon = getItemIcon(item.tipo_residuo)
              const quantityAvailable = Number(item.quantidade_disponivel ?? item.quantidade ?? 0)

              return (
                <article key={item.id} className="rounded-2xl border border-[#dde1ef] bg-[#f7f9fc] p-4 shadow-sm">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1F4E79] text-white">
                      <ItemIcon size={24} />
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-base font-bold leading-tight text-[#1a3a4a]">
                        {item.descricao || formatResidueType(item.tipo_residuo)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Tipo: {formatResidueType(item.tipo_residuo)}</p>
                      <p className="mt-1 text-xs font-medium text-gray-500">
                        Disponivel: {formatQuantity(quantityAvailable)} kg
                        {Number(item.quantidade_reservada || 0) > 0
                          ? ` | Reservado: ${formatQuantity(item.quantidade_reservada)} kg`
                          : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:flex-col md:items-stretch xl:flex-row xl:items-end">
                    <div className="flex items-center justify-between gap-3 sm:justify-start md:justify-between xl:justify-start">
                      <button
                        type="button"
                        onClick={() => decrementar(item)}
                        disabled={isSubmitting}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#1F4E79] text-xl font-bold text-[#1F4E79] disabled:opacity-60"
                      >
                        -
                      </button>
                      <span className="min-w-12 text-center text-lg font-bold text-[#1a3a4a]">
                        {formatQuantity(item.quantidade)}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementar(item)}
                        disabled={isSubmitting}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F4E79] text-xl font-bold text-white disabled:opacity-60"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end md:flex-row xl:flex-col">
                      <button
                        type="button"
                        aria-label="Remover item"
                        onClick={() => remover(item.id)}
                        disabled={isSubmitting}
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-[#1F4E79] disabled:opacity-60"
                      >
                        <Trash2 size={20} />
                      </button>
                      <span className="text-sm font-bold text-green-700">+{getEstimatedPoints(quantityAvailable)} pts</span>
                      <button
                        type="button"
                        onClick={() => navigate(`/validacao-presenca?itemId=${item.id}`)}
                        className="inline-flex min-h-11 items-center justify-center gap-1 rounded-2xl bg-[#1F4E79] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Transferir
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <EmptyState
            title="Seu estoque esta vazio."
            description="Cadastre um residuo para comecar a organizar sua proxima entrega."
            actionLabel="Cadastrar residuo"
            onAction={() => navigate('/cadastrar-residuo')}
          />
        )}
      </div>
      <Navbar />
    </PageContainer>
  )
}
