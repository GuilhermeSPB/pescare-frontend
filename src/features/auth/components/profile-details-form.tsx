import { zodResolver } from '@hookform/resolvers/zod'
import { InputText } from 'primereact/inputtext'
import { useId } from 'react'
import { Controller, useForm, type Control } from 'react-hook-form'
import { z } from 'zod'

import { FormDialogActions } from '@/components/form-dialog'
import { FormField } from '@/components/form-field'
import { InlineAlert } from '@/components/inline-alert'
import { MunicipalitySelect } from '@/components/municipality-select'
import { ReadOnlyField } from '@/components/read-only-field'
import { useUpdateMe } from '@/features/auth/api/update-me'
import type { UpdateMeInput } from '@/features/auth/types/auth'
import type { Municipality } from '@/types/municipality'
import type { User } from '@/types/user'
import { getApiErrorMessage } from '@/utils/api-error'
import { getRoleLabel } from '@/utils/get-role-label'
import { formatDatabaseDate } from '@/utils/iso-date'

// Mesmas regras do backend (updateMeSchema), redefinidas aqui: o zod do front é outro.
const profileDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome.'),
  fk_municipality_ibge_code: z.string().min(1, 'Escolha o município.'),
})

const SAVE_ERROR_FALLBACK = 'Não foi possível salvar seus dados. Tente novamente.'

interface MunicipalityFieldProps {
  control: Control<UpdateMeInput>
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

interface ProfileDetailsFormProps {
  currentUser: User
  municipalities: Municipality[]
  onSaved: () => void
}

// Dados pessoais de "Meu perfil": nome e município se editam; e-mail, perfil e cadastro só aparecem.
export function ProfileDetailsForm({
  currentUser,
  municipalities,
  onSaved,
}: ProfileDetailsFormProps) {
  const nameId = useId()
  const updateMeMutation = useUpdateMe()
  const { register, control, handleSubmit, reset, formState } = useForm<UpdateMeInput>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      name: currentUser.name,
      fk_municipality_ibge_code: currentUser.fk_municipality_ibge_code,
    },
  })

  // Os valores salvos viram o novo ponto de partida: o botão volta a esperar uma alteração.
  const handleDetailsSubmit = (input: UpdateMeInput) => {
    updateMeMutation.mutate(input, {
      onSuccess: (user) => {
        reset({ name: user.name, fk_municipality_ibge_code: user.fk_municipality_ibge_code })
        onSaved()
      },
    })
  }

  // Volta aos últimos dados salvos e tira o aviso de erro do envio anterior.
  const handleDetailsCancel = () => {
    reset()
    updateMeMutation.reset()
  }

  return (
    <form noValidate onSubmit={handleSubmit(handleDetailsSubmit)} className="flex flex-col gap-5">
      {updateMeMutation.isError && (
        <InlineAlert message={getApiErrorMessage(updateMeMutation.error, SAVE_ERROR_FALLBACK)} />
      )}
      <FormField id={nameId} label="Nome" errorMessage={formState.errors.name?.message}>
        {(controlProps) => (
          <InputText
            {...controlProps}
            {...register('name')}
            autoComplete="name"
            invalid={Boolean(formState.errors.name)}
            className="w-full"
          />
        )}
      </FormField>
      <MunicipalityField control={control} municipalities={municipalities} />
      <dl className="grid gap-5 sm:grid-cols-3">
        <ReadOnlyField label="E-mail" value={currentUser.email} />
        <ReadOnlyField label="Perfil" value={getRoleLabel(currentUser.role)} />
        <ReadOnlyField
          label="Cadastrado em"
          value={formatDatabaseDate(currentUser.registration_date)}
        />
      </dl>
      <FormDialogActions
        submitLabel="Salvar alterações"
        isSubmitting={updateMeMutation.isPending}
        isSubmitDisabled={!formState.isDirty}
        onCancel={handleDetailsCancel}
      />
    </form>
  )
}
