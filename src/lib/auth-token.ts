const AUTH_TOKEN_STORAGE_KEY = 'pescare-admin:token'

/**
 * Lê o JWT da sessão salvo no localStorage.
 *
 * @returns o token, ou `null` quando não há sessão.
 * @example
 * const hasSession = getAuthToken() !== null
 */
export const getAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

/**
 * Salva o JWT recebido no login. Ele expira em 1 dia (backend).
 *
 * @example
 * saveAuthToken(signInResponse.token)
 */
export const saveAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

/**
 * Remove o JWT salvo, encerrando a sessão neste navegador.
 *
 * @example
 * clearAuthToken()
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}
