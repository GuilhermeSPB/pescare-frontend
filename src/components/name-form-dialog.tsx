import { zodResolver } from '@hookform/resolvers/zod'
import { InputText } from 'primereact/inputtext'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormDialog, FormDialogActions } from '@/components/form-dialog'
import { FormField } from '@/components/form-field'
import { InlineAlert } from '@/components/inline-alert'

export interface NameFormCopy {
  title: string
  fieldLabel: string
  requiredMessage: string
  submitLabel: string
}

interface NameFormValues {
  name: string
}

interface NameFormProps {
  copy: NameFormCopy
  defaultName: string
  isSubmitting: boolean
  // Erros da API: no campo (ex.: nome repetido) ou no formulário (demais casos).
  nameServerError?: string
  formServerError?: string
  onSubmit: (name: string) => void
  onCancel: () => void
}

function NameForm({
  copy,
  defaultName,
  isSubmitting,
  nameServerError,
  formServerError,
  onSubmit,
  onCancel,
}: NameFormProps) {
  const inputId = useId()
  const nameFormSchema = z.object({ name: z.string().trim().min(1, copy.requiredMessage) })
  const { register, handleSubmit, setError, formState } = useForm<NameFormValues>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: { name: defaultName },
  })

  useEffect(() => {
    if (nameServerError) setError('name', { message: nameServerError }, { shouldFocus: true })
  }, [nameServerError, setError])

  // Editando sem mudar nada, salvar não faria nada: o botão espera uma alteração.
  const isUnchangedEdit = defaultName !== '' && !formState.isDirty
  const nameErrorMessage = formState.errors.name?.message

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => onSubmit(values.name))}
      className="flex flex-col gap-5"
    >
      {formServerError && <InlineAlert message={formServerError} />}
      <FormField id={inputId} label={copy.fieldLabel} errorMessage={nameErrorMessage}>
        {(controlProps) => (
          <InputText
            {...controlProps}
            {...register('name')}
            autoFocus
            autoComplete="off"
            invalid={Boolean(nameErrorMessage)}
            className="w-full"
          />
        )}
      </FormField>
      <FormDialogActions
        submitLabel={copy.submitLabel}
        isSubmitting={isSubmitting}
        isSubmitDisabled={isUnchangedEdit}
        onCancel={onCancel}
      />
    </form>
  )
}

interface NameFormDialogProps extends Omit<NameFormProps, 'onCancel'> {
  isVisible: boolean
  onHide: () => void
}

export function NameFormDialog({ isVisible, onHide, ...formProps }: NameFormDialogProps) {
  return (
    <FormDialog
      isVisible={isVisible}
      title={formProps.copy.title}
      isSubmitting={formProps.isSubmitting}
      onHide={onHide}
    >
      <NameForm {...formProps} onCancel={onHide} />
    </FormDialog>
  )
}
