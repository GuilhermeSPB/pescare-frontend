import type { UseQueryResult } from '@tanstack/react-query'
import { Skeleton } from 'primereact/skeleton'
import { TabPanel, TabView } from 'primereact/tabview'
import { Toast } from 'primereact/toast'
import { useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router'

import { CatalogSection } from '@/components/catalog-section'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { paths } from '@/config/paths'
import { useActivateFishingBanPeriod } from '@/features/fishing-bans/api/activate-fishing-ban-period'
import { useFishingBanPeriodById } from '@/features/fishing-bans/api/get-fishing-ban-period-by-id'
import { useFishingBanPeriodVersions } from '@/features/fishing-bans/api/get-fishing-ban-period-versions'
import { EndFishingBanPeriodDialog } from '@/features/fishing-bans/components/end-fishing-ban-period-dialog'
import { FishingBanPeriodDetails } from '@/features/fishing-bans/components/fishing-ban-period-details'
import { FishingBanPeriodNotice } from '@/features/fishing-bans/components/fishing-ban-period-notice'
import { FishingBanPeriodStatusTag } from '@/features/fishing-bans/components/fishing-ban-period-status-tag'
import { FishingBanPeriodVersionsTable } from '@/features/fishing-bans/components/fishing-ban-period-versions-table'
import { FishingBanPeriodViewActions } from '@/features/fishing-bans/components/fishing-ban-period-view-actions'
import type {
  FishingBanPeriod,
  FishingBanPeriodListItem,
} from '@/features/fishing-bans/types/fishing-ban-period'
import { confirmPeriodActivation } from '@/features/fishing-bans/utils/confirm-period-activation'
import {
  getPeriodDisplayStatus,
  toFishingBanPeriodRows,
} from '@/features/fishing-bans/utils/fishing-ban-period-status'
import { getPeriodLabel } from '@/features/fishing-bans/utils/fishing-ban-period-summary'
import { getSupersededEndIsoDate } from '@/features/fishing-bans/utils/superseded-version-end'
import { useNavigationToast } from '@/hooks/use-navigation-toast'
import { useToast, type ToastText } from '@/hooks/use-toast'
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/api-error'
import { formatIsoDate, localDateToIsoDate } from '@/utils/iso-date'

// Altura aproximada de cada cartão da versão enquanto carrega.
const SKELETON_SECTION_HEIGHTS = ['6rem', '6rem', '8rem', '10rem']

// O que muda no app ao ativar: a versão anterior deixa de valer, ou o período começa a valer.
const describeActivation = (
  period: FishingBanPeriod,
  previousVersion?: FishingBanPeriodListItem,
): string => {
  if (!previousVersion) {
    return `O período passa a valer no app a partir de ${formatIsoDate(period.start_in)}.`
  }

  const previousEnd = getSupersededEndIsoDate(previousVersion.valid_until, period.start_in)

  return `A vigência anterior deixa de valer no app depois de ${formatIsoDate(previousEnd)}.`
}

function FishingBanPeriodViewSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      {SKELETON_SECTION_HEIGHTS.map((height, index) => (
        <Skeleton key={index} height={height} />
      ))}
    </div>
  )
}

interface VersionsTabContentProps {
  versionsQuery: UseQueryResult<FishingBanPeriodListItem[]>
  viewedPeriodId: number
  onViewClick: (versionId: number) => void
}

function VersionsTabContent({
  versionsQuery,
  viewedPeriodId,
  onViewClick,
}: VersionsTabContentProps) {
  if (versionsQuery.isError) {
    return (
      <QueryErrorAlert
        title="Não foi possível carregar o histórico do período."
        message={getApiErrorMessage(versionsQuery.error, 'Tente novamente em instantes.')}
        isRetrying={versionsQuery.isRefetching}
        onRetry={() => versionsQuery.refetch()}
      />
    )
  }

  if (!versionsQuery.data) return <Skeleton height="10rem" />

  return (
    <CatalogSection label="Histórico do período">
      <FishingBanPeriodVersionsTable
        versions={toFishingBanPeriodRows(versionsQuery.data, localDateToIsoDate(new Date()))}
        viewedPeriodId={viewedPeriodId}
        onViewClick={(version) => onViewClick(version.id)}
      />
    </CatalogSection>
  )
}

