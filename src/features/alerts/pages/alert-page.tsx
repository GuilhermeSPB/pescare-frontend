import type { UseQueryResult } from '@tanstack/react-query'
import { Button } from 'primereact/button'
import { Skeleton } from 'primereact/skeleton'
import { useNavigate } from 'react-router'

import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { paths } from '@/config/paths'
import { useCreateAlert } from '@/features/alerts/api/create-alert'
import { useUpdateAlert } from '@/features/alerts/api/update-alert'
import { AlertForm } from '@/features/alerts/components/alert-form'
import { useAlertFormQueries } from '@/features/alerts/hooks/use-alert-form-queries'
import type { AlertDetails } from '@/features/alerts/types/alert'
import {
  toAlertContentInput,
  toCreateAlertInput,
  type AlertFormMode,
  type AlertFormValues,
} from '@/features/alerts/utils/alert-form-values'
import type { ToastText } from '@/hooks/use-toast'
import type { Municipality } from '@/types/municipality'
import { getApiErrorMessage } from '@/utils/api-error'
import { toNavigationToastState } from '@/utils/navigation-toast'

const SAVE_ERROR_FALLBACK = 'Não foi possível salvar o comunicado. Tente novamente.'

const PAGE_TITLES: Record<AlertFormMode, string> = {
  create: 'Novo comunicado',
  edit: 'Editar comunicado',
}

// Altura aproximada de cada cartão do formulário enquanto carrega.
const SKELETON_SECTION_HEIGHTS = ['16rem', '10rem']

// O aviso diz onde a mudança chega para o pescador.
const describeSavedAlert = (saved: AlertDetails, mode: AlertFormMode): ToastText => {
  if (mode === 'edit') {
    return ['Comunicado atualizado', `As alterações em “${saved.title}” foram salvas.`]
  }
  if (saved.status === 'DRAFT') {
    return ['Rascunho salvo', `“${saved.title}” só aparece no app depois de publicado.`]
  }

  return ['Comunicado publicado', `“${saved.title}” já aparece no app.`]
}

function AlertFormSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      {SKELETON_SECTION_HEIGHTS.map((height, index) => (
        <Skeleton key={index} height={height} />
      ))}
    </div>
  )
}

function AlertNotFoundNotice({ onBackClick }: { onBackClick: () => void }) {
  return (
    <section className="rounded-md border border-line bg-white">
      <EmptyState
        icon="pi pi-megaphone"
        title="Comunicado não encontrado"
        description="O endereço não corresponde a nenhum comunicado cadastrado."
        action={<Button label="Ver os comunicados" size="small" onClick={onBackClick} />}
      />
    </section>
  )
}

interface AlertPageProps {
  mode: AlertFormMode
  // Na edição, o id do endereço; um id que não é número dá "não encontrado".
  alertId?: number
  // Vem da feature de municípios, composta na rota.
  municipalitiesQuery: UseQueryResult<Municipality[]>
}

export function AlertPage({ mode, alertId, municipalitiesQuery }: AlertPageProps) {
  const navigate = useNavigate()
  const hasValidAlertId =
    mode === 'create' || (alertId !== undefined && Number.isInteger(alertId) && alertId > 0)
  const formQueries = useAlertFormQueries(
    mode === 'edit' && hasValidAlertId ? alertId : undefined,
    municipalitiesQuery,
  )
  const createMutation = useCreateAlert()
  const updateMutation = useUpdateAlert()
  const activeMutation = mode === 'create' ? createMutation : updateMutation
  const title = PAGE_TITLES[mode]

  const goToAlertList = () => navigate(paths.alerts)

  const handleAlertSubmit = (values: AlertFormValues) => {
    // A lista mostra o aviso: cada tela tem o seu Toast.
    const handleAlertSaved = (saved: AlertDetails) =>
      navigate(paths.alerts, { state: toNavigationToastState(describeSavedAlert(saved, mode)) })

    if (mode === 'create' || alertId === undefined) {
      createMutation.mutate(toCreateAlertInput(values), { onSuccess: handleAlertSaved })
      return
    }

    updateMutation.mutate(
      { id: alertId, data: toAlertContentInput(values) },
      { onSuccess: handleAlertSaved },
    )
  }

  const renderPageContent = () => {
    if (!hasValidAlertId || formQueries.isAlertNotFound) {
      return <AlertNotFoundNotice onBackClick={goToAlertList} />
    }

    if (formQueries.hasLoadError) {
      return (
        <QueryErrorAlert
          title="Não foi possível carregar o formulário do comunicado."
          message={getApiErrorMessage(formQueries.loadError, 'Tente novamente em instantes.')}
          isRetrying={formQueries.isRetrying}
          onRetry={formQueries.retry}
        />
      )
    }

    if (formQueries.isLoading) return <AlertFormSkeleton />

    return (
      <AlertForm
        mode={mode}
        editingAlert={formQueries.editingAlert}
        municipalities={formQueries.municipalities}
        isSubmitting={activeMutation.isPending}
        formServerError={
          activeMutation.isError
            ? getApiErrorMessage(activeMutation.error, SAVE_ERROR_FALLBACK)
            : undefined
        }
        onSubmit={handleAlertSubmit}
        onCancel={goToAlertList}
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
