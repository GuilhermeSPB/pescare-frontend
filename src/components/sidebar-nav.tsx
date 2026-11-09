import { useId } from 'react'
import { NavLink } from 'react-router'

import { paths } from '@/config/paths'
import type { NavGroup, NavItem } from '@/types/navigation'

interface SidebarNavProps {
  groups: NavGroup[]
  // Chamado ao escolher um item; no celular, fecha a gaveta do menu.
  onNavigate?: () => void
}

// Rótulo longo ("Categorias de comprador") quebra em duas linhas em vez de estourar a barra lateral;
// o ícone não encolhe.
const ITEM_BASE_CLASS =
  'flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-left transition-colors [&>i]:shrink-0'

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
    // `end` só no "Início" (/), que senão ficaria marcado em todas as rotas. Nos demais, as
    // subpáginas (ex.: editar um período de defeso) mantêm o item da seção marcado.
    <NavLink
      to={item.to}
      end={item.to === paths.home}
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
