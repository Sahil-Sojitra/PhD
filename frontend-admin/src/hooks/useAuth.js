import { useMemo } from 'react'
import { getToken } from '../utils/auth'

function useAuth() {
  const token = getToken()

  return useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
    }),
    [token],
  )
}

export default useAuth