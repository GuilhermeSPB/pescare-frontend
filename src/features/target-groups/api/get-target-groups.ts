import { queryOptions, useQuery } from '@tanstack/react-query'

import type { TargetGroup } from '@/features/target-groups/types/target-group'
import { api } from '@/lib/api-client'

/**
 * Lista todos os grupos-alvo, ativos e inativos (GET /target-groups).
 * O filtro por situação é feito na tela, para as contagens usarem a lista inteira.
 *
 * @example
 * const targetGroups = await getTargetGroups()
 */
export const getTargetGroups = (): Promise<TargetGroup[]> =>
  api.get<TargetGroup[]>('/target-groups').then((response) => response.data)

/**
 * Query options da lista de grupos-alvo.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getTargetGroupsQueryOptions().queryKey })
 */
export const getTargetGroupsQueryOptions = () =>
  queryOptions({ queryKey: ['target-groups'], queryFn: getTargetGroups })

/**
 * Lista de grupos-alvo como estado do servidor.
 *
 * @example
 * const targetGroupsQuery = useTargetGroups()
 */
export const useTargetGroups = () => useQuery(getTargetGroupsQueryOptions())
