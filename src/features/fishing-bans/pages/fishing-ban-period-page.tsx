import type { UseQueryResult } from '@tanstack/react-query'
import { Skeleton } from 'primereact/skeleton'
import { generatePath, useNavigate } from 'react-router'

import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { paths } from '@/config/paths'
import { useCreateFishingBanPeriod } from '@/features/fishing-bans/api/create-fishing-ban-period'
import { useCreateFishingBanPeriodVersion } from '@/features/fishing-bans/api/create-fishing-ban-period-version'
import { useUpdateFishingBanPeriod } from '@/features/fishing-bans/api/update-fishing-ban-period'
import { FishingBanPeriodForm } from '@/features/fishing-bans/components/fishing-ban-period-form'
import { FishingBanPeriodNotice } from '@/features/fishing-bans/components/fishing-ban-period-notice'
import { useFishingBanPeriodFormQueries } from '@/features/fishing-bans/hooks/use-fishing-ban-period-form-queries'
import type {
  FishingBanPeriod,
  FishingBanPeriodInput,
  SelectableSpecies,
} from '@/features/fishing-bans/types/fishing-ban-period'
import {
  toCorrectionInput,
  type FishingBanPeriodFormMode,
} from '@/features/fishing-bans/utils/fishing-ban-period-form-values'
import { buildFishingBanPeriodOptions } from '@/features/fishing-bans/utils/fishing-ban-period-options'
import { getPeriodLabel } from '@/features/fishing-bans/utils/fishing-ban-period-summary'
import { getSupersededEndIsoDate } from '@/features/fishing-bans/utils/superseded-version-end'
import type { ToastText } from '@/hooks/use-toast'
import type { Municipality } from '@/types/municipality'
import type { NamedCatalogItem } from '@/types/named-catalog'
import { getApiErrorMessage } from '@/utils/api-error'
import { formatIsoDate } from '@/utils/iso-date'
import { toNavigationToastState } from '@/utils/navigation-toast'

const SAVE_ERROR_FALLBACK = 'Não foi possível salvar o período. Tente novamente.'

const PAGE_TITLES: Record<FishingBanPeriodFormMode, string> = {
  create: 'Novo período de defeso',
  edit: 'Editar período de defeso',
  'new-version': 'Nova vigência do período',
}

// Altura aproximada de cada cartão do formulário enquanto carrega.
const SKELETON_SECTION_HEIGHTS = ['8rem', '12rem', '14rem', '10rem']

// O aviso diz onde a mudança chega para o pescador.
const describeSavedPeriod = (
  saved: FishingBanPeriod,
  mode: FishingBanPeriodFormMode,
  basePeriod?: FishingBanPeriod,
): ToastText => {
  const label = getPeriodLabel(saved)

  if (mode === 'edit') return ['Período atualizado', `As alterações em “${label}” foram salvas.`]
  if (mode === 'new-version' && saved.status === 'DRAFT') {
    return ['Rascunho salvo', 'A nova vigência só vale no app depois de ativada.']
  }
  if (saved.status === 'DRAFT')
    return ['Rascunho salvo', `“${label}” só vale no app depois de ativado.`]
  if (mode === 'new-version' && basePeriod) {
    if (saved.start_in < basePeriod.start_in) {
      return ['Vigência registrada', 'Ela entrou no histórico e a vigência atual não mudou.']
    }

    const previousEnd = getSupersededEndIsoDate(basePeriod.valid_until, saved.start_in)
    return [
      'Nova vigência ativada',
      `A vigência anterior vale no app até ${formatIsoDate(previousEnd)}.`,
    ]
  }

  return ['Período cadastrado', `“${label}” foi cadastrado.`]
}

// Por que a versão aberta não aceita este modo (versão antiga, rascunho pendente), ou undefined.
const getUnavailableReason = (
  mode: FishingBanPeriodFormMode,
  period?: FishingBanPeriod,
): string | undefined => {
  if (!period || mode === 'create') return undefined

  if (mode === 'edit') {
    const isEditable = period.is_current_version || period.status === 'DRAFT'
    return isEditable ? undefined : 'Vigências antigas não podem ser alteradas.'
  }

  if (!period.is_current_version || period.status !== 'ACTIVE') {
    return 'Só a vigência atual e ativa de um período pode dar lugar a uma nova.'
  }

  return period.pending_version_id === null
    ? undefined
    : 'Este período já tem uma nova vigência em rascunho.'
}

function FishingBanPeriodFormSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      {SKELETON_SECTION_HEIGHTS.map((height, index) => (
        <Skeleton key={index} height={height} />
      ))}
    </div>
  )
}

