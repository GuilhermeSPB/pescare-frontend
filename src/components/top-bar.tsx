import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import type { MenuItem } from 'primereact/menuitem'
import { Skeleton } from 'primereact/skeleton'
import { useId, useRef, type ReactNode } from 'react'

interface UserMenuProps {
  // Sem nome ainda: os dados do usuário estão carregando.
  userName?: string
  userCaption: string
  onProfileClick: () => void
  onSignOutClick: () => void
}

interface TopBarProps extends UserMenuProps {
  breadcrumb: string[]
  // Marca mostrada no celular no lugar do caminho: lá o título da página já vem logo abaixo.
  phoneBrand: ReactNode
  onMenuClick: () => void
}

// Nome e perfil abrem as ações da conta. No celular o nome some da tela, mas continua
// sendo o nome acessível do botão (sr-only), e o ícone de pessoa fica no lugar.
function UserMenu({ userName, userCaption, onProfileClick, onSignOutClick }: UserMenuProps) {
  const userMenuRef = useRef<Menu>(null)
  const userMenuId = useId()
  const userMenuItems: MenuItem[] = [
    { label: 'Meu perfil', icon: 'pi pi-user-edit', command: onProfileClick },
    { label: 'Sair', icon: 'pi pi-sign-out', command: onSignOutClick },
  ]

  return (
    <>
      <Menu model={userMenuItems} popup popupAlignment="right" ref={userMenuRef} id={userMenuId} />
      <Button
        type="button"
        text
        severity="secondary"
        aria-haspopup="menu"
        aria-controls={userMenuId}
        onClick={(event) => userMenuRef.current?.toggle(event)}
        className="gap-3 text-right"
      >
        <i className="pi pi-user sm:hidden" aria-hidden="true" />
        <span className="max-sm:sr-only">
          {userName ? (
            <span className="block font-medium text-ink">{userName}</span>
          ) : (
            <Skeleton width="8rem" height="1rem" />
          )}
          <span className="block text-xs text-ink-soft">{userCaption}</span>
        </span>
        <i className="pi pi-angle-down text-ink-soft max-sm:hidden" aria-hidden="true" />
      </Button>
    </>
  )
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

export function TopBar({ breadcrumb, phoneBrand, onMenuClick, ...userMenuProps }: TopBarProps) {
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
      <div className="ml-auto">
        <UserMenu {...userMenuProps} />
      </div>
    </header>
  )
}
