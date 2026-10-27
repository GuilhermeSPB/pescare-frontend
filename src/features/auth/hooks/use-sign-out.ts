import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { paths } from '@/config/paths'
import { clearAuthToken } from '@/lib/auth-token'

/**
 * Encerra a sessão: apaga o token, descarta o cache de dados e volta ao login.
 *
 * @example
 * const signOut = useSignOut()
 * <Button label="Sair" onClick={signOut} />
 */
export const useSignOut = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return () => {
    clearAuthToken()
    // O próximo usuário neste navegador não pode ver dados em cache do anterior.
    queryClient.clear()
    navigate(paths.signIn, { replace: true })
  }
}