interface FishingBanPeriodPageProps {
  mode: FishingBanPeriodFormMode
  // Na edição e na nova versão, o id do endereço; um id que não é número dá "não encontrado".
  periodId?: number
  // Vêm das features de espécies, tipos de local e municípios, compostas na rota.
  speciesQuery: UseQueryResult<SelectableSpecies[]>
  locationTypesQuery: UseQueryResult<NamedCatalogItem[]>
  municipalitiesQuery: UseQueryResult<Municipality[]>
}

export function FishingBanPeriodPage({
  mode,
  periodId,
  speciesQuery,
  locationTypesQuery,
  municipalitiesQuery,
}: FishingBanPeriodPageProps) {
  const navigate = useNavigate()
  const hasValidPeriodId =
    mode === 'create' || (periodId !== undefined && Number.isInteger(periodId) && periodId > 0)
  const formQueries = useFishingBanPeriodFormQueries({
    periodId: mode !== 'create' && hasValidPeriodId ? periodId : undefined,
    speciesQuery,
    locationTypesQuery,
    municipalitiesQuery,
  })
  const createMutation = useCreateFishingBanPeriod()
  const updateMutation = useUpdateFishingBanPeriod()
  const createVersionMutation = useCreateFishingBanPeriodVersion()
  const activeMutation = {
    create: createMutation,
    edit: updateMutation,
    'new-version': createVersionMutation,
  }[mode]
  const title = PAGE_TITLES[mode]
  const basePeriod = formQueries.editingPeriod
  const unavailableReason = getUnavailableReason(mode, basePeriod)

  const goToPeriodList = () => navigate(paths.fishingBanPeriods)
  const goToPeriodView = (id: number) =>
    navigate(generatePath(paths.fishingBanPeriod, { periodId: String(id) }))
  const handleCancel = () =>
    periodId === undefined || mode === 'create' ? goToPeriodList() : goToPeriodView(periodId)

  const handlePeriodSubmit = (input: FishingBanPeriodInput, isCorrection: boolean) => {
    // A visualização do período salvo mostra o aviso: cada tela tem o seu Toast.
    const handlePeriodSaved = (saved: FishingBanPeriod) =>
      navigate(generatePath(paths.fishingBanPeriod, { periodId: String(saved.id) }), {
        state: toNavigationToastState(describeSavedPeriod(saved, mode, basePeriod)),
      })

    if (mode === 'create' || periodId === undefined) {
      createMutation.mutate(input, { onSuccess: handlePeriodSaved })
      return
    }

    if (mode === 'new-version') {
      createVersionMutation.mutate({ periodId, data: input }, { onSuccess: handlePeriodSaved })
      return
    }

    updateMutation.mutate(
      { id: periodId, data: toCorrectionInput(input, isCorrection) },
      { onSuccess: handlePeriodSaved },
    )
  }

  const renderPageContent = () => {
    if (!hasValidPeriodId || formQueries.isPeriodNotFound) {
      return (
        <FishingBanPeriodNotice
          title="Período não encontrado"
          description="O endereço não corresponde a nenhum período de defeso cadastrado."
          actionLabel="Ver os períodos"
          onActionClick={goToPeriodList}
        />
      )
    }

    if (formQueries.hasLoadError) {
      return (
        <QueryErrorAlert
          title="Não foi possível carregar o formulário do período."
          message={getApiErrorMessage(formQueries.loadError, 'Tente novamente em instantes.')}
          isRetrying={formQueries.isRetrying}
          onRetry={formQueries.retry}
        />
      )
    }

    if (formQueries.isLoading) return <FishingBanPeriodFormSkeleton />

    if (unavailableReason && periodId !== undefined) {
      return (
        <FishingBanPeriodNotice
          title={mode === 'edit' ? 'Vigência só de leitura' : 'Nova vigência indisponível'}
          description={unavailableReason}
          actionLabel="Ver o período"
          onActionClick={() => goToPeriodView(periodId)}
        />
      )
    }

    return (
      <FishingBanPeriodForm
        mode={mode}
        basePeriod={basePeriod}
        options={buildFishingBanPeriodOptions(formQueries, basePeriod)}
        municipalities={formQueries.municipalities}
        isSubmitting={activeMutation.isPending}
        formServerError={
          activeMutation.isError
            ? getApiErrorMessage(activeMutation.error, SAVE_ERROR_FALLBACK)
            : undefined
        }
        onSubmit={handlePeriodSubmit}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <title>{`${title} · Pescare Admin`}</title>
      <PageHeader title={title} />
      {renderPageContent()}
    </div>
  )
}
