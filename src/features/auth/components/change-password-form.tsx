import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormDialogActions } from '@/components/form-dialog'
import { InlineAlert } from '@/components/inline-alert'
import { PasswordField } from '@/components/password-field'
import { useChangePassword } from '@/features/auth/api/change-password'
import { getApiErrorMessage } from '@/utils/api-error'

// Mesmas regras do backend (changePasswordSchema), mais a confirmação, que só existe aqui.
const changePasswordFormSchema = z
  .object({
    current_password: z.string().min(1, 'Informe a senha atual.'),
    new_password: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres.'),
    confirm_password: z.string().min(1, 'Repita a nova senha.'),
  })
  .refine((values) => values.new_password !== values.current_password, {
    message: 'A nova senha deve ser diferente da atual.',
    path: ['new_password'],
  })
  .refine((values) => values.confirm_password === values.new_password, {
    message: 'As senhas não conferem.',
    path: ['confirm_password'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>

const EMPTY_PASSWORDS: ChangePasswordFormValues = {
  current_password: '',
  new_password: '',
  confirm_password: '',
}

const SAVE_ERROR_FALLBACK = 'Não foi possível alterar a senha. Tente novamente.'

interface ChangePasswordFormProps {
  onPasswordChanged: () => void
}

// Cartão "Senha" de "Meu perfil". Depois da troca os campos se esvaziam: senha não fica na tela.
export function ChangePasswordForm({ onPasswordChanged }: ChangePasswordFormProps) {
  const changePasswordMutation = useChangePassword()
  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: EMPTY_PASSWORDS,
  })

  // A confirmação fica no formulário: a API recebe só a senha atual e a nova.
  const handlePasswordSubmit = ({ current_password, new_password }: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(
      { current_password, new_password },
      {
        onSuccess: () => {
          reset(EMPTY_PASSWORDS)
          onPasswordChanged()
        },
      },
    )
  }

  // Só esvazia os campos e tira o aviso de erro do envio anterior.
  const handlePasswordCancel = () => {
    reset(EMPTY_PASSWORDS)
    changePasswordMutation.reset()
  }

  return (
    <form noValidate onSubmit={handleSubmit(handlePasswordSubmit)} className="flex flex-col gap-5">
      {changePasswordMutation.isError && (
        <InlineAlert
          message={getApiErrorMessage(changePasswordMutation.error, SAVE_ERROR_FALLBACK)}
        />
      )}
      <PasswordField
        control={control}
        name="current_password"
        label="Senha atual"
        autoComplete="current-password"
      />
      <PasswordField
        control={control}
        name="new_password"
        label="Nova senha"
        autoComplete="new-password"
      />
      <PasswordField
        control={control}
        name="confirm_password"
        label="Confirmar nova senha"
        autoComplete="new-password"
      />
      <FormDialogActions
        submitLabel="Alterar senha"
        isSubmitting={changePasswordMutation.isPending}
        isSubmitDisabled={false}
        onCancel={handlePasswordCancel}
      />
    </form>
  )
}
