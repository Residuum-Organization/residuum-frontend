import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookText,
  CircleDot,
  FlaskConical,
  Loader2,
  Trash2,
  Wine,
} from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import {
  listInventory,
  removeInventoryItem,
  updateInventoryItem,
} from '../services/inventory'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const POINTS_PER_KG = 10

const getItemIcon = (tipo) => {
  const normalizedType = String(tipo || '').toLowerCase()

  if (normalizedType === 'metal' || normalizedType === 'aluminio') {
    return CircleDot
  }

  if (normalizedType === 'papel' || normalizedType === 'papelao') {
    return BookText
  }

  if (normalizedType === 'plastico') {
    return FlaskConical
  }

  return Wine
}

const formatResidueType = (tipo) =>
  String(tipo || 'resíduo')
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

  const {
    data: itens = [],
    isLoading,
    isError,
    error,
  } = useQuery({
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
        message: getApiErrorMessage(mutationError, 'Não foi possível atualizar o item.'),
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
        message: getApiErrorMessage(mutationError, 'Não foi possível remover o item.'),
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

    if (nextQuantity === currentQuantity) {
      return
    }

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
      <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
        <div className="flex-1 px-5 pt-8 pb-24 flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#1a3a4a]">
            <Loader2 className="animate-spin" size={20} />
            <span>Carregando estoque...</span>
          </div>
        </div>
        <Navbar />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
        <div className="flex-1 px-5 pt-8 pb-24">
          <h1 className="text-2xl font-bold text-[#1a3a4a] mb-3">Meu Estoque</h1>
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {getApiErrorMessage(error, 'Não foi possível carregar o estoque.')}
          </div>
        </div>
        <Navbar />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
      <div className="flex-1 px-5 pt-8 pb-24 overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-[#1a3a4a]">Meu Estoque</h1>
          <span className="bg-[#1e4d6b] text-white text-sm font-semibold px-4 py-2 rounded-full">
            {itens.length} itens
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-6">Cadastre seus resíduos antes de ir ao ponto</p>

        {feedback ? (
          <div
            className={`mb-4 rounded-2xl px-4 py-3 text-sm font-medium ${
              feedback.tone === 'error'
                ? 'border border-red-200 bg-red-50 text-red-700'
                : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <h2 className="text-base font-bold text-[#1a3a4a] mb-4">Itens no estoque</h2>

        {itens.length ? (
          <div className="flex flex-col gap-4">
            {itens.map((item) => {
              const ItemIcon = getItemIcon(item.tipo_residuo)
              const quantityAvailable = Number(item.quantidade_disponivel ?? item.quantidade ?? 0)

              return (
                <div
                  key={item.id}
                  className="bg-[#f0f2f8] rounded-2xl px-4 py-4 border border-[#dde1ef]"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-[#1e4d6b] rounded-xl p-2 flex items-center justify-center">
                      <ItemIcon size={24} color="white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1a3a4a] text-base leading-tight">
                        {item.descricao || formatResidueType(item.tipo_residuo)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Tipo: {formatResidueType(item.tipo_residuo)}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Disponível: {formatQuantity(quantityAvailable)} kg
                        {Number(item.quantidade_reservada || 0) > 0
                          ? ` • Reservado: ${formatQuantity(item.quantidade_reservada)} kg`
                          : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decrementar(item)}
                        disabled={isSubmitting}
                        className="w-10 h-10 rounded-xl border-2 border-[#1e4d6b] text-[#1e4d6b] text-xl font-bold flex items-center justify-center disabled:opacity-60"
                      >
                        −
                      </button>
                      <span className="text-lg font-bold text-[#1a3a4a] min-w-12 text-center">
                        {formatQuantity(item.quantidade)}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementar(item)}
                        disabled={isSubmitting}
                        className="w-10 h-10 rounded-xl bg-[#1e4d6b] text-white text-xl font-bold flex items-center justify-center disabled:opacity-60"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => remover(item.id)}
                        disabled={isSubmitting}
                        className="text-[#1e4d6b] disabled:opacity-60"
                      >
                        <Trash2 size={20} />
                      </button>
                      <span className="text-green-600 font-bold text-sm">
                        +{getEstimatedPoints(quantityAvailable)} pts
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/validacao-presenca?itemId=${item.id}`)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#1e4d6b] px-3 py-2 text-xs font-semibold text-white"
                      >
                        Transferir
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#c8d2e3] bg-[#f7f9fc] px-5 py-8 text-center">
            <p className="text-[#1a3a4a] font-semibold">Seu estoque está vazio.</p>
            <p className="text-sm text-gray-400 mt-2">
              Cadastre um resíduo para começar a organizar sua próxima entrega.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/cadastrar-residuo')}
          className="w-full bg-[#1e4d6b] text-white font-semibold py-4 rounded-full text-sm mt-6"
        >
          Adicionar Resíduo
        </button>
      </div>

      <Navbar />
    </div>
  )
}
