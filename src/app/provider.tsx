import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PrimeReactProvider } from 'primereact/api'
import type { ReactNode } from 'react'

import { primeReactConfig } from '@/lib/primereact'
import { queryClient } from '@/lib/react-query'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <PrimeReactProvider value={primeReactConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* No canto esquerdo para não cobrir os avisos (Toast), que ficam à direita. */}
        {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="bottom-left" />}
      </QueryClientProvider>
    </PrimeReactProvider>
  )
}
