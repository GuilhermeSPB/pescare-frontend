import { Password } from 'primereact/password'
import { useId } from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { FormField } from '@/components/form-field'

interface PasswordFieldProps<Values extends FieldValues> {
  control: Control<Values>
  name: FieldPath<Values>
  label: string
  // Diz ao navegador se é para preencher a senha salva ou sugerir uma nova.
  autoComplete: 'current-password' | 'new-password'
  autoFocus?: boolean
}

// Campo de senha dos formulários do painel: rótulo, erro, mostrar/ocultar e sem medidor de força.
// O Password não é um input nativo: entra pelo Controller, ligado ao input interno (`inputRef`).
export function PasswordField<Values extends FieldValues>({
  control,
  name,
  label,
  autoComplete,
  autoFocus,
}: PasswordFieldProps<Values>) {
  const inputId = useId()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField id={inputId} label={label} errorMessage={fieldState.error?.message}>
          {({ id, ...ariaProps }) => (
            <Password
              {...ariaProps}
              inputId={id}
              inputRef={field.ref}
              name={field.name}
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              feedback={false}
              toggleMask
              autoComplete={autoComplete}
              autoFocus={autoFocus}
              invalid={Boolean(fieldState.error)}
              // Com toggleMask o input fica dentro de um IconField, que não ocupa a largura toda.
              className="w-full [&>.p-icon-field]:w-full"
              inputClassName="w-full"
            />
          )}
        </FormField>
      )}
    />
  )
}
