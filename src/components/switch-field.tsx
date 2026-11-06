import { InputSwitch } from 'primereact/inputswitch'
import { useId, type Ref } from 'react'

interface SwitchFieldProps {
  label: string
  isChecked: boolean
  // Recebe o foco quando o formulário aponta erro no campo (o `field.ref` do react-hook-form).
  inputRef?: Ref<HTMLInputElement>
  onChange: (isChecked: boolean) => void
}

// Liga/desliga com o rótulo ao lado; clicar no rótulo também alterna (o `label` aponta para o
// input do switch).
export function SwitchField({ label, isChecked, inputRef, onChange }: SwitchFieldProps) {
  const inputId = useId()

  return (
    <div className="flex items-center gap-3">
      <InputSwitch
        inputId={inputId}
        inputRef={inputRef}
        checked={isChecked}
        onChange={(event) => onChange(event.value)}
      />
      <label htmlFor={inputId} className="font-medium text-ink">
        {label}
      </label>
    </div>
  )
}
