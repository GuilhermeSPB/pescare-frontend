import type { UseQueryResult } from '@tanstack/react-query'

import { useSpecies } from '@/features/species/api/get-species'
import type { NamedCatalogItem } from '@/types/named-catalog'

/**
 * Junta a lista de espécies com a de grupos-alvo num só estado de carregamento:
 * a tabela só aparece quando as duas chegaram, para nenhuma linha ficar sem o nome do grupo.
 * Se uma falhar, "Tentar novamente" refaz só a que falhou.
 *
 * @param targetGroupsQuery vem da feature de grupos-alvo, composta na rota.
 * @example
 * const catalogQueries = useSpeciesCatalogQueries(targetGroupsQuery)
 */
export const useSpeciesCatalogQueries = (targetGroupsQuery: UseQueryResult<NamedCatalogItem[]>) => {
  const speciesQuery = useSpecies()
  const failedQueries = [speciesQuery, targetGroupsQuery].filter((query) => query.isError)

  return {
    speciesList: speciesQuery.data ?? [],
    targetGroups: targetGroupsQuery.data ?? [],
    isLoading: speciesQuery.isPending || targetGroupsQuery.isPending,
    isLoaded: speciesQuery.isSuccess && targetGroupsQuery.isSuccess,
    hasLoadError: failedQueries.length > 0,
    loadError: failedQueries[0]?.error,
    isRetrying: failedQueries.some((query) => query.isRefetching),
    retry: () => failedQueries.forEach((query) => query.refetch()),
  }
}
