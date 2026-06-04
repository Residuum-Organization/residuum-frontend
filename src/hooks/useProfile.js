import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../services/users'
import { mockProfile } from '../mocks/profile'

const USE_MOCK = !import.meta.env.VITE_API_BASE_URL

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: USE_MOCK ? () => Promise.resolve(mockProfile) : getProfile,
  })
}
