import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getFishingBanPeriodsQueryOptions } from '@/features/fishing-bans/api/get-fishing-ban-periods'
import type {
  CreateFishingBanPeriodVersionInput,
  FishingBanPeriod,
} from '@/features/fishing-bans/types/fishing-ban-period'
import { api } from '@/lib/api-client'

/**
 * Cria uma nova versão a partir da versão atual (POST /fishing-ban-periods/:id/versions). Ativa,
 * ela encerra a atual na véspera do próprio início; como rascunho, a atual segue vigente.
 *
 * @example
 * await createFishingBanPeriodVersion({ periodId: 12, data: toFishingBanPeriodInput(values) })
 */
export const createFishingBanPeriodVersion = ({
  periodId,
  data,
}: CreateFishingBanPeriodVersionInput): Promise<FishingBanPeriod> =>
  api
    .post<FishingBanPeriod>(`/fishing-ban-periods/${periodId}/versions`, data)
    .then((response) => response.data)

/**
 * Mutation da nova versão; atualiza a lista, os detalhes e os históricos ao concluir.
 *
 * @example
 * const createVersionMutation = useCreateFishingBanPeriodVersion()
 * createVersionMutation.mutate({ periodId: 12, data: input })
 */
export const useCreateFishingBanPeriodVersion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFishingBanPeriodVersion,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getFishingBanPeriodsQueryOptions().queryKey }),
  })
}
