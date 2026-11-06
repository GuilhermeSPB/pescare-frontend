import { Checkbox } from 'primereact/checkbox'
import { MultiSelect } from 'primereact/multiselect'
import { useId } from 'react'
import { useController, type Control } from 'react-hook-form'

import { FormField } from '@/components/form-field'
import type { FishingBanPeriodFormValues } from '@/features/fishing-bans/utils/fishing-ban-period-form-values'
import type { CatalogOption } from '@/utils/catalog-options'

interface FishingBanPeriodScopeFieldProps {
  control: Control<FishingBanPeriodFormValues>
  // A caixa "todas/todos" e a lista que ela substitui: espécies ou tipos de local.
  allFieldName: 'applies_to_all_species' | 'applies_to_all_location_types'
  idsFieldName: 'species_ids' | 'location_type_ids'
  allLabel: string
  listLabel: string
  options: CatalogOption[]
  emptyMessage: string
}

// "Todas as espécies" ou uma lista delas (o mesmo para tipos de local). Marcada a caixa, a
// lista some: o período vale para tudo, inclusive o que for cadastrado depois.
export function FishingBanPeriodScopeField({
  control,
  allFieldName,
  idsFieldName,
  allLabel,
  listLabel,
  options,
  emptyMessage,
}: FishingBanPeriodScopeFieldProps) {
  const checkboxId = useId()
  const listId = useId()
  const { field: allField } = useController({ control, name: allFieldName })
  const { field: idsField, fieldState: idsFieldState } = useController({
    control,
    name: idsFieldName,
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          inputId={checkboxId}
          inputRef={allField.ref}
          checked={allField.value}
          onChange={(event) => allField.onChange(Boolean(event.checked))}
        />
        <label htmlFor={checkboxId} className="font-medium text-ink">
          {allLabel}
        </label>
      </div>
      {!allField.value && (
        <FormField id={listId} label={listLabel} errorMessage={idsFieldState.error?.message}>
          {({ id, ...ariaProps }) => (
            <MultiSelect
              {...ariaProps}
              inputId={id}
              inputRef={idsField.ref}
              value={idsField.value}
              options={options}
              onChange={(event) => idsField.onChange(event.value)}
              onBlur={idsField.onBlur}
              filter
              resetFilterOnHide
              display="chip"
              emptyMessage={emptyMessage}
              invalid={Boolean(idsFieldState.error)}
              className="w-full"
            />
          )}
        </FormField>
      )}
    </div>
  )
}
