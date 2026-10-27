import type { UseQueryResult } from '@tanstack/react-query'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useState } from 'react'

import { CatalogEmptyState, type CatalogEmptyStateCopy } from '@/components/catalog-empty-state'
import { CatalogSection } from '@/components/catalog-section'
import { CatalogToolbar } from '@/components/catalog-toolbar'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { SpeciesFormDialog } from '@/features/species/components/species-form-dialog'
import { SpeciesTable } from '@/features/species/components/species-table'
import { useSpeciesActiveToggle } from '@/features/species/hooks/use-species-active-toggle'
import { useSpeciesCatalogQueries } from '@/features/species/hooks/use-species-catalog-queries'
import type { Species } from '@/features/species/types/species'
import { getSpeciesSearchText } from '@/features/species/utils/get-species-search-text'
import { buildTargetGroupNameById } from '@/features/species/utils/target-group-lookup'
import { useCatalogFilter } from '@/hooks/use-catalog-filter'
import { useToast, type ToastText } from '@/hooks/use-toast'
import type { NamedCatalogItem } from '@/types/named-catalog'
import { getApiErrorMessage } from '@/utils/api-error'

const SPECIES_EMPTY_STATE_COPY: CatalogEmptyStateCopy = {
  noMatchTitle: 'Nenhuma espécie encontrada',
  noMatchDescription: 'Nenhuma espécie corresponde à busca e ao filtro escolhidos.',
  emptyTitle: 'Nenhuma espécie cadastrada',
  emptyDescription: 'Cadastre as espécies para o pescador registrar o que pescou.',
  createLabel: 'Cadastrar espécie',
}

const describeActiveToggle = (species: Species, isActive: boolean): ToastText =>
  isActive
    ? ['Espécie ativada', `“${species.main_name}” voltou a aparecer no app dos pescadores.`]
    : ['Espécie desativada', `“${species.main_name}” não aparece mais no app dos pescadores.`]

interface FormDialogState {
  isVisible: boolean
  editingSpecies?: Species
}

interface SpeciesPageProps {
  // Vem da feature de grupos-alvo, composta na rota: dá nome à coluna e opções ao formulário.
  targetGroupsQuery: UseQueryResult<NamedCatalogItem[]>
}

export function SpeciesPage({ targetGroupsQuery }: SpeciesPageProps) {
  const catalogQueries = useSpeciesCatalogQueries(targetGroupsQuery)
  const catalogFilter = useCatalogFilter(catalogQueries.speciesList, getSpeciesSearchText)
  const { toastRef, showSuccessToast, showErrorToast } = useToast()
  const [formDialog, setFormDialog] = useState<FormDialogState>({ isVisible: false })

  const { requestActiveToggle, togglingSpeciesId } = useSpeciesActiveToggle({
    onToggled: (species, isActive) => showSuccessToast(...describeActiveToggle(species, isActive)),
    onToggleFailed: (error) =>
      showErrorToast(
        'Não foi possível mudar a situação',
        getApiErrorMessage(error, 'Tente novamente.'),
      ),
  })

  const handleCreateClick = () => setFormDialog({ isVisible: true })
  const handleEditClick = (species: Species) =>
    setFormDialog({ isVisible: true, editingSpecies: species })
  const handleFormDialogHide = () => setFormDialog((current) => ({ ...current, isVisible: false }))

  const handleSpeciesSaved = (toastText: ToastText) => {
    handleFormDialogHide()
    showSuccessToast(...toastText)
  }

  return (
    <div className="flex flex-col gap-6">
      <title>Espécies · Pescare Admin</title>
      <Toast ref={toastRef} position="bottom-right" />
      <PageHeader
        title="Espécies"
        actions={<Button label="Nova espécie" icon="pi pi-plus" onClick={handleCreateClick} />}
      />
      <CatalogSection
        label="Lista de espécies"
        toolbar={
          <CatalogToolbar
            searchTerm={catalogFilter.searchTerm}
            searchLabel="Buscar espécie pelo nome popular ou científico"
            statusFilter={catalogFilter.statusFilter}
            counts={catalogQueries.isLoaded ? catalogFilter.counts : undefined}
            onSearchTermChange={catalogFilter.setSearchTerm}
            onStatusFilterChange={catalogFilter.setStatusFilter}
          />
        }
      >
        {catalogQueries.hasLoadError ? (
          <div className="p-4">
            <QueryErrorAlert
              title="Não foi possível carregar as espécies."
              message={getApiErrorMessage(
                catalogQueries.loadError,
                'Tente novamente em instantes.',
              )}
              isRetrying={catalogQueries.isRetrying}
              onRetry={catalogQueries.retry}
            />
          </div>
        ) : (
          <SpeciesTable
            speciesList={catalogFilter.filteredItems}
            isLoading={catalogQueries.isLoading}
            targetGroupNameById={buildTargetGroupNameById(catalogQueries.targetGroups)}
            emptyState={
              <CatalogEmptyState
                hasActiveFilter={catalogFilter.hasActiveFilter}
                copy={SPECIES_EMPTY_STATE_COPY}
                onClearFilters={catalogFilter.clearFilters}
                onCreateClick={handleCreateClick}
              />
            }
            togglingSpeciesId={togglingSpeciesId}
            onEditClick={handleEditClick}
            onToggleActiveClick={requestActiveToggle}
          />
        )}
      </CatalogSection>
      <SpeciesFormDialog
        isVisible={formDialog.isVisible}
        editingSpecies={formDialog.editingSpecies}
        targetGroups={catalogQueries.targetGroups}
        onHide={handleFormDialogHide}
        onSaved={handleSpeciesSaved}
      />
    </div>
  )
}
