import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { AuthUser } from '@/features/auth/types/auth'

/**
 * Busca o usuário da sessão atual (GET /users/me).
 *
 * @example
 * const currentUser = await getMe()
 */
export const getMe = (): Promise<AuthUser> =>
  api.get<AuthUser>('/users/me').then((response) => response.data)

/**
 * Query options do usuário da sessão.
 *
 * @example
 * queryClient.removeQueries({ queryKey: getMeQueryOptions().queryKey })
 */
export const getMeQueryOptions = () => queryOptions({ queryKey: ['users', 'me'], queryFn: getMe })

/**
 * Usuário da sessão atual, como estado do servidor.
 *
 * @example
 * const meQuery = useMe()
 * meQuery.data?.name
 */
export const useMe = () => useQuery(getMeQueryOptions())
