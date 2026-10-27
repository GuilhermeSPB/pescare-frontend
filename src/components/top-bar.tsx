import { Button } from 'primereact/button'
import { Skeleton } from 'primereact/skeleton'
import type { ReactNode } from 'react'

interface TopBarProps {
  breadcrumb: string[]
  // Marca mostrada no celular no lugar do caminho: lá o título da página já vem logo abaixo.
  phoneBrand: ReactNode
  // Sem nome ainda: os dados do usuário estão carregando.
  userName?: string
  userCaption: string
  onMenuClick: () => void
  onSignOutClick: () => void
}

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav aria-label="Você está em" className="min-w-0 max-sm:hidden">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li key={item} className="flex min-w-0 items-center gap-2">
              {index > 0 && (
                <i className="pi pi-angle-right text-xs text-ink-soft" aria-hidden="true" />
              )}
              <span
                aria-current={isCurrent ? 'page' : undefined}
                className={isCurrent ? 'truncate font-medium text-ink' : 'text-ink-muted'}
              >
                {item}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function TopBar({
  breadcrumb,
  phoneBrand,
  userName,
  userCaption,
  onMenuClick,
  onSignOutClick,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-15 items-center gap-3 border-b border-line bg-white px-4 sm:px-6 lg:px-8">
      <Button
        icon="pi pi-bars"
        text
        severity="secondary"
        aria-label="Abrir menu"
        onClick={onMenuClick}
        className="lg:hidden"
      />
      <div className="sm:hidden">{phoneBrand}</div>
      <Breadcrumb items={breadcrumb} />
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          {userName ? (
            <p className="font-medium text-ink">{userName}</p>
          ) : (
            <Skeleton width="8rem" height="1rem" />
          )}
          <p className="text-xs text-ink-soft">{userCaption}</p>
        </div>
        <Button
          label="Sair"
          icon="pi pi-sign-out"
          size="small"
          outlined
          severity="secondary"
          onClick={onSignOutClick}
        />
      </div>
    </header>
  )
}
