import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import type { ReactNode } from 'react'

interface FormDialogProps {
  isVisible: boolean
  title: string
  // Enquanto salva, o diálogo não fecha: nem pelo X, nem clicando fora.
  isSubmitting: boolean
  onHide: () => void
  children: ReactNode
}

// O Dialog desmonta o conteúdo ao fechar, então cada abertura começa com o formulário limpo.
// `focusOnShow={false}`: o foco inicial fica com o `autoFocus` do primeiro campo. Ligado, o
// FocusTrap do PrimeReact procura o atributo `autofocus` (que o React não põe no DOM), não acha
// e foca o X do cabeçalho — e um Enter fechava o diálogo em vez de enviar.
export function FormDialog({ isVisible, title, isSubmitting, onHide, children }: FormDialogProps) {
  return (
    <Dialog
      visible={isVisible}
      onHide={onHide}
      header={title}
      focusOnShow={false}
      draggable={false}
      resizable={false}
      dismissableMask={!isSubmitting}
      closable={!isSubmitting}
      className="w-[min(32rem,calc(100vw-2rem))]"
    >
      {children}
    </Dialog>
  )
}

interface FormDialogActionsProps {
  submitLabel: string
  isSubmitting: boolean
  isSubmitDisabled: boolean
  onCancel: () => void
}

// Rodapé do formulário: cancelar discreto à esquerda da ação principal.
export function FormDialogActions({
  submitLabel,
  isSubmitting,
  isSubmitDisabled,
  onCancel,
}: FormDialogActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <Button type="button" label="Cancelar" text severity="secondary" onClick={onCancel} />
      <Button
        type="submit"
        label={submitLabel}
        loading={isSubmitting}
        disabled={isSubmitDisabled}
      />
    </div>
  )
}
