import React, { createContext, useContext } from 'react'
import { useLoadScript } from '@react-google-maps/api'

const libraries = ['places']
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || ''

const GoogleMapsContext = createContext({
  isLoaded: false,
  loadError: null,
  hasApiKey: false
})

export const GoogleMapsProvider = ({ children }) => {
  const hasApiKey = Boolean(googleMapsApiKey)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries
  })

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, hasApiKey }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}

export const useGoogleMaps = () => useContext(GoogleMapsContext)

export default GoogleMapsProvider
