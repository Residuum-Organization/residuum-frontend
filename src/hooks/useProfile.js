import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../services/users'
import { queryKeys } from '../services/queryKeys'

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: getProfile,
  })
}
