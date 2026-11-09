import type { ReactNode } from 'react'

import type { ActiveStatusLabels } from '@/components/active-status-tag'
import { CatalogSearchField } from '@/components/catalog-search-field'
import { FilterToolbar } from '@/components/filter-toolbar'
import { StatusFilter, type StatusFilterOption } from '@/components/status-filter'
import type { ActiveStatusCounts, ActiveStatusFilter } from '@/types/catalog'

interface CatalogToolbarProps {
  searchTerm: string
  // Nome do campo para leitores de tela; o texto visível é sempre o placeholder "Pesquisar".
  searchLabel: string
  statusFilter: ActiveStatusFilter
  // Sem contagens (lista carregando ou com erro), o filtro mostra só os rótulos e fica bloqueado.
  counts?: ActiveStatusCounts
  // Lista buscada no servidor, sem contagens: quem usa diz quando bloquear.
  isDisabled?: boolean
  // Rótulos de outra situação de dois estados.
  statusLabels?: ActiveStatusLabels
  // Filtro próprio do catálogo, antes do status: ex.: o perfil na lista de usuários.
  extraFilter?: ReactNode
  onSearchTermChange: (searchTerm: string) => void
  onStatusFilterChange: (statusFilter: ActiveStatusFilter) => void
}

const DEFAULT_STATUS_LABELS: ActiveStatusLabels = { active: 'Ativos', inactive: 'Inativos' }

const buildStatusOptions = (
  statusLabels: ActiveStatusLabels,
  counts?: ActiveStatusCounts,
): StatusFilterOption<ActiveStatusFilter>[] => [
  { value: 'all', label: 'Todos', count: counts?.all },
  { value: 'active', label: statusLabels.active, count: counts?.active },
  { value: 'inactive', label: statusLabels.inactive, count: counts?.inactive },
]

export function CatalogToolbar({
  searchTerm,
  searchLabel,
  statusFilter,
  counts,
  isDisabled = counts === undefined,
  statusLabels = DEFAULT_STATUS_LABELS,
  extraFilter,
  onSearchTermChange,
  onStatusFilterChange,
}: CatalogToolbarProps) {
  return (
    <FilterToolbar
      search={
        <CatalogSearchField
          searchTerm={searchTerm}
          searchLabel={searchLabel}
          isDisabled={isDisabled}
          onSearchTermChange={onSearchTermChange}
        />
      }
      filters={
        <>
          {extraFilter}
          <StatusFilter
            value={statusFilter}
            options={buildStatusOptions(statusLabels, counts)}
            isDisabled={isDisabled}
            onChange={onStatusFilterChange}
          />
        </>
      }
    />
  )
}
