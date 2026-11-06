import { queryOptions, useQuery } from '@tanstack/react-query'

import type { FishingBanPeriodListItem } from '@/features/fishing-bans/types/fishing-ban-period'
import { api } from '@/lib/api-client'

/**
 * Lista os períodos de defeso, um por período: a versão atual, vigente, encerrada ou rascunho
 * (GET /fishing-ban-periods). Cada item resume a cobertura (contagem e UFs); os municípios vêm
 * só no detalhe.
 *
 * @example
 * const periods = await getFishingBanPeriods()
 */
export const getFishingBanPeriods = (): Promise<FishingBanPeriodListItem[]> =>
  api.get<FishingBanPeriodListItem[]>('/fishing-ban-periods').then((response) => response.data)

/**
 * Query options da lista de períodos. A chave também é o prefixo do detalhe
 * (`['fishing-ban-periods', id]`): invalidar a lista invalida os detalhes.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getFishingBanPeriodsQueryOptions().queryKey })
 */
export const getFishingBanPeriodsQueryOptions = () =>
  queryOptions({ queryKey: ['fishing-ban-periods'], queryFn: getFishingBanPeriods })

/**
 * Lista de períodos de defeso como estado do servidor.
 *
 * @example
 * const periodsQuery = useFishingBanPeriods()
 */
export const useFishingBanPeriods = () => useQuery(getFishingBanPeriodsQueryOptions())
