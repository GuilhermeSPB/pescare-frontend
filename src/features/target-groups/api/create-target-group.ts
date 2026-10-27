import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getTargetGroupsQueryOptions } from '@/features/target-groups/api/get-target-groups'
import type {
  CreateTargetGroupInput,
  TargetGroup,
} from '@/features/target-groups/types/target-group'
import { api } from '@/lib/api-client'

/**
 * Cadastra um grupo-alvo (POST /target-groups). Nasce ativo.
 * Nome repetido responde 409.
 *
 * @example
 * await createTargetGroup({ name: 'Crustáceos' })
 */
export const createTargetGroup = (input: CreateTargetGroupInput): Promise<TargetGroup> =>
  api.post<TargetGroup>('/target-groups', input).then((response) => response.data)

/**
 * Mutation de cadastro; atualiza a lista ao concluir.
 *
 * @example
 * const createMutation = useCreateTargetGroup()
 * createMutation.mutate({ name: 'Moluscos' })
 */
export const useCreateTargetGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTargetGroup,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getTargetGroupsQueryOptions().queryKey }),
  })
}