function FishingBanPeriodView({ periodId }: { periodId: number }) {
  const navigate = useNavigate()
  const hasValidPeriodId = Number.isInteger(periodId) && periodId > 0
  const periodQuery = useFishingBanPeriodById(hasValidPeriodId ? periodId : undefined)
  const versionsQuery = useFishingBanPeriodVersions(hasValidPeriodId ? periodId : undefined)
  const activateMutation = useActivateFishingBanPeriod()
  const { toastRef, showSuccessToast, showErrorToast } = useToast()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [isEndValidityDialogVisible, setIsEndValidityDialogVisible] = useState(false)
  const period = periodQuery.data

  useNavigationToast(showSuccessToast)

  const goToPeriod = (id: number) =>
    navigate(generatePath(paths.fishingBanPeriod, { periodId: String(id) }))
  const goToPeriodPath = (path: string) =>
    navigate(generatePath(path, { periodId: String(periodId) }))

  const handleActivateClick = (activatedPeriod: FishingBanPeriod) => {
    const previousVersion = versionsQuery.data?.find(
      (version) => version.id === activatedPeriod.previous_version_id,
    )
    const message = describeActivation(activatedPeriod, previousVersion)

    confirmPeriodActivation({
      periodLabel: getPeriodLabel(activatedPeriod),
      message,
      onAccept: () =>
        activateMutation.mutate(activatedPeriod.id, {
          onSuccess: () => showSuccessToast('Período ativado', message),
          onError: (error) =>
            showErrorToast(
              'Não foi possível ativar o período',
              getApiErrorMessage(error, 'Tente novamente em instantes.'),
            ),
        }),
    })
  }

  const handleValidityEnded = (toastText: ToastText) => {
    setIsEndValidityDialogVisible(false)
    showSuccessToast(...toastText)
  }

  if (!hasValidPeriodId || getApiErrorStatus(periodQuery.error) === 404) {
    return (
      <FishingBanPeriodNotice
        title="Período não encontrado"
        description="O endereço não corresponde a nenhum período de defeso cadastrado."
        actionLabel="Ver os períodos"
        onActionClick={() => navigate(paths.fishingBanPeriods)}
      />
    )
  }

  const displayStatus = period && getPeriodDisplayStatus(period, localDateToIsoDate(new Date()))
  const title = period?.fishing_ban.name ?? 'Período de defeso'

  return (
    <div className="flex flex-col gap-6">
      <title>{`${title} · Pescare Admin`}</title>
      <Toast ref={toastRef} position="bottom-right" />
      <PageHeader
        title={title}
        titleAddon={period && displayStatus && <FishingBanPeriodStatusTag status={displayStatus} />}
        actions={
          period &&
          displayStatus && (
            <FishingBanPeriodViewActions
              period={period}
              displayStatus={displayStatus}
              isActivating={activateMutation.isPending}
              onEditClick={() => goToPeriodPath(paths.editFishingBanPeriod)}
              onNewVersionClick={() => goToPeriodPath(paths.newFishingBanPeriodVersion)}
              onOpenDraftClick={() =>
                period.pending_version_id && goToPeriod(period.pending_version_id)
              }
              onActivateClick={() => handleActivateClick(period)}
              onEndValidityClick={() => setIsEndValidityDialogVisible(true)}
            />
          )
        }
      />
      {periodQuery.isError ? (
        <QueryErrorAlert
          title="Não foi possível carregar o período."
          message={getApiErrorMessage(periodQuery.error, 'Tente novamente em instantes.')}
          isRetrying={periodQuery.isRefetching}
          onRetry={() => periodQuery.refetch()}
        />
      ) : (
        <TabView
          activeIndex={activeTabIndex}
          onTabChange={(event) => setActiveTabIndex(event.index)}
        >
          <TabPanel header="Período">
            {period ? (
              <FishingBanPeriodDetails period={period} />
            ) : (
              <FishingBanPeriodViewSkeleton />
            )}
          </TabPanel>
          <TabPanel header="Histórico">
            <VersionsTabContent
              versionsQuery={versionsQuery}
              viewedPeriodId={periodId}
              onViewClick={goToPeriod}
            />
          </TabPanel>
        </TabView>
      )}
      <EndFishingBanPeriodDialog
        isVisible={isEndValidityDialogVisible}
        period={period}
        onHide={() => setIsEndValidityDialogVisible(false)}
        onEnded={handleValidityEnded}
      />
    </div>
  )
}

// Uma versão do período: a aba "Período" mostra a versão aberta e "Versões", o histórico. O `key`
// faz cada versão abrir do zero, na aba "Período", ao navegar pelo histórico.
export function FishingBanPeriodViewPage() {
  const { periodId } = useParams()

  return <FishingBanPeriodView key={periodId} periodId={Number(periodId)} />
}
