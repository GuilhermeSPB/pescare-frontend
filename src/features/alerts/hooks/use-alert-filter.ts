import { useState } from 'react'

import type { AlertListItem } from '@/features/alerts/types/alert'
import { countAlertsByStatus, type AlertStatusFilter } from '@/features/alerts/utils/alert-status'
import { normalizeForSearch } from '@/utils/filter-catalog'

/**
 * Busca (título ou texto) e filtro por status da lista de comunicados. As contagens usam a lista
 * inteira.
 *
 * @example
 * const alertFilter = useAlertFilter(alerts)
 */
export const useAlertFilter = (alerts: AlertListItem[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AlertStatusFilter>('all')
  const normalizedTerm = normalizeForSearch(searchTerm)

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
  }

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clearFilters,
    counts: countAlertsByStatus(alerts),
    filteredItems: alerts.filter(
      (alert) =>
        (statusFilter === 'all' || alert.status === statusFilter) &&
        normalizeForSearch(`${alert.title} ${alert.description}`).includes(normalizedTerm),
    ),
    hasActiveFilter: searchTerm.trim() !== '' || statusFilter !== 'all',
  }
}
