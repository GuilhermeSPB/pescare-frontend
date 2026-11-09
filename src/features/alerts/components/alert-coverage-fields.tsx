import { Checkbox } from 'primereact/checkbox'
import { useId } from 'react'
import { useController, type Control } from 'react-hook-form'

import { MunicipalityCoveragePicker } from '@/components/municipality-coverage-picker'
import type { AlertFormValues } from '@/features/alerts/utils/alert-form-values'
import type { Municipality } from '@/types/municipality'

interface AlertCoverageFieldsProps {
  control: Control<AlertFormValues>
  municipalities: Municipality[]
}

// "Todos os municípios" ou uma lista deles. Marcada a caixa, a lista some: o comunicado vale para
// o país inteiro, inclusive para os municípios cadastrados depois.
export function AlertCoverageFields({ control, municipalities }: AlertCoverageFieldsProps) {
  const checkboxId = useId()
  const { field: allField } = useController({ control, name: 'applies_to_all_municipalities' })
  const { field: codesField, fieldState: codesFieldState } = useController({
    control,
    name: 'municipalities',
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox
          inputId={checkboxId}
          inputRef={allField.ref}
          checked={allField.value}
          onChange={(event) => allField.onChange(Boolean(event.checked))}
        />
        <label htmlFor={checkboxId} className="font-medium text-ink">
          Todos os municípios
        </label>
      </div>
      {!allField.value && (
        <MunicipalityCoveragePicker
          municipalities={municipalities}
          value={codesField.value}
          errorMessage={codesFieldState.error?.message}
          municipalitiesInputRef={codesField.ref}
          onChange={codesField.onChange}
        />
      )}
    </div>
  )
}
