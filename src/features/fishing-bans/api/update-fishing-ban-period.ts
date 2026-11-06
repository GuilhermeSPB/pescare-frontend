import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getFishingBanPeriodsQueryOptions } from '@/features/fishing-bans/api/get-fishing-ban-periods'
import type {
  FishingBanPeriod,
  UpdateFishingBanPeriodInput,
} from '@/features/fishing-bans/types/fishing-ban-period'
import { api } from '@/lib/api-client'

/**
 * Corrige a versão atual ou um rascunho no lugar (PUT /fishing-ban-periods/:id). Listas enviadas
 * (janelas, espécies, tipos de local, municípios) substituem as anteriores inteiras. Versão antiga
 * responde 409.
 *
 * @example
 * await updateFishingBanPeriod({ id: 12, data: { valid_until: '2026-10-26' } })
 */
export const updateFishingBanPeriod = ({
  id,
  data,
}: UpdateFishingBanPeriodInput): Promise<FishingBanPeriod> =>
  api.put<FishingBanPeriod>(`/fishing-ban-periods/${id}`, data).then((response) => response.data)

/**
 * Mutation de alteração; atualiza a lista e o detalhe do período ao concluir.
 *
 * @example
 * const updateMutation = useUpdateFishingBanPeriod()
 * updateMutation.mutate({ id: 12, data: { valid_until: null } })
 */
export const useUpdateFishingBanPeriod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateFishingBanPeriod,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getFishingBanPeriodsQueryOptions().queryKey }),
  })
}
