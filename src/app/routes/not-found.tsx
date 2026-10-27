import { Link } from 'react-router'

import { paths } from '@/config/paths'

export function NotFoundRoute() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12 text-center">
      <title>Página não encontrada · Pescare Admin</title>
      <div>
        <h1 className="text-2xl font-semibold text-ink">Página não encontrada</h1>
        <p className="mt-2 text-ink-muted">
          O endereço pode ter mudado ou ter sido digitado errado.
        </p>
        <Link
          to={paths.home}
          className="mt-6 inline-flex font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
        >
          Voltar para o painel
        </Link>
      </div>
    </main>
  )
}
