import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getFishingLocationTypesQueryOptions } from '@/features/fishing-location-types/api/get-fishing-location-types'
import type {
  CreateFishingLocationTypeInput,
  FishingLocationType,
} from '@/features/fishing-location-types/types/fishing-location-type'
import { api } from '@/lib/api-client'

/**
 * Cadastra um tipo de local de pesca com o ambiente (POST /fishing-location-types). Nasce ativo.
 * Nome repetido responde 409.
 *
 * @example
 * await createFishingLocationType({ name: 'Rio', environment: 'CONTINENTAL' })
 */
export const createFishingLocationType = (
  input: CreateFishingLocationTypeInput,
): Promise<FishingLocationType> =>
  api.post<FishingLocationType>('/fishing-location-types', input).then((response) => response.data)

/**
 * Mutation de cadastro; atualiza a lista ao concluir.
 *
 * @example
 * const createMutation = useCreateFishingLocationType()
 * createMutation.mutate({ name: 'Lago', environment: 'CONTINENTAL' })
 */
export const useCreateFishingLocationType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFishingLocationType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getFishingLocationTypesQueryOptions().queryKey }),
  })
}
