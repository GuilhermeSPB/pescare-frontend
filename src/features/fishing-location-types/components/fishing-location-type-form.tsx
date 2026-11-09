import { zodResolver } from '@hookform/resolvers/zod'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useEffect, useId } from 'react'
import { Controller, useForm, type Control } from 'react-hook-form'
import { z } from 'zod'

import { FormDialogActions } from '@/components/form-dialog'
import { FormField } from '@/components/form-field'
import { InlineAlert } from '@/components/inline-alert'
import type {
  CreateFishingLocationTypeInput,
  FishingLocationType,
} from '@/features/fishing-location-types/types/fishing-location-type'
import type { FishingEnvironment } from '@/types/fishing-environment'
import { FISHING_ENVIRONMENT_OPTIONS } from '@/utils/fishing-environment'

interface FishingLocationTypeFormValues {
  name: string
  // null até escolher (e num tipo antigo, cadastrado sem ambiente); o schema recusa null.
  environment: FishingEnvironment | null
}

const fishingLocationTypeFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do corpo d’água.'),
  environment: z
    .enum(['CONTINENTAL', 'MARINHO'])
    .nullable()
    .refine((environment) => environment !== null, 'Escolha o ambiente.'),
})

const toFormValues = (item?: FishingLocationType): FishingLocationTypeFormValues => ({
  name: item?.name ?? '',
  environment: item?.environment ?? null,
})

interface EnvironmentFieldProps {
  control: Control<FishingLocationTypeFormValues>
}

// O Dropdown não é um input nativo: entra pelo Controller, com o rótulo e o erro
// ligados ao input focável dele (`inputId`, `focusInputRef`).
function EnvironmentField({ control }: EnvironmentFieldProps) {
  const inputId = useId()

  return (
    <Controller
      name="environment"
      control={control}
      render={({ field, fieldState }) => (
        <FormField id={inputId} label="Ambiente" errorMessage={fieldState.error?.message}>
          {({ id, ...ariaProps }) => (
            <Dropdown
              {...ariaProps}
              inputId={id}
              focusInputRef={field.ref}
              value={field.value}
              options={FISHING_ENVIRONMENT_OPTIONS}
              onChange={(event) => field.onChange(event.value)}
              onBlur={field.onBlur}
              invalid={Boolean(fieldState.error)}
              className="w-full"
            />
          )}
        </FormField>
      )}
    />
  )
}

interface FishingLocationTypeFormProps {
  // Sem tipo: cadastro. Com tipo: edição.
  editingItem?: FishingLocationType
  isSubmitting: boolean
  // Erros da API: no nome (nome repetido) ou no formulário (demais casos).
  nameServerError?: string
  formServerError?: string
  onSubmit: (input: CreateFishingLocationTypeInput) => void
  onCancel: () => void
}

export function FishingLocationTypeForm({
  editingItem,
  isSubmitting,
  nameServerError,
  formServerError,
  onSubmit,
  onCancel,
}: FishingLocationTypeFormProps) {
  const nameId = useId()
  const { register, control, handleSubmit, setError, formState } =
    useForm<FishingLocationTypeFormValues>({
      resolver: zodResolver(fishingLocationTypeFormSchema),
      defaultValues: toFormValues(editingItem),
    })

  useEffect(() => {
    if (nameServerError) setError('name', { message: nameServerError }, { shouldFocus: true })
  }, [nameServerError, setError])

  const handleValidSubmit = ({ name, environment }: FishingLocationTypeFormValues) => {
    // O schema já recusou o ambiente vazio; a checagem só estreita o tipo.
    if (environment === null) return
    onSubmit({ name, environment })
  }

  // Editando sem mudar nada, salvar não faria nada: o botão espera uma alteração.
  const isUnchangedEdit = Boolean(editingItem) && !formState.isDirty
  const { errors } = formState

  return (
    <form noValidate onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-col gap-5">
      {formServerError && <InlineAlert message={formServerError} />}
      <FormField id={nameId} label="Nome do corpo d’água" errorMessage={errors.name?.message}>
        {(controlProps) => (
          <InputText
            {...controlProps}
            {...register('name')}
            autoFocus
            autoComplete="off"
            invalid={Boolean(errors.name)}
            className="w-full"
          />
        )}
      </FormField>
      <EnvironmentField control={control} />
      <FormDialogActions
        submitLabel={editingItem ? 'Salvar alterações' : 'Cadastrar corpo d’água'}
        isSubmitting={isSubmitting}
        isSubmitDisabled={isUnchangedEdit}
        onCancel={onCancel}
      />
    </form>
  )
}
