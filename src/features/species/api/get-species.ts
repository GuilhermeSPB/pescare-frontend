import { queryOptions, useQuery } from '@tanstack/react-query'

import type { Species } from '@/features/species/types/species'
import { api } from '@/lib/api-client'

/**
 * Lista todas as espécies, ativas e inativas (GET /species).
 * O filtro por situação é feito na tela, para as contagens usarem a lista inteira.
 *
 * @example
 * const species = await getSpecies()
 */
export const getSpecies = (): Promise<Species[]> =>
  api.get<Species[]>('/species').then((response) => response.data)

/**
 * Query options da lista de espécies.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getSpeciesQueryOptions().queryKey })
 */
export const getSpeciesQueryOptions = () =>
  queryOptions({ queryKey: ['species'], queryFn: getSpecies })

/**
 * Lista de espécies como estado do servidor.
 *
 * @example
 * const speciesQuery = useSpecies()
 */
export const useSpecies = () => useQuery(getSpeciesQueryOptions())
