import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import Label from '../components/ui/Label'
import RoleShell from '../components/layout/RoleShell'
import PageHeader from '../components/ui/PageHeader'
import SectionCard from '../components/ui/SectionCard'
import LoadingState from '../components/ui/LoadingState'
import ErrorState from '../components/ui/ErrorState'
import { getApiErrorMessage } from '../services/http/getApiErrorMessage'

const getNextLevelPoints = (points) => {
  const safePoints = Math.max(Number(points || 0), 0)
  return Math.max(100, Math.ceil((safePoints + 1) / 100) * 100)
}

const getTierLabel = (points) => {
  if (points >= 500) return { title: 'Transformador' }
  if (points >= 250) return { title: 'Reciclador ativo' }
  if (points >= 100) return { title: 'Aliado sustentável' }
  return { title: 'Primeiros passos' }
}

export default function ProfilePage() {
  const { data: profile, isLoading, isError, error } = useProfile()
  const navigate = useNavigate()

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
  const { title } = getTierLabel(currentPoints)

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-[#1F4E79]">Perfil</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/configuracoes')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[#1F4E79] transition hover:bg-slate-300"
            aria-label="Configurações da conta"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <section className="rounded-2xl bg-[#1F4E79] p-5 text-white shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Label className="text-white opacity-80">Nível sustentável</Label>
              <h2 className="mt-1 text-2xl font-bold">{title}</h2>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#1FA34A]"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between gap-3 text-xs opacity-85">
                <span>{currentPoints.toLocaleString('pt-BR')} pontos totais</span>
                <span>Próximo nível: {nextLevelPoints.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-2xl">
          <SectionCard title="Dados pessoais" description="Informações vinculadas à sua conta.">
            <div className="grid gap-5 sm:grid-cols-2">
              <InfoField label="Nome" value={profile?.nome || profile?.usuario?.nome} />
              <InfoField label="E-mail" value={profile?.email || profile?.usuario?.email} />
              <InfoField label="Telefone" value={profile?.telefone || profile?.usuario?.telefone} />
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="font-extrabold text-[#1F4E79]">Endereço residencial</h3>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoField label="Rua" value={profile?.endereco?.rua} />
              <InfoField label="Número" value={profile?.endereco?.numero} />
              <InfoField label="Bairro" value={profile?.endereco?.bairro} />
              <InfoField label="Cidade" value={profile?.endereco?.cidade} />
            </div>
          </SectionCard>
        </div>
      </div>
    </RoleShell>
  )
}

function InfoField({ label, value }) {
  return (
    <div>
      <Label className="mb-1 block text-sm font-semibold text-[#1F4E79]">{label}</Label>
      <p className="text-base font-medium text-slate-700">{value || '-'}</p>
    </div>
  )
}
