import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Loader2, MapPin, QrCode, Send,
  CircleDot, BookText, FlaskConical, Wine,
  CheckSquare, Square, Recycle,
} from 'lucide-react'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import InlineAlert from '../components/ui/InlineAlert'
import LoadingState from '../components/ui/LoadingState'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import LoadingButton from '../components/ui/LoadingButton'
import Button from '../components/ui/Button'
import { listInventory, transferInventoryItem } from '../services/inventory'
import { listCollectionPoints } from '../services/collectionPoints'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const POINTS_PER_KG = 10

const formatResidueType = (tipo) =>
  String(tipo || 'resíduo')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const getItemIcon = (tipo) => {
  const normalizedType = String(tipo || '').toLowerCase()
  if (normalizedType === 'metal' || normalizedType === 'aluminio') return CircleDot
  if (normalizedType === 'papel' || normalizedType === 'papelao') return BookText
  if (normalizedType === 'plastico') return FlaskConical
  return Wine
}

const formatQuantity = (value) => {
  const quantity = Number(value || 0)
  return quantity.toLocaleString('pt-BR', {
    minimumFractionDigits: Number.isInteger(quantity) ? 0 : 1,
    maximumFractionDigits: 2,
  })
}

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada neste dispositivo.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => reject(new Error('Não foi possível obter sua localização atual.')),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  })

const QR_TOKEN_QUERY_KEYS = ['qrToken', 'token', 'codigo']

const getQrTokenFromSearchParams = (searchParams) => {
  for (const key of QR_TOKEN_QUERY_KEYS) {
    const value = searchParams.get(key)
    if (value?.trim()) return value.trim()
  }
  return ''
}

const hasQrTokenQueryParam = (searchParams) =>
  QR_TOKEN_QUERY_KEYS.some((key) => searchParams.has(key))

const getTransferErrorMessage = (error) => {
  if (error?.isAxiosError && !error.response) {
    return 'Servidor indisponível. Verifique se o backend está ligado e tente novamente.'
  }
  return getApiErrorMessage(error, 'Token QR Code inválido ou não foi possível enviar o item para o ponto.')
}

/* ─────────────────────────────────────────────────────── */
/* Main Component                                         */
/* ─────────────────────────────────────────────────────── */

