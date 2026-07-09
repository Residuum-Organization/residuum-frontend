import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useZxing } from 'react-zxing'
import { ArrowLeft, BookText, Camera, Check, CircleDot, FlaskConical, ScanLine, Wine, X } from 'lucide-react'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import InlineAlert from '../components/ui/InlineAlert'
import LoadingButton from '../components/ui/LoadingButton'
import Button from '../components/ui/Button'
import { createInventoryItem } from '../services/inventory'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

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

function identificarTipoResiduo(barcode) {
  const prefix = barcode.substring(0, 3)
  if (['789', '790'].includes(prefix)) return 'plastico'
  if (barcode.startsWith('5449')) return 'metal'
  if (barcode.startsWith('978')) return 'papel'
  return null
}

function ScannerCamera({ onScan, onClose }) {
  const [scanned, setScanned] = useState(false)
  const [error, setError] = useState(null)

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (!scanned) {
        setScanned(true)
        onScan(result.getText())
      }
    },
    onError(err) {
      console.error('Erro no scanner:', err)
      setError('Não foi possível acessar a câmera. Verifique as permissões.')
    },
    paused: scanned,
    timeBetweenDecodingAttempts: 300,
  })

  return (
    <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black">
      {error ? (
        <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-white">
          {error}
        </div>
      ) : (
        <div className="relative h-full w-full">
          <video ref={ref} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white/80 hover:text-white"
            aria-label="Fechar camera"
          >
            <X size={18} />
          </button>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 rounded-2xl border-2 border-white/35" />
          </div>
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white/80">
              <ScanLine size={14} />
              <span>Aponte para o código</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CadastrarResiduo() {
  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [quantidade, setQuantidade] = useState(1)
  const [showScanner, setShowScanner] = useState(false)
  const [ultimoCodigo, setUltimoCodigo] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const handleScan = (barcode) => {
    setUltimoCodigo(barcode)
    setShowScanner(false)
    setValue('descricao', `Código: ${barcode}`)
    const tipoIdentificado = identificarTipoResiduo(barcode)
    if (tipoIdentificado) setTipoSelecionado(tipoIdentificado)
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
    const observacao = data.observacao?.trim()
    if (descricao) payload.descricao = descricao
    if (observacao) payload.observacao = observacao
    if (ultimoCodigo) payload.codigo_barras = ultimoCodigo

    createMutation.mutate(payload)
  }

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageHeader
            title="Cadastrar resíduo"
            description="Escaneie o código ou preencha os dados do resíduo antes da entrega."
          />
          <Button type="button" variant="secondary" onClick={() => navigate('/meu-estoque')} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para estoque
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <SectionCard title="Código do produto" description="Use a câmera se houver código de barras.">
            {showScanner ? (
              <ScannerCamera onScan={handleScan} onClose={() => setShowScanner(false)} />
            ) : (
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="relative mt-4 flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-[#1F4E79] shadow-sm transition hover:bg-[#173B5C]"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-48 w-48 rounded-full border-2 border-white/10" />
                </div>
                <div className="relative z-10 rounded-full bg-white/20 p-5">
                  <Camera size={40} className="text-white" />
                </div>
                <div className="relative z-10 text-center">
                  <span className="block text-lg font-bold text-white">Escanear código</span>
                  <span className="mt-1 block text-sm text-white/75">Toque para ativar a câmera</span>
                </div>
              </button>
            )}

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
                  Re-escanear
                </button>
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
                          ? 'bg-[#173B5C] ring-2 ring-[#1F4E79] ring-offset-2'
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
                A pontuação só entra depois da confirmação e pesagem pela cooperativa.
              </InlineAlert>

              <LoadingButton
                type="submit"
                isLoading={createMutation.isPending}
                loadingText="Salvando..."
                className="w-full py-4"
              >
                Adicionar ao estoque
              </LoadingButton>
            </form>
          </SectionCard>
        </div>
      </div>
    </RoleShell>
  )
}
