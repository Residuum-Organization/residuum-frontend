import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, MapPin, QrCode, Send } from 'lucide-react'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
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
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => reject(new Error('Não foi possível obter sua localização atual.')),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
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

export default function ValidacaoPresencaPage() {
  const [searchParams] = useSearchParams()
  const [selectedItemId, setSelectedItemId] = useState(searchParams.get('itemId') || '')
  const [selectedPointId, setSelectedPointId] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [observacao, setObservacao] = useState('')
  const [qrToken, setQrToken] = useState(() => getQrTokenFromSearchParams(searchParams))
  const [coords, setCoords] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: inventory = [],
    isLoading: inventoryLoading,
    isError: inventoryError,
    error: inventoryQueryError,
  } = useQuery({
    queryKey: queryKeys.inventory,
    queryFn: () => listInventory(),
    select: (items) =>
      items.filter(
        (item) =>
          item.status !== 'cancelado' && Number(item.quantidade_disponivel ?? item.quantidade ?? 0) > 0
      ),
  })

  useEffect(() => {
    if (!inventory.length) return
    const hasSelectedItem = inventory.some((item) => String(item.id) === String(selectedItemId))
    if (!hasSelectedItem) setSelectedItemId(String(inventory[0].id))
  }, [inventory, selectedItemId])

  const selectedItem = inventory.find((item) => String(item.id) === String(selectedItemId))

  useEffect(() => {
    if (!selectedItem) return
    const availableQuantity = Number(selectedItem.quantidade_disponivel ?? selectedItem.quantidade ?? 1)
    setQuantidade(String(availableQuantity))
  }, [selectedItemId, selectedItem])

  const pointFilters = {}
  if (selectedItem?.tipo_residuo) pointFilters.tipo_residuo = selectedItem.tipo_residuo
  if (coords) {
    pointFilters.lat = coords.lat
    pointFilters.long = coords.lng
  }

  const {
    data: points = [],
    isLoading: pointsLoading,
    isError: pointsError,
    error: pointsQueryError,
  } = useQuery({
    queryKey: queryKeys.collectionPoints(pointFilters),
    queryFn: () => listCollectionPoints(pointFilters),
    enabled: Boolean(selectedItem),
  })

  useEffect(() => {
    if (!points.length) {
      setSelectedPointId('')
      return
    }

    const hasSelectedPoint = points.some((point) => String(point.id) === String(selectedPointId))
    if (!hasSelectedPoint) setSelectedPointId(String(points[0].id))
  }, [points, selectedPointId])

  const selectedPoint = points.find((point) => String(point.id) === String(selectedPointId))

  const transferMutation = useMutation({
    mutationFn: ({ itemId, payload }) => transferInventoryItem(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory })
      queryClient.invalidateQueries({ queryKey: queryKeys.discardHistory })
      navigate('/extrato')
    },
    onError: (error) => {
      setFeedback({ tone: 'error', message: getTransferErrorMessage(error) })
    },
  })

  useEffect(() => {
    const tokenFromUrl = getQrTokenFromSearchParams(searchParams)
    if (tokenFromUrl) setQrToken(tokenFromUrl)
  }, [searchParams])

  const requestLocation = async () => {
    setLocationError('')
    setIsLocating(true)

    try {
      const nextCoords = await getCurrentPosition()
      setCoords(nextCoords)
      return nextCoords
    } catch (error) {
      const message = getApiErrorMessage(error, 'Nao foi possivel validar sua localizacao.')
      setLocationError(message)
      throw error
    } finally {
      setIsLocating(false)
    }
  }

  const handleTransfer = async () => {
    setFeedback(null)

    if (!selectedItem) {
      setFeedback({ tone: 'error', message: 'Selecione um item do estoque para transferir.' })
      return
    }

    if (!selectedPointId) {
      setFeedback({ tone: 'error', message: 'Selecione um ponto de coleta.' })
      return
    }

    if (hasQrTokenQueryParam(searchParams) && !qrToken.trim()) {
      setFeedback({
        tone: 'error',
        message: 'Token QR Code ausente ou vazio. Escaneie novamente ou informe o código manualmente.',
      })
      return
    }

    const quantityNumber = Number(quantidade)
    const availableQuantity = Number(selectedItem.quantidade_disponivel ?? selectedItem.quantidade ?? 0)

    if (!quantityNumber || quantityNumber <= 0) {
      setFeedback({ tone: 'error', message: 'Informe uma quantidade válida para a transferência.' })
      return
    }

    if (quantityNumber > availableQuantity) {
      setFeedback({
        tone: 'error',
          message: `A quantidade disponível para este item é ${formatQuantity(availableQuantity)} kg.`,
      })
      return
    }

    let currentCoords = coords
    if (!qrToken.trim()) {
      try {
        currentCoords = currentCoords || (await requestLocation())
      } catch (_error) {
        return
      }
    }

    transferMutation.mutate({
      itemId: selectedItem.id,
      payload: {
        quantidade: quantityNumber,
        ponto_coleta_id: Number(selectedPointId),
        usuario_lat: currentCoords?.lat ?? 0,
        usuario_long: currentCoords?.lng ?? 0,
        observacao: observacao || undefined,
        qrcode_token: qrToken.trim() || undefined,
      },
    })
  }

  if (inventoryLoading) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
        <LoadingState title="Carregando itens para transferencia..." className="mx-auto mt-10 max-w-md" />
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

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageHeader
            title="Transferir para o ponto"
            description="Escolha o resíduo, escolha o ponto, valide sua presença e confirme a transferência."
          />
          <Button type="button" variant="secondary" onClick={() => navigate('/meu-estoque')} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para estoque
          </Button>
        </div>

        <InlineAlert variant="info">
          A entrega só pode ser confirmada com localização ou QR Code. Os pontos entram apenas depois da confirmação da cooperativa.
        </InlineAlert>

        {feedback ? <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert> : null}

        {!inventory.length ? (
            <EmptyState
              title="Você ainda não tem itens disponíveis."
              description="Cadastre um resíduo no estoque antes de solicitar uma entrega."
              actionLabel="Cadastrar resíduo"
              onAction={() => navigate('/cadastrar-residuo')}
            />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="1. Resíduo">
              <label className="mb-2 block text-sm font-bold text-[#1a3a4a]">Item do estoque</label>
              <select
                value={selectedItemId}
                onChange={(event) => setSelectedItemId(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-base text-[#1a3a4a] outline-none"
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {(item.descricao || formatResidueType(item.tipo_residuo)) +
                      ` | ${formatQuantity(item.quantidade_disponivel ?? item.quantidade)} kg`}
                  </option>
                ))}
              </select>

              {selectedItem ? (
                <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                  <p className="text-sm font-bold text-[#1a3a4a]">
                    {selectedItem.descricao || formatResidueType(selectedItem.tipo_residuo)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">Tipo: {formatResidueType(selectedItem.tipo_residuo)}</p>
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Disponível: {formatQuantity(selectedItem.quantidade_disponivel ?? selectedItem.quantidade)} kg
                  </p>
                </div>
              ) : null}
            </Panel>

            <Panel title="2. Validar presença">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-[#1a3a4a]">Sua localização</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {coords
                      ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                      : 'Use sua localização atual ou informe o QR Code do ponto.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-[#C53030]">
                  <MapPin size={28} />
                </div>
              </div>

              {locationError ? <p className="mt-3 text-xs font-medium text-red-600">{locationError}</p> : null}

              <button
                type="button"
                onClick={requestLocation}
                disabled={isLocating}
                className="mt-4 w-full rounded-2xl border-2 border-[#1F4E79] bg-white py-3 text-sm font-semibold text-[#1F4E79] disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  {isLocating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                  {coords ? 'Atualizar localização' : 'Capturar localização'}
                </span>
              </button>
            </Panel>

            <Panel title="3. Ponto de coleta">
              {pointsLoading ? (
                <div className="flex items-center gap-2 text-sm text-[#1a3a4a]">
                  <Loader2 className="animate-spin" size={16} />
                  Buscando pontos compativeis...
                </div>
              ) : pointsError ? (
                <InlineAlert variant="error">
                  {getApiErrorMessage(pointsQueryError, 'Nao foi possivel carregar os pontos.')}
                </InlineAlert>
              ) : points.length ? (
                <>
                  <select
                    value={selectedPointId}
                    onChange={(event) => setSelectedPointId(event.target.value)}
                    className="min-h-12 w-full rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-base text-[#1a3a4a] outline-none"
                  >
                    {points.map((point) => (
                      <option key={point.id} value={point.id}>
                        {point.nome}
                        {point.distancia_km != null ? ` | ${point.distancia_km.toFixed(1)} km` : ''}
                      </option>
                    ))}
                  </select>

                  {selectedPoint ? (
                    <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                      <p className="text-base font-bold text-[#1a3a4a]">{selectedPoint.nome}</p>
                      <p className="mt-1 text-sm text-gray-500">{selectedPoint.endereco || 'Endereço não informado'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(selectedPoint.tipos_residuos_aceitos || []).map((material) => (
                          <span key={material} className="rounded-full border border-[#1a3a4a] px-3 py-1 text-xs font-medium text-[#1a3a4a]">
                            {formatResidueType(material)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-gray-500">Nenhum ponto disponível foi encontrado para este tipo de resíduo no momento.</p>
              )}
            </Panel>

            <Panel title="4. Confirmar transferência">
              <label className="mb-2 block text-sm font-bold text-[#1a3a4a]">Quantidade a transferir (kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={quantidade}
                onChange={(event) => setQuantidade(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-base text-[#1a3a4a] outline-none"
              />

              <label className="mb-2 mt-4 block text-sm font-bold text-[#1a3a4a]">Observação (opcional)</label>
              <textarea
                rows={3}
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
                placeholder="Ex.: entrega parcial do item"
                className="w-full resize-none rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-base text-[#1a3a4a] outline-none"
              />

              <label className="mb-2 mt-4 block text-sm font-bold text-[#1a3a4a]">Token QR Code (opcional)</label>
              <input
                type="text"
                value={qrToken}
                onChange={(event) => setQrToken(event.target.value)}
                placeholder="Cole o código do QR Code"
                className="min-h-12 w-full rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-base text-[#1a3a4a] outline-none"
              />

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#e8f5e2] px-4 py-3">
                <span className="text-sm font-medium text-green-700">Pontos estimados após confirmação</span>
                <span className="text-sm font-bold text-green-700">
                  +{Math.round(Number(quantidade || 0) * POINTS_PER_KG)} pts
                </span>
              </div>
            </Panel>

            <div className="flex flex-col gap-3 lg:col-span-2">
              <LoadingButton
                type="button"
                onClick={handleTransfer}
                disabled={transferMutation.isPending || !selectedItem || !selectedPointId}
                isLoading={transferMutation.isPending}
                loadingText="Enviando..."
                className="w-full py-4"
              >
                <Send size={18} />
                Enviar para o ponto de coleta
              </LoadingButton>

              <button
                type="button"
                onClick={() => navigate(selectedItemId ? `/escanear-qr?itemId=${selectedItemId}` : '/escanear-qr')}
                className="w-full rounded-2xl border-2 border-[#1F4E79] bg-white py-4 text-sm font-semibold text-[#1F4E79]"
              >
                <span className="inline-flex items-center gap-2">
                  <QrCode size={18} />
                  Usar QR Code como alternativa
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  )
}

function Panel({ title, children }) {
  return (
    <section className="rounded-2xl border border-[#dde1ef] bg-[#f7f9fc] px-5 py-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-[#1F4E79]">{title}</h2>
      {children}
    </section>
  )
}
