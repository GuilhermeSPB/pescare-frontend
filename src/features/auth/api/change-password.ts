import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { ChangePasswordInput } from '@/features/auth/types/auth'

/**
 * Troca a senha do usuário da sessão (PATCH /users/me/password, responde 204).
 * Senha atual errada responde 400 com "Senha atual incorreta".
 *
 * @example
 * await changePassword({ current_password: '••••', new_password: '••••••••' })
 */
export const changePassword = (input: ChangePasswordInput): Promise<void> =>
  api.patch('/users/me/password', input).then(() => undefined)

/**
 * Mutation da troca de senha. Nada a invalidar: a resposta não traz dados.
 *
 * @example
 * const changePasswordMutation = useChangePassword()
 * changePasswordMutation.mutate(input, { onSuccess: handlePasswordChanged })
 */
export const useChangePassword = () => useMutation({ mutationFn: changePassword })
