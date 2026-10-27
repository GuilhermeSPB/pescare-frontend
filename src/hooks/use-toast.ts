import type { Toast } from 'primereact/toast'
import { useRef } from 'react'

const TOAST_LIFE_MS = 4000

// Título e detalhe de um aviso, prontos para `showSuccessToast(...toastText)`.
export type ToastText = [summary: string, detail: string]

/**
 * Liga um `<Toast ref={toastRef} />` do PrimeReact a atalhos de sucesso e erro.
 * Cada tela renderiza o seu Toast; não há instância global.
 *
 * @example
 * const { toastRef, showSuccessToast } = useToast()
 * showSuccessToast('Método criado', '“Tarrafa” já aparece no app.')
 */
export const useToast = () => {
  const toastRef = useRef<Toast>(null)

  const showSuccessToast = (summary: string, detail?: string) => {
    toastRef.current?.show({ severity: 'success', summary, detail, life: TOAST_LIFE_MS })
  }

  const showErrorToast = (summary: string, detail?: string) => {
    toastRef.current?.show({ severity: 'error', summary, detail, life: TOAST_LIFE_MS * 2 })
  }

  return { toastRef, showSuccessToast, showErrorToast }
}
