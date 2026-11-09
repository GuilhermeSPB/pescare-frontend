import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { generatePath, useNavigate } from 'react-router'

import { CatalogEmptyState, type CatalogEmptyStateCopy } from '@/components/catalog-empty-state'
import { CatalogSearchField } from '@/components/catalog-search-field'
import { CatalogSection } from '@/components/catalog-section'
import { FilterToolbar } from '@/components/filter-toolbar'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { StatusFilter, type StatusFilterOption } from '@/components/status-filter'
import { paths } from '@/config/paths'
import { useAlerts } from '@/features/alerts/api/get-alerts'
import { AlertTable } from '@/features/alerts/components/alert-table'
import { useAlertFilter } from '@/features/alerts/hooks/use-alert-filter'
import { useAlertStatusChange } from '@/features/alerts/hooks/use-alert-status-change'
import type { AlertListItem } from '@/features/alerts/types/alert'
import {
  ALERT_STATUS_FILTER_LABELS,
  type AlertStatusFilter,
} from '@/features/alerts/utils/alert-status'
import type { AlertTargetStatus } from '@/features/alerts/utils/confirm-alert-status-change'
import { useNavigationToast } from '@/hooks/use-navigation-toast'
import { useToast, type ToastText } from '@/hooks/use-toast'
import { getApiErrorMessage } from '@/utils/api-error'

const ALERTS_EMPTY_STATE_COPY: CatalogEmptyStateCopy = {
  noMatchTitle: 'Nenhum comunicado encontrado',
  noMatchDescription: 'Nenhum comunicado corresponde à busca e ao filtro escolhidos.',
  emptyTitle: 'Nenhum comunicado cadastrado',
  emptyDescription: 'Crie comunicados para os pescadores verem na aba do app.',
  createLabel: 'Criar comunicado',
}

const STATUS_CHANGED_TOASTS: Record<AlertTargetStatus, (title: string) => ToastText> = {
  PUBLISHED: (title) => ['Comunicado publicado', `“${title}” já aparece no app.`],
  ARCHIVED: (title) => ['Comunicado arquivado', `“${title}” saiu da aba do app.`],
}

// Sem contagens (lista carregando ou com erro), o filtro mostra só os rótulos.
const buildStatusOptions = (
  counts?: Record<AlertStatusFilter, number>,
): StatusFilterOption<AlertStatusFilter>[] =>
  (Object.keys(ALERT_STATUS_FILTER_LABELS) as AlertStatusFilter[]).map((status) => ({
    value: status,
    label: ALERT_STATUS_FILTER_LABELS[status],
    count: counts?.[status],
  }))

export function AlertsPage() {
  const navigate = useNavigate()
  const alertsQuery = useAlerts()
  const alertFilter = useAlertFilter(alertsQuery.data ?? [])
  const counts = alertsQuery.isSuccess ? alertFilter.counts : undefined
  const { toastRef, showSuccessToast, showErrorToast } = useToast()
  const { requestStatusChange, changingAlertId } = useAlertStatusChange({
    onStatusChanged: (alert, targetStatus) =>
      showSuccessToast(...STATUS_CHANGED_TOASTS[targetStatus](alert.title)),
    onStatusChangeFailed: (error) =>
      showErrorToast(
        'Não foi possível alterar o comunicado',
        getApiErrorMessage(error, 'Tente novamente em instantes.'),
      ),
  })

  useNavigationToast(showSuccessToast)

  const handleCreateClick = () => navigate(paths.newAlert)
  const handleEditClick = (alert: AlertListItem) =>
    navigate(generatePath(paths.editAlert, { alertId: String(alert.id) }))

  return (
    <div className="flex flex-col gap-6">
      <title>Comunicados · Pescare Admin</title>
      <Toast ref={toastRef} position="bottom-right" />
      <PageHeader
        title="Comunicados"
        actions={<Button label="Novo comunicado" icon="pi pi-plus" onClick={handleCreateClick} />}
      />
      <CatalogSection
        label="Lista de comunicados"
        toolbar={
          <FilterToolbar
            search={
              <CatalogSearchField
                searchTerm={alertFilter.searchTerm}
                searchLabel="Buscar comunicado pelo título ou texto"
                isDisabled={counts === undefined}
                onSearchTermChange={alertFilter.setSearchTerm}
              />
            }
            filters={
              <StatusFilter
                value={alertFilter.statusFilter}
                options={buildStatusOptions(counts)}
                isDisabled={counts === undefined}
                onChange={alertFilter.setStatusFilter}
              />
            }
          />
        }
      >
        {alertsQuery.isError ? (
          <div className="p-4">
            <QueryErrorAlert
              title="Não foi possível carregar os comunicados."
              message={getApiErrorMessage(alertsQuery.error, 'Tente novamente em instantes.')}
              isRetrying={alertsQuery.isRefetching}
              onRetry={() => alertsQuery.refetch()}
            />
          </div>
        ) : (
          <AlertTable
            alerts={alertFilter.filteredItems}
            isLoading={alertsQuery.isPending}
            changingAlertId={changingAlertId}
            emptyState={
              <CatalogEmptyState
                hasActiveFilter={alertFilter.hasActiveFilter}
                copy={ALERTS_EMPTY_STATE_COPY}
                onClearFilters={alertFilter.clearFilters}
                onCreateClick={handleCreateClick}
              />
            }
            onEditClick={handleEditClick}
            onPublishClick={(alert) => requestStatusChange(alert, 'PUBLISHED')}
            onArchiveClick={(alert) => requestStatusChange(alert, 'ARCHIVED')}
          />
        )}
      </CatalogSection>
    </div>
  )
}
