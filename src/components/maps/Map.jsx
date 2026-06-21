import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const STATUS_COLORS = {
  ativo: '#19c64a',
  active: '#19c64a',
  disponivel: '#19c64a',
  cheio: '#f59e0b',
  amber: '#f59e0b',
  parcial: '#f59e0b',
  atencao: '#f59e0b',
  atenção: '#f59e0b',
  inativo: '#ef4444',
  inactive: '#ef4444',
  indisponivel: '#ef4444',
  suspenso: '#ef4444',
}

export const getStatusColor = (status) => {
  const normalizedStatus = String(status || 'ativo').toLowerCase()
  return STATUS_COLORS[normalizedStatus] || STATUS_COLORS.ativo
}

const createMarkerIcon = (color) => {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 4px solid white;
        border-radius: 999px;
        box-shadow: 0 2px 10px rgba(0,0,0,.35);
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
  })
}

export default function Map({
  center = { lat: -3.119, lng: -60.0217 },
  zoom = 13,
  markers = [],
  selectedMarkerId,
  onMarkerClick,
  height = '560px',
}) {
  const validMarkers = markers.filter(
    (marker) =>
      Number.isFinite(Number(marker.latitude)) &&
      Number.isFinite(Number(marker.longitude))
  )

  const mapCenter =
    validMarkers.length > 0
      ? [Number(validMarkers[0].latitude), Number(validMarkers[0].longitude)]
      : [center.lat, center.lng]

  return (
    <div
      style={{
        width: '100%',
        height,
        minHeight: height,
        borderRadius: '22px',
        overflow: 'hidden',
        background: '#e5e7eb',
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{
          width: '100%',
          height: '100%',
          minHeight: height,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validMarkers.map((marker) => {
          const isSelected = String(marker.id) === String(selectedMarkerId)
          const color = getStatusColor(marker.status || marker.status_calculado)

          return (
            <Marker
              key={marker.id}
              position={[Number(marker.latitude), Number(marker.longitude)]}
              icon={createMarkerIcon(color)}
              eventHandlers={{
  click: () => {
    onMarkerClick?.(marker)
  },
}}
            >
              <Popup>
                <div className="max-w-[210px] text-sm text-slate-700">
                  <strong className="text-slate-900">
                    {marker.name || marker.nome || 'Ponto de coleta'}
                  </strong>

                  <br />

                  {marker.address || marker.endereco || 'Endereço não informado'}

                  {marker.wasteTypes?.length ? (
                    <>
                      <br />
                      <small>{marker.wasteTypes.join(', ')}</small>
                    </>
                  ) : null}

                  {marker.tipos_residuos_aceitos?.length ? (
                    <>
                      <br />
                      <small>{marker.tipos_residuos_aceitos.join(', ')}</small>
                    </>
                  ) : null}

                  {isSelected ? (
                    <>
                      <br />
                      <small>Status: {marker.status || marker.status_calculado}</small>
                    </>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}