import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Gift, Info, Leaf, Medal, Sparkles, Trophy } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import { getRaffleDetails } from '../services/rewards';
import { queryKeys } from '../services/queryKeys';

const tabs = [
  { id: 'funciona', label: 'Como funciona' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'premios', label: 'Prêmios' },
];

const isFallbackOrMockData = (data) => ['fallback', 'mock'].includes(data?.__dataOrigin);

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition ${
        active ? 'bg-[#11527A] text-white shadow-sm' : 'bg-white text-slate-500'
      }`}
    >
      {children}
    </button>
  );
}

function Timeline({ etapas }) {
  return (
    <div className="space-y-3">
      {etapas.map((etapa, index) => (
        <div key={etapa} className="flex gap-3 rounded-[22px] bg-white p-4 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DDF7E9] text-[#0B6B53]">
              <CheckCircle2 size={22} />
            </div>
            {index < etapas.length - 1 ? <div className="mt-2 h-8 w-0.5 rounded-full bg-emerald-100" /> : null}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0B6B53]">Etapa {index + 1}</p>
            <h3 className="mt-1 text-sm font-black text-[#12384C]">{etapa}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

function Premios({ premios }) {
  return (
    <div className="space-y-3">
      {premios.map((premio, index) => (
        <article key={premio.posicao} className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${index === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
              <Medal size={28} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{premio.posicao}</p>
              <h3 className="mt-1 text-base font-black text-[#12384C]">{premio.titulo}</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">{premio.descricao}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function SorteioDetalhesPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('funciona');
  const { data: sorteio, isLoading } = useQuery({
    queryKey: queryKeys.raffleDetails(id),
    queryFn: () => getRaffleDetails(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-200 px-3 py-4">
        <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] items-center justify-center rounded-[28px] bg-[#F7FAF9] shadow-2xl">
          <p className="text-sm font-semibold text-slate-500">Carregando sorteio...</p>
        </section>
      </main>
    );
  }

  if (!sorteio) return <Navigate to="/sorteios" replace />;

  const showingFallbackData = isFallbackOrMockData(sorteio);

  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#F7FAF9] shadow-2xl">
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
          <div className="flex items-center justify-between">
            <Link to="/sorteios" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#12384C] shadow-sm">
              <ArrowLeft size={22} />
            </Link>
            <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#11527A] shadow-sm">
              {sorteio.status === 'ativo' ? 'ATIVO' : 'ENCERRADO'}
            </span>
          </div>

          {showingFallbackData ? (
            <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-relaxed text-amber-800">
              Este sorteio esta sendo exibido com dados demonstrativos.
            </div>
          ) : null}

          <section className="mt-4 overflow-hidden rounded-[32px] text-white shadow-lg" style={{ backgroundColor: sorteio.cor }}>
            <div className="p-5">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15">
                <Trophy size={34} />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">{sorteio.patrocinador}</p>
              <h1 className="mt-2 text-3xl font-black leading-tight">{sorteio.titulo}</h1>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-white/85">{sorteio.subtitulo}</p>

              <div className="mt-5 rounded-2xl bg-white/15 p-3">
                <div className="mb-2 flex items-center justify-between text-xs font-black">
                  <span>Progresso da campanha</span>
                  <span>{sorteio.progresso}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white" style={{ width: `${sorteio.progresso}%` }} />
                </div>
              </div>
            </div>
          </section>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </TabButton>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'funciona' ? (
              <>
                <div className="mb-4 rounded-[24px] bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF7E9] text-[#0B6B53]">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-[#12384C]">Participe com seus pontos</h2>
                      <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500">
                        A cada {sorteio.pontosNecessarios} pontos você ganha uma chance. Quanto mais reciclar, maiores as chances.
                      </p>
                    </div>
                  </div>
                </div>
                <Timeline etapas={sorteio.etapas} />
              </>
            ) : null}

            {activeTab === 'sobre' ? (
              <div className="rounded-[26px] bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#DDF7E9] text-[#0B6B53]">
                  <Info size={28} />
                </div>
                <h2 className="text-xl font-black text-[#12384C]">Sobre a campanha</h2>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">{sorteio.descricao}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-black text-slate-400">Pontos por chance</p>
                    <p className="mt-1 text-2xl font-black text-[#0B6B53]">{sorteio.pontosNecessarios}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-black text-slate-400">Participantes</p>
                    <p className="mt-1 text-2xl font-black text-[#0B6B53]">{sorteio.participantes}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'premios' ? (
              <>
                <div className="mb-4 rounded-[24px] bg-[#FFF7D6] p-4 text-[#7A5900] shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-black">
                    <Sparkles size={18} /> Mais pontos = mais chances de ganhar
                  </div>
                </div>
                <Premios premios={sorteio.premios} />
                <button
                  type="button"
                  disabled
                  className="mt-5 w-full rounded-full bg-slate-300 py-4 text-sm font-black text-white"
                >
                  {sorteio.status === 'encerrado' ? 'CAMPANHA ENCERRADA' : 'PARTICIPACAO INDISPONIVEL'}
                </button>
                {sorteio.status !== 'encerrado' ? (
                  <p className="mt-2 text-center text-xs font-semibold text-slate-500">
                    Participacao em sorteios ainda nao disponivel.
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
        <Navbar />
      </section>
    </main>
  );
}
