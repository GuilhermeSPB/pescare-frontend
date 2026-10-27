import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormField } from '@/components/form-field'
import { InlineAlert } from '@/components/inline-alert'
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
  const passwordId = useId()
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
      <FormField id={passwordId} label="Senha" errorMessage={formState.errors.password?.message}>
        {({ id, ...ariaProps }) => (
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Password
                {...ariaProps}
                inputId={id}
                inputRef={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                feedback={false}
                toggleMask
                autoComplete="current-password"
                invalid={Boolean(formState.errors.password)}
                // Com toggleMask o input fica dentro de um IconField, que não ocupa a largura toda.
                className="w-full [&>.p-icon-field]:w-full"
                inputClassName="w-full"
              />
            )}
          />
        )}
      </FormField>
      <Button
        type="submit"
        label="Entrar"
        loading={signInMutation.isPending}
        className="mt-1 w-full"
      />
    </form>
  )
}
