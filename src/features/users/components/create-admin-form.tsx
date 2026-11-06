import { zodResolver } from '@hookform/resolvers/zod'
import { InputText } from 'primereact/inputtext'
import { useEffect, useId } from 'react'
import { Controller, useForm, type Control } from 'react-hook-form'
import { z } from 'zod'

import { FormDialogActions } from '@/components/form-dialog'
import { FormField } from '@/components/form-field'
import { InlineAlert } from '@/components/inline-alert'
import { MunicipalitySelect } from '@/components/municipality-select'
import { PasswordField } from '@/components/password-field'
import type { CreateAdminInput } from '@/features/users/types/user-input'
import type { Municipality } from '@/types/municipality'

// Mesmas regras do backend (users.schema.ts), redefinidas aqui: o zod do front é outro.
const createAdminFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do administrador.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe o e-mail.')
    .email('Informe um e-mail válido, como nome@exemplo.com.'),
  password: z.string().min(8, 'A senha inicial deve ter no mínimo 8 caracteres.'),
  fk_municipality_ibge_code: z.string().min(1, 'Escolha o município.'),
})

interface MunicipalityFieldProps {
  control: Control<CreateAdminInput>
  municipalities: Municipality[]
}

function MunicipalityField({ control, municipalities }: MunicipalityFieldProps) {
  return (
    <Controller
      name="fk_municipality_ibge_code"
      control={control}
      render={({ field, fieldState }) => (
        <MunicipalitySelect
          municipalities={municipalities}
          value={field.value}
          errorMessage={fieldState.error?.message}
          municipalityInputRef={field.ref}
          onChange={field.onChange}
        />
      )}
    />
  )
}

interface CreateAdminFormProps {
  municipalities: Municipality[]
  // Município de quem está cadastrando: o mais provável para o novo admin.
  defaultMunicipalityCode: string
  isSubmitting: boolean
  // Erros da API: no campo (e-mail já cadastrado) ou no formulário (demais casos).
  emailServerError?: string
  formServerError?: string
  onSubmit: (input: CreateAdminInput) => void
  onCancel: () => void
}

export function CreateAdminForm({
  municipalities,
  defaultMunicipalityCode,
  isSubmitting,
  emailServerError,
  formServerError,
  onSubmit,
  onCancel,
}: CreateAdminFormProps) {
  const nameId = useId()
  const emailId = useId()
  const { register, control, handleSubmit, setError, formState } = useForm<CreateAdminInput>({
    resolver: zodResolver(createAdminFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      fk_municipality_ibge_code: defaultMunicipalityCode,
    },
  })

  useEffect(() => {
    if (emailServerError) setError('email', { message: emailServerError }, { shouldFocus: true })
  }, [emailServerError, setError])

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {formServerError && <InlineAlert message={formServerError} />}
      <FormField id={nameId} label="Nome" errorMessage={formState.errors.name?.message}>
        {(controlProps) => (
          <InputText
            {...controlProps}
            {...register('name')}
            autoFocus
            autoComplete="off"
            invalid={Boolean(formState.errors.name)}
            className="w-full"
          />
        )}
      </FormField>
      <FormField id={emailId} label="E-mail" errorMessage={formState.errors.email?.message}>
        {(controlProps) => (
          <InputText
            {...controlProps}
            {...register('email')}
            type="email"
            autoComplete="off"
            invalid={Boolean(formState.errors.email)}
            className="w-full"
          />
        )}
      </FormField>
      <PasswordField
        control={control}
        name="password"
        label="Senha inicial"
        autoComplete="new-password"
      />
      <MunicipalityField control={control} municipalities={municipalities} />
      <FormDialogActions
        submitLabel="Cadastrar administrador"
        isSubmitting={isSubmitting}
        isSubmitDisabled={false}
        onCancel={onCancel}
      />
    </form>
  )
}
