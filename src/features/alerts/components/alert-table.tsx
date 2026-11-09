import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'
import type { ReactNode } from 'react'

import { AlertRowActions } from '@/features/alerts/components/alert-row-actions'
import { AlertStatusTag } from '@/features/alerts/components/alert-status-tag'
import type { AlertListItem } from '@/features/alerts/types/alert'
import {
  getAlertCoverageLabel,
  getAlertPublicationLabel,
} from '@/features/alerts/utils/alert-summary'
import { getCatalogPaginatorProps } from '@/utils/catalog-paginator'

// Larguras no cabeçalho e no corpo: sem linhas (lista vazia), o cabeçalho não muda de lugar.
// As colunas somem da menos para a mais importante conforme a tela estreita.
const COVERAGE_COLUMN_CLASS = 'w-44 tabular-nums max-md:hidden'
const PUBLICATION_COLUMN_CLASS = 'w-32 tabular-nums max-lg:hidden'
const STATUS_COLUMN_CLASS = 'w-32 max-sm:hidden'
const ACTIONS_COLUMN_CLASS = 'w-28'

// Mesmo esqueleto dos catálogos: larguras variadas para não parecer um carimbo.
const SKELETON_TITLE_WIDTHS = ['11rem', '14rem', '9rem', '12rem', '10rem', '13rem']
const SKELETON_ROWS: AlertListItem[] = SKELETON_TITLE_WIDTHS.map((_, index) => ({
  id: -(index + 1),
  title: '',
  description: '',
  publication_date: '2000-01-01T00:00:00.000Z',
  scope: 'GLOBAL',
  status: 'DRAFT',
  municipality_count: 0,
}))

const getSkeletonTitleWidth = (alert: AlertListItem) => SKELETON_TITLE_WIDTHS[-alert.id - 1]

interface AlertTableProps {
  alerts: AlertListItem[]
  isLoading: boolean
  changingAlertId?: number
  emptyState: ReactNode
  onEditClick: (alert: AlertListItem) => void
  onPublishClick: (alert: AlertListItem) => void
  onArchiveClick: (alert: AlertListItem) => void
}

export function AlertTable({
  alerts,
  isLoading,
  changingAlertId,
  emptyState,
  onEditClick,
  onPublishClick,
  onArchiveClick,
}: AlertTableProps) {
  const renderAlert = (alert: AlertListItem) => {
    if (isLoading) return <Skeleton width={getSkeletonTitleWidth(alert)} />

    return (
      <div className="flex min-w-0 flex-col items-start gap-0.5">
        <span className="font-medium text-ink">{alert.title}</span>
        <span className="line-clamp-1 text-sm text-ink-muted">{alert.description}</span>
        <span className="mt-1 sm:hidden">
          <AlertStatusTag status={alert.status} />
        </span>
      </div>
    )
  }

  const renderText = (skeletonWidth: string, getText: (alert: AlertListItem) => string) =>
    function renderTextCell(alert: AlertListItem) {
      return isLoading ? <Skeleton width={skeletonWidth} /> : getText(alert)
    }

  const renderStatus = (alert: AlertListItem) =>
    isLoading ? (
      <Skeleton width="4.5rem" height="1.5rem" />
    ) : (
      <AlertStatusTag status={alert.status} />
    )

  const renderActions = (alert: AlertListItem) =>
    isLoading ? (
      <Skeleton width="4.5rem" className="mx-auto" />
    ) : (
      <AlertRowActions
        alertTitle={alert.title}
        status={alert.status}
        isStatusChanging={changingAlertId === alert.id}
        onEditClick={() => onEditClick(alert)}
        onPublishClick={() => onPublishClick(alert)}
        onArchiveClick={() => onArchiveClick(alert)}
      />
    )

  return (
    // `cellMemo={false}`: as ações leem `changingAlertId`, que está fora da linha.
    <DataTable
      value={isLoading ? SKELETON_ROWS : alerts}
      dataKey="id"
      cellMemo={false}
      emptyMessage={emptyState}
      {...getCatalogPaginatorProps(alerts.length, isLoading)}
      aria-busy={isLoading}
      tableStyle={{ minWidth: '24rem' }}
    >
      <Column header="Comunicado" body={renderAlert} />
      <Column
        header="Abrangência"
        body={renderText('7rem', getAlertCoverageLabel)}
        headerClassName={COVERAGE_COLUMN_CLASS}
        bodyClassName={COVERAGE_COLUMN_CLASS}
      />
      <Column
        header="Publicação"
        body={renderText('5rem', getAlertPublicationLabel)}
        headerClassName={PUBLICATION_COLUMN_CLASS}
        bodyClassName={PUBLICATION_COLUMN_CLASS}
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
