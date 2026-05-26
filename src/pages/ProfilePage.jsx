import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Label from '../components/ui/Label'

const profileNavItems = [
  { to: '/welcome-residuum', icon: '🏠', label: 'Início' },
  { to: '/mapa', icon: '📍', label: 'Pontos' },
  { to: '/perfil', icon: '👤', label: 'Perfil' },
]

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="bg-[#F4F7FA] min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Carregando perfil...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-[#F4F7FA] min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Erro ao carregar perfil.</p>
      </div>
    )
  }

  const progressPercent = Math.round((profile.level.points / profile.level.nextLevelPoints) * 100)

  return (
    <div className="bg-[#F4F7FA] min-h-screen flex justify-center py-8 px-4 font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">

        <div className="bg-[#0D2C8B] px-6 pt-8 pb-10 text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <Label className="text-white opacity-70">Painel do usuário</Label>
              <h1 className="text-3xl font-bold mt-1">{profile.name}</h1>
              <p className="text-sm opacity-80 mt-2">membro desde {profile.memberSince}</p>
            </div>
            <Button variant="ghost" className="w-12 h-12 rounded-full flex items-center justify-center text-xl" onClick={() => console.log('Configurações')}>⚙️</Button>
          </div>

          <div className="flex items-center gap-5 mt-8">
            <div className="w-24 h-24 rounded-full bg-white text-[#0D2C8B] flex items-center justify-center text-4xl font-bold shadow-lg">{profile.initials}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <Label className="text-white opacity-80">Nível sustentável</Label>
                <Badge className="bg-[#1FA34A] text-white">{profile.level.tier}</Badge>
              </div>
              <h2 className="text-2xl font-bold mt-2">{profile.level.title}</h2>
              <div className="w-full h-3 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div className="bg-[#1FA34A] h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="flex justify-between text-xs mt-2 opacity-80">
                <span>{profile.level.points.toLocaleString('pt-BR')} pts</span>
                <span>Próximo nível: {profile.level.nextLevelPoints.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 -mt-5">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <Label>Total reciclado</Label>
              <h2 className="text-3xl font-bold text-[#0D2C8B] mt-2">{profile.stats.totalRecycled}</h2>
              <p className="text-[#1FA34A] text-sm mt-2">{profile.stats.recycledThisMonth}</p>
            </Card>
            <Card>
              <Label>Pontuação</Label>
              <h2 className="text-3xl font-bold text-[#0D2C8B] mt-2">{profile.stats.score}</h2>
              <p className="text-[#1FA34A] text-sm mt-2">{profile.stats.scoreGrowth}</p>
            </Card>
          </div>
        </div>

        <div className="px-5 mt-8">
          <h2 className="text-2xl font-bold text-[#0D2C8B] mb-4">Acesso rápido</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate('/mapa')}
              className="p-5 text-left"
            >
              <div className="text-3xl">♻️</div>
              <h3 className="font-bold text-lg mt-4">Pontos de coleta</h3>
              <p className="text-sm opacity-80 mt-1">encontre locais próximos</p>
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/sorteios')}
              className="p-5 text-left"
            >
              <div className="text-3xl">🎁</div>
              <h3 className="font-bold text-lg text-[#0D2C8B] mt-4">Recompensas</h3>
              <p className="text-sm text-gray-500 mt-1">troque seus pontos</p>
            </Button>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-gray-200 px-8 py-4 flex justify-between items-center rounded-t-3xl shadow-2xl">
          {profileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs gap-1 ${
                  isActive ? 'text-[#0D2C8B] font-bold' : 'text-gray-400'
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

      </div>
    </div>
  )
}
