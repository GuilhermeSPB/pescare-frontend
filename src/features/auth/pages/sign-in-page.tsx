import { Navigate, useLocation, useNavigate } from 'react-router'

import { ProductWordmark } from '@/components/product-wordmark'
import { paths } from '@/config/paths'
import { SignInArtPanel } from '@/features/auth/components/sign-in-art-panel'
import { SignInForm } from '@/features/auth/components/sign-in-form'
import { getAuthToken } from '@/lib/auth-token'

// Só aceita voltar para caminhos internos do painel.
const getReturnPath = (state: unknown): string => {
  const from = (state as { from?: unknown } | null)?.from

  return typeof from === 'string' && from.startsWith('/') ? from : paths.home
}

export function SignInPage() {
  const location = useLocation()
  const navigate = useNavigate()

  if (getAuthToken()) {
    return <Navigate to={paths.home} replace />
  }

  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-2">
      <title>Entrar · Pescare Admin</title>
      {/* Marca, título e formulário num bloco só, centrado na coluna. */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <section aria-labelledby="sign-in-title" className="w-full max-w-[26rem]">
          <ProductWordmark />
          <h1 id="sign-in-title" className="mt-10 text-3xl font-semibold tracking-tight text-ink">
            Bem-vindo de volta
          </h1>
          <div className="mt-8">
            <SignInForm
              onSignedIn={() => navigate(getReturnPath(location.state), { replace: true })}
            />
          </div>
        </section>
      </div>
      <div className="hidden p-4 lg:block">
        <SignInArtPanel />
      </div>
    </main>
  )
}
