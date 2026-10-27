import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getFishingMethodsQueryOptions } from '@/features/fishing-methods/api/get-fishing-methods'
import type {
  FishingMethod,
  UpdateFishingMethodInput,
} from '@/features/fishing-methods/types/fishing-method'
import { api } from '@/lib/api-client'

/**
 * Altera nome e/ou situação de um método de pesca (PUT /fishing-methods/:id).
 * Desativar é a única forma de tirar um método do app: a API não apaga.
 *
 * @example
 * await updateFishingMethod({ id: 3, data: { is_active: false } })
 */
export const updateFishingMethod = ({
  id,
  data,
}: UpdateFishingMethodInput): Promise<FishingMethod> =>
  api.put<FishingMethod>(`/fishing-methods/${id}`, data).then((response) => response.data)

/**
 * Mutation de alteração; atualiza a lista ao concluir.
 *
 * @example
 * const updateMutation = useUpdateFishingMethod()
 * updateMutation.mutate({ id: 3, data: { name: 'Linha de mão' } })
 */
export const useUpdateFishingMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateFishingMethod,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getFishingMethodsQueryOptions().queryKey }),
  })
}
