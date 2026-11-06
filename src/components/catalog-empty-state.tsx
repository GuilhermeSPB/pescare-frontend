import { Button } from 'primereact/button'

import { EmptyState } from '@/components/empty-state'

export interface CatalogEmptyStateCopy {
  noMatchTitle: string
  noMatchDescription: string
  emptyTitle: string
  emptyDescription: string
  // Sem rótulo e sem `onCreateClick`, o catálogo vazio não oferece cadastro (ex.: municípios).
  createLabel?: string
}

interface CatalogEmptyStateProps {
  // Com filtro, a lista vazia é resultado da busca; sem filtro, o catálogo está vazio.
  hasActiveFilter: boolean
  copy: CatalogEmptyStateCopy
  onClearFilters: () => void
  onCreateClick?: () => void
}

export function CatalogEmptyState({
  hasActiveFilter,
  copy,
  onClearFilters,
  onCreateClick,
}: CatalogEmptyStateProps) {
  if (hasActiveFilter) {
    return (
      <EmptyState
        icon="pi pi-search"
        title={copy.noMatchTitle}
        description={copy.noMatchDescription}
        action={<Button label="Limpar filtros" outlined size="small" onClick={onClearFilters} />}
      />
    )
  }

  return (
    <EmptyState
      icon="pi pi-list"
      title={copy.emptyTitle}
      description={copy.emptyDescription}
      action={
        copy.createLabel &&
        onCreateClick && (
          <Button label={copy.createLabel} icon="pi pi-plus" size="small" onClick={onCreateClick} />
        )
      }
    />
  )
}
