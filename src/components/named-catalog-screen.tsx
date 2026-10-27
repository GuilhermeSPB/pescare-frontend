import type { UseQueryResult } from '@tanstack/react-query'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useState } from 'react'

import { CatalogEmptyState, type CatalogEmptyStateCopy } from '@/components/catalog-empty-state'
import { CatalogSection } from '@/components/catalog-section'
import { CatalogToolbar } from '@/components/catalog-toolbar'
import {
  NamedCatalogFormDialog,
  type NamedCatalogFormCopy,
} from '@/components/named-catalog-form-dialog'
import { NamedCatalogTable } from '@/components/named-catalog-table'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { useCatalogFilter } from '@/hooks/use-catalog-filter'
import { useNamedCatalogActiveToggle } from '@/hooks/use-named-catalog-active-toggle'
import { useToast, type ToastText } from '@/hooks/use-toast'
import type { DeactivationCopy } from '@/lib/confirm-deactivation'
import type {
  NamedCatalogCreateMutation,
  NamedCatalogItem,
  NamedCatalogUpdateMutation,
} from '@/types/named-catalog'
import { getApiErrorMessage } from '@/utils/api-error'

export interface NamedCatalogScreenCopy {
  title: string
  createLabel: string
  // Nomes da lista e do campo de busca para leitores de tela.
  listLabel: string
  searchLabel: string
  loadErrorTitle: string
  emptyState: CatalogEmptyStateCopy
  form: NamedCatalogFormCopy
  deactivation: DeactivationCopy
  activatedToast: (name: string) => ToastText
  deactivatedToast: (name: string) => ToastText
}

interface NamedCatalogScreenProps {
  copy: NamedCatalogScreenCopy
  itemsQuery: UseQueryResult<NamedCatalogItem[]>
  createMutation: NamedCatalogCreateMutation
  // Duas instâncias da mesma mutation de alteração: uma para o formulário, outra para
  // ativar/desativar na lista, para o carregando e o erro de uma não aparecerem na outra.
  renameMutation: NamedCatalogUpdateMutation
  activeToggleMutation: NamedCatalogUpdateMutation
}

interface FormDialogState {
  isVisible: boolean
  editingItem?: NamedCatalogItem
}

const getItemName = (item: NamedCatalogItem) => item.name

// Tela completa de um catálogo simples: cada feature entra só com os textos e os hooks da API.
export function NamedCatalogScreen({
  copy,
  itemsQuery,
  createMutation,
  renameMutation,
  activeToggleMutation,
}: NamedCatalogScreenProps) {
  const catalogFilter = useCatalogFilter(itemsQuery.data ?? [], getItemName)
  const { toastRef, showSuccessToast, showErrorToast } = useToast()
  const [formDialog, setFormDialog] = useState<FormDialogState>({ isVisible: false })

  const { requestActiveToggle, togglingItemId } = useNamedCatalogActiveToggle({
    updateMutation: activeToggleMutation,
    deactivationCopy: copy.deactivation,
    onToggled: (item, isActive) =>
      showSuccessToast(
        ...(isActive ? copy.activatedToast(item.name) : copy.deactivatedToast(item.name)),
      ),
    onToggleFailed: (error) =>
      showErrorToast(
        'Não foi possível mudar a situação',
        getApiErrorMessage(error, 'Tente novamente.'),
      ),
  })

  const handleCreateClick = () => setFormDialog({ isVisible: true })
  const handleEditClick = (item: NamedCatalogItem) =>
    setFormDialog({ isVisible: true, editingItem: item })
  const handleFormDialogHide = () => setFormDialog((current) => ({ ...current, isVisible: false }))

  const handleItemSaved = (toastText: ToastText) => {
    handleFormDialogHide()
    showSuccessToast(...toastText)
  }

  return (
    <div className="flex flex-col gap-6">
      <Toast ref={toastRef} position="bottom-right" />
      <PageHeader
        title={copy.title}
        actions={<Button label={copy.createLabel} icon="pi pi-plus" onClick={handleCreateClick} />}
      />
      <CatalogSection
        label={copy.listLabel}
        toolbar={
          <CatalogToolbar
            searchTerm={catalogFilter.searchTerm}
            searchLabel={copy.searchLabel}
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
              title={copy.loadErrorTitle}
              message={getApiErrorMessage(itemsQuery.error, 'Tente novamente em instantes.')}
              isRetrying={itemsQuery.isRefetching}
              onRetry={() => itemsQuery.refetch()}
            />
          </div>
        ) : (
          <NamedCatalogTable
            items={catalogFilter.filteredItems}
            isLoading={itemsQuery.isPending}
            emptyState={
              <CatalogEmptyState
                hasActiveFilter={catalogFilter.hasActiveFilter}
                copy={copy.emptyState}
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
      <NamedCatalogFormDialog
        isVisible={formDialog.isVisible}
        copy={copy.form}
        editingItem={formDialog.editingItem}
        createMutation={createMutation}
        renameMutation={renameMutation}
        onHide={handleFormDialogHide}
        onSaved={handleItemSaved}
      />
    </div>
  )
}
