import { Calendar } from 'primereact/calendar'
import type { Ref } from 'react'

import type { FormFieldControlProps } from '@/components/form-field'

interface DateInputProps extends FormFieldControlProps {
  value: Date | null
  minDate?: Date
  isInvalid: boolean
  // Recebe o foco quando o formulário aponta erro no campo (o `field.ref` do react-hook-form).
  inputRef?: Ref<HTMLInputElement>
  onChange: (date: Date | null) => void
  onBlur?: () => void
}

// Calendar do PrimeReact como controle de um FormField: dia/mês/ano, com o erro ligado ao input
// de verdade (as props aria de fora iriam para o contêiner, não para o campo).
export function DateInput({
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  value,
  minDate,
  isInvalid,
  inputRef,
  onChange,
  onBlur,
}: DateInputProps) {
  return (
    <Calendar
      inputId={id}
      inputRef={inputRef}
      value={value}
      onChange={(event) => onChange(event.value ?? null)}
      onBlur={onBlur}
      minDate={minDate}
      dateFormat="dd/mm/yy"
      showIcon
      invalid={isInvalid}
      pt={{ input: { 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid } }}
      className="w-full"
    />
  )
}
