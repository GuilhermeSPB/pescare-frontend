import { QueryClient } from '@tanstack/react-query'

/**
 * QueryClient único da aplicação. Catálogos mudam pouco, então 1 minuto de cache
 * evita refetch a cada troca de tela sem deixar dado velho por muito tempo.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: ['fishing-methods'] })
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
