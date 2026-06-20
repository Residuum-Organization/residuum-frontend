// src/pages/EscanearQrCode.jsx
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Navbar from '../components/ui/Navbar'

export default function EscanearQrCode() {
  const [lido, setLido] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const itemId = searchParams.get('itemId')

  const simularLeitura = () => {
    setLido(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
      {/* Conteúdo principal */}
      <div className="flex-1 px-5 pt-8 pb-24 overflow-y-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#1a3a4a] mb-6">Escanear Qr Code</h1>

        {/* Área da câmera */}
        <div
          className="w-full bg-[#0d1b2e] rounded-2xl flex flex-col items-center justify-center py-10 px-6 cursor-pointer"
          onClick={simularLeitura}
        >
          {/* Quadro de escaneamento */}
          <div className="relative w-44 h-44 mb-6">
            {/* Cantos do quadro */}
            <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
            <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
            <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
            <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />

            {/* QR Code mockado no centro */}
            {lido && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/QR_CODE.png"
                  alt="QR Code"
                  className="w-32 h-32 object-contain opacity-80"
                />
              </div>
            )}
          </div>

          <p className="text-gray-300 text-sm text-center">
            Aponte para o QR Code exibido no ponto
          </p>
        </div>

        {/* Card de sucesso */}
        {lido && (
          <div className="mt-4 flex items-center gap-3 border border-green-400 rounded-2xl px-4 py-4 bg-white">
            <CheckCircle size={28} className="text-green-500 flex-shrink-0" />
            <div>
              <p className="text-green-600 font-bold text-sm">QR Code lido com sucesso!</p>
              <p className="text-gray-400 text-sm">Ponto Norte — Av. Norte, 123</p>
            </div>
          </div>
        )}

        {/* Botão confirmar */}
        <button
          onClick={() =>
            navigate(itemId ? `/validacao-presenca?itemId=${itemId}` : '/validacao-presenca')
          }
          disabled={!lido}
          className={`w-full mt-6 py-4 rounded-full font-semibold text-sm transition-all ${
            lido
              ? 'bg-[#1e4d6b] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Confirmar presença
        </button>

        {/* Instrução */}
        {!lido && (
          <p className="text-center text-gray-400 text-xs mt-3">
            Toque na câmera para simular a leitura
          </p>
        )}
      </div>

      <Navbar />
    </div>
  )
}
