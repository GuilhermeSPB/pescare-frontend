import type { ToastText } from '@/hooks/use-toast'

// Uma página salva e navega para outra; o aviso vai junto no state da navegação, porque cada tela
// tem o seu Toast.
interface NavigationToastState {
  navigationToast: ToastText
}

/**
 * Monta o state de navegação que leva o aviso de "salvo" até a próxima tela.
 *
 * @example
 * navigate(paths.alerts, { state: toNavigationToastState(['Comunicado publicado', '...']) })
 */
export const toNavigationToastState = (toastText: ToastText): NavigationToastState => ({
  navigationToast: toastText,
})

/**
 * Lê o aviso do state da navegação, se houver.
 *
 * @example
 * const navigationToast = readNavigationToast(location.state)
 */
export const readNavigationToast = (state: unknown): ToastText | undefined => {
  const navigationToast = (state as Partial<NavigationToastState> | null)?.navigationToast

  return Array.isArray(navigationToast) ? navigationToast : undefined
}
