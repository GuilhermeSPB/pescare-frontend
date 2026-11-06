import type { ToastText } from '@/hooks/use-toast'

// A página do período salva e volta para a lista; o aviso vai junto no state da navegação,
// porque cada tela tem o seu Toast.
interface SavedPeriodToastState {
  savedPeriodToast: ToastText
}

/**
 * Monta o state de navegação que leva o aviso de "período salvo" até a lista.
 *
 * @example
 * navigate(paths.fishingBanPeriods, { state: toSavedPeriodToastState(['Período cadastrado', '...']) })
 */
export const toSavedPeriodToastState = (toastText: ToastText): SavedPeriodToastState => ({
  savedPeriodToast: toastText,
})

/**
 * Lê o aviso de "período salvo" do state da navegação, se houver.
 *
 * @example
 * const savedToast = readSavedPeriodToast(location.state)
 */
export const readSavedPeriodToast = (state: unknown): ToastText | undefined => {
  const savedPeriodToast = (state as Partial<SavedPeriodToastState> | null)?.savedPeriodToast

  return Array.isArray(savedPeriodToast) ? savedPeriodToast : undefined
}
