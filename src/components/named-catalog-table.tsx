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
// A coluna extra some antes, como o grupo-alvo nas espécies.
const EXTRA_COLUMN_CLASS = 'w-40 max-md:hidden'
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

// Um dado a mais entre o nome e a situação, para o catálogo que tem algo além do nome
// (ex.: o ambiente do tipo de local).
export interface NamedCatalogExtraColumn<TItem extends NamedCatalogItem> {
  header: string
  render: (item: TItem) => ReactNode
}

interface NamedCatalogTableProps<TItem extends NamedCatalogItem> {
  items: TItem[]
  isLoading: boolean
  emptyState: ReactNode
  extraColumn?: NamedCatalogExtraColumn<TItem>
  // Linha cuja ativação/desativação está em andamento (mostra o botão carregando).
  togglingItemId?: number
  onEditClick: (item: TItem) => void
  onToggleActiveClick: (item: TItem) => void
}

export function NamedCatalogTable<TItem extends NamedCatalogItem>({
  items,
  isLoading,
  emptyState,
  extraColumn,
  togglingItemId,
  onEditClick,
  onToggleActiveClick,
}: NamedCatalogTableProps<TItem>) {
  const renderName = (item: TItem) => {
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

  // As linhas do esqueleto não têm os campos extras: o template só lê o item depois de carregar.
  const renderExtra = (item: TItem) =>
    isLoading ? <Skeleton width="6rem" /> : extraColumn?.render(item)

  const renderStatus = (item: TItem) =>
    isLoading ? (
      <Skeleton width="4.5rem" height="1.5rem" />
    ) : (
      <ActiveStatusTag isActive={item.is_active} />
    )

  const renderActions = (item: TItem) =>
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
      // O DataTable memoiza as células pelo `rowData`: sem isto, o botão carregando da linha
      // em ativação (dado de fora da linha) não chega ao template.
      cellMemo={false}
    >
      <Column field="name" header="Nome" sortable={!isLoading} body={renderName} />
      {extraColumn && (
        <Column
          header={extraColumn.header}
          body={renderExtra}
          headerClassName={EXTRA_COLUMN_CLASS}
          bodyClassName={EXTRA_COLUMN_CLASS}
        />
      )}
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
