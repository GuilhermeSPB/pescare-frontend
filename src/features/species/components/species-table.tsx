import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'
import type { ReactNode } from 'react'

import { ActiveStatusTag } from '@/components/active-status-tag'
import { CatalogRowActions } from '@/components/catalog-row-actions'
import type { Species } from '@/features/species/types/species'
import { getCatalogPaginatorProps } from '@/utils/catalog-paginator'

// Larguras no cabeçalho e no corpo: sem linhas (lista vazia), o cabeçalho não muda de lugar.
// O grupo-alvo some antes da situação: no celular o nome popular e o científico precisam do espaço.
const TARGET_GROUP_COLUMN_CLASS = 'w-48 max-md:hidden'
const STATUS_COLUMN_CLASS = 'w-36 max-sm:hidden'
const ACTIONS_COLUMN_CLASS = 'w-28'

// Mesmo esqueleto dos catálogos simples: larguras variadas para não parecer um carimbo.
const SKELETON_NAME_WIDTHS = ['9rem', '12rem', '7rem', '10rem', '8rem', '11rem']
const SKELETON_ROWS: Species[] = SKELETON_NAME_WIDTHS.map((_, index) => ({
  id: -(index + 1),
  main_name: '',
  scientific_name: '',
  description: null,
  is_active: true,
  fk_target_group_id: 0,
}))

const getSkeletonNameWidth = (species: Species) => SKELETON_NAME_WIDTHS[-species.id - 1]

interface SpeciesTableProps {
  speciesList: Species[]
  isLoading: boolean
  // Nome de cada grupo-alvo pelo id: a API de espécies traz só o id.
  targetGroupNameById: ReadonlyMap<number, string>
  emptyState: ReactNode
  // Linha cuja ativação/desativação está em andamento (mostra o botão carregando).
  togglingSpeciesId?: number
  onEditClick: (species: Species) => void
  onToggleActiveClick: (species: Species) => void
}

export function SpeciesTable({
  speciesList,
  isLoading,
  targetGroupNameById,
  emptyState,
  togglingSpeciesId,
  onEditClick,
  onToggleActiveClick,
}: SpeciesTableProps) {
  const renderName = (species: Species) => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-1.5">
          <Skeleton width={getSkeletonNameWidth(species)} />
          <Skeleton width="8rem" height="0.75rem" />
        </div>
      )
    }

    // Nome científico em itálico, como se escreve na biologia.
    return (
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-medium text-ink">{species.main_name}</span>
        <span className="text-ink-muted italic">{species.scientific_name}</span>
        <span className="mt-1 sm:hidden">
          <ActiveStatusTag isActive={species.is_active} />
        </span>
      </div>
    )
  }

  const renderTargetGroup = (species: Species) =>
    isLoading ? (
      <Skeleton width="6rem" />
    ) : (
      (targetGroupNameById.get(species.fk_target_group_id) ?? '—')
    )

  const renderStatus = (species: Species) =>
    isLoading ? (
      <Skeleton width="4.5rem" height="1.5rem" />
    ) : (
      <ActiveStatusTag isActive={species.is_active} />
    )

  const renderActions = (species: Species) =>
    isLoading ? (
      <Skeleton width="4.5rem" className="mx-auto" />
    ) : (
      <CatalogRowActions
        itemLabel={species.main_name}
        isActive={species.is_active}
        isToggling={togglingSpeciesId === species.id}
        onEditClick={() => onEditClick(species)}
        onToggleActiveClick={() => onToggleActiveClick(species)}
      />
    )

  return (
    <DataTable
      value={isLoading ? SKELETON_ROWS : speciesList}
      dataKey="id"
      emptyMessage={emptyState}
      sortField="main_name"
      sortOrder={1}
      {...getCatalogPaginatorProps(speciesList.length, isLoading)}
      aria-busy={isLoading}
      tableStyle={{ minWidth: '18rem' }}
      // O DataTable memoiza as células pelo `rowData`: sem isto, o botão carregando da linha
      // em ativação (dado de fora da linha) não chega ao template.
      cellMemo={false}
    >
      <Column field="main_name" header="Nome" sortable={!isLoading} body={renderName} />
      <Column
        header="Grupo-alvo"
        body={renderTargetGroup}
        headerClassName={TARGET_GROUP_COLUMN_CLASS}
        bodyClassName={TARGET_GROUP_COLUMN_CLASS}
      />
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
