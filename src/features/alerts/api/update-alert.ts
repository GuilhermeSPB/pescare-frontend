import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getAlertsQueryOptions } from '@/features/alerts/api/get-alerts'
import type { AlertDetails, UpdateAlertInput } from '@/features/alerts/types/alert'
import { api } from '@/lib/api-client'

/**
 * Altera o conteúdo ou o status de um comunicado (PUT /alerts/:id). A lista de municípios enviada
 * substitui a anterior inteira; ao publicar, a API define a data de publicação como hoje.
 *
 * @example
 * await updateAlert({ id: 12, data: { status: 'ARCHIVED' } })
 */
export const updateAlert = ({ id, data }: UpdateAlertInput): Promise<AlertDetails> =>
  api.put<AlertDetails>(`/alerts/${id}`, data).then((response) => response.data)

/**
 * Mutation de alteração; atualiza a lista e o detalhe do comunicado ao concluir.
 *
 * @example
 * const updateMutation = useUpdateAlert()
 * updateMutation.mutate({ id: 12, data: { status: 'PUBLISHED' } })
 */
export const useUpdateAlert = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getAlertsQueryOptions().queryKey }),
  })
}
