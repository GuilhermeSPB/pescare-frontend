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
}

// A norma do período é só texto: a portaria digitada e o ambiente. Não há catálogo de normas;
// o backend reaproveita a norma com a mesma portaria ou cria uma.
export function FishingBanPeriodRuleFields({ control, register }: FishingBanPeriodRuleFieldsProps) {
  const ruleId = useId()
  const typeId = useId()
  const { errors } = useFormState({ control, name: 'rule' })

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_14rem]">
      <FormField id={ruleId} label="Portaria" errorMessage={errors.rule?.message}>
        {(controlProps) => (
          <InputText
            {...controlProps}
            {...register('rule')}
            autoFocus
            autoComplete="off"
            invalid={Boolean(errors.rule)}
            className="w-full"
          />
        )}
      </FormField>
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
