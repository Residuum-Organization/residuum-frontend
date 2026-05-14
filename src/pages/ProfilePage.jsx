import React from 'react'

export default function ProfilePage() {
  return (
    <div className="bg-[#F4F7FA] min-h-screen flex justify-center py-8 px-4 font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">

        <div className="bg-[#0D2C8B] px-6 pt-8 pb-10 text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-70">Painel do usuário</p>
              <h1 className="text-3xl font-bold mt-1">João Victor</h1>
              <p className="text-sm opacity-80 mt-2">membro desde 2026</p>
            </div>
            <button onClick={() => console.log('Configurações')} className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center text-xl">⚙️</button>
          </div>

          <div className="flex items-center gap-5 mt-8">
            <div className="w-24 h-24 rounded-full bg-white text-[#0D2C8B] flex items-center justify-center text-4xl font-bold shadow-lg">JV</div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-sm opacity-80">Nível sustentável</p>
                <span className="bg-[#1FA34A] text-white text-xs px-3 py-1 rounded-full">Platinum</span>
              </div>
              <h2 className="text-2xl font-bold mt-2">Eco Guardian</h2>
              <div className="w-full h-3 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div className="bg-[#1FA34A] h-full w-[72%] rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs mt-2 opacity-80">
                <span>2.847 pts</span>
                <span>Próximo nível: 4.000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 -mt-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl shadow-lg p-5 border border-gray-100">
              <p className="text-gray-500 text-sm">Total reciclado</p>
              <h2 className="text-3xl font-bold text-[#0D2C8B] mt-2">35kg</h2>
              <p className="text-[#1FA34A] text-sm mt-2">+8kg este mês</p>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-5 border border-gray-100">
              <p className="text-gray-500 text-sm">Pontuação</p>
              <h2 className="text-3xl font-bold text-[#0D2C8B] mt-2">2.847</h2>
              <p className="text-[#1FA34A] text-sm mt-2">+12% crescimento</p>
            </div>
          </div>
        </div>

        <div className="px-5 mt-8">
          <h2 className="text-2xl font-bold text-[#0D2C8B] mb-4">Acesso rápido</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-[#0D2C8B] text-white rounded-3xl p-5 text-left shadow-lg">
              <div className="text-3xl">♻️</div>
              <h3 className="font-bold text-lg mt-4">Pontos de coleta</h3>
              <p className="text-sm opacity-80 mt-1">encontre locais próximos</p>
            </button>
            <button className="bg-white border border-gray-100 rounded-3xl p-5 text-left shadow-md">
              <div className="text-3xl">🎁</div>
              <h3 className="font-bold text-lg text-[#0D2C8B] mt-4">Recompensas</h3>
              <p className="text-sm text-gray-500 mt-1">troque seus pontos</p>
            </button>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-gray-200 px-8 py-4 flex justify-between items-center rounded-t-3xl shadow-2xl">
          <button className="flex flex-col items-center text-gray-400 text-xs gap-1"><span className="text-2xl">🏠</span>Início</button>
          <button className="flex flex-col items-center text-gray-400 text-xs gap-1"><span className="text-2xl">📍</span>Pontos</button>
          <button className="flex flex-col items-center text-[#0D2C8B] text-xs gap-1 font-bold"><span className="text-2xl">👤</span>Perfil</button>
        </div>

      </div>
    </div>
  )
}
