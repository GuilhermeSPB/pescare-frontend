import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { SignInInput, SignInResponse } from '@/features/auth/types/auth'

/**
 * Autentica com e-mail e senha (POST /auth/sign-in).
 *
 * @returns o JWT e o usuário autenticado.
 * @example
 * const { token } = await signIn({ email: 'admin@pescare.dev', password: '••••' })
 */
export const signIn = (input: SignInInput): Promise<SignInResponse> =>
  api.post<SignInResponse>('/auth/sign-in', input).then((response) => response.data)

/**
 * Mutation do login. Não salva o token: quem chama decide, depois de checar o perfil.
 *
 * @example
 * const signInMutation = useSignIn()
 * signInMutation.mutate(values, { onSuccess: handleSignedIn })
 */
export const useSignIn = () => useMutation({ mutationFn: signIn })
