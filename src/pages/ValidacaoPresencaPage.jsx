import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, MapPin, QrCode, Send } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
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

export default function ValidacaoPresencaPage() {
  const [searchParams] = useSearchParams()
  const [selectedItemId, setSelectedItemId] = useState(searchParams.get('itemId') || '')
  const [selectedPointId, setSelectedPointId] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [observacao, setObservacao] = useState('')
  const [qrToken, setQrToken] = useState('')
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
    if (!inventory.length) {
      return
    }

    const hasSelectedItem = inventory.some((item) => String(item.id) === String(selectedItemId))

    if (!hasSelectedItem) {
      setSelectedItemId(String(inventory[0].id))
    }
  }, [inventory, selectedItemId])

  const selectedItem = inventory.find((item) => String(item.id) === String(selectedItemId))

  useEffect(() => {
    if (!selectedItem) {
      return
    }

    const availableQuantity = Number(selectedItem.quantidade_disponivel ?? selectedItem.quantidade ?? 1)
    setQuantidade(String(availableQuantity))
  }, [selectedItemId, selectedItem])

  const pointFilters = {}

  if (selectedItem?.tipo_residuo) {
    pointFilters.tipo_residuo = selectedItem.tipo_residuo
  }

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

    if (!hasSelectedPoint) {
      setSelectedPointId(String(points[0].id))
    }
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
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(error, 'Não foi possível enviar o item para o ponto.'),
      })
    },
  })

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

    if (!selectedItem) {
      setFeedback({ tone: 'error', message: 'Selecione um item do estoque para transferir.' })
      return
    }

    if (!selectedPointId) {
      setFeedback({ tone: 'error', message: 'Selecione um ponto de coleta.' })
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
      <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
        <div className="flex-1 px-5 pt-8 pb-24 flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#1a3a4a]">
            <Loader2 className="animate-spin" size={20} />
            <span>Carregando itens para transferência...</span>
          </div>
        </div>
        <Navbar />
      </div>
    )
  }

  if (inventoryError) {
    return (
      <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
        <div className="flex-1 px-5 pt-8 pb-24">
          <h1 className="text-2xl font-bold text-[#1a3a4a] mb-3">Transferir para o ponto</h1>
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {getApiErrorMessage(inventoryQueryError, 'Não foi possível carregar o estoque disponível.')}
          </div>
        </div>
        <Navbar />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
      <div className="flex-1 px-5 pt-8 pb-24 overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#1a3a4a]">Transferir para o ponto</h1>
        <p className="text-gray-400 text-sm mt-1">
          Selecione o item, valide sua posição e envie sua solicitação ao ponto de coleta.
        </p>

        {feedback ? (
          <div
            className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium ${
              feedback.tone === 'error'
                ? 'border border-red-200 bg-red-50 text-red-700'
                : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        {!inventory.length ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#c8d2e3] bg-[#f7f9fc] px-5 py-8 text-center">
            <p className="text-[#1a3a4a] font-semibold">Você ainda não tem itens disponíveis.</p>
            <p className="text-sm text-gray-400 mt-2 mb-5">
              Cadastre um resíduo no estoque antes de solicitar uma entrega.
            </p>
            <button
              type="button"
              onClick={() => navigate('/cadastrar-residuo')}
              className="w-full rounded-full bg-[#1e4d6b] py-4 text-sm font-semibold text-white"
            >
              Cadastrar resíduo
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-2xl border border-[#dde1ef] bg-[#f0f2f8] px-5 py-5">
              <label className="block text-sm font-bold text-[#1a3a4a] mb-2">Item do estoque</label>
              <select
                value={selectedItemId}
                onChange={(event) => setSelectedItemId(event.target.value)}
                className="w-full rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-sm text-[#1a3a4a] outline-none"
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {(item.descricao || formatResidueType(item.tipo_residuo)) +
                      ` • ${formatQuantity(item.quantidade_disponivel ?? item.quantidade)} kg`}
                  </option>
                ))}
              </select>

              {selectedItem ? (
                <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                  <p className="text-sm font-bold text-[#1a3a4a]">
                    {selectedItem.descricao || formatResidueType(selectedItem.tipo_residuo)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Tipo: {formatResidueType(selectedItem.tipo_residuo)}
                  </p>
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Disponível: {formatQuantity(selectedItem.quantidade_disponivel ?? selectedItem.quantidade)} kg
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border border-[#dde1ef] bg-[#f0f2f8] px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[#1a3a4a] font-bold text-base">Sua localização</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {coords
                      ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                      : 'Use sua localização atual para validar a transferência.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-[#e53935]">
                  <MapPin size={28} />
                </div>
              </div>

              {locationError ? (
                <p className="mt-3 text-xs font-medium text-red-600">{locationError}</p>
              ) : null}

              <button
                type="button"
                onClick={requestLocation}
                disabled={isLocating}
                className="mt-4 w-full rounded-full border-2 border-[#1e4d6b] bg-white py-3 text-sm font-semibold text-[#1e4d6b] disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  {isLocating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                  {coords ? 'Atualizar localização' : 'Capturar localização'}
                </span>
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-[#dde1ef] bg-[#f0f2f8] px-5 py-5">
              <label className="block text-sm font-bold text-[#1a3a4a] mb-2">Ponto de coleta</label>
              {pointsLoading ? (
                <div className="flex items-center gap-2 text-sm text-[#1a3a4a]">
                  <Loader2 className="animate-spin" size={16} />
                  Buscando pontos compatíveis...
                </div>
              ) : pointsError ? (
                <p className="text-sm text-red-600">
                  {getApiErrorMessage(pointsQueryError, 'Não foi possível carregar os pontos.')}
                </p>
              ) : points.length ? (
                <>
                  <select
                    value={selectedPointId}
                    onChange={(event) => setSelectedPointId(event.target.value)}
                    className="w-full rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-sm text-[#1a3a4a] outline-none"
                  >
                    {points.map((point) => (
                      <option key={point.id} value={point.id}>
                        {point.nome}
                        {point.distancia_km != null ? ` • ${point.distancia_km.toFixed(1)} km` : ''}
                      </option>
                    ))}
                  </select>

                  {selectedPoint ? (
                    <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                      <p className="text-[#1a3a4a] font-bold text-base">{selectedPoint.nome}</p>
                      <p className="text-sm text-gray-500 mt-1">{selectedPoint.endereco || 'Endereço não informado'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(selectedPoint.tipos_residuos_aceitos || []).map((material) => (
                          <span
                            key={material}
                            className="rounded-full border border-[#1a3a4a] px-3 py-1 text-xs font-medium text-[#1a3a4a]"
                          >
                            {formatResidueType(material)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhum ponto disponível foi encontrado para este tipo de resíduo no momento.
                </p>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-[#dde1ef] bg-[#f0f2f8] px-5 py-5">
              <label className="block text-sm font-bold text-[#1a3a4a] mb-2">Quantidade a transferir (kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={quantidade}
                onChange={(event) => setQuantidade(event.target.value)}
                className="w-full rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-sm text-[#1a3a4a] outline-none"
              />

              <label className="block text-sm font-bold text-[#1a3a4a] mt-4 mb-2">Observação (opcional)</label>
              <textarea
                rows={3}
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
                placeholder="Ex.: entrega parcial do item"
                className="w-full rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-sm text-[#1a3a4a] outline-none resize-none"
              />

              <label className="block text-sm font-bold text-[#1a3a4a] mt-4 mb-2">
                Token QR Code (opcional)
              </label>
              <input
                type="text"
                value={qrToken}
                onChange={(event) => setQrToken(event.target.value)}
                placeholder="Cole o token gerado no ponto"
                className="w-full rounded-2xl border border-[#c8d2e3] bg-white px-4 py-3 text-sm text-[#1a3a4a] outline-none"
              />

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#e8f5e2] px-4 py-3">
                <span className="text-sm text-green-700 font-medium">Pontos estimados ao confirmar</span>
                <span className="text-sm text-green-700 font-bold">
                  +{Math.round(Number(quantidade || 0) * POINTS_PER_KG)} pts
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleTransfer}
                disabled={transferMutation.isPending || !selectedItem || !selectedPointId}
                className="w-full rounded-full bg-[#1e4d6b] py-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="inline-flex items-center gap-2">
                  {transferMutation.isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  {transferMutation.isPending ? 'Enviando...' : 'Enviar para o ponto de coleta'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    selectedItemId ? `/escanear-qr?itemId=${selectedItemId}` : '/escanear-qr'
                  )
                }
                className="w-full rounded-full border-2 border-[#1e4d6b] bg-white py-4 text-sm font-semibold text-[#1e4d6b]"
              >
                <span className="inline-flex items-center gap-2">
                  <QrCode size={18} />
                  Usar QR Code como alternativa
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      <Navbar />
    </div>
  )
}
