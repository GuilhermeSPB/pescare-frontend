import type { UseQueryResult } from '@tanstack/react-query'

import { useFishingBanPeriodById } from '@/features/fishing-bans/api/get-fishing-ban-period-by-id'
import type { SelectableSpecies } from '@/features/fishing-bans/types/fishing-ban-period'
import type { Municipality } from '@/types/municipality'
import type { NamedCatalogItem } from '@/types/named-catalog'
import { getApiErrorStatus } from '@/utils/api-error'

interface FishingBanPeriodFormQueriesOptions {
  // Sem id: cadastro, e o período não é buscado.
  periodId?: number
  // Vêm das features de espécies, tipos de local e municípios, compostas na rota.
  speciesQuery: UseQueryResult<SelectableSpecies[]>
  locationTypesQuery: UseQueryResult<NamedCatalogItem[]>
  municipalitiesQuery: UseQueryResult<Municipality[]>
}

/**
 * Junta tudo o que o formulário do período precisa num só estado de carregamento: o período
 * (na edição), espécies, tipos de local e municípios. O formulário só aparece quando tudo
 * chegou, para abrir já com as opções. Se algo falhar, "Tentar novamente" refaz só o que falhou.
 *
 * @example
 * const formQueries = useFishingBanPeriodFormQueries({ periodId, speciesQuery, locationTypesQuery, municipalitiesQuery })
 */
export const useFishingBanPeriodFormQueries = ({
  periodId,
  speciesQuery,
  locationTypesQuery,
  municipalitiesQuery,
}: FishingBanPeriodFormQueriesOptions) => {
  const periodQuery = useFishingBanPeriodById(periodId)
  // A query do período desligada (cadastro) fica "pending" para sempre: entra só na edição.
  const queries = [
    speciesQuery,
    locationTypesQuery,
    municipalitiesQuery,
    ...(periodId === undefined ? [] : [periodQuery]),
  ]
  const failedQueries = queries.filter((query) => query.isError)

  return {
    editingPeriod: periodQuery.data,
    species: speciesQuery.data ?? [],
    locationTypes: locationTypesQuery.data ?? [],
    municipalities: municipalitiesQuery.data ?? [],
    isLoading: queries.some((query) => query.isPending),
    isPeriodNotFound: getApiErrorStatus(periodQuery.error) === 404,
    hasLoadError: failedQueries.length > 0,
    loadError: failedQueries[0]?.error,
    isRetrying: failedQueries.some((query) => query.isRefetching),
    retry: () => failedQueries.forEach((query) => query.refetch()),
  }
}
