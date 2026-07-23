import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, ArrowLeft, Recycle } from "lucide-react";
import Map from "../components/maps/Map";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import Button from "../components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { listCollectionPoints } from "../services/collectionPoints";
import { queryKeys } from "../services/queryKeys";

const initialCenter = { lat: -3.119, lng: -60.0217 };
const wasteTypesOptions = [
  "Todos",
  "plastico",
  "papel",
  "aluminio",
  "vidro",
  "eletronicos",
  "oleo",
  "baterias",
];

export default function MapPage() {
  const navigate = useNavigate();
  const [selectedWasteType, setSelectedWasteType] = useState("Todos");
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("requesting");

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }

    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setLocationStatus("available");
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const { data: apiPoints = [], isLoading, isError } = useQuery({
    queryKey: queryKeys.collectionPoints({
      tipo_residuo: selectedWasteType,
      lat: userLocation?.lat,
      long: userLocation?.lng,
    }),
    queryFn: () => listCollectionPoints({
      ...(selectedWasteType !== "Todos" ? { tipo_residuo: selectedWasteType } : {}),
      ...(userLocation ? { lat: userLocation.lat, long: userLocation.lng } : {}),
    }),
    enabled: locationStatus !== "requesting",
  });

  const formattedPoints = useMemo(() => {
    return apiPoints.map(p => ({
      id: p.id,
      name: p.nome,
      address: p.endereco,
      latitude: p.latitude,
      longitude: p.longitude,
      status: p.status === 'ativo' ? 'ativo' : 'inativo',
      statusLabel: p.status === 'ativo' ? 'Ativo' : 'Inativo',
      openingHours: p.horario_funcionamento || 'Não informado',
      distanceKm: Number.isFinite(Number(p.distancia_km)) ? Number(p.distancia_km) : null,
      currentVolumeKg: p.total_inventario || 0,
      capacityKg: p.capacidade_maxima || 0,
      fillPercentage: p.percentual_ocupacao || 0,
      wasteTypes: p.tipos_residuos_aceitos || [],
    }));
  }, [apiPoints]);

  const activePoints = useMemo(() => {
    return formattedPoints.filter((point) => point.status === "ativo");
  }, [formattedPoints]);

  const filteredPoints = useMemo(() => {
    if (selectedWasteType === "Todos") return activePoints;
    return activePoints.filter((point) => point.wasteTypes.includes(selectedWasteType));
  }, [activePoints, selectedWasteType]);

  const selected = selectedPoint || filteredPoints[0];
  const mapCenter = selected
    ? { lat: selected.latitude, lng: selected.longitude }
    : initialCenter;

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-36 sm:px-6 sm:py-6 lg:px-8 lg:pb-56">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Mapa"
          title="Pontos de coleta"
          description="Escolha um ponto ativo e confira os materiais aceitos antes de sair."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <span className="inline-flex min-h-10 items-center rounded-full bg-[#1F4E79] px-4 text-sm font-bold text-white">
                {filteredPoints.length} ativos
              </span>
            </div>
          }
        />

        {isError && (
          <ErrorState title="Erro ao carregar os pontos de coleta da API." />
        )}

        {locationStatus === "denied" || locationStatus === "unavailable" ? (
          <InlineAlert
            variant="warning"
            title="Distancia indisponivel"
            description="Permita o acesso a sua localizacao para ordenar os pontos por proximidade e calcular a distancia real."
            action={
              <Button type="button" variant="secondary" onClick={requestLocation}>
                Tentar novamente
              </Button>
            }
          />
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
          <div className="space-y-4">
            <SectionCard
              title="Filtrar pontos"
              description="Selecione o tipo de resíduo que você quer entregar."
              className="p-4 sm:p-5"
            >
              <label className="sr-only" htmlFor="waste-type-filter">
                Filtrar por tipo de resíduo
              </label>
              <Select
                value={selectedWasteType}
                onValueChange={(val) => {
                  setSelectedWasteType(val);
                  setSelectedPoint(null);
                }}
              >
                <SelectTrigger id="waste-type-filter" className="w-full">
                  <SelectValue placeholder="Filtrar por tipo de resíduo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os resíduos</SelectItem>
                  {wasteTypesOptions.map((type) => (
                    type !== "Todos" && (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </SectionCard>

            <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-2 shadow-sm">
              {isLoading ? (
                <LoadingState title="Carregando mapa e pontos de coleta..." />
              ) : (
                <Map
                  center={mapCenter}
                  zoom={selected ? 15 : 13}
                  markers={filteredPoints}
                  selectedMarkerId={selected?.id}
                  onMarkerClick={setSelectedPoint}
                  userLocation={userLocation}
                  height="clamp(300px, 46vh, 500px)"
                />
              )}
            </section>
          </div>

          <aside className="space-y-4">
            {selected ? <PointDetails point={selected} /> : null}

            <SectionCard
              title="Pontos proximos"
              description="Toque em um ponto para ver os detalhes no mapa."
            >
              {filteredPoints.length ? (
                <div className="space-y-3">
                  {filteredPoints.map((point) => (
                    <PointListItem
                      key={point.id}
                      point={point}
                      active={selected?.id === point.id}
                      onClick={() => setSelectedPoint(point)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Nenhum ponto encontrado."
                  description="Tente selecionar outro tipo de resíduo."
                  icon={MapPin}
                  className="bg-white"
                />
              )}
            </SectionCard>
          </aside>
        </div>
      </div>
    </RoleShell>
  );
}

function PointDetails({ point }) {
  const navigate = useNavigate();
  const fillPercentage = point.fillPercentage ?? 0;

  return (
    <SectionCard
      title="Detalhes do ponto"
      description="Confira endereço, funcionamento e materiais aceitos."
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-lg font-extrabold text-[var(--color-text)]">
              {point.name}
            </h2>
            <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
              {point.address}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#2EA44F] px-3 py-1 text-xs font-bold text-white">
            {point.statusLabel || "Ativo"}
          </span>
        </div>

        <div className="grid gap-3 text-sm font-medium text-[var(--color-text-muted)]">
          <InfoLine label="Funcionamento" value={point.openingHours} />
            <InfoLine
            label="Distância"
            value={point.distanceKm == null ? "Ative sua localizacao" : `${point.distanceKm.toFixed(1).replace(".", ",")} km`}
          />
          <InfoLine
            label="Quantidade acumulada"
            value={`${point.currentVolumeKg ?? 0} kg de ${point.capacityKg ?? 0} kg`}
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs font-bold text-[var(--color-text-muted)]">
            <span>Nível de ocupação</span>
            <span>{fillPercentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#2EA44F]"
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {point.wasteTypes.map((type) => (
            <span
              key={type}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
            >
              {type}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Button
            type="button"
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => navigate('/estoque')}
          >
            <Recycle className="h-4 w-4" aria-hidden="true" />
            Descartar resíduos neste ponto
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`,
                "_blank"
              );
            }}
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Ver rota até o ponto
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

function PointListItem({ point, active, onClick }) {
  const fillPercentage = point.fillPercentage ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition focus-visible:ring-2 focus-visible:ring-[#1F4E79]/30 ${
        active
          ? "border-[#2EA44F] bg-emerald-50"
          : "border-[var(--color-border)] bg-white hover:border-[#1F4E79]/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-extrabold text-[var(--color-text)]">
            {point.name}
          </h3>
          <p className="mt-1 text-xs font-medium leading-relaxed text-[var(--color-text-muted)]">
            {point.address}
          </p>
        </div>
        <span className="shrink-0 text-xs font-black text-[#2EA44F]">
          {point.distanceKm == null ? "-" : `${point.distanceKm.toFixed(1).replace(".", ",")} km`}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs font-bold text-[var(--color-text-muted)]">
        <span>
          {point.currentVolumeKg ?? 0} kg de {point.capacityKg ?? 0} kg
        </span>
        <span className="text-[#1F4E79]">{fillPercentage}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#2EA44F]"
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
    </button>
  );
}

function InfoLine({ label, value }) {
  return (
    <p>
      <strong className="font-extrabold text-[var(--color-text)]">{label}:</strong>{" "}
      {value}
    </p>
  );
}
