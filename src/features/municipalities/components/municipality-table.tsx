import { Column, type ColumnBodyOptions } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'
import type { ReactNode } from 'react'

import { RowActions, ViewRowActionButton } from '@/components/row-action-button'
import type { Municipality } from '@/types/municipality'
import { getCatalogPaginatorProps } from '@/utils/catalog-paginator'

// Larguras no cabeçalho e no corpo: sem linhas (lista vazia), o cabeçalho não muda de lugar.
// No celular o código sai da coluna e vai para baixo do nome.
const UF_COLUMN_CLASS = 'w-20'
const CODE_COLUMN_CLASS = 'w-36 max-sm:hidden'
const ACTIONS_COLUMN_CLASS = 'w-28'

// Mesmo esqueleto dos catálogos: larguras variadas para não parecer um carimbo.
const SKELETON_NAME_WIDTHS = ['9rem', '12rem', '7rem', '10rem', '8rem', '11rem']
const SKELETON_ROWS: Municipality[] = SKELETON_NAME_WIDTHS.map((_, index) => ({
  ibge_code: `skeleton-${index}`,
  name: '',
  uf: '',
}))

interface MunicipalityTableProps {
  municipalities: Municipality[]
  isLoading: boolean
  emptyState: ReactNode
  onEditClick: (municipality: Municipality) => void
}

export function MunicipalityTable({
  municipalities,
  isLoading,
  emptyState,
  onEditClick,
}: MunicipalityTableProps) {
  const renderName = (municipality: Municipality, options: ColumnBodyOptions) => {
    if (isLoading) return <Skeleton width={SKELETON_NAME_WIDTHS[options.rowIndex]} />

    return (
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-medium text-ink">{municipality.name}</span>
        <span className="text-ink-muted tabular-nums sm:hidden">{municipality.ibge_code}</span>
      </div>
    )
  }

  const renderUf = (municipality: Municipality) =>
    isLoading ? <Skeleton width="2rem" /> : municipality.uf

  const renderCode = (municipality: Municipality) =>
    isLoading ? (
      <Skeleton width="5rem" />
    ) : (
      <span className="tabular-nums">{municipality.ibge_code}</span>
    )

  const renderActions = (municipality: Municipality) =>
    isLoading ? (
      <Skeleton width="2rem" className="mx-auto" />
    ) : (
      <RowActions>
        <ViewRowActionButton
          itemLabel={municipality.name}
          onClick={() => onEditClick(municipality)}
        />
      </RowActions>
    )

  return (
    <DataTable
      value={isLoading ? SKELETON_ROWS : municipalities}
      dataKey="ibge_code"
      emptyMessage={emptyState}
      sortField="name"
      sortOrder={1}
      {...getCatalogPaginatorProps(municipalities.length, isLoading)}
      aria-busy={isLoading}
      tableStyle={{ minWidth: '18rem' }}
    >
      <Column field="name" header="Nome" sortable={!isLoading} body={renderName} />
      <Column
        field="uf"
        header="UF"
        sortable={!isLoading}
        body={renderUf}
        headerClassName={UF_COLUMN_CLASS}
        bodyClassName={UF_COLUMN_CLASS}
      />
      <Column
        field="ibge_code"
        header="Código IBGE"
        body={renderCode}
        headerClassName={CODE_COLUMN_CLASS}
        bodyClassName={CODE_COLUMN_CLASS}
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
