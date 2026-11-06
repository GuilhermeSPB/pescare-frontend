import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getUsersQueryOptions } from '@/features/users/api/get-users'
import type { CreateAdminInput } from '@/features/users/types/user-input'
import { api } from '@/lib/api-client'
import type { User } from '@/types/user'

/**
 * Cadastra outro administrador (POST /users). Responde 409 quando o e-mail já existe.
 *
 * @example
 * await createAdmin({ name: 'Ana', email: 'ana@pescare.org', password: '...', fk_municipality_ibge_code: '1501402' })
 */
export const createAdmin = (input: CreateAdminInput): Promise<User> =>
  api.post<User>('/users', input).then((response) => response.data)

/**
 * Mutation de cadastro de administrador; atualiza a lista ao concluir.
 *
 * @example
 * const createMutation = useCreateAdmin()
 * createMutation.mutate(formValues)
 */
export const useCreateAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getUsersQueryOptions().queryKey }),
  })
}
