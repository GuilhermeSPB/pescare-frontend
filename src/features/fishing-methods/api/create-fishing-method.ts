import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getFishingMethodsQueryOptions } from '@/features/fishing-methods/api/get-fishing-methods'
import type {
  CreateFishingMethodInput,
  FishingMethod,
} from '@/features/fishing-methods/types/fishing-method'
import { api } from '@/lib/api-client'

/**
 * Cadastra um método de pesca (POST /fishing-methods). Nasce ativo.
 * Nome repetido responde 409.
 *
 * @example
 * await createFishingMethod({ name: 'Tarrafa' })
 */
export const createFishingMethod = (input: CreateFishingMethodInput): Promise<FishingMethod> =>
  api.post<FishingMethod>('/fishing-methods', input).then((response) => response.data)

/**
 * Mutation de cadastro; atualiza a lista ao concluir.
 *
 * @example
 * const createMutation = useCreateFishingMethod()
 * createMutation.mutate({ name: 'Covo' })
 */
export const useCreateFishingMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFishingMethod,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getFishingMethodsQueryOptions().queryKey }),
  })
}
