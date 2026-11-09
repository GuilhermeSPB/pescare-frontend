import type { UseQueryResult } from '@tanstack/react-query'

import { useAlertById } from '@/features/alerts/api/get-alert-by-id'
import type { Municipality } from '@/types/municipality'
import { getApiErrorStatus } from '@/utils/api-error'

/**
 * Junta o que o formulário do comunicado precisa num só estado de carregamento: o comunicado (na
 * edição) e os municípios. O formulário só aparece quando tudo chegou, para abrir já preenchido.
 *
 * @param alertId sem id: cadastro, e o comunicado não é buscado.
 * @param municipalitiesQuery vem da feature de municípios, composta na rota.
 * @example
 * const formQueries = useAlertFormQueries(alertId, municipalitiesQuery)
 */
export const useAlertFormQueries = (
  alertId: number | undefined,
  municipalitiesQuery: UseQueryResult<Municipality[]>,
) => {
  const alertQuery = useAlertById(alertId)
  // A query do comunicado desligada (cadastro) fica "pending" para sempre: entra só na edição.
  const queries = [municipalitiesQuery, ...(alertId === undefined ? [] : [alertQuery])]
  const failedQueries = queries.filter((query) => query.isError)

  return {
    editingAlert: alertQuery.data,
    municipalities: municipalitiesQuery.data ?? [],
    isLoading: queries.some((query) => query.isPending),
    isAlertNotFound: getApiErrorStatus(alertQuery.error) === 404,
    hasLoadError: failedQueries.length > 0,
    loadError: failedQueries[0]?.error,
    isRetrying: failedQueries.some((query) => query.isRefetching),
    retry: () => failedQueries.forEach((query) => query.refetch()),
  }
}
