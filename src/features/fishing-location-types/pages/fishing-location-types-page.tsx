import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useState } from 'react'

import { CatalogEmptyState, type CatalogEmptyStateCopy } from '@/components/catalog-empty-state'
import { CatalogSection } from '@/components/catalog-section'
import { CatalogToolbar } from '@/components/catalog-toolbar'
import { NamedCatalogTable } from '@/components/named-catalog-table'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { useFishingLocationTypes } from '@/features/fishing-location-types/api/get-fishing-location-types'
import { useUpdateFishingLocationType } from '@/features/fishing-location-types/api/update-fishing-location-type'
import { FishingLocationTypeFormDialog } from '@/features/fishing-location-types/components/fishing-location-type-form-dialog'
import type { FishingLocationType } from '@/features/fishing-location-types/types/fishing-location-type'
import { useCatalogFilter } from '@/hooks/use-catalog-filter'
import { useNamedCatalogActiveToggle } from '@/hooks/use-named-catalog-active-toggle'
import { useToast, type ToastText } from '@/hooks/use-toast'
import type { DeactivationCopy } from '@/lib/confirm-deactivation'
import { getApiErrorMessage } from '@/utils/api-error'
import { getFishingEnvironmentLabel } from '@/utils/fishing-environment'

const EMPTY_STATE_COPY: CatalogEmptyStateCopy = {
  noMatchTitle: 'Nenhum tipo encontrado',
  noMatchDescription: 'Nenhum tipo corresponde à busca e ao filtro escolhidos.',
  emptyTitle: 'Nenhum tipo cadastrado',
  emptyDescription:
    'Cadastre os tipos de local para o pescador escolher ao registrar uma pescaria.',
  createLabel: 'Cadastrar tipo',
}

const DEACTIVATION_COPY: DeactivationCopy = {
  message:
    'O tipo deixa de aparecer como opção no app dos pescadores. As pescarias já registradas continuam com ele, e você pode reativá-lo quando quiser.',
  acceptLabel: 'Desativar tipo',
}

const describeActiveToggle = (name: string, isActive: boolean): ToastText =>
  isActive
    ? ['Tipo ativado', `“${name}” voltou a aparecer no app dos pescadores.`]
    : ['Tipo desativado', `“${name}” não aparece mais no app dos pescadores.`]

const getItemName = (item: FishingLocationType) => item.name

// Tipo cadastrado antes do campo existir aparece sem ambiente, até alguém editar.
const renderEnvironment = (item: FishingLocationType) =>
  item.environment ? (
    getFishingEnvironmentLabel(item.environment)
  ) : (
    <span className="text-ink-muted">Não informado</span>
  )

interface FormDialogState {
  isVisible: boolean
  editingItem?: FishingLocationType
}

// Tipos de local têm um campo além do nome (o ambiente de pesca, que o REAP pede), por isso não
// usam a NamedCatalogScreen: a tela é montada aqui com as mesmas peças de catálogo.
export function FishingLocationTypesPage() {
  const itemsQuery = useFishingLocationTypes()
  const activeToggleMutation = useUpdateFishingLocationType()
  const catalogFilter = useCatalogFilter(itemsQuery.data ?? [], getItemName)
  const { toastRef, showSuccessToast, showErrorToast } = useToast()
  const [formDialog, setFormDialog] = useState<FormDialogState>({ isVisible: false })

  const { requestActiveToggle, togglingItemId } = useNamedCatalogActiveToggle({
    updateMutation: activeToggleMutation,
    deactivationCopy: DEACTIVATION_COPY,
    onToggled: (item, isActive) => showSuccessToast(...describeActiveToggle(item.name, isActive)),
    onToggleFailed: (error) =>
      showErrorToast(
        'Não foi possível mudar a situação',
        getApiErrorMessage(error, 'Tente novamente.'),
      ),
  })

  const handleCreateClick = () => setFormDialog({ isVisible: true })
  const handleEditClick = (item: FishingLocationType) =>
    setFormDialog({ isVisible: true, editingItem: item })
  const handleFormDialogHide = () => setFormDialog((current) => ({ ...current, isVisible: false }))

  const handleItemSaved = (toastText: ToastText) => {
    handleFormDialogHide()
    showSuccessToast(...toastText)
  }

  return (
    <div className="flex flex-col gap-6">
      <title>Tipos de local · Pescare Admin</title>
      <Toast ref={toastRef} position="bottom-right" />
      <PageHeader
        title="Tipos de local"
        actions={<Button label="Novo tipo" icon="pi pi-plus" onClick={handleCreateClick} />}
      />
      <CatalogSection
        label="Lista de tipos de local"
        toolbar={
          <CatalogToolbar
            searchTerm={catalogFilter.searchTerm}
            searchLabel="Buscar tipo pelo nome"
            statusFilter={catalogFilter.statusFilter}
            counts={itemsQuery.isSuccess ? catalogFilter.counts : undefined}
            onSearchTermChange={catalogFilter.setSearchTerm}
            onStatusFilterChange={catalogFilter.setStatusFilter}
          />
        }
      >
        {itemsQuery.isError ? (
          <div className="p-4">
            <QueryErrorAlert
              title="Não foi possível carregar os tipos de local."
              message={getApiErrorMessage(itemsQuery.error, 'Tente novamente em instantes.')}
              isRetrying={itemsQuery.isRefetching}
              onRetry={() => itemsQuery.refetch()}
            />
          </div>
        ) : (
          <NamedCatalogTable
            items={catalogFilter.filteredItems}
            isLoading={itemsQuery.isPending}
            extraColumn={{ header: 'Ambiente', render: renderEnvironment }}
            emptyState={
              <CatalogEmptyState
                hasActiveFilter={catalogFilter.hasActiveFilter}
                copy={EMPTY_STATE_COPY}
                onClearFilters={catalogFilter.clearFilters}
                onCreateClick={handleCreateClick}
              />
            }
            togglingItemId={togglingItemId}
            onEditClick={handleEditClick}
            onToggleActiveClick={requestActiveToggle}
          />
        )}
      </CatalogSection>
      <FishingLocationTypeFormDialog
        isVisible={formDialog.isVisible}
        editingItem={formDialog.editingItem}
        onHide={handleFormDialogHide}
        onSaved={handleItemSaved}
      />
    </div>
  )
}
