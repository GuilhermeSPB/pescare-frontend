import type { ReactNode } from 'react'

export interface FormFieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

interface FormFieldProps {
  id: string
  label: string
  errorMessage?: string
  // Recebe as props que ligam o input ao rótulo e ao erro; repasse-as ao controle.
  children: (controlProps: FormFieldControlProps) => ReactNode
}

export function FormField({ id, label, errorMessage, children }: FormFieldProps) {
  const errorId = errorMessage ? `${id}-error` : undefined

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium text-ink">
        {label}
      </label>
      {children({
        id,
        'aria-describedby': errorId,
        'aria-invalid': errorMessage ? true : undefined,
      })}
      {errorMessage && (
        <small id={errorId} className="text-sm text-danger">
          {errorMessage}
        </small>
      )}
    </div>
  )
}
