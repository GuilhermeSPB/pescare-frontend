import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormField } from '@/components/form-field'
import { InlineAlert } from '@/components/inline-alert'
import { PasswordField } from '@/components/password-field'
import { useSignIn } from '@/features/auth/api/sign-in'
import type { SignInResponse } from '@/features/auth/types/auth'
import { getSignInErrorMessage } from '@/features/auth/utils/get-sign-in-error-message'
import { saveAuthToken } from '@/lib/auth-token'

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .email('Informe um e-mail válido, como nome@exemplo.com.'),
  password: z.string().min(1, 'Informe sua senha.'),
})

type SignInFormValues = z.infer<typeof signInSchema>

const NOT_ADMIN_MESSAGE =
  'Este painel é só para administradores. Pescadores usam o app Pescare no celular.'

interface SignInFormProps {
  onSignedIn: () => void
}

export function SignInForm({ onSignedIn }: SignInFormProps) {
  const emailId = useId()
  const signInMutation = useSignIn()
  const [roleErrorMessage, setRoleErrorMessage] = useState<string>()
  const { register, control, handleSubmit, formState } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  // O token só é salvo para administradores: o painel inteiro exige ADMIN.
  const handleSignInSuccess = ({ token, user }: SignInResponse) => {
    if (user.role !== 'ADMIN') {
      setRoleErrorMessage(NOT_ADMIN_MESSAGE)
      return
    }

    saveAuthToken(token)
    onSignedIn()
  }

  const handleSignInSubmit = (values: SignInFormValues) => {
    setRoleErrorMessage(undefined)
    signInMutation.mutate(values, { onSuccess: handleSignInSuccess })
  }

  const formErrorMessage = signInMutation.isError
    ? getSignInErrorMessage(signInMutation.error)
    : roleErrorMessage

  return (
    <form noValidate onSubmit={handleSubmit(handleSignInSubmit)} className="flex flex-col gap-5">
      {formErrorMessage && <InlineAlert message={formErrorMessage} />}
      <FormField id={emailId} label="E-mail" errorMessage={formState.errors.email?.message}>
        {(controlProps) => (
          <InputText
            {...controlProps}
            {...register('email')}
            type="email"
            autoComplete="email"
            autoFocus
            invalid={Boolean(formState.errors.email)}
            className="w-full"
          />
        )}
      </FormField>
      <PasswordField
        control={control}
        name="password"
        label="Senha"
        autoComplete="current-password"
      />
      <Button
        type="submit"
        label="Entrar"
        loading={signInMutation.isPending}
        className="mt-1 w-full"
      />
    </form>
  )
}
