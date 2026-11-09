import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getAlertsQueryOptions } from '@/features/alerts/api/get-alerts'
import type { AlertDetails, CreateAlertInput } from '@/features/alerts/types/alert'
import { api } from '@/lib/api-client'

/**
 * Cadastra um comunicado, publicado ou como rascunho, com a sua cobertura (POST /alerts).
 *
 * @example
 * await createAlert({ title: 'Reunião', description: 'Dia 15, na colônia.', scope: 'GLOBAL', status: 'DRAFT', municipalities: [] })
 */
export const createAlert = (input: CreateAlertInput): Promise<AlertDetails> =>
  api.post<AlertDetails>('/alerts', input).then((response) => response.data)

/**
 * Mutation de cadastro; atualiza a lista de comunicados ao concluir.
 *
 * @example
 * const createMutation = useCreateAlert()
 * createMutation.mutate(toCreateAlertInput(values))
 */
export const useCreateAlert = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getAlertsQueryOptions().queryKey }),
  })
}
