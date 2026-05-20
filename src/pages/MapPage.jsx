import React, { useMemo, useState } from 'react'
import Map from '../components/maps/Map'
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
              <p className="text-xs font-semibold text-[#11527a]">Residuum</p>
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
                <p className="text-xs font-medium text-[#11527a]">Pontos ativos</p>
                <strong className="text-2xl text-[#000080]">{filteredPoints.length}</strong>
              </div>

              <div className="rounded-full bg-[#19c64a] px-4 py-2 text-xs font-bold text-white">
                Ativo
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-24">
          <div className="rounded-3xl bg-white p-3 shadow-sm">
            <label className="mb-2 block text-xs font-bold text-[#000080]">
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
                  <p className="text-xs font-bold text-[#000080]">Detalhes do ponto</p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    {selected.name}
                  </h2>
                </div>

                <span className="rounded-full bg-[#19c64a] px-3 py-1 text-xs font-bold text-white">
                  Ativo
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
  className="mt-5 w-full rounded-2xl bg-[#070707] py-3 text-sm font-bold text-white"
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
            <h3 className="text-sm font-bold text-[#000080]">Pontos próximos</h3>

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

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-3/4 rounded-full bg-[#19c64a]" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <nav className="fixed bottom-4 left-1/2 z-[999] grid w-[360px] -translate-x-1/2 grid-cols-5 bg-[#11527a] px-3 py-4 text-white shadow-xl">
  <button
    type="button"
    aria-label="Localização"
    className="flex items-center justify-center"
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
  </button>

  <button
    type="button"
    aria-label="Reciclagem"
    className="flex items-center justify-center text-[28px] leading-none"
  >
    ♻
  </button>

  <button
    type="button"
    aria-label="Início"
    className="flex items-center justify-center"
  >
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 10.8 12 3l9 7.8V21a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1V10.8z" />
    </svg>
  </button>

  <button
    type="button"
    aria-label="QR Code"
    className="flex items-center justify-center"
  >
    <svg width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M4 4h5v5H4z" />
      <path d="M15 4h5v5h-5z" />
      <path d="M4 15h5v5H4z" />
      <path d="M15 15h2v2h-2z" />
      <path d="M19 15h1v5h-5v-1" />
      <path d="M12 4v16" />
      <path d="M2 7v10" />
      <path d="M22 7v10" />
    </svg>
  </button>

  <button
    type="button"
    aria-label="Favoritos"
    className="flex items-center justify-center"
  >
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 2.8 2.8 5.7 6.3.9-4.55 4.45 1.08 6.28L12 17.15l-5.63 2.98 1.08-6.28L2.9 9.4l6.3-.9L12 2.8z" />
    </svg>
  </button>
</nav>
      </section>
    </main>
  )
}