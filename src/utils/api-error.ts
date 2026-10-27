import { isAxiosError } from 'axios'

import type { ApiErrorBody } from '@/types/api-error'

const NETWORK_ERROR_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique se a API está no ar e tente novamente.'

/**
 * Lê o status HTTP de um erro da API.
 *
 * @returns o status, ou `undefined` quando não houve resposta (rede) ou não é erro do axios.
 * @example
 * if (getApiErrorStatus(error) === 409) showDuplicateNameError()
 */
export const getApiErrorStatus = (error: unknown): number | undefined =>
  isAxiosError(error) ? error.response?.status : undefined

/**
 * Extrai a mensagem para o usuário de um erro da API (`{ message }` do backend).
 *
 * @param fallbackMessage usada quando o erro não traz mensagem própria.
 * @example
 * getApiErrorMessage(error, 'Não foi possível salvar o método de pesca.')
 */
export const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (!isAxiosError<ApiErrorBody>(error)) return fallbackMessage
  if (!error.response) return NETWORK_ERROR_MESSAGE

  return error.response.data?.message ?? fallbackMessage
}
