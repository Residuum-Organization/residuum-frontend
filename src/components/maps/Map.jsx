import React, { useCallback, useRef } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { useGoogleMaps } from '../../providers/GoogleMapsProvider'

const containerStyle = {
  width: '100%',
  height: '100%'
}

export default function Map({ center = { lat: -23.55052, lng: -46.633308 }, zoom = 15, markers = [], onMarkerClick }){
  const { isLoaded } = useGoogleMaps()
  const mapRef = useRef(null)

  const onLoad = useCallback(function callback(map){
    mapRef.current = map
  }, [])

  const onUnmount = useCallback(function callback(){
    mapRef.current = null
  }, [])

  if (!isLoaded) return <div>Carregando mapa...</div>

  return (
    <div className="w-full h-full">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom} onLoad={onLoad} onUnmount={onUnmount}>
        {markers.map(m => (
          <Marker key={m.id} position={{ lat: m.latitude, lng: m.longitude }} onClick={() => onMarkerClick && onMarkerClick(m)} />
        ))}
      </GoogleMap>
    </div>
  )
}
