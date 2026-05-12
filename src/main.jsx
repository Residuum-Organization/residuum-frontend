import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { GoogleMapsProvider } from './providers/GoogleMapsProvider'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GoogleMapsProvider>
          <App />
        </GoogleMapsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
