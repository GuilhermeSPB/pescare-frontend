import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'
import type { ReactNode } from 'react'

import { ActiveStatusTag } from '@/components/active-status-tag'
import { CatalogRowActions } from '@/components/catalog-row-actions'
import type { NamedCatalogItem } from '@/types/named-catalog'
import { getCatalogPaginatorProps } from '@/utils/catalog-paginator'

// Larguras no cabeçalho e no corpo: sem linhas (lista vazia), o cabeçalho não muda de lugar.
// No celular a situação vai para baixo do nome e a coluna some, para o nome caber numa linha.
const STATUS_COLUMN_CLASS = 'w-36 max-sm:hidden'
const ACTIONS_COLUMN_CLASS = 'w-28'

// Linhas falsas para o esqueleto do carregamento inicial, com larguras variadas
// para não parecer um carimbo repetido.
const SKELETON_NAME_WIDTHS = ['9rem', '12rem', '7rem', '10rem', '8rem', '11rem']
const SKELETON_ROWS: NamedCatalogItem[] = SKELETON_NAME_WIDTHS.map((_, index) => ({
  id: -(index + 1),
  name: '',
  is_active: true,
}))

const getSkeletonNameWidth = (item: NamedCatalogItem) => SKELETON_NAME_WIDTHS[-item.id - 1]

interface NamedCatalogTableProps {
  items: NamedCatalogItem[]
  isLoading: boolean
  emptyState: ReactNode
  // Linha cuja ativação/desativação está em andamento (mostra o botão carregando).
  togglingItemId?: number
  onEditClick: (item: NamedCatalogItem) => void
  onToggleActiveClick: (item: NamedCatalogItem) => void
}

export function NamedCatalogTable({
  items,
  isLoading,
  emptyState,
  togglingItemId,
  onEditClick,
  onToggleActiveClick,
}: NamedCatalogTableProps) {
  const renderName = (item: NamedCatalogItem) => {
    if (isLoading) return <Skeleton width={getSkeletonNameWidth(item)} />

    return (
      <div className="flex flex-col items-start gap-1">
        <span className="font-medium text-ink">{item.name}</span>
        <span className="sm:hidden">
          <ActiveStatusTag isActive={item.is_active} />
        </span>
      </div>
    )
  }

  const renderStatus = (item: NamedCatalogItem) =>
    isLoading ? (
      <Skeleton width="4.5rem" height="1.5rem" />
    ) : (
      <ActiveStatusTag isActive={item.is_active} />
    )

  const renderActions = (item: NamedCatalogItem) =>
    isLoading ? (
      <Skeleton width="4.5rem" className="mx-auto" />
    ) : (
      <CatalogRowActions
        itemLabel={item.name}
        isActive={item.is_active}
        isToggling={togglingItemId === item.id}
        onEditClick={() => onEditClick(item)}
        onToggleActiveClick={() => onToggleActiveClick(item)}
      />
    )

  return (
    <DataTable
      value={isLoading ? SKELETON_ROWS : items}
      dataKey="id"
      emptyMessage={emptyState}
      sortField="name"
      sortOrder={1}
      {...getCatalogPaginatorProps(items.length, isLoading)}
      aria-busy={isLoading}
      tableStyle={{ minWidth: '18rem' }}
    >
      <Column field="name" header="Nome" sortable={!isLoading} body={renderName} />
      <Column
        field="is_active"
        header="Status"
        sortable={!isLoading}
        body={renderStatus}
        headerClassName={STATUS_COLUMN_CLASS}
        bodyClassName={STATUS_COLUMN_CLASS}
      />
      <Column
        header="Ações"
        alignHeader="center"
        body={renderActions}
        headerClassName={ACTIONS_COLUMN_CLASS}
        bodyClassName={ACTIONS_COLUMN_CLASS}
      />
    </DataTable>
  )
}
