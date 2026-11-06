import { useState } from 'react'

import {
  countPeriodsByStatus,
  type FishingBanPeriodRow,
  type PeriodStatusFilter,
} from '@/features/fishing-bans/utils/fishing-ban-period-status'
import { getFishingBanPeriodSearchText } from '@/features/fishing-bans/utils/get-fishing-ban-period-search-text'
import { normalizeForSearch } from '@/utils/filter-catalog'

/**
 * Busca e filtro por status da lista de períodos. É o `useCatalogFilter` com três situações em
 * vez de duas (vigente, rascunho, encerrado). As contagens usam a lista inteira.
 *
 * @example
 * const periodFilter = useFishingBanPeriodFilter(periodRows)
 */
export const useFishingBanPeriodFilter = (rows: FishingBanPeriodRow[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PeriodStatusFilter>('all')
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
    counts: countPeriodsByStatus(rows),
    filteredItems: rows.filter(
      (row) =>
        (statusFilter === 'all' || row.display_status === statusFilter) &&
        normalizeForSearch(getFishingBanPeriodSearchText(row)).includes(normalizedTerm),
    ),
    hasActiveFilter: searchTerm.trim() !== '' || statusFilter !== 'all',
  }
}
