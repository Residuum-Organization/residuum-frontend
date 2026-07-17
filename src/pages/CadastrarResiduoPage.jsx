import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, BookText, Check, CircleDot, FlaskConical, ScanBarcode, Sticker, Wine } from 'lucide-react'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import InlineAlert from '../components/ui/InlineAlert'
import LoadingButton from '../components/ui/LoadingButton'
import Button from '../components/ui/Button'
import { createInventoryItem, updateInventoryItem } from '../services/inventory'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'
import BarcodeScanner from '../components/BarcodeScanner'
import { buildResidueObservation, parseResidueIdentification } from '../utils/residueIdentification'

const schema = z.object({
  descricao: z.string().optional(),
  observacao: z.string().optional(),
})

const tiposResiduo = [
  { id: 'plastico', label: 'Plástico', icon: <FlaskConical size={22} /> },
  { id: 'metal', label: 'Metal', icon: <CircleDot size={22} /> },
  { id: 'papel', label: 'Papel', icon: <BookText size={22} /> },
  { id: 'vidro', label: 'Vidro', icon: <Wine size={22} /> },
]

export default function CadastrarResiduo() {
  const location = useLocation()
  const editItem = location.state?.item
  const initialIdentification = parseResidueIdentification(editItem)

  const [tipoSelecionado, setTipoSelecionado] = useState(editItem?.tipo_residuo || null)
  const [quantidade, setQuantidade] = useState(Number(editItem?.quantidade || 1))
  const [showScanner, setShowScanner] = useState(false)
  const [ultimoCodigo, setUltimoCodigo] = useState(initialIdentification.barcode)
  const [semRotulo, setSemRotulo] = useState(initialIdentification.withoutLabel)
  const [feedback, setFeedback] = useState(null)
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
      observacao: initialIdentification.cleanObservation,
    },
  })

  const handleScan = (barcode) => {
    setUltimoCodigo(barcode)
    setSemRotulo(false)
    setShowScanner(false)
  }

  const markWithoutLabel = () => {
    setSemRotulo(true)
    setUltimoCodigo('')
    setShowScanner(false)
  }

  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.inventory })
      setFeedback({ tone: 'success', message: 'Resíduo cadastrado com sucesso.' })
      setTimeout(() => {
        navigate('/meu-estoque')
      }, 800)
    },
    onError: (mutationError) => {
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(mutationError, 'Não foi possível cadastrar o resíduo.'),
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload) => updateInventoryItem(editItem?.id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.inventory })
      setFeedback({ tone: 'success', message: 'Resíduo atualizado com sucesso.' })
      setTimeout(() => {
        navigate('/meu-estoque')
      }, 800)
    },
    onError: (mutationError) => {
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(mutationError, 'Não foi possível atualizar o resíduo.'),
      })
    },
  })

  const onSubmit = (data) => {
    setFeedback(null)

    if (!tipoSelecionado) {
      setFeedback({ tone: 'error', message: 'Informe o tipo de resíduo.' })
      return
    }

    const quantidadeNumerica = Number(quantidade)
    if (!Number.isFinite(quantidadeNumerica) || quantidadeNumerica <= 0) {
      setFeedback({ tone: 'error', message: 'Informe uma quantidade válida.' })
      return
    }

    const payload = {
      tipo_residuo: tipoSelecionado,
      quantidade: quantidadeNumerica,
    }

    const descricao = data.descricao?.trim()
    if (semRotulo && !descricao) {
      setFeedback({ tone: 'error', message: 'Descreva a embalagem sem rótulo para que o ponto de coleta possa identificá-la.' })
      return
    }

    const observacao = buildResidueObservation({
      observation: data.observacao,
      barcode: ultimoCodigo,
      withoutLabel: semRotulo,
    })
    if (descricao) payload.descricao = descricao
    if (observacao) payload.observacao = observacao
    if (ultimoCodigo) payload.codigo_barras = ultimoCodigo
    payload.sem_rotulo = semRotulo

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
            title={editItem ? "Editar resíduo" : "Cadastrar resíduo"}
            description={editItem ? "Atualize as informações do seu item no estoque." : "Escaneie o código ou preencha os dados do resíduo antes da entrega."}
          />
          <Button type="button" variant="secondary" onClick={() => navigate('/meu-estoque')} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para estoque
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <SectionCard title="Identificação da embalagem" description="Informe se a embalagem possui código de barras ou está sem rótulo.">
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className={`flex min-h-32 flex-col items-start justify-between rounded-2xl border-2 p-4 text-left transition ${!semRotulo ? 'border-[#1F4E79] bg-[#eef5fb] text-[#1F4E79]' : 'border-slate-200 bg-white text-slate-500 hover:border-[#1F4E79]/40'}`}
              >
                <span className="rounded-xl bg-white p-2 shadow-sm"><ScanBarcode size={24} /></span>
                <span><strong className="block text-sm">Com código de barras</strong><small className="mt-1 block">Use a câmera para registrar o produto.</small></span>
              </button>
              <button
                type="button"
                onClick={markWithoutLabel}
                className={`flex min-h-32 flex-col items-start justify-between rounded-2xl border-2 p-4 text-left transition ${semRotulo ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 bg-white text-slate-500 hover:border-amber-300'}`}
              >
                <span className="rounded-xl bg-white p-2 shadow-sm"><Sticker size={24} /></span>
                <span><strong className="block text-sm">Embalagem sem rótulo</strong><small className="mt-1 block">O ponto fará a identificação manual.</small></span>
              </button>
            </div>

            {ultimoCodigo ? (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 sm:flex-row sm:items-center">
                <Check size={20} className="shrink-0 text-green-600" />
                <div className="min-w-0 flex-1 break-words">
                  <span className="font-medium">Código lido:</span> {ultimoCodigo}
                </div>
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="min-h-10 rounded-full bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800"
                >
                  Escanear novamente
                </button>
              </div>
            ) : semRotulo ? (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <Sticker size={20} className="shrink-0" />
                <span><strong>Sem rótulo.</strong> Preencha a descrição e o tipo do material.</span>
              </div>
            ) : null}
          </SectionCard>

          <SectionCard title="Dados do resíduo" description="Escolha o tipo e informe a quantidade em kg.">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {feedback ? <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert> : null}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#1a3a4a]">Descrição do item</label>
                <input
                  {...register('descricao')}
                  placeholder="Ex: Garrafa PET 2L"
                  className="min-h-12 w-full rounded-2xl border border-gray-300 px-4 py-3 text-base text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-[#1F4E79]"
                />
                {errors.descricao ? <p className="mt-1 text-xs text-red-600">{errors.descricao.message}</p> : null}
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-[#1a3a4a]">Tipo de resíduo</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                  {tiposResiduo.map((tipo) => (
                    <button
                      key={tipo.id}
                      type="button"
                      onClick={() => setTipoSelecionado(tipo.id)}
                      className={`flex min-h-14 items-center gap-3 rounded-2xl px-4 py-4 font-semibold text-white transition-all ${
                        tipoSelecionado === tipo.id
                          ? 'bg-emerald-600 ring-2 ring-emerald-500 ring-offset-2 shadow-md scale-[1.02]'
                          : 'bg-[#1F4E79] hover:bg-[#173B5C]'
                      }`}
                    >
                      {tipo.icon}
                      {tipo.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-[#1a3a4a]">Quantidade</label>
                <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface)] p-3">
                  <button
                    type="button"
                    onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#1F4E79] text-2xl font-bold text-[#1F4E79] transition-colors hover:bg-white"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-[#1a3a4a]">{quantidade}</span>
                  <button
                    type="button"
                    onClick={() => setQuantidade((q) => q + 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F4E79] text-2xl font-bold text-white transition-colors hover:bg-[#173B5C]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#1a3a4a]">Observação (opcional)</label>
                <textarea
                  {...register('observacao')}
                  placeholder="Ex: Embalagem sem rótulo"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 text-base text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-[#1F4E79]"
                />
              </div>

              <InlineAlert variant="info">
                A pontuação só entra depois da conferência e pesagem pelo ponto de coleta.
              </InlineAlert>

              <LoadingButton
                type="submit"
                isLoading={editItem ? updateMutation.isPending : createMutation.isPending}
                loadingText="Salvando..."
                className="w-full py-4"
              >
                {editItem ? "Salvar alterações" : "Adicionar ao estoque"}
              </LoadingButton>
            </form>
          </SectionCard>
        </div>
      </div>
      {showScanner ? <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} /> : null}
    </RoleShell>
  )
}
