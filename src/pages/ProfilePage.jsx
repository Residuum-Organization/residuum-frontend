import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Label from '../components/ui/Label'
import Navbar from '../components/ui/Navbar'
import { updateProfile } from '../services/users'
import { queryKeys } from '../services/queryKeys'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const getInitials = (name) =>
  String(name || 'RU')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const getNextLevelPoints = (points) => {
  const safePoints = Math.max(Number(points || 0), 0)
  return Math.max(100, Math.ceil((safePoints + 1) / 100) * 100)
}

const getTierLabel = (points) => {
  if (points >= 500) return { tier: 'Elite', title: 'Transformador' }
  if (points >= 250) return { tier: 'Avançado', title: 'Reciclador ativo' }
  if (points >= 100) return { tier: 'Intermediário', title: 'Aliado sustentável' }
  return { tier: 'Inicial', title: 'Primeiros passos' }
}

const formatDate = (value) => {
  if (!value) {
    return 'agora'
  }

  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function ProfilePage() {
  const { data: profile, isLoading, isError, error } = useProfile()
  const [form, setForm] = React.useState({ nome: '', email: '', telefone: '' })
  const [feedback, setFeedback] = React.useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (!profile) {
      return
    }

    setForm({
      nome: profile.nome || profile.usuario?.nome || '',
      email: profile.email || profile.usuario?.email || '',
      telefone: profile.telefone || profile.usuario?.telefone || '',
    })
  }, [profile])

  const saveMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      setFeedback('Alterações salvas com sucesso.')
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser })
    },
    onError: (mutationError) => {
      setFeedback(getApiErrorMessage(mutationError, 'Não foi possível salvar as alterações.'))
    },
  })

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
        <p className="text-red-500 text-lg">{getApiErrorMessage(error, 'Erro ao carregar perfil.')}</p>
      </div>
    )
  }

  const currentPoints = Number(profile?.pontuacao_total || 0)
  const nextLevelPoints = getNextLevelPoints(currentPoints)
  const progressPercent = Math.round((currentPoints / nextLevelPoints) * 100)
  const { tier, title } = getTierLabel(currentPoints)
  const memberSince = profile?.extrato_pontos_resumido?.[0]?.data_evento
  const totalInventoryKg = Number(profile?.resumo?.quantidade_total_inventario || 0)
  const totalItems = Number(profile?.resumo?.total_itens_inventario || 0)
  const pendingDiscards = Number(profile?.resumo?.total_descartes_pendentes || 0)

  return (
    <div className="bg-[#F4F7FA] min-h-screen flex justify-center py-8 px-4 font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 pb-28">
        <div className="bg-[#1F4E79] px-6 pt-8 pb-10 text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <Label className="text-white opacity-70">Painel do usuário</Label>
              <h1 className="text-3xl font-bold mt-1">{profile?.nome || form.nome}</h1>
              <p className="text-sm opacity-80 mt-2">acompanhando desde {formatDate(memberSince)}</p>
            </div>
            <Button variant="ghost" className="w-12 h-12 rounded-full flex items-center justify-center text-xl" onClick={() => navigate('/meu-estoque')}>♻️</Button>
          </div>

          <div className="flex items-center gap-5 mt-8">
            <div className="w-24 h-24 rounded-full bg-white text-[#1F4E79] flex items-center justify-center text-4xl font-bold shadow-lg">
              {getInitials(profile?.nome || form.nome)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <Label className="text-white opacity-80">Nível sustentável</Label>
                <Badge className="bg-[#1FA34A] text-white">{tier}</Badge>
              </div>
              <h2 className="text-2xl font-bold mt-2">{title}</h2>
              <div className="w-full h-3 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div className="bg-[#1FA34A] h-full rounded-full" style={{ width: `${Math.min(progressPercent, 100)}%` }}></div>
              </div>
              <div className="flex justify-between text-xs mt-2 opacity-80">
                <span>{currentPoints.toLocaleString('pt-BR')} pts</span>
                <span>Próximo nível: {nextLevelPoints.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 -mt-5">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <Label>Total no estoque</Label>
              <h2 className="text-3xl font-bold text-[#1F4E79] mt-2">{totalInventoryKg.toLocaleString('pt-BR')} kg</h2>
              <p className="text-[#1FA34A] text-sm mt-2">{totalItems} item(ns) cadastrados</p>
            </Card>
            <Card>
              <Label>Pontuação</Label>
              <h2 className="text-3xl font-bold text-[#1F4E79] mt-2">{currentPoints}</h2>
              <p className="text-[#1FA34A] text-sm mt-2">{pendingDiscards} entrega(s) pendente(s)</p>
            </Card>
          </div>
        </div>

        <div className="px-5 mt-8">
          <h2 className="text-2xl font-bold text-[#1F4E79] mb-4">Editar perfil</h2>
          <div className="space-y-4 rounded-[28px] bg-[#F7FAFB] p-5">
            <Field label="Nome" value={form.nome} onChange={(value) => setForm((current) => ({ ...current, nome: value }))} />
            <Field label="E-mail" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
            <Field label="Telefone" value={form.telefone} onChange={(value) => setForm((current) => ({ ...current, telefone: value }))} />

            {feedback ? <p className="text-sm font-medium text-[#1F4E79]">{feedback}</p> : null}

            <Button
              type="button"
              variant="primary"
              className="w-full py-4"
              onClick={() => saveMutation.mutate(form)}
            >
              {saveMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </div>

        <div className="px-5 mt-8">
          <h2 className="text-2xl font-bold text-[#1F4E79] mb-4">Acesso rápido</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="primary" onClick={() => navigate('/mapa')} className="p-5 text-left">
              <div className="text-3xl">♻️</div>
              <h3 className="font-bold text-lg mt-4">Pontos de coleta</h3>
              <p className="text-sm opacity-80 mt-1">encontre locais próximos</p>
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/sorteios')} className="p-5 text-left">
              <div className="text-3xl">🎁</div>
              <h3 className="font-bold text-lg text-[#1F4E79] mt-4">Recompensas</h3>
              <p className="text-sm text-gray-500 mt-1">acompanhe sorteios e vouchers</p>
            </Button>
          </div>
        </div>

        <Navbar />
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-semibold text-[#1F4E79]">{label}</Label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none"
      />
    </div>
  )
}
