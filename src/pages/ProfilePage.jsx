import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { LogOut, Recycle, Gift } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Label from '../components/ui/Label'
import Navbar from '../components/ui/Navbar'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import InlineAlert from '../components/ui/InlineAlert'
import RoleEnvironmentBanner from '../components/layout/RoleEnvironmentBanner'
import LoadingButton from '../components/ui/LoadingButton'
import LoadingState from '../components/ui/LoadingState'
import ErrorState from '../components/ui/ErrorState'
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
  if (points >= 250) return { tier: 'Avancado', title: 'Reciclador ativo' }
  if (points >= 100) return { tier: 'Intermediario', title: 'Aliado sustentavel' }
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
  const [feedback, setFeedback] = React.useState(null)
  const navigate = useNavigate()
  const { logout } = useAuth()
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
      setFeedback({ tone: 'success', message: 'Alteracoes salvas com sucesso.' })
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser })
    },
    onError: (mutationError) => {
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(mutationError, 'Nao foi possivel salvar as alteracoes.'),
      })
    },
  })

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  if (isLoading) {
    return (
      <PageContainer className="bg-[var(--color-surface)]" innerClassName="pb-24">
        <LoadingState title="Carregando perfil..." className="mx-auto mt-10 max-w-md" />
        <Navbar />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer className="bg-[var(--color-surface)]" innerClassName="pb-24">
        <ErrorState
          title={getApiErrorMessage(error, 'Erro ao carregar perfil.')}
          className="mx-auto mt-10 max-w-md"
        />
        <Navbar />
      </PageContainer>
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
    <PageContainer className="bg-[var(--color-surface)] font-sans" innerClassName="pb-28">
      <div className="space-y-6">
        <RoleEnvironmentBanner variant="morador" />

        <PageHeader
          eyebrow="Painel do morador / gerador"
          title={profile?.nome || form.nome || 'Meu perfil'}
          description={`Acompanhando desde ${formatDate(memberSince)}`}
          action={
            <div className="grid gap-2 sm:flex">
              <Button type="button" variant="secondary" onClick={() => navigate('/inicio')}>
                Inicio
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/meu-estoque')}>
                Ver estoque
              </Button>
              <Button type="button" variant="danger" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sair
              </Button>
            </div>
          }
        />

        <section className="rounded-2xl bg-[#1F4E79] p-5 text-white shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-[#1F4E79] shadow-lg sm:h-24 sm:w-24 sm:text-4xl">
              {getInitials(profile?.nome || form.nome)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label className="text-white opacity-80">Nivel sustentavel</Label>
                <Badge className="bg-[#1FA34A] text-white">{tier}</Badge>
              </div>
              <h2 className="mt-2 text-2xl font-bold">{title}</h2>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#1FA34A]"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between gap-3 text-xs opacity-85">
                <span>{currentPoints.toLocaleString('pt-BR')} pts</span>
                <span>Proximo nivel: {nextLevelPoints.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <Label>Total no estoque</Label>
            <h2 className="mt-2 text-3xl font-bold text-[#1F4E79]">
              {totalInventoryKg.toLocaleString('pt-BR')} kg
            </h2>
            <p className="mt-2 text-sm text-[#1FA34A]">{totalItems} item(ns) cadastrados</p>
          </Card>
          <Card>
            <Label>Pontuacao</Label>
            <h2 className="mt-2 text-3xl font-bold text-[#1F4E79]">{currentPoints}</h2>
            <p className="mt-2 text-sm text-[#1FA34A]">{pendingDiscards} entrega(s) pendente(s)</p>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <SectionCard title="Editar perfil" description="Confira seus dados e mantenha seu contato atualizado.">
            <div className="space-y-4">
              <Field label="Nome" value={form.nome} onChange={(value) => setForm((current) => ({ ...current, nome: value }))} />
              <Field label="E-mail" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
              <Field label="Telefone" value={form.telefone} onChange={(value) => setForm((current) => ({ ...current, telefone: value }))} />

              {feedback ? <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert> : null}

              <LoadingButton
                type="button"
                variant="primary"
                className="w-full py-4"
                isLoading={saveMutation.isPending}
                loadingText="Salvando..."
                onClick={() => saveMutation.mutate(form)}
              >
                Salvar alteracoes
              </LoadingButton>
            </div>
          </SectionCard>

          <SectionCard title="Acesso rapido" description="Atalhos para continuar seu fluxo.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Button type="button" variant="primary" onClick={() => navigate('/mapa')} className="justify-start p-5 text-left">
                <Recycle className="h-7 w-7 shrink-0" aria-hidden="true" />
                <div className="ml-3">
                  <h3 className="text-base font-bold">Pontos de coleta</h3>
                  <p className="text-sm opacity-80">Encontre locais proximos</p>
                </div>
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/sorteios')} className="justify-start p-5 text-left">
                <Gift className="h-7 w-7 shrink-0" aria-hidden="true" />
                <div className="ml-3">
                  <h3 className="text-base font-bold text-[#1F4E79]">Recompensas</h3>
                  <p className="text-sm text-gray-500">Acompanhe sorteios e vouchers</p>
                </div>
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
      <Navbar />
    </PageContainer>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-semibold text-[#1F4E79]">{label}</Label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
      />
    </div>
  )
}
