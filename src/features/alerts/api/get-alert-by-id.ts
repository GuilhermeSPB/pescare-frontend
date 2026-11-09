import { queryOptions, useQuery } from '@tanstack/react-query'

import type { AlertDetails } from '@/features/alerts/types/alert'
import { api } from '@/lib/api-client'

/**
 * Busca um comunicado com os municípios cobertos (GET /alerts/:id). Id inexistente responde 404.
 *
 * @example
 * const alert = await getAlertById(12)
 */
export const getAlertById = (id: number): Promise<AlertDetails> =>
  api.get<AlertDetails>(`/alerts/${id}`).then((response) => response.data)

/**
 * Query options de um comunicado.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getAlertByIdQueryOptions(12).queryKey })
 */
export const getAlertByIdQueryOptions = (id: number) =>
  queryOptions({ queryKey: ['alerts', id], queryFn: () => getAlertById(id) })

/**
 * Um comunicado como estado do servidor.
 *
 * @param id sem id (cadastro), a query não roda.
 * @example
 * const alertQuery = useAlertById(alertId)
 */
export const useAlertById = (id?: number) =>
  useQuery({ ...getAlertByIdQueryOptions(id ?? 0), enabled: id !== undefined })
