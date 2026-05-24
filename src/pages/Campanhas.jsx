// src/pages/Campanhas.jsx
import { useState } from 'react'
import { MapPin, Home, Briefcase, User, ArrowRight } from 'lucide-react'
import { Icon } from '@iconify/react'

const campanhasAtivas = [
  {
    id: 1,
    nome: 'Campanha Heineken',
    status: 'Ativa',
    statusColor: 'bg-green-100 text-green-700 border border-green-400',
    periodo: '01/04/2026 - 30/04/2026',
    pontos: 'Norte, Sul e Leste',
    descricao: 'Desconto garrafas PET e concorra a prêmios',
    progresso: 67,
    logo: 'logos:heineken',
    logoBg: 'bg-green-700',
  },
  {
    id: 2,
    nome: 'Campanha Coca-Cola',
    status: 'Planejada',
    statusColor: 'bg-orange-100 text-orange-600 border border-orange-400',
    periodo: '01/05/2026 - 30/05/2026',
    pontos: 'Todos os pontos',
    descricao: null,
    progresso: null,
    logo: 'logos:coca-cola',
    logoBg: 'bg-red-600',
  },
]

export default function Campanhas() {
  const [abaSelecionada, setAbaSelecionada] = useState('ativas')

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
      <div className="flex-1 px-5 pt-8 pb-24 overflow-y-auto">

        {/* Header */}
<div className="flex items-center justify-between mb-1">
  <div>
    <h1 className="text-2xl font-bold text-[#1a3a4a]">Campanhas</h1>
    <p className="text-gray-500 text-sm mt-0.5">Gerencie promoções e engajamento</p>
  </div>
  <div className="flex-shrink-0">
    <img
      src="/logo-empresa.png"
      alt="Logo empresa"
      className="w-12 h-12 object-contain"
    />
  </div>
</div>

        {/* Tabs */}
        <div className="flex gap-2 mt-5 mb-4">
          <button
            onClick={() => setAbaSelecionada('ativas')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              abaSelecionada === 'ativas'
                ? 'bg-[#1a3a4a] text-white border-[#1a3a4a]'
                : 'bg-white text-[#1a3a4a] border-[#1a3a4a]'
            }`}
          >
            Ativas
          </button>
          <button
            onClick={() => setAbaSelecionada('encerradas')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              abaSelecionada === 'encerradas'
                ? 'bg-[#1a3a4a] text-white border-[#1a3a4a]'
                : 'bg-white text-[#1a3a4a] border-[#1a3a4a]'
            }`}
          >
            Encerradas
          </button>
        </div>

        {/* Lista ativas */}
        {abaSelecionada === 'ativas' && (
          <div className="flex flex-col gap-4">
            {campanhasAtivas.map((campanha) => (
              <div
                key={campanha.id}
                className="border border-gray-200 rounded-2xl px-4 py-4 bg-white"
              >
                {/* Nome e status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#1a3a4a] font-bold text-base">{campanha.nome}</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${campanha.statusColor}`}>
                    {campanha.status}
                  </span>
                </div>

                {/* Logo circular + infos */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-14 h-14 rounded-full ${campanha.logoBg} flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md`}
                  >
                    <Icon icon={campanha.logo} width={44} height={44} />
                  </div>
                  <div className="flex flex-col gap-1 justify-center h-14">
                    <span className="text-gray-500 text-sm">{campanha.periodo}</span>
                    <div className="flex items-center gap-1 text-[#e53935] text-sm font-medium">
                      <MapPin size={14} />
                      {campanha.pontos}
                    </div>
                  </div>
                </div>

                {/* Barra de progresso */}
                {campanha.progresso !== null && (
                  <div className="mt-2">
                    <div className="bg-[#f0f2f8] rounded-xl px-3 py-2">
                      <p className="text-[#1a3a4a] text-xs font-medium mb-2">
                        {campanha.descricao}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${campanha.progresso}%` }}
                        />
                      </div>
                      <p className="text-gray-400 text-xs text-right">
                        {campanha.progresso}% do período concluído
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Card encerradas vazio */}
            <div className="border border-gray-200 rounded-2xl px-4 py-5 bg-white flex items-center gap-4">
              <div className="bg-[#f0f2f8] rounded-xl p-3">
                <Icon icon="mdi:gift-outline" width={32} color="#1a3a4a" />
              </div>
              <div>
                <p className="text-[#1a3a4a] font-bold text-sm">Nenhuma campanha encerrada</p>
                <p className="text-gray-400 text-xs mt-0.5">Campanhas finalizadas aparecerão aqui</p>
              </div>
            </div>
          </div>
        )}

        {/* Aba encerradas */}
        {abaSelecionada === 'encerradas' && (
          <div className="border border-gray-200 rounded-2xl px-4 py-5 bg-white flex items-center gap-4">
            <div className="bg-[#f0f2f8] rounded-xl p-3">
              <Icon icon="mdi:gift-outline" width={32} color="#1a3a4a" />
            </div>
            <div>
              <p className="text-[#1a3a4a] font-bold text-sm">Nenhuma campanha encerrada</p>
              <p className="text-gray-400 text-xs mt-0.5">Campanhas finalizadas aparecerão aqui</p>
            </div>
          </div>
        )}

        {/* Divisor */}
        <div className="border-t border-gray-200 mt-6 mb-6" />

        {/* Nova Campanha sugerida */}
        <div>
          <h2 className="text-xl font-bold text-[#1a3a4a]">Nova Campanha sugerida</h2>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Crie uma nova campanha de patrocínio em poucos passos
          </p>

          <div className="border border-gray-200 rounded-2xl px-4 py-5 bg-white flex items-start gap-4 relative">
            <div className="bg-[#f0f2f8] rounded-xl p-3 flex-shrink-0">
              <Icon icon="mdi:book-open-page-variant" width={40} color="#1a3a4a" />
            </div>
            <div className="flex-1">
              <p className="text-[#1a3a4a] font-bold text-base mb-1">Crie uma nova campanha</p>
              <p className="text-gray-400 text-sm leading-snug">
                Preencha as informações da empresa parceira, período, tipos de resíduos e premiação
              </p>
            </div>
            <button className="absolute bottom-4 right-4 bg-[#1a3a4a] rounded-full p-2">
              <ArrowRight size={18} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-[#1e4d6b] flex justify-around items-center py-4 px-6">
        <button className="text-white"><Home size={22} /></button>
        <button className="text-white"><Briefcase size={22} /></button>
        <button className="text-white"><MapPin size={22} /></button>
        <button className="text-white"><User size={22} /></button>
      </nav>
    </div>
  )
}