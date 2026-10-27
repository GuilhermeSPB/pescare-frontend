import { queryOptions, useQuery } from '@tanstack/react-query'

import type { FishingMethod } from '@/features/fishing-methods/types/fishing-method'
import { api } from '@/lib/api-client'

/**
 * Lista todos os métodos de pesca, ativos e inativos (GET /fishing-methods).
 * O filtro por situação é feito na tela, para as contagens usarem a lista inteira.
 *
 * @example
 * const fishingMethods = await getFishingMethods()
 */
export const getFishingMethods = (): Promise<FishingMethod[]> =>
  api.get<FishingMethod[]>('/fishing-methods').then((response) => response.data)

/**
 * Query options da lista de métodos de pesca.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getFishingMethodsQueryOptions().queryKey })
 */
export const getFishingMethodsQueryOptions = () =>
  queryOptions({ queryKey: ['fishing-methods'], queryFn: getFishingMethods })

/**
 * Lista de métodos de pesca como estado do servidor.
 *
 * @example
 * const fishingMethodsQuery = useFishingMethods()
 */
export const useFishingMethods = () => useQuery(getFishingMethodsQueryOptions())
