import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getMunicipalitiesQueryOptions } from '@/features/municipalities/api/get-municipalities'
import type { UpdateMunicipalityInput } from '@/features/municipalities/types/update-municipality-input'
import { api } from '@/lib/api-client'
import type { Municipality } from '@/types/municipality'

/**
 * Corrige o nome de um município (PUT /municipalities/:ibgeCode, somente admin).
 * A próxima carga do arquivo do IBGE no backend volta ao nome do arquivo.
 *
 * @example
 * await updateMunicipality({ ibgeCode: '2507507', data: { name: 'João Pessoa' } })
 */
export const updateMunicipality = ({
  ibgeCode,
  data,
}: UpdateMunicipalityInput): Promise<Municipality> =>
  api.put<Municipality>(`/municipalities/${ibgeCode}`, data).then((response) => response.data)

/**
 * Mutation de correção do nome; busca a lista de novo ao concluir.
 *
 * @example
 * const updateMutation = useUpdateMunicipality()
 * updateMutation.mutate({ ibgeCode: '2507507', data: { name: 'João Pessoa' } })
 */
export const useUpdateMunicipality = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMunicipality,
    // A lista tem `staleTime: Infinity`, mas invalidar busca de novo mesmo assim.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getMunicipalitiesQueryOptions().queryKey }),
  })
}
