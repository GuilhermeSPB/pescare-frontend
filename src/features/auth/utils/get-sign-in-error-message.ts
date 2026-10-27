import { getApiErrorMessage, getApiErrorStatus } from '@/utils/api-error'

// O backend responde 401 para e-mail inexistente e senha errada sem distinguir,
// de propósito; a mensagem mantém isso.
const SIGN_IN_ERROR_BY_STATUS: Record<number, string> = {
  401: 'E-mail ou senha incorretos. Confira e tente de novo.',
  403: 'Este usuário está desativado. Peça a um administrador para reativá-lo.',
}

/**
 * Mensagem para o usuário quando o login falha.
 *
 * @example
 * getSignInErrorMessage(signInMutation.error)
 */
export const getSignInErrorMessage = (error: unknown): string => {
  const status = getApiErrorStatus(error)
  const knownMessage = status === undefined ? undefined : SIGN_IN_ERROR_BY_STATUS[status]

  return knownMessage ?? getApiErrorMessage(error, 'Não foi possível entrar. Tente novamente.')
}
