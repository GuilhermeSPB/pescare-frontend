import { queryOptions, useQuery } from '@tanstack/react-query'

import type { AlertListItem } from '@/features/alerts/types/alert'
import { api } from '@/lib/api-client'

/**
 * Lista todos os comunicados, de qualquer status, do mais recente ao mais antigo (GET /alerts).
 * Cada item traz a contagem de municípios; a lista deles vem só no detalhe.
 *
 * @example
 * const alerts = await getAlerts()
 */
export const getAlerts = (): Promise<AlertListItem[]> =>
  api.get<AlertListItem[]>('/alerts').then((response) => response.data)

/**
 * Query options da lista de comunicados. A chave também é o prefixo do detalhe
 * (`['alerts', id]`): invalidar a lista invalida os detalhes.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getAlertsQueryOptions().queryKey })
 */
export const getAlertsQueryOptions = () =>
  queryOptions({ queryKey: ['alerts'], queryFn: getAlerts })

/**
 * Lista de comunicados como estado do servidor.
 *
 * @example
 * const alertsQuery = useAlerts()
 */
export const useAlerts = () => useQuery(getAlertsQueryOptions())
