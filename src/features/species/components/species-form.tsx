import { zodResolver } from '@hookform/resolvers/zod'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { useId } from 'react'
import { Controller, useForm, type Control } from 'react-hook-form'
import { z } from 'zod'

import { FormDialogActions } from '@/components/form-dialog'
import { FormField } from '@/components/form-field'
import { InlineAlert } from '@/components/inline-alert'
import type { CreateSpeciesInput, Species } from '@/features/species/types/species'
import type { TargetGroupOption } from '@/features/species/utils/target-group-lookup'

// O que o formulário entrega: todos os campos preenchidos, descrição vazia como ''.
export type SpeciesFormSubmission = Required<CreateSpeciesInput>

interface SpeciesFormValues extends Omit<SpeciesFormSubmission, 'target_group_id'> {
  // null até escolher um grupo; o schema recusa null com a mensagem de obrigatório.
  target_group_id: number | null
}

const speciesFormSchema = z.object({
  main_name: z.string().trim().min(1, 'Informe o nome popular da espécie.'),
  scientific_name: z.string().trim().min(1, 'Informe o nome científico da espécie.'),
  target_group_id: z.number({ invalid_type_error: 'Escolha o grupo-alvo da espécie.' }),
  description: z.string().trim(),
})

const toFormValues = (species?: Species): SpeciesFormValues => ({
  main_name: species?.main_name ?? '',
  scientific_name: species?.scientific_name ?? '',
  target_group_id: species?.fk_target_group_id ?? null,
  description: species?.description ?? '',
})

interface TargetGroupFieldProps {
  control: Control<SpeciesFormValues>
  options: TargetGroupOption[]
}

// O Dropdown não é um input nativo: entra pelo Controller, com o rótulo e o erro
// ligados ao input focável dele (`inputId`, `focusInputRef`).
function TargetGroupField({ control, options }: TargetGroupFieldProps) {
  const inputId = useId()

  return (
    <Controller
      name="target_group_id"
      control={control}
      render={({ field, fieldState }) => (
        <FormField id={inputId} label="Grupo-alvo" errorMessage={fieldState.error?.message}>
          {({ id, ...ariaProps }) => (
            <Dropdown
              {...ariaProps}
              inputId={id}
              focusInputRef={field.ref}
              value={field.value}
              options={options}
              onChange={(event) => field.onChange(event.value)}
              onBlur={field.onBlur}
              emptyMessage="Nenhum grupo-alvo ativo"
              invalid={Boolean(fieldState.error)}
              className="w-full"
            />
          )}
        </FormField>
      )}
    />
  )
}

interface SpeciesFormProps {
  // Sem espécie: cadastro. Com espécie: edição.
  editingSpecies?: Species
  targetGroupOptions: TargetGroupOption[]
  isSubmitting: boolean
  formServerError?: string
  onSubmit: (submission: SpeciesFormSubmission) => void
  onCancel: () => void
}

export function SpeciesForm({
  editingSpecies,
  targetGroupOptions,
  isSubmitting,
  formServerError,
  onSubmit,
  onCancel,
}: SpeciesFormProps) {
  const mainNameId = useId()
  const scientificNameId = useId()
  const descriptionId = useId()
  const { register, control, handleSubmit, formState } = useForm<SpeciesFormValues>({
    resolver: zodResolver(speciesFormSchema),
    defaultValues: toFormValues(editingSpecies),
  })

  const handleValidSubmit = ({ target_group_id, ...values }: SpeciesFormValues) => {
    // O schema já recusou o grupo vazio; a checagem só estreita o tipo.
    if (target_group_id === null) return
    onSubmit({ ...values, target_group_id })
  }

  // Editando sem mudar nada, salvar não faria nada: o botão espera uma alteração.
  const isUnchangedEdit = Boolean(editingSpecies) && !formState.isDirty
  const { errors } = formState

  return (
    <form noValidate onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-col gap-5">
      {formServerError && <InlineAlert message={formServerError} />}
      <FormField id={mainNameId} label="Nome popular" errorMessage={errors.main_name?.message}>
        {(controlProps) => (
          <InputText
            {...controlProps}
            {...register('main_name')}
            autoFocus
            autoComplete="off"
            invalid={Boolean(errors.main_name)}
            className="w-full"
          />
        )}
      </FormField>
      <FormField
        id={scientificNameId}
        label="Nome científico"
        errorMessage={errors.scientific_name?.message}
      >
        {(controlProps) => (
          <InputText
            {...controlProps}
            {...register('scientific_name')}
            autoComplete="off"
            invalid={Boolean(errors.scientific_name)}
            className="w-full italic"
          />
        )}
      </FormField>
      <TargetGroupField control={control} options={targetGroupOptions} />
      <FormField id={descriptionId} label="Descrição (opcional)">
        {(controlProps) => (
          <InputTextarea
            {...controlProps}
            {...register('description')}
            rows={3}
            autoResize
            className="w-full"
          />
        )}
      </FormField>
      <FormDialogActions
        submitLabel={editingSpecies ? 'Salvar alterações' : 'Cadastrar espécie'}
        isSubmitting={isSubmitting}
        isSubmitDisabled={isUnchangedEdit}
        onCancel={onCancel}
      />
    </form>
  )
}
