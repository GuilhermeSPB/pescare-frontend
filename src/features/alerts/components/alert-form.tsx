import { zodResolver } from '@hookform/resolvers/zod'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { useId } from 'react'
import { Controller, useForm, useWatch, type Control } from 'react-hook-form'

import { FormDialogActions } from '@/components/form-dialog'
import { FormField } from '@/components/form-field'
import { FormSection } from '@/components/form-section'
import { InlineAlert } from '@/components/inline-alert'
import { SwitchField } from '@/components/switch-field'
import { AlertCoverageFields } from '@/features/alerts/components/alert-coverage-fields'
import type { AlertDetails } from '@/features/alerts/types/alert'
import {
  alertFormSchema,
  toAlertFormValues,
  type AlertFormMode,
  type AlertFormValues,
} from '@/features/alerts/utils/alert-form-values'
import type { Municipality } from '@/types/municipality'

// O botão diz o que acontece ao salvar: um comunicado publicado chega aos pescadores na hora.
const getSubmitLabel = (mode: AlertFormMode, isPublishingOnSave: boolean): string => {
  if (mode === 'edit') return 'Salvar alterações'

  return isPublishingOnSave ? 'Publicar comunicado' : 'Salvar rascunho'
}

function PublicationField({ control }: { control: Control<AlertFormValues> }) {
  return (
    <Controller
      name="is_published_on_save"
      control={control}
      render={({ field }) => (
        <SwitchField
          label="Publicar agora"
          isChecked={field.value}
          inputRef={field.ref}
          onChange={field.onChange}
        />
      )}
    />
  )
}

interface AlertFormProps {
  mode: AlertFormMode
  editingAlert?: AlertDetails
  municipalities: Municipality[]
  isSubmitting: boolean
  formServerError?: string
  onSubmit: (values: AlertFormValues) => void
  onCancel: () => void
}

export function AlertForm({
  mode,
  editingAlert,
  municipalities,
  isSubmitting,
  formServerError,
  onSubmit,
  onCancel,
}: AlertFormProps) {
  const titleId = useId()
  const descriptionId = useId()
  const { register, control, handleSubmit, formState } = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: toAlertFormValues(editingAlert),
  })
  const isPublishingOnSave = useWatch({ control, name: 'is_published_on_save' })
  const { errors } = formState

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Comunicado">
        <FormField id={titleId} label="Título" errorMessage={errors.title?.message}>
          {(controlProps) => (
            <InputText
              {...controlProps}
              {...register('title')}
              invalid={Boolean(errors.title)}
              className="w-full"
            />
          )}
        </FormField>
        <FormField id={descriptionId} label="Texto" errorMessage={errors.description?.message}>
          {(controlProps) => (
            <InputTextarea
              {...controlProps}
              {...register('description')}
              rows={6}
              autoResize
              invalid={Boolean(errors.description)}
              className="w-full"
            />
          )}
        </FormField>
      </FormSection>
      <FormSection title="Abrangência">
        <AlertCoverageFields control={control} municipalities={municipalities} />
      </FormSection>
      {formServerError && <InlineAlert message={formServerError} />}
      {/* Na edição o status não muda: publicar e arquivar são ações da lista. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {mode === 'create' && <PublicationField control={control} />}
        <div className="sm:ml-auto">
          <FormDialogActions
            submitLabel={getSubmitLabel(mode, isPublishingOnSave)}
            isSubmitting={isSubmitting}
            isSubmitDisabled={mode === 'edit' && !formState.isDirty}
            onCancel={onCancel}
          />
        </div>
      </div>
    </form>
  )
}
