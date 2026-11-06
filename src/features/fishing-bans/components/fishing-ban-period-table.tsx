import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'
import type { ReactNode } from 'react'

import { FishingBanPeriodRowActions } from '@/features/fishing-bans/components/fishing-ban-period-row-actions'
import { FishingBanPeriodStatusTag } from '@/features/fishing-bans/components/fishing-ban-period-status-tag'
import { FishingBanPeriodWindowsText } from '@/features/fishing-bans/components/fishing-ban-period-windows-text'
import {
  canEndPeriodValidity,
  type FishingBanPeriodRow,
} from '@/features/fishing-bans/utils/fishing-ban-period-status'
import {
  getPeriodLabel,
  summarizePeriodCoverage,
  summarizePeriodSpecies,
} from '@/features/fishing-bans/utils/fishing-ban-period-summary'
import { getFishingBanTypeLabel } from '@/features/fishing-bans/utils/fishing-ban-type'
import { getCatalogPaginatorProps } from '@/utils/catalog-paginator'

// Larguras no cabeçalho e no corpo: sem linhas (lista vazia), o cabeçalho não muda de lugar.
// As colunas somem da menos para a mais importante conforme a tela estreita.
const WINDOW_COLUMN_CLASS = 'w-36'
const SPECIES_COLUMN_CLASS = 'w-56 max-md:hidden'
const COVERAGE_COLUMN_CLASS = 'w-44 tabular-nums max-lg:hidden'
const TYPE_COLUMN_CLASS = 'w-32 max-xl:hidden'
const STATUS_COLUMN_CLASS = 'w-36 max-sm:hidden'
const ACTIONS_COLUMN_CLASS = 'w-28'

// Mesmo esqueleto dos catálogos: larguras variadas para não parecer um carimbo.
const SKELETON_NAME_WIDTHS = ['11rem', '14rem', '9rem', '12rem', '10rem', '13rem']
const SKELETON_ROWS: FishingBanPeriodRow[] = SKELETON_NAME_WIDTHS.map((_, index) => ({
  id: -(index + 1),
  fk_fishing_ban_id: 0,
  fk_previous_period_id: null,
  status: 'ACTIVE',
  fishing_ban: { id: 0, rule: '', fishing_ban_type: 'CONTINENTAL' },
  windows: [],
  start_in: '2000-01-01',
  valid_until: null,
  observation: null,
  applies_to_all_species: false,
  applies_to_all_location_types: false,
  species: [],
  location_types: [],
  version: 1,
  is_current_version: true,
  pending_version_id: null,
  municipality_count: 0,
  ufs: [],
  display_status: 'in-force',
}))

const getSkeletonNameWidth = (period: FishingBanPeriodRow) => SKELETON_NAME_WIDTHS[-period.id - 1]

interface FishingBanPeriodTableProps {
  periods: FishingBanPeriodRow[]
  isLoading: boolean
  emptyState: ReactNode
  onViewClick: (period: FishingBanPeriodRow) => void
  onEndValidityClick: (period: FishingBanPeriodRow) => void
}

export function FishingBanPeriodTable({
  periods,
  isLoading,
  emptyState,
  onViewClick,
  onEndValidityClick,
}: FishingBanPeriodTableProps) {
  const renderRule = (period: FishingBanPeriodRow) => {
    if (isLoading) return <Skeleton width={getSkeletonNameWidth(period)} />

    return (
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-medium text-ink">{period.fishing_ban.rule}</span>
        <span className="mt-1 sm:hidden">
          <FishingBanPeriodStatusTag status={period.display_status} />
        </span>
      </div>
    )
  }

  const renderText = (skeletonWidth: string, getText: (period: FishingBanPeriodRow) => string) =>
    function renderTextCell(period: FishingBanPeriodRow) {
      return isLoading ? <Skeleton width={skeletonWidth} /> : getText(period)
    }

  const renderWindows = (period: FishingBanPeriodRow) =>
    isLoading ? <Skeleton width="6rem" /> : <FishingBanPeriodWindowsText windows={period.windows} />

  const renderStatus = (period: FishingBanPeriodRow) =>
    isLoading ? (
      <Skeleton width="4.5rem" height="1.5rem" />
    ) : (
      <FishingBanPeriodStatusTag status={period.display_status} />
    )

  const renderActions = (period: FishingBanPeriodRow) =>
    isLoading ? (
      <Skeleton width="4.5rem" className="mx-auto" />
    ) : (
      <FishingBanPeriodRowActions
        periodLabel={getPeriodLabel(period)}
        canEndValidity={canEndPeriodValidity(period.display_status)}
        onViewClick={() => onViewClick(period)}
        onEndValidityClick={() => onEndValidityClick(period)}
      />
    )

  return (
    <DataTable
      value={isLoading ? SKELETON_ROWS : periods}
      dataKey="id"
      emptyMessage={emptyState}
      {...getCatalogPaginatorProps(periods.length, isLoading)}
      aria-busy={isLoading}
      tableStyle={{ minWidth: '24rem' }}
    >
      <Column header="Portaria" body={renderRule} />
      <Column
        header="Janela"
        body={renderWindows}
        headerClassName={WINDOW_COLUMN_CLASS}
        bodyClassName={WINDOW_COLUMN_CLASS}
      />
      <Column
        header="Espécies"
        body={renderText('8rem', summarizePeriodSpecies)}
        headerClassName={SPECIES_COLUMN_CLASS}
        bodyClassName={SPECIES_COLUMN_CLASS}
      />
      <Column
        header="Municípios"
        body={renderText('7rem', summarizePeriodCoverage)}
        headerClassName={COVERAGE_COLUMN_CLASS}
        bodyClassName={COVERAGE_COLUMN_CLASS}
      />
      <Column
        header="Ambiente"
        body={renderText('5rem', (period) =>
          getFishingBanTypeLabel(period.fishing_ban.fishing_ban_type),
        )}
        headerClassName={TYPE_COLUMN_CLASS}
        bodyClassName={TYPE_COLUMN_CLASS}
      />
      <Column
        header="Status"
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
