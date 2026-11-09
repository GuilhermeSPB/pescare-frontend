import { Toast } from 'primereact/toast'
import { useState } from 'react'

import { CatalogEmptyState, type CatalogEmptyStateCopy } from '@/components/catalog-empty-state'
import { CatalogSection } from '@/components/catalog-section'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { useSearchMunicipalities } from '@/features/municipalities/api/search-municipalities'
import { MunicipalityNameDialog } from '@/features/municipalities/components/municipality-name-dialog'
import { MunicipalityTable } from '@/features/municipalities/components/municipality-table'
import { MunicipalityToolbar } from '@/features/municipalities/components/municipality-toolbar'
import { useMunicipalityFilter } from '@/features/municipalities/hooks/use-municipality-filter'
import { useToast, type ToastText } from '@/hooks/use-toast'
import type { Municipality } from '@/types/municipality'
import { getApiErrorMessage } from '@/utils/api-error'
import { BRAZILIAN_UFS } from '@/utils/brazilian-ufs'

// Sem cadastro: os municípios vêm da carga do IBGE no backend.
const MUNICIPALITIES_EMPTY_STATE_COPY: CatalogEmptyStateCopy = {
  noMatchTitle: 'Nenhum município encontrado',
  noMatchDescription: 'Nenhum município corresponde à busca e à UF escolhidas.',
  emptyTitle: 'Nenhum município carregado',
  emptyDescription: 'Os municípios vêm da carga do IBGE feita no servidor.',
}

interface NameDialogState {
  isVisible: boolean
  editingMunicipality?: Municipality
}

export function MunicipalitiesPage() {
  const municipalityFilter = useMunicipalityFilter()
  const municipalitiesQuery = useSearchMunicipalities(municipalityFilter.searchFilters)
  const { toastRef, showSuccessToast } = useToast()
  const [nameDialog, setNameDialog] = useState<NameDialogState>({ isVisible: false })

  const handleEditClick = (municipality: Municipality) =>
    setNameDialog({ isVisible: true, editingMunicipality: municipality })
  const handleNameDialogHide = () => setNameDialog((current) => ({ ...current, isVisible: false }))

  const handleMunicipalitySaved = (toastText: ToastText) => {
    handleNameDialogHide()
    showSuccessToast(...toastText)
  }

  return (
    <div className="flex flex-col gap-6">
      <title>Municípios · Pescare Admin</title>
      <Toast ref={toastRef} position="bottom-right" />
      <PageHeader title="Municípios" />
      <CatalogSection
        label="Lista de municípios"
        toolbar={
          <MunicipalityToolbar
            searchTerm={municipalityFilter.searchTerm}
            selectedUf={municipalityFilter.selectedUf}
            ufOptions={BRAZILIAN_UFS}
            isDisabled={municipalitiesQuery.isPending}
            onSearchTermChange={municipalityFilter.setSearchTerm}
            onUfChange={municipalityFilter.setSelectedUf}
          />
        }
      >
        {municipalitiesQuery.isError ? (
          <div className="p-4">
            <QueryErrorAlert
              title="Não foi possível carregar os municípios."
              message={getApiErrorMessage(
                municipalitiesQuery.error,
                'Tente novamente em instantes.',
              )}
              isRetrying={municipalitiesQuery.isRefetching}
              onRetry={() => municipalitiesQuery.refetch()}
            />
          </div>
        ) : (
          <MunicipalityTable
            municipalities={municipalitiesQuery.data ?? []}
            isLoading={municipalitiesQuery.isPending}
            emptyState={
              <CatalogEmptyState
                hasActiveFilter={municipalityFilter.hasActiveFilter}
                copy={MUNICIPALITIES_EMPTY_STATE_COPY}
                onClearFilters={municipalityFilter.clearFilters}
              />
            }
            onEditClick={handleEditClick}
          />
        )}
      </CatalogSection>
      <MunicipalityNameDialog
        isVisible={nameDialog.isVisible}
        editingMunicipality={nameDialog.editingMunicipality}
        onHide={handleNameDialogHide}
        onSaved={handleMunicipalitySaved}
      />
    </div>
  )
}
