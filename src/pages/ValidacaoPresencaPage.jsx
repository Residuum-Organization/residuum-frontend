// src/pages/ValidacaoPresenca.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Navbar from '../components/ui/Navbar'

const DISTANCIA_MAXIMA = 100
const PONTO = {
  nome: 'Ponto Norte',
  endereco: 'Av. Norte, 123',
  materiais: ['Pet', 'Papel', 'Alumínio'],
}

export default function ValidacaoPresenca() {
  const [distancia, setDistancia] = useState(42)
  const [detectando, setDetectando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setDetectando(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const progresso = Math.min((distancia / DISTANCIA_MAXIMA) * 100, 100)
  const proximidade = distancia <= DISTANCIA_MAXIMA

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
      {/* Conteúdo principal */}
      <div className="flex-1 px-5 pt-8 pb-24 overflow-y-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#1a3a4a]">Validação de Presença</h1>
        <p className="text-gray-400 text-sm mt-1">
          {PONTO.nome} — {PONTO.endereco}
        </p>

        {/* Card de localização */}
        <div className="mt-6 bg-[#f0f2f8] border border-[#dde1ef] rounded-2xl px-5 py-6 flex flex-col items-center">
          {/* Ícone de mapa */}
          <div className="mb-3">
            <MapPin size={48} color="#e53935" />
          </div>

          {/* Status de detecção */}
          <p className="text-[#1a3a4a] font-bold text-base mb-3">
            {detectando ? 'Detectando sua localização...' : 'Localização detectada'}
          </p>

          {/* Badge de distância */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-4 ${
              proximidade
                ? 'bg-yellow-400 text-[#1a3a4a]'
                : 'bg-green-500 text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            {proximidade
              ? `A ${distancia} metros — se aproxime mais`
              : 'Você está próximo!'}
          </div>

          {/* Barra de progresso */}
          <div className="w-full">
            <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-gray-400 text-xs text-center">
              {distancia} / {DISTANCIA_MAXIMA} metros
            </p>
          </div>
        </div>

        {/* Card ponto selecionado */}
        <div className="mt-4 bg-[#f0f2f8] border border-[#dde1ef] rounded-2xl px-5 py-4">
          <p className="text-gray-400 text-sm">Ponto selecionado</p>
          <p className="text-[#1a3a4a] font-bold text-base mt-1 mb-3">{PONTO.nome}</p>
          <div className="flex gap-2 flex-wrap">
            {PONTO.materiais.map((material) => (
              <span
                key={material}
                className="border border-[#1a3a4a] text-[#1a3a4a] text-sm px-4 py-1 rounded-full font-medium"
              >
                {material}
              </span>
            ))}
          </div>
        </div>

        {/* Botões */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            className={`w-full py-4 rounded-full font-semibold text-sm transition-all ${
              proximidade
                ? 'bg-[#1e4d6b] text-white opacity-80 cursor-not-allowed'
                : 'bg-[#1e4d6b] text-white'
            }`}
            disabled={proximidade}
          >
            {proximidade ? 'Aguardando proximidade' : 'Validar Presença'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/escanear-qr')}
            className="w-full py-4 rounded-full font-semibold text-sm border-2 border-[#1e4d6b] text-[#1e4d6b] bg-white"
          >
            Usar Qr Code como alternativa
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  )
}
