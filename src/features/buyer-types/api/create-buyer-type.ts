import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getBuyerTypesQueryOptions } from '@/features/buyer-types/api/get-buyer-types'
import type { BuyerType, CreateBuyerTypeInput } from '@/features/buyer-types/types/buyer-type'
import { api } from '@/lib/api-client'

/**
 * Cadastra um tipo de comprador (POST /buyer-types). Nasce ativo.
 * Nome repetido responde 409.
 *
 * @example
 * await createBuyerType({ name: 'Atravessador' })
 */
export const createBuyerType = (input: CreateBuyerTypeInput): Promise<BuyerType> =>
  api.post<BuyerType>('/buyer-types', input).then((response) => response.data)

/**
 * Mutation de cadastro; atualiza a lista ao concluir.
 *
 * @example
 * const createMutation = useCreateBuyerType()
 * createMutation.mutate({ name: 'Feira' })
 */
export const useCreateBuyerType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBuyerType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getBuyerTypesQueryOptions().queryKey }),
  })
}
