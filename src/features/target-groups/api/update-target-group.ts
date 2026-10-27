import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getTargetGroupsQueryOptions } from '@/features/target-groups/api/get-target-groups'
import type {
  TargetGroup,
  UpdateTargetGroupInput,
} from '@/features/target-groups/types/target-group'
import { api } from '@/lib/api-client'

/**
 * Altera nome e/ou situação de um grupo-alvo (PUT /target-groups/:id).
 * Desativar é a única forma de tirar um grupo do app: a API não apaga.
 *
 * @example
 * await updateTargetGroup({ id: 2, data: { is_active: false } })
 */
export const updateTargetGroup = ({ id, data }: UpdateTargetGroupInput): Promise<TargetGroup> =>
  api.put<TargetGroup>(`/target-groups/${id}`, data).then((response) => response.data)

/**
 * Mutation de alteração; atualiza a lista ao concluir.
 *
 * @example
 * const updateMutation = useUpdateTargetGroup()
 * updateMutation.mutate({ id: 2, data: { name: 'Peixes de água doce' } })
 */
export const useUpdateTargetGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTargetGroup,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getTargetGroupsQueryOptions().queryKey }),
  })
}
