import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function EscanearQrCodePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const scannerRef = useRef(null)

  const [manualCode, setManualCode] = useState('')
  const [error, setError] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  const itemId = searchParams.get('itemId')
  const pointId = searchParams.get('pointId')

  const goToValidation = async (qrToken) => {
    if (!qrToken) return

    try {
      if (scannerRef.current && isScanning) {
        await scannerRef.current.stop()
        await scannerRef.current.clear()
      }
    } catch (err) {
      console.warn('Scanner já estava parado:', err)
    }

    const params = new URLSearchParams()

    if (itemId) params.set('itemId', itemId)
    if (pointId) params.set('pointId', pointId)
    params.set('qrToken', qrToken)

    navigate(`/validacao-presenca?${params.toString()}`)
  }

  const startScanner = async () => {
    try {
      setError('')

      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          goToValidation(decodedText)
        },
        () => {}
      )

      setIsScanning(true)
    } catch (err) {
      console.error(err)
      setError(
        'Não foi possível abrir a câmera. Use o código manual ou teste em um celular com permissão de câmera.'
      )
      setIsScanning(false)
    }
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current.clear())
          .catch(() => {})
      }
    }
  }, [])

  const handleManualSubmit = (event) => {
    event.preventDefault()
    goToValidation(manualCode.trim())
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <section className="mx-auto max-w-md rounded-3xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">
          Escanear QR Code
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Aponte a câmera para o QR Code do ponto de coleta ou digite o código manualmente.
        </p>

        <button
          type="button"
          onClick={startScanner}
          className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
        >
          Abrir câmera
        </button>

        <div
          id="qr-reader"
          className="mt-5 overflow-hidden rounded-2xl border border-slate-200"
        />

        {isScanning ? (
          <p className="mt-3 text-sm text-emerald-600">
            Câmera ativa. Aguardando leitura do QR Code...
          </p>
        ) : null}

        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleManualSubmit} className="mt-6 space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Código manual
          </label>

          <input
            value={manualCode}
            onChange={(event) => setManualCode(event.target.value)}
            placeholder="Digite ou cole o token do QR Code"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Confirmar código
          </button>
        </form>
      </section>
    </main>
  )
}