export default function ValidacaoPresencaPage() {
  const [searchParams] = useSearchParams()
  const [selectedItems, setSelectedItems] = useState({})
  const [selectedPointId, setSelectedPointId] = useState('')
  const [observacao, setObservacao] = useState('')
  const [qrToken, setQrToken] = useState(() => getQrTokenFromSearchParams(searchParams))
  const [coords, setCoords] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  /* ── Queries ── */

  const {
    data: inventory = [],
    isLoading: inventoryLoading,
    isError: inventoryError,
    error: inventoryQueryError,
  } = useQuery({
    queryKey: queryKeys.inventory,
    queryFn: () => listInventory(),
    select: (items) => {
      const filtered = items.filter(
        (item) =>
          item.status !== 'cancelado' &&
          Number(item.quantidade_disponivel ?? item.quantidade ?? 0) > 0
      )
      const urlItemId = searchParams.get('itemId')
      if (urlItemId) {
        const idx = filtered.findIndex((i) => String(i.id) === urlItemId)
        if (idx > 0) {
          const [item] = filtered.splice(idx, 1)
          filtered.unshift(item)
        }
      }
      return filtered
    },
  })

  const pointFilters = {}
  if (coords) {
    pointFilters.lat = coords.lat
    pointFilters.long = coords.lng
  }

  const {
    data: allPoints = [],
    isLoading: pointsLoading,
    isError: pointsError,
    error: pointsQueryError,
  } = useQuery({
    queryKey: queryKeys.collectionPoints(pointFilters),
    queryFn: () => listCollectionPoints(pointFilters),
  })

  /* ── Derived state ── */

  const selectedTypes = Object.keys(selectedItems)
    .map((id) => {
      const item = inventory.find((i) => String(i.id) === id)
      return item ? String(item.tipo_residuo || '').toLowerCase() : ''
    })
    .filter(Boolean)

  const compatiblePoints = allPoints.filter((p) => {
    const accepted = (p.tipos_residuos_aceitos || []).map((t) => t.toLowerCase())
    return selectedTypes.every((t) => accepted.includes(t))
  })

  const totalPoints = Object.keys(selectedItems).reduce(
    (sum, id) => sum + Math.round(Number(selectedItems[id]) * POINTS_PER_KG),
    0
  )

  const selectedCount = Object.keys(selectedItems).length

  /* ── Effects ── */

  useEffect(() => {
    if (inventory.length > 0 && Object.keys(selectedItems).length === 0) {
      const urlItemId = searchParams.get('itemId')
      if (urlItemId) {
        const item = inventory.find((i) => String(i.id) === urlItemId)
        if (item) {
          setSelectedItems({ [item.id]: Number(item.quantidade_disponivel ?? item.quantidade ?? 1) })
        }
      } else {
        const item = inventory[0]
        setSelectedItems({ [item.id]: Number(item.quantidade_disponivel ?? item.quantidade ?? 1) })
      }
    }
  }, [inventory, searchParams])

  useEffect(() => {
    if (!compatiblePoints.length) {
      setSelectedPointId('')
      return
    }
    const hasSelectedPoint = compatiblePoints.some((p) => String(p.id) === String(selectedPointId))
    if (!hasSelectedPoint) setSelectedPointId(String(compatiblePoints[0].id))
  }, [compatiblePoints, selectedPointId])

  useEffect(() => {
    const tokenFromUrl = getQrTokenFromSearchParams(searchParams)
    if (tokenFromUrl) setQrToken(tokenFromUrl)
  }, [searchParams])

  /* ── Handlers ── */

  const toggleItem = (item) => {
    setSelectedItems((prev) => {
      const next = { ...prev }
      if (next[item.id]) {
        delete next[item.id]
      } else {
        next[item.id] = Number(item.quantidade_disponivel ?? item.quantidade ?? 1)
      }
      return next
    })
  }

  const updateQuantity = (itemId, newQuantity, maxVal) => {
    setSelectedItems((prev) => {
      if (prev[itemId] === undefined) return prev
      return { ...prev, [itemId]: Math.max(0.1, Math.min(Number(newQuantity), maxVal)) }
    })
  }

  const handleInputChange = (itemId, rawValue, maxVal) => {
    setSelectedItems((prev) => {
      if (prev[itemId] === undefined) return prev
      const numValue = Number(rawValue)
      return { ...prev, [itemId]: numValue > maxVal ? maxVal : rawValue }
    })
  }

  const requestLocation = async () => {
    setLocationError('')
    setIsLocating(true)
    try {
      const nextCoords = await getCurrentPosition()
      setCoords(nextCoords)
      return nextCoords
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível validar sua localização.')
      setLocationError(message)
      throw error
    } finally {
      setIsLocating(false)
    }
  }

  const handleTransfer = async () => {
    setFeedback(null)
    const itemIds = Object.keys(selectedItems)

    if (itemIds.length === 0) {
      setFeedback({ tone: 'error', message: 'Selecione pelo menos um item do estoque para transferir.' })
      return
    }
    if (!selectedPointId) {
      setFeedback({ tone: 'error', message: 'Selecione um ponto de coleta.' })
      return
    }
    if (hasQrTokenQueryParam(searchParams) && !qrToken.trim()) {
      setFeedback({ tone: 'error', message: 'Token QR Code ausente ou vazio. Escaneie novamente ou informe o código manualmente.' })
      return
    }

    for (const itemId of itemIds) {
      const item = inventory.find((i) => String(i.id) === itemId)
      const quantityNumber = Number(selectedItems[itemId])
      const availableQuantity = Number(item?.quantidade_disponivel ?? item?.quantidade ?? 0)
      if (!quantityNumber || quantityNumber <= 0) {
        setFeedback({ tone: 'error', message: `Informe uma quantidade válida para ${formatResidueType(item?.tipo_residuo)}.` })
        return
      }
      if (quantityNumber > availableQuantity) {
        setFeedback({ tone: 'error', message: `A quantidade de ${formatResidueType(item?.tipo_residuo)} excede o limite disponível de ${formatQuantity(availableQuantity)} kg.` })
        return
      }
    }

    let currentCoords = coords
    if (!qrToken.trim()) {
      try {
        currentCoords = currentCoords || (await requestLocation())
      } catch (_error) {
        return
      }
    }

    setIsTransferring(true)
    try {
      await Promise.all(
        itemIds.map((itemId) =>
          transferInventoryItem(itemId, {
            quantidade: Number(selectedItems[itemId]),
            ponto_coleta_id: Number(selectedPointId),
            usuario_lat: currentCoords?.lat ?? 0,
            usuario_long: currentCoords?.lng ?? 0,
            observacao: observacao || undefined,
            qrcode_token: qrToken.trim() || undefined,
          })
        )
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory })
      queryClient.invalidateQueries({ queryKey: queryKeys.discardHistory })
      navigate('/extrato')
    } catch (error) {
      setFeedback({ tone: 'error', message: getTransferErrorMessage(error) })
    } finally {
      setIsTransferring(false)
    }
  }

  /* ── Early returns ── */

  if (inventoryLoading) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
        <LoadingState title="Carregando itens para transferência..." className="mx-auto mt-10 max-w-md" />
      </RoleShell>
    )
  }

  if (inventoryError) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
        <div className="space-y-5">
          <PageHeader title="Transferir para o ponto" description="Escolha o resíduo, valide sua presença e confirme." />
          <ErrorState title={getApiErrorMessage(inventoryQueryError, 'Não foi possível carregar o estoque disponível.')} />
        </div>
      </RoleShell>
    )
  }

  /* ── Render ── */

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-36 sm:px-6 sm:py-6 lg:px-8 lg:pb-56">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Validação & Transferência"
          title="Transferir para o Ponto"
          description="Valide sua presença, selecione os resíduos e escolha o ponto de coleta."
          action={
            <Button type="button" variant="secondary" onClick={() => navigate('/meu-estoque')} className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para estoque
            </Button>
          }
        />

        {feedback ? <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert> : null}

        {!inventory.length ? (
          <EmptyState
            title="Você ainda não tem itens disponíveis."
            description="Cadastre um resíduo no estoque antes de solicitar uma entrega."
            actionLabel="Cadastrar resíduo"
            onAction={() => navigate('/cadastrar-residuo')}
            icon={Recycle}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ── Top-Left: Validação ── */}
            <SectionCard title="1. Validar presença" description="Capture sua localização ou use o QR Code do ponto.">
              <div className="mt-2 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${coords ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <MapPin size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1a3a4a]">{coords ? 'Localização capturada' : 'Localização não detectada'}</p>
                    <p className="text-xs text-slate-500">{coords ? 'Você pode atualizar a qualquer momento.' : 'Necessária para listar pontos próximos.'}</p>
                  </div>
                </div>

                {locationError ? <p className="text-xs font-medium text-red-600">{locationError}</p> : null}

                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={isLocating}
                  className="w-full rounded-2xl border-2 border-[#1F4E79] bg-white py-3 text-sm font-semibold text-[#1F4E79] transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {isLocating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                    {coords ? 'Atualizar localização' : 'Capturar localização'}
                  </span>
                </button>

                <div className="my-1 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-bold uppercase text-slate-400">ou</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <label className="block text-sm font-bold text-[#1a3a4a]">Token QR Code</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={qrToken}
                    onChange={(e) => setQrToken(e.target.value)}
                    placeholder="Cole o token do ponto..."
                    className="min-h-12 flex-1 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[#1a3a4a] outline-none focus:border-[#1F4E79]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const firstId = Object.keys(selectedItems)[0] || ''
                      navigate(firstId ? `/escanear-qr?itemId=${firstId}` : '/escanear-qr')
                    }}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#1F4E79] px-5 text-sm font-semibold text-white transition hover:bg-[#173B5C]"
                  >
                    <QrCode size={18} />
                    Escanear
                  </button>
                </div>
              </div>
            </SectionCard>

            {/* ── Top-Right: Resíduos ── */}
            <SectionCard
              title="2. Resíduos a transferir"
              description="Selecione um ou mais itens do seu estoque."
              action={
                <span className="inline-flex min-h-8 items-center rounded-full bg-[#1F4E79] px-3 text-xs font-bold text-white">
                  {selectedCount} selecionado{selectedCount !== 1 ? 's' : ''}
                </span>
              }
            >
              <div className="mt-2 flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {inventory.map((item) => {
                  const isSelected = selectedItems[item.id] !== undefined
                  const maxKg = Number(item.quantidade_disponivel ?? item.quantidade ?? 0)
                  const ItemIcon = getItemIcon(item.tipo_residuo)
                  const currentQuantity = selectedItems[item.id] ?? maxKg

                  return (
                    <article
                      key={item.id}
                      className={`rounded-2xl border-2 p-4 transition-all ${
                        isSelected
                          ? 'border-[#1F4E79] bg-[#f4f7fa] shadow-sm'
                          : 'border-[var(--color-border)] bg-white hover:border-slate-300'
                      }`}
                    >
                      <div onClick={() => toggleItem(item)} className="flex items-center gap-3 cursor-pointer">
                        <div className={isSelected ? 'text-[#1F4E79]' : 'text-slate-300'}>
                          {isSelected ? <CheckSquare size={22} /> : <Square size={22} />}
                        </div>
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isSelected ? 'bg-[#1F4E79] text-white' : 'bg-slate-100 text-[#1F4E79]'}`}>
                          <ItemIcon size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-bold ${isSelected ? 'text-[#1F4E79]' : 'text-[#1a3a4a]'}`}>
                            {item.descricao || formatResidueType(item.tipo_residuo)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatResidueType(item.tipo_residuo)} · <span className="font-bold text-[#1F4E79]">{formatQuantity(maxKg)} kg</span>
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                          <span className="text-xs font-bold text-[#1F4E79]">Quantidade (kg)</span>
                          <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-white p-1">
                            <button type="button" onClick={() => updateQuantity(item.id, Number(currentQuantity) - 0.5, maxKg)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-lg font-bold text-[#1F4E79] hover:bg-slate-200">−</button>
                            <input type="number" min="0.1" step="0.1" value={currentQuantity} onChange={(e) => handleInputChange(item.id, e.target.value, maxKg)} className="h-8 w-16 bg-transparent text-center text-sm font-bold text-[#1a3a4a] outline-none" />
                            <button type="button" onClick={() => updateQuantity(item.id, Number(currentQuantity) + 0.5, maxKg)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F4E79] text-lg font-bold text-white hover:bg-[#173B5C]">+</button>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </SectionCard>

            {/* ── Bottom-Left: Pontos de Coleta ── */}
            <SectionCard
              title="3. Ponto de coleta"
              description="Pontos que aceitam todos os resíduos selecionados."
              action={compatiblePoints.length > 0 ? (
                <span className="inline-flex min-h-8 items-center rounded-full bg-emerald-100 px-3 text-xs font-bold text-emerald-700">
                  {compatiblePoints.length} compatível{compatiblePoints.length !== 1 ? 'is' : ''}
                </span>
              ) : null}
            >
              {selectedCount === 0 ? (
                <div className="mt-2 rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-5 text-center text-sm font-medium text-amber-700">
                  Selecione pelo menos um resíduo para ver os pontos compatíveis.
                </div>
              ) : pointsLoading ? (
                <div className="flex items-center gap-2 p-6 text-sm text-[#1a3a4a]">
                  <Loader2 className="animate-spin" size={18} />
                  Buscando pontos compatíveis...
                </div>
              ) : pointsError ? (
                <InlineAlert variant="error" className="mt-2">
                  {getApiErrorMessage(pointsQueryError, 'Não foi possível carregar os pontos.')}
                </InlineAlert>
              ) : compatiblePoints.length ? (
                <div className="mt-2 flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                  {compatiblePoints.map((point) => {
                    const isSelected = String(point.id) === String(selectedPointId)
                    return (
                      <button
                        key={point.id}
                        type="button"
                        onClick={() => setSelectedPointId(String(point.id))}
                        className={`flex w-full flex-col gap-2 rounded-2xl border-2 p-4 text-left transition-all outline-none ${
                          isSelected
                            ? 'border-[#1F4E79] bg-[#f4f7fa] shadow-sm'
                            : 'border-[var(--color-border)] bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 w-full">
                          <p className={`text-sm font-bold leading-tight ${isSelected ? 'text-[#1F4E79]' : 'text-[#1a3a4a]'}`}>{point.nome}</p>
                          {point.distancia_km != null && (
                            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                              {point.distancia_km.toFixed(1).replace('.', ',')} km
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{point.endereco || 'Endereço não informado'}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(point.tipos_residuos_aceitos || []).map((material) => (
                            <span key={material} className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${isSelected ? 'border-[#1F4E79]/30 bg-[#1F4E79] text-white' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>
                              {formatResidueType(material)}
                            </span>
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-2 rounded-2xl border border-dashed border-rose-300 bg-rose-50 p-5 text-center text-sm font-medium text-rose-700">
                  Nenhum ponto próximo aceita todos os resíduos selecionados. Tente remover algum ou atualizar sua localização.
                </div>
              )}
            </SectionCard>

            {/* ── Bottom-Right: Observação + Pontos ── */}
            <SectionCard title="4. Observação" description="Informações adicionais para a cooperativa (opcional).">
              <textarea
                rows={4}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex.: entrega em fardos, embalagens lavadas..."
                className="mt-2 w-full resize-none rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[#1a3a4a] outline-none focus:border-[#1F4E79]"
              />
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f0faf4] border border-emerald-200/50 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-[#1a3a4a]">Pontos estimados</p>
                  <p className="text-xs text-slate-500">Após confirmação</p>
                </div>
                <span className="text-2xl font-black text-[#2EA44F]">+{totalPoints} <span className="text-sm font-bold">pts</span></span>
              </div>
            </SectionCard>

            {/* ── Botão centralizado embaixo ── */}
            <div className="lg:col-span-2 flex justify-center">
              <LoadingButton
                type="button"
                onClick={handleTransfer}
                disabled={isTransferring || selectedCount === 0 || !selectedPointId}
                isLoading={isTransferring}
                loadingText="Enviando..."
                className="w-full max-w-lg py-4 text-base font-bold shadow-sm"
              >
                <Send size={18} className="mr-2" />
                Confirmar envio para o ponto
              </LoadingButton>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  )
}
