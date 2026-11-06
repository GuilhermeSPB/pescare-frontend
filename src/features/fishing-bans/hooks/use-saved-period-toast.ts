import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { readSavedPeriodToast } from '@/features/fishing-bans/utils/saved-period-toast'

/**
 * Mostra, uma vez, o aviso que a página do período mandou ao salvar e voltar para a lista.
 * Depois limpa o state da navegação, para o aviso não voltar ao recarregar a página.
 *
 * @param showSuccessToast o atalho do `useToast` da lista.
 * @example
 * useSavedPeriodToast(showSuccessToast)
 */
export const useSavedPeriodToast = (
  showSuccessToast: (summary: string, detail?: string) => void,
) => {
  const location = useLocation()
  const navigate = useNavigate()
  // No StrictMode o efeito roda duas vezes com o mesmo state; a ref evita o aviso dobrado.
  const shownStateRef = useRef<unknown>(null)

  useEffect(() => {
    const savedToast = readSavedPeriodToast(location.state)
    if (!savedToast || shownStateRef.current === location.state) return

    shownStateRef.current = location.state
    showSuccessToast(...savedToast)
    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate, showSuccessToast])
}
