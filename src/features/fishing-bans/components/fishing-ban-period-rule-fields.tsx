import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useId } from 'react'
import { Controller, useFormState, type Control, type UseFormRegister } from 'react-hook-form'

import { FormField } from '@/components/form-field'
import type { FishingBanPeriodFormValues } from '@/features/fishing-bans/utils/fishing-ban-period-form-values'
import { FISHING_BAN_TYPE_OPTIONS } from '@/features/fishing-bans/utils/fishing-ban-type'

interface FishingBanPeriodRuleFieldsProps {
  control: Control<FishingBanPeriodFormValues>
  register: UseFormRegister<FishingBanPeriodFormValues>
  // Nome e ambiente são do defeso: a nova versão herda os dois e só informa a portaria.
  showsFishingBanFields: boolean
}

// A portaria é só texto e pertence à versão. Não há catálogo de normas.
export function FishingBanPeriodRuleFields({
  control,
  register,
  showsFishingBanFields,
}: FishingBanPeriodRuleFieldsProps) {
  const nameId = useId()
  const ruleId = useId()
  const typeId = useId()
  const { errors } = useFormState({ control, name: ['name', 'rule'] })

  const ruleField = (
    <FormField id={ruleId} label="Portaria" errorMessage={errors.rule?.message}>
      {(controlProps) => (
        <InputText
          {...controlProps}
          {...register('rule')}
          autoFocus={!showsFishingBanFields}
          autoComplete="off"
          invalid={Boolean(errors.rule)}
          className="w-full"
        />
      )}
    </FormField>
  )

  if (!showsFishingBanFields) return ruleField

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="md:col-span-2">
        <FormField id={nameId} label="Nome do defeso" errorMessage={errors.name?.message}>
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
      </div>
      {ruleField}
      <Controller
        name="fishing_ban_type"
        control={control}
        render={({ field, fieldState }) => (
          <FormField id={typeId} label="Ambiente" errorMessage={fieldState.error?.message}>
            {({ id, ...ariaProps }) => (
              <Dropdown
                {...ariaProps}
                inputId={id}
                focusInputRef={field.ref}
                value={field.value}
                options={FISHING_BAN_TYPE_OPTIONS}
                onChange={(event) => field.onChange(event.value)}
                onBlur={field.onBlur}
                invalid={Boolean(fieldState.error)}
                className="w-full"
              />
            )}
          </FormField>
        )}
      />
    </div>
  )
}
