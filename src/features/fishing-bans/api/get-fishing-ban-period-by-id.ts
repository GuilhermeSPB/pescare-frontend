import { queryOptions, useQuery } from '@tanstack/react-query'

import type { FishingBanPeriod } from '@/features/fishing-bans/types/fishing-ban-period'
import { api } from '@/lib/api-client'

/**
 * Busca um período de defeso com os municípios cobertos (GET /fishing-ban-periods/:id).
 * Id inexistente responde 404.
 *
 * @example
 * const period = await getFishingBanPeriodById(12)
 */
export const getFishingBanPeriodById = (id: number): Promise<FishingBanPeriod> =>
  api.get<FishingBanPeriod>(`/fishing-ban-periods/${id}`).then((response) => response.data)

/**
 * Query options de um período de defeso.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getFishingBanPeriodByIdQueryOptions(12).queryKey })
 */
export const getFishingBanPeriodByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['fishing-ban-periods', id],
    queryFn: () => getFishingBanPeriodById(id),
  })

/**
 * Um período de defeso como estado do servidor.
 *
 * @param id sem id (cadastro), a query não roda.
 * @example
 * const periodQuery = useFishingBanPeriodById(periodId)
 */
export const useFishingBanPeriodById = (id?: number) =>
  useQuery({ ...getFishingBanPeriodByIdQueryOptions(id ?? 0), enabled: id !== undefined })
