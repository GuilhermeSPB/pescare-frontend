import axios, { isAxiosError } from 'axios'

import { env } from '@/config/env'
import { paths } from '@/config/paths'
import { clearAuthToken, getAuthToken } from '@/lib/auth-token'

// O 401 do próprio login é "credenciais inválidas", não sessão expirada.
const SIGN_IN_ENDPOINT = '/auth/sign-in'

/**
 * Instância única do axios para a API do Pescare (`/api/v1`).
 * Envia o JWT salvo como `Authorization: Bearer` e manda para o login quando a sessão cai.
 *
 * @example
 * const response = await api.get<FishingMethod[]>('/fishing-methods')
 */
export const api = axios.create({
  baseURL: env.apiBaseUrl,
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const isExpiredSessionError = (error: unknown): boolean =>
  isAxiosError(error) && error.response?.status === 401 && error.config?.url !== SIGN_IN_ENDPOINT

api.interceptors.response.use(undefined, (error: unknown) => {
  if (isExpiredSessionError(error)) {
    console.warn('[api] sessão expirada ou inválida — redirecionando para o login')
    clearAuthToken()
    window.location.assign(paths.signIn)
  }

  return Promise.reject(error)
})
