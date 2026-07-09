import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Camera, QrCode } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import InlineAlert from '../components/ui/InlineAlert'
import Button from '../components/ui/Button'
import Navbar from '../components/ui/Navbar'

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
      console.warn('Scanner ja estava parado:', err)
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
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          goToValidation(decodedText)
        },
        () => {}
      )

      setIsScanning(true)
    } catch (err) {
      console.error(err)
      setError('Nao foi possivel abrir a camera. Use o codigo manual ou teste em um celular com permissao de camera.')
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
    <PageContainer innerClassName="pb-28">
      <div className="space-y-6">
        <PageHeader
          title="Escanear QR Code"
          description="Aponte a camera para o QR Code do ponto ou digite o codigo manualmente."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <SectionCard title="Leitura pela camera" description="Use em um celular e permita acesso a camera quando o navegador pedir.">
            <Button type="button" onClick={startScanner} className="w-full py-4">
              <Camera className="mr-2 h-5 w-5" aria-hidden="true" />
              Abrir camera
            </Button>

            <div id="qr-reader" className="mt-5 min-h-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50" />

            {isScanning ? (
              <InlineAlert variant="success" className="mt-4">
                Camera ativa. Mantenha o QR Code dentro do quadro.
              </InlineAlert>
            ) : null}

            {error ? (
              <InlineAlert variant="error" className="mt-4">
                {error}
              </InlineAlert>
            ) : null}
          </SectionCard>

          <SectionCard title="Codigo manual" description="Se a camera nao abrir, digite ou cole o codigo do QR Code.">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <label className="block text-sm font-semibold text-[#1F4E79]">Codigo do QR Code</label>
              <input
                value={manualCode}
                onChange={(event) => setManualCode(event.target.value)}
                placeholder="Digite ou cole o token"
                className="min-h-12 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#1F4E79]"
              />
              <Button type="submit" className="w-full py-4" disabled={!manualCode.trim()}>
                <QrCode className="mr-2 h-5 w-5" aria-hidden="true" />
                Confirmar codigo
              </Button>
            </form>

            <InlineAlert variant="info" className="mt-5">
              Depois da leitura, voce voltara para a tela de validação para revisar e confirmar a transferencia.
            </InlineAlert>
          </SectionCard>
        </div>
      </div>
      <Navbar />
    </PageContainer>
  )
}
