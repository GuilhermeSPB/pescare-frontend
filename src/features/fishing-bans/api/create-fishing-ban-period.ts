import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getFishingBanPeriodsQueryOptions } from '@/features/fishing-bans/api/get-fishing-ban-periods'
import type {
  FishingBanPeriod,
  FishingBanPeriodInput,
} from '@/features/fishing-bans/types/fishing-ban-period'
import { api } from '@/lib/api-client'

/**
 * Cadastra um período de defeso, ativo ou como rascunho, com janelas, espécies, tipos de local e
 * municípios (POST /fishing-ban-periods).
 *
 * @example
 * await createFishingBanPeriod({ rule: 'Portaria IBAMA Nº 48/07', fishing_ban_type: 'CONTINENTAL', windows: [{ start_date: '11-15', end_date: '03-15' }], status: 'ACTIVE', ... })
 */
export const createFishingBanPeriod = (input: FishingBanPeriodInput): Promise<FishingBanPeriod> =>
  api.post<FishingBanPeriod>('/fishing-ban-periods', input).then((response) => response.data)

/**
 * Mutation de cadastro; atualiza a lista de períodos ao concluir.
 *
 * @example
 * const createMutation = useCreateFishingBanPeriod()
 * createMutation.mutate(toFishingBanPeriodInput(values))
 */
export const useCreateFishingBanPeriod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFishingBanPeriod,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getFishingBanPeriodsQueryOptions().queryKey }),
  })
}
