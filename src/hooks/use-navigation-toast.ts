import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { readNavigationToast } from '@/utils/navigation-toast'

/**
 * Mostra, uma vez, o aviso que a tela anterior mandou ao salvar e navegar para esta.
 * Depois limpa o state da navegação, para o aviso não voltar ao recarregar a página.
 *
 * @param showSuccessToast o atalho do `useToast` da tela.
 * @example
 * useNavigationToast(showSuccessToast)
 */
export const useNavigationToast = (
  showSuccessToast: (summary: string, detail?: string) => void,
) => {
  const location = useLocation()
  const navigate = useNavigate()
  // No StrictMode o efeito roda duas vezes com o mesmo state; a ref evita o aviso dobrado.
  const shownStateRef = useRef<unknown>(null)

  useEffect(() => {
    const navigationToast = readNavigationToast(location.state)
    if (!navigationToast || shownStateRef.current === location.state) return

    shownStateRef.current = location.state
    showSuccessToast(...navigationToast)
    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate, showSuccessToast])
}
