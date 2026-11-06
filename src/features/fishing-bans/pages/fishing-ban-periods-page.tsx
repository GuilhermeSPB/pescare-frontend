import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useState } from 'react'
import { generatePath, useNavigate } from 'react-router'

import { CatalogEmptyState, type CatalogEmptyStateCopy } from '@/components/catalog-empty-state'
import { CatalogSearchField } from '@/components/catalog-search-field'
import { CatalogSection } from '@/components/catalog-section'
import { FilterToolbar } from '@/components/filter-toolbar'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { StatusFilter, type StatusFilterOption } from '@/components/status-filter'
import { paths } from '@/config/paths'
import { useFishingBanPeriods } from '@/features/fishing-bans/api/get-fishing-ban-periods'
import { EndFishingBanPeriodDialog } from '@/features/fishing-bans/components/end-fishing-ban-period-dialog'
import { FishingBanPeriodTable } from '@/features/fishing-bans/components/fishing-ban-period-table'
import { useFishingBanPeriodFilter } from '@/features/fishing-bans/hooks/use-fishing-ban-period-filter'
import { useSavedPeriodToast } from '@/features/fishing-bans/hooks/use-saved-period-toast'
import {
  PERIOD_STATUS_FILTER_LABELS,
  toFishingBanPeriodRows,
  type FishingBanPeriodRow,
  type PeriodStatusFilter,
} from '@/features/fishing-bans/utils/fishing-ban-period-status'
import { useToast, type ToastText } from '@/hooks/use-toast'
import { getApiErrorMessage } from '@/utils/api-error'
import { localDateToIsoDate } from '@/utils/iso-date'

const PERIODS_EMPTY_STATE_COPY: CatalogEmptyStateCopy = {
  noMatchTitle: 'Nenhum período encontrado',
  noMatchDescription: 'Nenhum período corresponde à busca e ao filtro escolhidos.',
  emptyTitle: 'Nenhum período de defeso cadastrado',
  emptyDescription: 'Cadastre os períodos para o app avisar o pescador sobre espécies em defeso.',
  createLabel: 'Cadastrar período',
}

// Sem contagens (lista carregando ou com erro), o filtro mostra só os rótulos.
const buildStatusOptions = (
  counts?: Record<PeriodStatusFilter, number>,
): StatusFilterOption<PeriodStatusFilter>[] =>
  (Object.keys(PERIOD_STATUS_FILTER_LABELS) as PeriodStatusFilter[]).map((status) => ({
    value: status,
    label: PERIOD_STATUS_FILTER_LABELS[status],
    count: counts?.[status],
  }))

interface EndValidityDialogState {
  isVisible: boolean
  period?: FishingBanPeriodRow
}

export function FishingBanPeriodsPage() {
  const navigate = useNavigate()
  const periodsQuery = useFishingBanPeriods()
  const periodRows = toFishingBanPeriodRows(periodsQuery.data ?? [], localDateToIsoDate(new Date()))
  const periodFilter = useFishingBanPeriodFilter(periodRows)
  const counts = periodsQuery.isSuccess ? periodFilter.counts : undefined
  const { toastRef, showSuccessToast } = useToast()
  const [endValidityDialog, setEndValidityDialog] = useState<EndValidityDialogState>({
    isVisible: false,
  })

  useSavedPeriodToast(showSuccessToast)

  const handleCreateClick = () => navigate(paths.newFishingBanPeriod)
  const handleViewClick = (period: FishingBanPeriodRow) =>
    navigate(generatePath(paths.fishingBanPeriod, { periodId: String(period.id) }))
  const handleEndValidityClick = (period: FishingBanPeriodRow) =>
    setEndValidityDialog({ isVisible: true, period })
  const handleEndValidityDialogHide = () =>
    setEndValidityDialog((current) => ({ ...current, isVisible: false }))

  const handleValidityEnded = (toastText: ToastText) => {
    handleEndValidityDialogHide()
    showSuccessToast(...toastText)
  }

  return (
    <div className="flex flex-col gap-6">
      <title>Períodos de defeso · Pescare Admin</title>
      <Toast ref={toastRef} position="bottom-right" />
      <PageHeader
        title="Períodos de defeso"
        actions={<Button label="Novo período" icon="pi pi-plus" onClick={handleCreateClick} />}
      />
      <CatalogSection
        label="Lista de períodos de defeso"
        toolbar={
          <FilterToolbar
            search={
              <CatalogSearchField
                searchTerm={periodFilter.searchTerm}
                searchLabel="Buscar período pela portaria, janela, espécie, UF ou observação"
                isDisabled={counts === undefined}
                onSearchTermChange={periodFilter.setSearchTerm}
              />
            }
            filters={
              <StatusFilter
                value={periodFilter.statusFilter}
                options={buildStatusOptions(counts)}
                isDisabled={counts === undefined}
                onChange={periodFilter.setStatusFilter}
              />
            }
          />
        }
      >
        {periodsQuery.isError ? (
          <div className="p-4">
            <QueryErrorAlert
              title="Não foi possível carregar os períodos de defeso."
              message={getApiErrorMessage(periodsQuery.error, 'Tente novamente em instantes.')}
              isRetrying={periodsQuery.isRefetching}
              onRetry={() => periodsQuery.refetch()}
            />
          </div>
        ) : (
          <FishingBanPeriodTable
            periods={periodFilter.filteredItems}
            isLoading={periodsQuery.isPending}
            emptyState={
              <CatalogEmptyState
                hasActiveFilter={periodFilter.hasActiveFilter}
                copy={PERIODS_EMPTY_STATE_COPY}
                onClearFilters={periodFilter.clearFilters}
                onCreateClick={handleCreateClick}
              />
            }
            onViewClick={handleViewClick}
            onEndValidityClick={handleEndValidityClick}
          />
        )}
      </CatalogSection>
      <EndFishingBanPeriodDialog
        isVisible={endValidityDialog.isVisible}
        period={endValidityDialog.period}
        onHide={handleEndValidityDialogHide}
        onEnded={handleValidityEnded}
      />
    </div>
  )
}
