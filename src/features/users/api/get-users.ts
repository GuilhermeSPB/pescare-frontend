import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { User } from '@/types/user'

/**
 * Lista pescadores e administradores (GET /users, somente admin), em ordem de nome.
 * O backend nunca devolve a senha.
 *
 * @example
 * const users = await getUsers()
 */
export const getUsers = (): Promise<User[]> =>
  api.get<User[]>('/users').then((response) => response.data)

/**
 * Query options da lista de usuários. A chave `['users']` também cobre `['users', 'me']`:
 * invalidar a lista atualiza o usuário da sessão junto.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getUsersQueryOptions().queryKey })
 */
export const getUsersQueryOptions = () => queryOptions({ queryKey: ['users'], queryFn: getUsers })

/**
 * Lista de usuários como estado do servidor.
 *
 * @example
 * const usersQuery = useUsers()
 */
export const useUsers = () => useQuery(getUsersQueryOptions())
