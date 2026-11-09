import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import type { MunicipalitySearchFilters } from '@/features/municipalities/types/municipality-search-filters'
import { api } from '@/lib/api-client'
import type { Municipality } from '@/types/municipality'
import { SERVER_SEARCH_ROW_LIMIT } from '@/utils/server-search'

/**
 * Busca municípios pelo nome (sem diferenciar acentos) ou pelo código IBGE, com filtro de UF e
 * no máximo 10 linhas (GET /municipalities).
 *
 * @example
 * const municipalities = await searchMunicipalities({ search: 'belem', uf: 'PA' })
 */
export const searchMunicipalities = (filters: MunicipalitySearchFilters): Promise<Municipality[]> =>
  api
    .get<Municipality[]>('/municipalities', {
      params: { ...filters, limit: SERVER_SEARCH_ROW_LIMIT },
    })
    .then((response) => response.data)

/**
 * Query options da busca. A chave fica sob `['municipalities']`, então renomear um município
 * também atualiza a busca.
 *
 * @example
 * queryClient.prefetchQuery(searchMunicipalitiesQueryOptions({ uf: 'PA' }))
 */
export const searchMunicipalitiesQueryOptions = (filters: MunicipalitySearchFilters) =>
  queryOptions({
    queryKey: ['municipalities', 'search', filters],
    queryFn: () => searchMunicipalities(filters),
    // Mantém as linhas atuais enquanto a nova busca não chega: a tabela não pisca a cada termo.
    placeholderData: keepPreviousData,
  })

/**
 * Resultado da busca de municípios como estado do servidor.
 *
 * @example
 * const municipalitiesQuery = useSearchMunicipalities({ search: 'belem' })
 */
export const useSearchMunicipalities = (filters: MunicipalitySearchFilters) =>
  useQuery(searchMunicipalitiesQueryOptions(filters))
