import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { useId } from 'react'
import { Controller, useFieldArray, useWatch, type Control } from 'react-hook-form'

import { DateInput } from '@/components/date-input'
import { FormField } from '@/components/form-field'
import {
  EMPTY_PERIOD_WINDOW,
  type FishingBanPeriodFormValues,
} from '@/features/fishing-bans/utils/fishing-ban-period-form-values'

type WindowFieldName = `windows.${number}.start_day_month` | `windows.${number}.end_day_month`

interface DayMonthFieldProps {
  control: Control<FishingBanPeriodFormValues>
  name: WindowFieldName
  label: string
}

// Dia e mês sem ano: a janela do defeso se repete todo ano.
function DayMonthField({ control, name, label }: DayMonthFieldProps) {
  const inputId = useId()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField id={inputId} label={label} errorMessage={fieldState.error?.message}>
          {(controlProps) => (
            <InputMask
              {...controlProps}
              ref={field.ref}
              value={field.value}
              onChange={(event) => field.onChange(event.value ?? '')}
              onBlur={field.onBlur}
              mask="99/99"
              slotChar="dd/mm"
              inputMode="numeric"
              autoComplete="off"
              invalid={Boolean(fieldState.error)}
              className="w-full tabular-nums"
            />
          )}
        </FormField>
      )}
    />
  )
}

interface PeriodWindowRowProps {
  control: Control<FishingBanPeriodFormValues>
  index: number
  isOnlyWindow: boolean
  onRemoveClick: () => void
}

// Uma janela: início e fim. Com mais de uma, os rótulos dizem qual é, para cada campo ter um
// nome único para leitores de tela.
function PeriodWindowRow({ control, index, isOnlyWindow, onRemoveClick }: PeriodWindowRowProps) {
  const windowNumber = index + 1

  return (
    <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
      <DayMonthField
        control={control}
        name={`windows.${index}.start_day_month`}
        label={isOnlyWindow ? 'Início do defeso' : `Início da janela ${windowNumber}`}
      />
      <DayMonthField
        control={control}
        name={`windows.${index}.end_day_month`}
        label={isOnlyWindow ? 'Fim do defeso' : `Fim da janela ${windowNumber}`}
      />
      {!isOnlyWindow && (
        <Button
          type="button"
          icon="pi pi-trash"
          text
          rounded
          severity="secondary"
          aria-label={`Remover janela ${windowNumber}`}
          onClick={onRemoveClick}
          className="self-end"
        />
      )}
    </div>
  )
}

// Um período pode ter várias janelas no ano (ex.: as cinco da andada do caranguejo-uçá). Sempre
// sobra ao menos uma: a última não tem botão de remover.
function PeriodWindowsField({ control }: { control: Control<FishingBanPeriodFormValues> }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'windows' })

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <PeriodWindowRow
          key={field.id}
          control={control}
          index={index}
          isOnlyWindow={fields.length === 1}
          onRemoveClick={() => remove(index)}
        />
      ))}
      <div>
        <Button
          type="button"
          label="Adicionar janela"
          icon="pi pi-plus"
          text
          size="small"
          onClick={() => append(EMPTY_PERIOD_WINDOW)}
        />
      </div>
    </div>
  )
}

interface ValidityDateFieldProps {
  control: Control<FishingBanPeriodFormValues>
  name: 'start_in' | 'valid_until'
  label: string
  minDate?: Date
}

function ValidityDateField({ control, name, label, minDate }: ValidityDateFieldProps) {
  const inputId = useId()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField id={inputId} label={label} errorMessage={fieldState.error?.message}>
          {(controlProps) => (
            <DateInput
              {...controlProps}
              inputRef={field.ref}
              value={field.value}
              minDate={minDate}
              isInvalid={Boolean(fieldState.error)}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        </FormField>
      )}
    />
  )
}

// Janelas anuais do defeso (dia/mês) e vigência da norma que as instituiu (datas completas).
export function FishingBanPeriodDateFields({
  control,
}: {
  control: Control<FishingBanPeriodFormValues>
}) {
  const startIn = useWatch({ control, name: 'start_in' })

  return (
    <div className="flex flex-col gap-5">
      <PeriodWindowsField control={control} />
      <div className="grid gap-5 md:grid-cols-2">
        <ValidityDateField control={control} name="start_in" label="Vigente a partir de" />
        <ValidityDateField
          control={control}
          name="valid_until"
          label="Vigente até (opcional)"
          minDate={startIn ?? undefined}
        />
      </div>
    </div>
  )
}
