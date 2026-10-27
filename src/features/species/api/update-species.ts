import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getSpeciesQueryOptions } from '@/features/species/api/get-species'
import type { Species, UpdateSpeciesInput } from '@/features/species/types/species'
import { api } from '@/lib/api-client'

/**
 * Altera dados e/ou situação de uma espécie (PUT /species/:id).
 * Desativar é a única forma de tirar uma espécie do app: a API não apaga.
 *
 * @example
 * await updateSpecies({ id: 7, data: { is_active: false } })
 */
export const updateSpecies = ({ id, data }: UpdateSpeciesInput): Promise<Species> =>
  api.put<Species>(`/species/${id}`, data).then((response) => response.data)

/**
 * Mutation de alteração; atualiza a lista ao concluir.
 *
 * @example
 * const updateMutation = useUpdateSpecies()
 * updateMutation.mutate({ id: 7, data: { main_name: 'Tucunaré-açu' } })
 */
export const useUpdateSpecies = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSpecies,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getSpeciesQueryOptions().queryKey }),
  })
}
