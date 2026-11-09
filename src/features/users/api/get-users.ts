import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import type { UserListFilters } from '@/features/users/types/user-list-filters'
import { api } from '@/lib/api-client'
import type { User } from '@/types/user'
import { SERVER_SEARCH_ROW_LIMIT } from '@/utils/server-search'

// Prefixo de todas as consultas de usuários. Também cobre `['users', 'me']`: invalidar a lista
// atualiza o usuário da sessão junto.
export const USERS_QUERY_KEY = ['users']

/**
 * Lista pescadores e administradores (GET /users, somente admin), em ordem de nome e com no
 * máximo 10 linhas. A busca procura no nome e no e-mail. O backend nunca devolve a senha.
 *
 * @example
 * const users = await getUsers({ search: 'maria', isActive: true })
 */
export const getUsers = (filters: UserListFilters): Promise<User[]> =>
  api
    .get<User[]>('/users', { params: { ...filters, limit: SERVER_SEARCH_ROW_LIMIT } })
    .then((response) => response.data)

/**
 * Query options da lista de usuários para um conjunto de filtros.
 *
 * @example
 * queryClient.prefetchQuery(getUsersQueryOptions({ role: 'ADMIN' }))
 */
export const getUsersQueryOptions = (filters: UserListFilters) =>
  queryOptions({
    queryKey: [...USERS_QUERY_KEY, filters],
    queryFn: () => getUsers(filters),
    // Mantém as linhas atuais enquanto a nova busca não chega: a tabela não pisca a cada termo.
    placeholderData: keepPreviousData,
  })

/**
 * Lista de usuários como estado do servidor.
 *
 * @example
 * const usersQuery = useUsers({ search: 'maria' })
 */
export const useUsers = (filters: UserListFilters) => useQuery(getUsersQueryOptions(filters))
