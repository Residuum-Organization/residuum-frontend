// src/pages/MeuEstoque.jsx
import React, { useState } from 'react'
import {
  MapPin,
  RefreshCw,
  Home,
  Barcode,
  Star,
  Trash2,
  Wine,
  CircleDot,
} from 'lucide-react'

const itensIniciais = [
  { id: 1, nome: 'Garrafa Pet 2L', codigo: '7891000053508', quantidade: 2, pontos: 40, tipo: 'garrafa' },
  { id: 2, nome: 'Alumínio 350ml', codigo: '7891000053509', quantidade: 10, pontos: 10, tipo: 'metal' },
  { id: 3, nome: 'Garrafa Pet 1L', codigo: '7891000053508', quantidade: 1, pontos: 20, tipo: 'garrafa' },
  { id: 4, nome: 'Garrafa Pet 500ml', codigo: '7891000053508', quantidade: 3, pontos: 60, tipo: 'garrafa' },
]

const getItemIcon = (tipo) => (tipo === 'metal' ? CircleDot : Wine)

export default function MeuEstoque() {
  const [itens, setItens] = useState(itensIniciais)

  const incrementar = (id) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    )
  }

  const decrementar = (id) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantidade: Math.max(1, item.quantidade - 1) }
          : item
      )
    )
  }

  const remover = (id) => {
    setItens((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
      {/* Conteúdo principal */}
      <div className="flex-1 px-5 pt-8 pb-24 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-[#1a3a4a]">Meu Estoque</h1>
          <span className="bg-[#1e4d6b] text-white text-sm font-semibold px-4 py-2 rounded-full">
            {itens.length} itens
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-6">Cadastre seus resíduos antes de ir ao ponto</p>

        {/* Título seção */}
        <h2 className="text-base font-bold text-[#1a3a4a] mb-4">Itens no estoque</h2>

        {/* Lista de itens */}
        <div className="flex flex-col gap-4">
          {itens.map((item) => (
            <div
              key={item.id}
              className="bg-[#f0f2f8] rounded-2xl px-4 py-4 border border-[#dde1ef]"
            >
              {/* Nome e ícone */}
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-[#1e4d6b] rounded-xl p-2 flex items-center justify-center">
                  {(() => {
                    const ItemIcon = getItemIcon(item.tipo)
                    return <ItemIcon size={24} color="white" />
                  })()}
                </div>
                <div>
                  <p className="font-bold text-[#1a3a4a] text-base leading-tight">{item.nome}</p>
                  <p className="text-gray-400 text-sm">Cód: {item.codigo}</p>
                </div>
              </div>

              {/* Quantidade e pontos */}
              <div className="flex items-center justify-between">
                {/* Controle de quantidade */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrementar(item.id)}
                    className="w-10 h-10 rounded-xl border-2 border-[#1e4d6b] text-[#1e4d6b] text-xl font-bold flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-lg font-bold text-[#1a3a4a] w-6 text-center">
                    {item.quantidade}
                  </span>
                  <button
                    onClick={() => incrementar(item.id)}
                    className="w-10 h-10 rounded-xl bg-[#1e4d6b] text-white text-xl font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Pontos e lixeira */}
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => remover(item.id)}
                    className="text-[#1e4d6b] mb-1"
                  >
                    <Trash2 size={20} />
                  </button>
                  <span className="text-green-600 font-bold text-sm">+{item.pontos} pts</span>
                  <span className="text-gray-400 text-xs">ao entregar</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Adicionar Resíduo */}
        <button className="w-full bg-[#1e4d6b] text-white font-semibold py-4 rounded-full text-sm mt-6">
          Adicionar Resíduo
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-[#1e4d6b] flex justify-around items-center py-4 px-6">
        <button className="text-white"><MapPin size={22} /></button>
        <button className="text-white"><RefreshCw size={22} /></button>
        <button className="text-white"><Home size={22} /></button>
        <button className="text-white"><Barcode size={22} /></button>
        <button className="text-white"><Star size={22} /></button>
      </nav>
    </div>
  )
}
