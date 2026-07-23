import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Recycle, Send } from 'lucide-react'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import InlineAlert from '../components/ui/InlineAlert'
import LoadingButton from '../components/ui/LoadingButton'
import Button from '../components/ui/Button'
import { createInventoryItem, updateInventoryItem } from '../services/inventory'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const schema = z.object({
  descricao: z.string().optional(),
  observacao: z.string().optional(),
})

const tiposResiduo = [
  { id: 'plastico', label: 'Plástico', icon: <Recycle size={22} />, color: 'bg-red-500', ringColor: 'ring-red-500' },
  { id: 'papel', label: 'Papel', icon: <Recycle size={22} />, color: 'bg-blue-600', ringColor: 'ring-blue-500' },
  { id: 'vidro', label: 'Vidro', icon: <Recycle size={22} />, color: 'bg-emerald-500', ringColor: 'ring-emerald-500' },
  { id: 'metal', label: 'Metal', icon: <Recycle size={22} />, color: 'bg-amber-400', ringColor: 'ring-amber-400' },
  { id: 'organico', label: 'Orgânico', icon: <Recycle size={22} />, color: 'bg-amber-800', ringColor: 'ring-amber-800' },
  { id: 'eletronico', label: 'Eletrônicos', icon: <Recycle size={22} />, color: 'bg-orange-500', ringColor: 'ring-orange-500' },
]

export default function CadastrarResiduo() {
  const location = useLocation()
  const editItem = location.state?.item

  const [tipoSelecionado, setTipoSelecionado] = useState(editItem?.tipo_residuo || null)
  const [quantidade, setQuantidade] = useState(Number(editItem?.quantidade || 1))
  const [feedback, setFeedback] = useState(null)
  const [actionType, setActionType] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      descricao: editItem?.descricao || '',
      observacao: editItem?.observacao || '',
    },
  })

  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: async (createdItem, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.inventory })
      if (variables.isImmediateDiscard) {
        navigate('/validacao-presenca', {
          state: { selectedItemIds: [String(createdItem?.id || '')].filter(Boolean) }
        })
      } else {
        setFeedback({ tone: 'success', message: 'Resíduo adicionado ao estoque.' })
        setTimeout(() => {
          navigate('/meu-estoque')
        }, 800)
      }
    },
    onError: (mutationError) => {
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(mutationError, 'Não foi possível cadastrar o resíduo.'),
      })
      setActionType(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload) => updateInventoryItem(editItem?.id, payload),
    onSuccess: async (updatedItem, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.inventory })
      if (variables.isImmediateDiscard) {
        navigate('/validacao-presenca', {
          state: { selectedItemIds: [String(editItem.id)] }
        })
      } else {
        setFeedback({ tone: 'success', message: 'Resíduo atualizado com sucesso.' })
        setTimeout(() => {
          navigate('/meu-estoque')
        }, 800)
      }
    },
    onError: (mutationError) => {
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(mutationError, 'Não foi possível atualizar o resíduo.'),
      })
      setActionType(null)
    },
  })

  const onSubmit = (data, isImmediateDiscard = false) => {
    setFeedback(null)
    setActionType(isImmediateDiscard ? 'discard' : 'store')

    if (!tipoSelecionado) {
      setFeedback({ tone: 'error', message: 'Informe o tipo de resíduo.' })
      setActionType(null)
      return
    }

    const quantidadeNumerica = Number(quantidade)
    if (!Number.isFinite(quantidadeNumerica) || quantidadeNumerica <= 0) {
      setFeedback({ tone: 'error', message: 'Informe uma quantidade válida.' })
      setActionType(null)
      return
    }

    const payload = {
      tipo_residuo: tipoSelecionado,
      quantidade: quantidadeNumerica,
      isImmediateDiscard // to pass to onSuccess
    }

    const descricao = data.descricao?.trim()
    if (descricao) payload.descricao = descricao
    if (data.observacao) payload.observacao = data.observacao

    if (editItem) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageHeader
            title={editItem ? "Editar resíduo" : "Adicionar resíduo"}
            description={editItem ? "Atualize as informações do seu item no estoque." : "Preencha os dados do resíduo e decida se quer descartar agora ou guardar para depois."}
          />
          <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>

        <div className="mx-auto max-w-3xl">
          <SectionCard title="Dados do resíduo" description="Escolha o tipo e informe a quantidade em unidades.">
            <form className="flex flex-col gap-5">
              {feedback ? <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert> : null}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#1a3a4a]">Descrição do item (Opcional)</label>
                <input
                  {...register('descricao')}
                  placeholder="Ex: Garrafa PET 2L, Lata de alumínio 350ml"
                  className="min-h-12 w-full rounded-2xl border border-gray-300 px-4 py-3 text-base text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-[#1A2C71]"
                />
                {errors.descricao ? <p className="mt-1 text-xs text-red-600">{errors.descricao.message}</p> : null}
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-[#1a3a4a]">Tipo de resíduo</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {tiposResiduo.map((tipo) => (
                    <button
                      key={tipo.id}
                      type="button"
                      onClick={() => setTipoSelecionado(tipo.id)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 font-semibold text-white transition-all ${
                        tipoSelecionado === tipo.id
                          ? `${tipo.color} ring-4 ${tipo.ringColor} ring-offset-2 shadow-lg scale-105`
                          : `${tipo.color} hover:opacity-90 opacity-80`
                      }`}
                    >
                      {tipo.icon}
                      <span className="text-sm drop-shadow-sm">{tipo.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-[#1a3a4a]">Quantidade (unidades)</label>
                <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface)] p-3">
                  <button
                    type="button"
                    onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#1A2C71] text-2xl font-bold text-[#1A2C71] transition-colors hover:bg-white"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-[#1a3a4a]">{quantidade}</span>
                  <button
                    type="button"
                    onClick={() => setQuantidade((q) => q + 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A2C71] text-2xl font-bold text-white transition-colors hover:bg-[#121D4D]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <LoadingButton
                  type="button"
                  variant="secondary"
                  onClick={handleSubmit((data) => onSubmit(data, false))}
                  isLoading={actionType === 'store' && (createMutation.isPending || updateMutation.isPending)}
                  disabled={actionType === 'discard' && (createMutation.isPending || updateMutation.isPending)}
                  loadingText="Guardando..."
                  className="w-full py-4 border-2"
                >
                  Guardar para depois
                </LoadingButton>

                <LoadingButton
                  type="button"
                  variant="primary"
                  onClick={handleSubmit((data) => onSubmit(data, true))}
                  isLoading={actionType === 'discard' && (createMutation.isPending || updateMutation.isPending)}
                  disabled={actionType === 'store' && (createMutation.isPending || updateMutation.isPending)}
                  loadingText="Processando..."
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Descartar agora
                </LoadingButton>
              </div>
            </form>
          </SectionCard>
        </div>
      </div>
    </RoleShell>
  )
}
