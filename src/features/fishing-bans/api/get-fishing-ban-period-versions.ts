import { queryOptions, useQuery } from '@tanstack/react-query'

import type { FishingBanPeriodListItem } from '@/features/fishing-bans/types/fishing-ban-period'
import { api } from '@/lib/api-client'

/**
 * Todas as versões do período a que o id pertence, da mais nova para a mais antiga
 * (GET /fishing-ban-periods/:id/versions).
 *
 * @example
 * const versions = await getFishingBanPeriodVersions(12)
 */
export const getFishingBanPeriodVersions = (id: number): Promise<FishingBanPeriodListItem[]> =>
  api
    .get<FishingBanPeriodListItem[]>(`/fishing-ban-periods/${id}/versions`)
    .then((response) => response.data)

/**
 * Query options do histórico de versões. A chave começa com `['fishing-ban-periods']`: as
 * mutações que invalidam a lista também invalidam o histórico.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getFishingBanPeriodVersionsQueryOptions(12).queryKey })
 */
export const getFishingBanPeriodVersionsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['fishing-ban-periods', id, 'versions'],
    queryFn: () => getFishingBanPeriodVersions(id),
  })

/**
 * Histórico de versões de um período como estado do servidor.
 *
 * @param id sem id (endereço inválido), a query não roda.
 * @example
 * const versionsQuery = useFishingBanPeriodVersions(periodId)
 */
export const useFishingBanPeriodVersions = (id?: number) =>
  useQuery({ ...getFishingBanPeriodVersionsQueryOptions(id ?? 0), enabled: id !== undefined })
