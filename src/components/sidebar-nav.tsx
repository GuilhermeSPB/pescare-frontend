import { useId } from 'react'
import { NavLink } from 'react-router'

import type { NavGroup, NavItem } from '@/types/navigation'

interface SidebarNavProps {
  groups: NavGroup[]
  // Chamado ao escolher um item; no celular, fecha a gaveta do menu.
  onNavigate?: () => void
}

const ITEM_BASE_CLASS =
  'flex h-10 items-center gap-3 rounded-md px-3 whitespace-nowrap transition-colors'

function SidebarNavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  // Seção ainda sem tela: fica no menu para mostrar o mapa do painel, mas apagada.
  // Não cabe um "em breve" ao lado dos rótulos longos; a nota no fim do menu explica o cinza.
  if (!item.to) {
    return (
      <span
        aria-disabled="true"
        title="Em breve"
        className={`${ITEM_BASE_CLASS} cursor-not-allowed text-ink-soft opacity-60`}
      >
        <i className={item.icon} aria-hidden="true" />
        <span>{item.label}</span>
        <span className="sr-only">(em breve)</span>
      </span>
    )
  }

  return (
    // `end`: "Início" (/) só fica marcado na própria página inicial, não em todas as rotas.
    <NavLink
      to={item.to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        isActive
          ? `${ITEM_BASE_CLASS} bg-primary-soft font-semibold text-primary-ink`
          : `${ITEM_BASE_CLASS} text-ink-muted hover:bg-gray-100 hover:text-ink`
      }
    >
      <i className={item.icon} aria-hidden="true" />
      <span>{item.label}</span>
    </NavLink>
  )
}

export function SidebarNav({ groups, onNavigate }: SidebarNavProps) {
  // O menu aparece duas vezes (barra lateral e gaveta do celular): ids precisam ser únicos.
  const navId = useId()
  const hasUpcomingItems = groups.some((group) => group.items.some((item) => !item.to))

  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-6">
      {groups.map((group, groupIndex) => {
        const headingId = group.label ? `${navId}-group-${groupIndex}` : undefined

        return (
          <section key={group.label ?? groupIndex} aria-labelledby={headingId}>
            {group.label && (
              <h2
                id={headingId}
                className="px-3 pb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase"
              >
                {group.label}
              </h2>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.label}>
                  <SidebarNavLink item={item} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {hasUpcomingItems && (
        <p className="px-3 text-xs text-ink-soft">Seções apagadas ainda estão em construção.</p>
      )}
    </nav>
  )
}
