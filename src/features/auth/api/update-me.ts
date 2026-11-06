import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { UpdateMeInput } from '@/features/auth/types/auth'
import type { User } from '@/types/user'

/**
 * Altera nome e município do usuário da sessão (PATCH /users/me).
 *
 * @example
 * await updateMe({ name: 'Erick Willyan', fk_municipality_ibge_code: '1501402' })
 */
export const updateMe = (input: UpdateMeInput): Promise<User> =>
  api.patch<User>('/users/me', input).then((response) => response.data)

/**
 * Mutation de "Meu perfil". Invalida a raiz `['users']`: cobre o usuário da sessão
 * (`['users', 'me']`, nome no topo) e a lista de usuários, onde a pessoa também aparece.
 *
 * @example
 * const updateMeMutation = useUpdateMe()
 * updateMeMutation.mutate(values, { onSuccess: handleProfileSaved })
 */
export const useUpdateMe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
