import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getSpeciesQueryOptions } from '@/features/species/api/get-species'
import type { CreateSpeciesInput, Species } from '@/features/species/types/species'
import { api } from '@/lib/api-client'

/**
 * Cadastra uma espécie (POST /species). Nasce ativa.
 * Grupo-alvo inexistente responde 400.
 *
 * @example
 * await createSpecies({ main_name: 'Tambaqui', scientific_name: 'Colossoma macropomum', target_group_id: 1 })
 */
export const createSpecies = (input: CreateSpeciesInput): Promise<Species> =>
  api.post<Species>('/species', input).then((response) => response.data)

/**
 * Mutation de cadastro; atualiza a lista ao concluir.
 *
 * @example
 * const createMutation = useCreateSpecies()
 * createMutation.mutate({ main_name: 'Pirarucu', scientific_name: 'Arapaima gigas', target_group_id: 1 })
 */
export const useCreateSpecies = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSpecies,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getSpeciesQueryOptions().queryKey }),
  })
}
