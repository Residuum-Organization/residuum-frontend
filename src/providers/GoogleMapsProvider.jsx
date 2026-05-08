import React, { createContext, useContext } from 'react'
import { useLoadScript } from '@react-google-maps/api'

const GoogleMapsContext = createContext({ isLoaded: false, loadError: null })

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || '',
    libraries: ['places'],
    // preventAutoReload: true // optional fine-tuning
  })

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}

export const useGoogleMaps = () => useContext(GoogleMapsContext)

export default GoogleMapsProvider
