import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { LogOut, Recycle, Gift, ArrowLeft } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Label from '../components/ui/Label'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import InlineAlert from '../components/ui/InlineAlert'
import LoadingButton from '../components/ui/LoadingButton'
import LoadingState from '../components/ui/LoadingState'
import ErrorState from '../components/ui/ErrorState'
import { updateAddress, updateProfile } from '../services/users'
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
  const [form, setForm] = React.useState({ nome: '', email: '', telefone: '', rua: '', bairro: '', numero: '', cep: '', cidade: '' })
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
      rua: profile.endereco?.rua || '',
      bairro: profile.endereco?.bairro || '',
      numero: profile.endereco?.numero || '',
      cep: profile.endereco?.cep || '',
      cidade: profile.endereco?.cidade || '',
    })
  }, [profile])

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      await updateProfile(payload)
      const hasAddress = ['rua', 'bairro', 'numero', 'cep', 'cidade'].some((field) => String(payload[field] || '').trim())
      if (hasAddress) {
        await updateAddress(payload)
      }
    },
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Alterações salvas com sucesso.' })
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser })
    },
    onError: (mutationError) => {
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(mutationError, 'Não foi possível salvar as alterações.'),
      })
    },
  })

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  if (isLoading) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
        <LoadingState title="Carregando perfil..." className="mx-auto mt-10 max-w-md" />
      </RoleShell>
    )
  }

  if (isError) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
        <ErrorState
          title={getApiErrorMessage(error, 'Erro ao carregar perfil.')}
          className="mx-auto mt-10 max-w-md"
        />
      </RoleShell>
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
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Painel do Morador"
          title={profile?.nome || form.nome || 'Meu perfil'}
          description={`Acompanhando desde ${formatDate(memberSince)}`}
          action={
            <div className="grid gap-2 sm:flex">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Voltar
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/inicio')}>
                Início
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
                <Label className="text-white opacity-80">Nível sustentável</Label>
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
                  <span>Próximo nível: {nextLevelPoints.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </section>


        <div className="max-w-2xl">
          <SectionCard title="Editar perfil" description="Confira seus dados e mantenha seu contato atualizado.">
            <div className="space-y-4">
              <Field label="Nome" value={form.nome} onChange={(value) => setForm((current) => ({ ...current, nome: value }))} />
              <Field label="E-mail" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
              <Field label="Telefone" value={form.telefone} onChange={(value) => setForm((current) => ({ ...current, telefone: value }))} />

              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-extrabold text-[var(--color-primary)]">Endereco residencial</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">Usado para manter seu cadastro completo.</p>
              </div>
              <Field label="Rua" value={form.rua} onChange={(value) => setForm((current) => ({ ...current, rua: value }))} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Numero" type="number" value={form.numero} onChange={(value) => setForm((current) => ({ ...current, numero: value }))} />
                <Field label="Bairro" value={form.bairro} onChange={(value) => setForm((current) => ({ ...current, bairro: value }))} />
                <Field label="CEP" value={form.cep} onChange={(value) => setForm((current) => ({ ...current, cep: value }))} />
                <Field label="Cidade" value={form.cidade} onChange={(value) => setForm((current) => ({ ...current, cidade: value }))} />
              </div>

              {feedback ? <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert> : null}

              <LoadingButton
                type="button"
                variant="primary"
                className="w-full py-4"
                isLoading={saveMutation.isPending}
                loadingText="Salvando..."
                onClick={() => saveMutation.mutate(form)}
              >
                  Salvar alterações
              </LoadingButton>
            </div>
          </SectionCard>
        </div>
      </div>
    </RoleShell>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-semibold text-[#1F4E79]">{label}</Label>
      <input
      value={value}
      type={type}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
      />
    </div>
  )
}
