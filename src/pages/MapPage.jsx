import React, { useMemo, useState } from 'react'
import Map from '../components/maps/Map'
import Navbar from '../components/ui/Navbar'
import { collectionPoints, wasteTypes } from '../mocks/collectionPoints'

const initialCenter = { lat: -3.119, lng: -60.0217 }

export default function MapPage() {
  const [selectedWasteType, setSelectedWasteType] = useState('Todos')
  const [selectedPoint, setSelectedPoint] = useState(null)

  const activePoints = useMemo(() => {
    return collectionPoints.filter((point) => point.status === 'ativo')
  }, [])

  const filteredPoints = useMemo(() => {
    if (selectedWasteType === 'Todos') return activePoints
    return activePoints.filter((point) => point.wasteTypes.includes(selectedWasteType))
  }, [activePoints, selectedWasteType])

  const selected = selectedPoint || filteredPoints[0]

  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#f7faf9] shadow-2xl">
        <header className="relative bg-white px-5 pb-4 pt-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#1F4E79]">Residuum</p>
              <h1 className="mt-1 text-2xl font-bold leading-tight text-[#111827]">
                Pontos de coleta
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Encontre locais ativos próximos em Manaus.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <span className="text-2xl font-black text-[#16b83e]">♻</span>
            </div>
          </div>

          <div className="mt-4 rounded-3xl bg-[#eaf7ef] p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#1F4E79]">Pontos ativos</p>
                <strong className="text-2xl text-[#1F4E79]">{filteredPoints.length}</strong>
              </div>

              <div className="rounded-full bg-[#19c64a] px-4 py-2 text-xs font-bold text-white">
                Ativo
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-relaxed text-amber-800">
            Mapa em modo demonstrativo. Os pontos exibidos podem nao representar dados reais do servidor.
          </div>
        </header>

        <section className="flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-24">
          <div className="rounded-3xl bg-white p-3 shadow-sm">
            <label className="mb-2 block text-xs font-bold text-[#1F4E79]">
              Filtrar por tipo de resíduo
            </label>

            <select
              value={selectedWasteType}
              onChange={(event) => {
                setSelectedWasteType(event.target.value)
                setSelectedPoint(null)
              }}
              className="w-full rounded-2xl border border-slate-200 bg-[#eef2f6] px-4 py-3 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="Todos">Todos os resíduos</option>
              {wasteTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white p-2 shadow-sm">
            <Map
              center={selected ? { lat: selected.latitude, lng: selected.longitude } : initialCenter}
              zoom={selected ? 15 : 13}
              markers={filteredPoints}
              onMarkerClick={setSelectedPoint}
              height="330px"
            />
          </div>

          {selected ? (
            <article className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#1F4E79]">Detalhes do ponto</p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    {selected.name}
                  </h2>
                </div>

               <span className="rounded-full bg-[#19c64a] px-3 py-1 text-xs font-bold text-white">
                    {selected.statusLabel || 'Em funcionamento'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-900">Endereço:</strong> {selected.address}
                </p>

                <p>
                  <strong className="text-slate-900">Funcionamento:</strong>{' '}
                  {selected.openingHours}
                </p>

                <p>
                  <strong className="text-slate-900">Distância:</strong>{' '}
                  {selected.distanceKm.toFixed(1).replace('.', ',')} km
                </p>
                <p>
  <strong className="text-slate-900">Quantidade acumulada:</strong>{' '}
  {selected.currentVolumeKg ?? 0} kg de {selected.capacityKg ?? 0} kg
</p>

<div className="mt-3">
  <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
    <span>Nível de ocupação</span>
    <span>{selected.fillPercentage ?? 0}%</span>
  </div>

  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
    <div
      className="h-full rounded-full bg-[#19c64a]"
      style={{ width: `${selected.fillPercentage ?? 0}%` }}
    />
  </div>
</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.wasteTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-full bg-[#eaf7ef] px-3 py-1 text-xs font-semibold text-[#128633]"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <button
  onClick={() => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`,
      '_blank'
    )
  }}
  className="mt-5 w-full rounded-2xl bg-[#1F4E79] py-3 text-sm font-bold text-white"
>
  Ver rota até o ponto
</button>
            </article>
          ) : (
            <article className="rounded-3xl bg-white p-4 text-sm text-slate-500 shadow-sm">
              Nenhum ponto encontrado para esse filtro.
            </article>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#1F4E79]">Pontos próximos</h3>

            {filteredPoints.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelectedPoint(point)}
                className={`w-full rounded-3xl border bg-white p-4 text-left shadow-sm ${
                  selected?.id === point.id
                    ? 'border-[#19c64a]'
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{point.name}</h4>
                    <p className="mt-1 text-xs text-slate-500">{point.address}</p>
                  </div>

                  <span className="text-xs font-bold text-[#19c64a]">
  {point.distanceKm.toFixed(1).replace('.', ',')} km
</span>
</div>

<div className="mt-3 flex items-center justify-between text-xs text-slate-500">
  <span>
    {point.currentVolumeKg ?? 0} kg de {point.capacityKg ?? 0} kg
  </span>

  <span className="font-bold text-[#1F4E79]">
    {point.fillPercentage ?? 0}%
  </span>
</div>

<div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
  <div
    className="h-full rounded-full bg-[#19c64a]"
    style={{ width: `${point.fillPercentage ?? 0}%` }}
  />
</div>
              </button>
            ))}
          </div>
        </section>

        <Navbar />
      </section>
    </main>
  )
}
