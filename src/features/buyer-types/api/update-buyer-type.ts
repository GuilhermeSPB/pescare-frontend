import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getBuyerTypesQueryOptions } from '@/features/buyer-types/api/get-buyer-types'
import type { BuyerType, UpdateBuyerTypeInput } from '@/features/buyer-types/types/buyer-type'
import { api } from '@/lib/api-client'

/**
 * Altera nome e/ou situação de um tipo de comprador (PUT /buyer-types/:id).
 * Desativar é a única forma de tirar um tipo do app: a API não apaga.
 *
 * @example
 * await updateBuyerType({ id: 1, data: { is_active: false } })
 */
export const updateBuyerType = ({ id, data }: UpdateBuyerTypeInput): Promise<BuyerType> =>
  api.put<BuyerType>(`/buyer-types/${id}`, data).then((response) => response.data)

/**
 * Mutation de alteração; atualiza a lista ao concluir.
 *
 * @example
 * const updateMutation = useUpdateBuyerType()
 * updateMutation.mutate({ id: 1, data: { name: 'Peixaria' } })
 */
export const useUpdateBuyerType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBuyerType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getBuyerTypesQueryOptions().queryKey }),
  })
}
