import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { Municipality } from '@/types/municipality'

/**
 * Lista todos os municípios do IBGE (GET /municipalities), em ordem de nome.
 *
 * @example
 * const municipalities = await getMunicipalities()
 */
export const getMunicipalities = (): Promise<Municipality[]> =>
  api.get<Municipality[]>('/municipalities').then((response) => response.data)

/**
 * Query options da lista de municípios. A lista do IBGE não muda enquanto o painel está aberto:
 * é buscada uma vez e não fica velha.
 *
 * @example
 * queryClient.prefetchQuery(getMunicipalitiesQueryOptions())
 */
export const getMunicipalitiesQueryOptions = () =>
  queryOptions({ queryKey: ['municipalities'], queryFn: getMunicipalities, staleTime: Infinity })

/**
 * Lista de municípios como estado do servidor.
 *
 * @example
 * const municipalitiesQuery = useMunicipalities()
 */
export const useMunicipalities = () => useQuery(getMunicipalitiesQueryOptions())
