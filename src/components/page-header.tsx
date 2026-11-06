import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  // Ao lado do título, para a situação do registro aberto (ex.: status e versão do período).
  titleAddon?: ReactNode
  actions?: ReactNode
}

// Só o título e a ação principal: o painel não usa texto explicativo abaixo do título.
export function PageHeader({ title, titleAddon, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="min-w-0 text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {titleAddon}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}
