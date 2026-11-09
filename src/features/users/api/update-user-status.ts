import { useMutation, useQueryClient } from '@tanstack/react-query'

import { USERS_QUERY_KEY } from '@/features/users/api/get-users'
import type { UpdateUserStatusInput } from '@/features/users/types/user-input'
import { api } from '@/lib/api-client'
import type { User } from '@/types/user'

/**
 * Ativa ou desativa um usuário (PATCH /users/:id). Desativar corta o acesso na hora:
 * o backend confere o status a cada requisição. O admin não pode desativar a si mesmo (400).
 *
 * @example
 * await updateUserStatus({ id: 7, data: { is_active: false } })
 */
export const updateUserStatus = ({ id, data }: UpdateUserStatusInput): Promise<User> =>
  api.patch<User>(`/users/${id}`, data).then((response) => response.data)

/**
 * Mutation de ativação/desativação; atualiza a lista ao concluir.
 *
 * @example
 * const statusMutation = useUpdateUserStatus()
 * statusMutation.mutate({ id: 7, data: { is_active: true } })
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  })
}
