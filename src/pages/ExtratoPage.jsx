import React from 'react';
import { CheckCircle2, Clock3, Recycle, TrendingUp, Wallet } from 'lucide-react';
import Navbar from '../components/ui/Navbar';

const historico = [
  { id: 1, titulo: 'Garrafas PET', quantidade: '3x', pontos: 120, status: 'entregue', data: 'Hoje, 14:35' },
  { id: 2, titulo: 'Latas de alumínio', quantidade: '1x', pontos: 80, status: 'pendente', data: 'Ontem, 10:15' },
  { id: 3, titulo: 'Vidros recicláveis', quantidade: '2x', pontos: 150, status: 'entregue', data: '18 Mai, 09:40' },
  { id: 4, titulo: 'Papelão limpo', quantidade: '4x', pontos: 150, status: 'entregue', data: '15 Mai, 16:20' },
];

function HistoricoCard({ item }) {
  const pendente = item.status === 'pendente';
  return (
    <article className={`rounded-[24px] border p-4 shadow-sm ${pendente ? 'border-amber-200 bg-amber-50' : 'border-emerald-100 bg-white'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${pendente ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            <Recycle size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#12384C]">{item.titulo}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">{item.quantidade} • {item.data}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-[#0B6B53]">+{item.pontos}</p>
          <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${pendente ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {pendente ? <Clock3 size={12} /> : <CheckCircle2 size={12} />}
            {pendente ? 'PENDENTE' : 'ENTREGUE'}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function ExtratoPage() {
  const total = 500;
  const pendentes = 80;
  const entregues = 420;

  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#F7FAF9] shadow-2xl">
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
          <h1 className="text-3xl font-black text-[#12384C]">
            Extrato de <span className="text-[#E5B900]">Pontos</span>
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">Acompanhe seu saldo e suas entregas.</p>

          <section className="mt-5 rounded-[32px] bg-[#DDF7E9] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0B6B53]/80">Total disponível</p>
                <h2 className="mt-2 text-6xl font-black leading-none text-[#0B6B53]">{total}</h2>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 text-[#0B6B53] shadow-sm">
                <Wallet size={32} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/80 p-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-700">
                  <Clock3 size={15} /> Pendentes
                </div>
                <p className="mt-2 text-2xl font-black text-[#12384C]">{pendentes}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-700">
                  <TrendingUp size={15} /> Entregues
                </div>
                <p className="mt-2 text-2xl font-black text-[#12384C]">{entregues}</p>
              </div>
            </div>
          </section>

          <div className="mb-4 mt-7 flex items-center justify-between">
            <h2 className="text-lg font-black text-[#12384C]">Histórico</h2>
            <button className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#11527A] shadow-sm">Todos</button>
          </div>

          <div className="space-y-3">
            {historico.map((item) => (
              <HistoricoCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <Navbar />
      </section>
    </main>
  );
}
