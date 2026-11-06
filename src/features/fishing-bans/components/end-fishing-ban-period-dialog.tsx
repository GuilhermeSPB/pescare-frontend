import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { DateInput } from '@/components/date-input'
import { FormDialog, FormDialogActions } from '@/components/form-dialog'
import { FormField } from '@/components/form-field'
import { InlineAlert } from '@/components/inline-alert'
import { useUpdateFishingBanPeriod } from '@/features/fishing-bans/api/update-fishing-ban-period'
import type { FishingBanPeriodListItem } from '@/features/fishing-bans/types/fishing-ban-period'
import { getPeriodLabel } from '@/features/fishing-bans/utils/fishing-ban-period-summary'
import type { ToastText } from '@/hooks/use-toast'
import { getApiErrorMessage } from '@/utils/api-error'
import { formatIsoDate, isoDateToLocalDate, localDateToIsoDate } from '@/utils/iso-date'

const SAVE_ERROR_FALLBACK = 'Não foi possível encerrar a vigência. Tente novamente.'

// O que o diálogo usa do período: serve tanto a linha da lista quanto o detalhe da visualização.
type EndablePeriod = Pick<FishingBanPeriodListItem, 'id' | 'start_in' | 'fishing_ban' | 'windows'>

interface EndValidityFormValues {
  valid_until: Date | null
}

// O último dia não pode ser antes do início da vigência.
const buildEndValiditySchema = (startIn: Date) =>
  z.object({
    valid_until: z
      .date()
      .nullable()
      .refine((date) => date !== null, 'Informe o último dia de vigência.')
      .refine(
        (date) => date === null || date >= startIn,
        `O último dia não pode ser antes do início da vigência (${startIn.toLocaleDateString('pt-BR')}).`,
      ),
  })

// Começa em hoje; se a vigência ainda não começou, no primeiro dia dela.
const getDefaultLastDay = (startIn: Date): Date => {
  const today = isoDateToLocalDate(localDateToIsoDate(new Date()))

  return today >= startIn ? today : startIn
}

interface EndValidityFormProps {
  period: EndablePeriod
  isSubmitting: boolean
  formServerError?: string
  onSubmit: (validUntil: string) => void
  onCancel: () => void
}

function EndValidityForm({
  period,
  isSubmitting,
  formServerError,
  onSubmit,
  onCancel,
}: EndValidityFormProps) {
  const inputId = useId()
  const startIn = isoDateToLocalDate(period.start_in)
  const { control, handleSubmit } = useForm<EndValidityFormValues>({
    resolver: zodResolver(buildEndValiditySchema(startIn)),
    defaultValues: { valid_until: getDefaultLastDay(startIn) },
  })

  const handleValidSubmit = ({ valid_until }: EndValidityFormValues) => {
    // O schema já recusou a data vazia; a checagem só estreita o tipo.
    if (valid_until === null) return
    onSubmit(localDateToIsoDate(valid_until))
  }

  return (
    <form noValidate onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-col gap-5">
      {formServerError && <InlineAlert message={formServerError} />}
      <Controller
        name="valid_until"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            id={inputId}
            label="Último dia de vigência"
            errorMessage={fieldState.error?.message}
          >
            {(controlProps) => (
              <DateInput
                {...controlProps}
                inputRef={field.ref}
                value={field.value}
                minDate={startIn}
                isInvalid={Boolean(fieldState.error)}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          </FormField>
        )}
      />
      <FormDialogActions
        submitLabel="Encerrar vigência"
        isSubmitting={isSubmitting}
        isSubmitDisabled={false}
        onCancel={onCancel}
      />
    </form>
  )
}

interface EndFishingBanPeriodDialogProps {
  isVisible: boolean
  // Período a encerrar. Fica guardado ao fechar, para o conteúdo não sumir durante a animação.
  period?: EndablePeriod
  onHide: () => void
  onEnded: (toastText: ToastText) => void
}

// Não há exclusão de período: encerrar a vigência é o jeito de tirá-lo do app. Para reabrir,
// edite o período e limpe o "Vigente até".
export function EndFishingBanPeriodDialog({
  isVisible,
  period,
  onHide,
  onEnded,
}: EndFishingBanPeriodDialogProps) {
  const updateMutation = useUpdateFishingBanPeriod()

  const handleDialogHide = () => {
    updateMutation.reset()
    onHide()
  }

  const handleLastDaySubmit = (validUntil: string) => {
    if (!period) return

    updateMutation.mutate(
      { id: period.id, data: { valid_until: validUntil } },
      {
        onSuccess: () =>
          onEnded([
            'Vigência encerrada',
            `“${getPeriodLabel(period)}” deixa de valer no app depois de ${formatIsoDate(validUntil)}.`,
          ]),
      },
    )
  }

  return (
    <FormDialog
      isVisible={isVisible}
      title="Encerrar vigência"
      isSubmitting={updateMutation.isPending}
      onHide={handleDialogHide}
    >
      {period && (
        <EndValidityForm
          period={period}
          isSubmitting={updateMutation.isPending}
          formServerError={
            updateMutation.isError
              ? getApiErrorMessage(updateMutation.error, SAVE_ERROR_FALLBACK)
              : undefined
          }
          onSubmit={handleLastDaySubmit}
          onCancel={handleDialogHide}
        />
      )}
    </FormDialog>
  )
}
