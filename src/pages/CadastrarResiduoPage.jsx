// src/pages/CadastrarResiduo.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  MapPin,
  RefreshCw,
  Home,
  Barcode,
  Star,
  CircleDot,
  BookText,
  Wine,
  FlaskConical,
} from 'lucide-react'

const schema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  observacao: z.string().optional(),
})

const tiposResiduo = [
  { id: 'plastico', label: 'Plastico', icon: <FlaskConical size={22} /> },
  { id: 'metal', label: 'Metal', icon: <CircleDot size={22} /> },
  { id: 'papel', label: 'Papel', icon: <BookText size={22} /> },
  { id: 'vidro', label: 'Vidro', icon: <Wine size={22} /> },
]

export default function CadastrarResiduo() {
  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [quantidade, setQuantidade] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    console.log({ ...data, tipo: tipoSelecionado, quantidade })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">
      {/* Conteúdo principal */}
      <div className="flex-1 px-5 pt-8 pb-4 overflow-y-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#1a3a4a]">Cadastrar Residuo</h1>
        <p className="text-gray-400 text-sm mt-1">Descreva o resíduo que vai descartar</p>

        {/* Tipos de Resíduo */}
        <div className="mt-6">
          <h2 className="text-base font-bold text-[#1a3a4a] mb-3">Tipos de Residuo</h2>
          <div className="grid grid-cols-2 gap-3">
            {tiposResiduo.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => setTipoSelecionado(tipo.id)}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-white transition-all
                  ${tipoSelecionado === tipo.id ? 'bg-[#1a3a4a] ring-2 ring-[#1a3a4a]' : 'bg-[#1e4d6b]'}
                `}
              >
                {tipo.icon}
                {tipo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
          {/* Descrição */}
          <div>
            <label className="block text-sm font-bold text-[#1a3a4a] mb-2">
              Descrição do Item
            </label>
            <input
              {...register('descricao')}
              placeholder="Ex : Garrafa PET 2L"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-400 placeholder-gray-300 outline-none focus:border-[#1e4d6b]"
            />
            {errors.descricao && (
              <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>
            )}
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-bold text-[#1a3a4a] mb-3">Quantidade</label>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="w-12 h-12 rounded-xl border-2 border-[#1e4d6b] text-[#1e4d6b] text-2xl font-bold flex items-center justify-center"
              >
                −
              </button>
              <span className="text-2xl font-bold text-[#1a3a4a]">{quantidade}</span>
              <button
                type="button"
                onClick={() => setQuantidade((q) => q + 1)}
                className="w-12 h-12 rounded-xl bg-[#1e4d6b] text-white text-2xl font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Observação */}
          <div>
            <label className="block text-sm font-bold text-[#1a3a4a] mb-2">
              Observação (Opcional)
            </label>
            <textarea
              {...register('observacao')}
              placeholder="Ex : Embalagem sem rotulo"
              rows={3}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-400 placeholder-gray-300 outline-none focus:border-[#1e4d6b] resize-none"
            />
          </div>

          {/* Pontos estimados */}
          <div className="flex items-center justify-between bg-[#e8f5e2] rounded-2xl px-4 py-3">
            <span className="text-sm text-green-700 font-medium">Pontos estimados ao entregar</span>
            <span className="text-sm text-green-700 font-bold">+20 pts</span>
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-[#1e4d6b] text-white font-semibold py-4 rounded-full text-sm"
          >
            Adicionar ao estoque
          </button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-[#1e4d6b] flex justify-around items-center py-4 px-6">
        <button className="text-white"><MapPin size={22} /></button>
        <button className="text-white"><RefreshCw size={22} /></button>
        <button className="text-white"><Home size={22} /></button>
        <button className="text-white"><Barcode size={22} /></button>
        <button className="text-white"><Star size={22} /></button>
      </nav>
    </div>
  )
}
