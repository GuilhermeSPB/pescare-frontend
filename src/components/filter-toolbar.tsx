import type { ReactNode } from 'react'

interface FilterToolbarProps {
  search: ReactNode
  filters: ReactNode
}

// Busca à esquerda e filtros à direita, acima de uma lista. Com um filtro a mais, a linha pode
// não caber no tablet: os filtros descem para baixo da busca.
export function FilterToolbar({ search, filters }: FilterToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
      {search}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">{filters}</div>
    </div>
  )
}
