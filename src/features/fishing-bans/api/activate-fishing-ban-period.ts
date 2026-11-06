import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getFishingBanPeriodsQueryOptions } from '@/features/fishing-bans/api/get-fishing-ban-periods'
import type { FishingBanPeriod } from '@/features/fishing-bans/types/fishing-ban-period'
import { api } from '@/lib/api-client'

/**
 * Ativa um rascunho (POST /fishing-ban-periods/:id/activate). Se ele é a nova versão de outro
 * período, a versão anterior passa a valer até a véspera do início dele.
 *
 * @example
 * await activateFishingBanPeriod(15)
 */
export const activateFishingBanPeriod = (id: number): Promise<FishingBanPeriod> =>
  api
    .post<FishingBanPeriod>(`/fishing-ban-periods/${id}/activate`)
    .then((response) => response.data)

/**
 * Mutation da ativação; atualiza a lista, os detalhes e os históricos ao concluir.
 *
 * @example
 * const activateMutation = useActivateFishingBanPeriod()
 * activateMutation.mutate(period.id)
 */
export const useActivateFishingBanPeriod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activateFishingBanPeriod,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getFishingBanPeriodsQueryOptions().queryKey }),
  })
}
