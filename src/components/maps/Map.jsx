import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="
      width: 30px;
      height: 30px;
      background: #19c64a;
      border: 4px solid white;
      border-radius: 999px;
      box-shadow: 0 8px 20px rgba(0,0,0,.35);
    "></div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

function ChangeMapView({ center, zoom }) {
  const map = useMap()

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [center, zoom, map])

  return null
}

export default function Map({
  center = { lat: -3.119, lng: -60.0217 },
  zoom = 13,
  markers = [],
  onMarkerClick,
  height = '560px',
}) {
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
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{
          width: '100%',
          height,
          minHeight: height,
          zIndex: 1,
        }}
      >
        <ChangeMapView center={center} zoom={zoom} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={markerIcon}
            eventHandlers={{
              click: () => onMarkerClick?.(marker),
            }}
          >
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              {marker.address}
              <br />
              <small>{marker.wasteTypes.join(', ')}</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}