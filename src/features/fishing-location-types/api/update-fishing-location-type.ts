import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getFishingLocationTypesQueryOptions } from '@/features/fishing-location-types/api/get-fishing-location-types'
import type {
  FishingLocationType,
  UpdateFishingLocationTypeInput,
} from '@/features/fishing-location-types/types/fishing-location-type'
import { api } from '@/lib/api-client'

/**
 * Altera nome, ambiente e/ou situação de um tipo de local de pesca (PUT /fishing-location-types/:id).
 * Desativar é a única forma de tirar um tipo do app: a API não apaga.
 *
 * @example
 * await updateFishingLocationType({ id: 4, data: { is_active: false } })
 */
export const updateFishingLocationType = ({
  id,
  data,
}: UpdateFishingLocationTypeInput): Promise<FishingLocationType> =>
  api
    .put<FishingLocationType>(`/fishing-location-types/${id}`, data)
    .then((response) => response.data)

/**
 * Mutation de alteração; atualiza a lista ao concluir.
 *
 * @example
 * const updateMutation = useUpdateFishingLocationType()
 * updateMutation.mutate({ id: 4, data: { name: 'Estuário' } })
 */
export const useUpdateFishingLocationType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateFishingLocationType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getFishingLocationTypesQueryOptions().queryKey }),
  })
}
