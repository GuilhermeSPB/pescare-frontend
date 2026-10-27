import { queryOptions, useQuery } from '@tanstack/react-query'

import type { FishingLocationType } from '@/features/fishing-location-types/types/fishing-location-type'
import { api } from '@/lib/api-client'

/**
 * Lista todos os tipos de local de pesca, ativos e inativos (GET /fishing-location-types).
 * O filtro por situação é feito na tela, para as contagens usarem a lista inteira.
 *
 * @example
 * const fishingLocationTypes = await getFishingLocationTypes()
 */
export const getFishingLocationTypes = (): Promise<FishingLocationType[]> =>
  api.get<FishingLocationType[]>('/fishing-location-types').then((response) => response.data)

/**
 * Query options da lista de tipos de local de pesca.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getFishingLocationTypesQueryOptions().queryKey })
 */
export const getFishingLocationTypesQueryOptions = () =>
  queryOptions({ queryKey: ['fishing-location-types'], queryFn: getFishingLocationTypes })

/**
 * Lista de tipos de local de pesca como estado do servidor.
 *
 * @example
 * const fishingLocationTypesQuery = useFishingLocationTypes()
 */
export const useFishingLocationTypes = () => useQuery(getFishingLocationTypesQueryOptions())
