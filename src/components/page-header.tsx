import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  actions?: ReactNode
}

// Só o título e a ação principal: o painel não usa texto explicativo abaixo do título.
export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="min-w-0 text-2xl font-semibold tracking-tight text-ink">{title}</h1>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}
