import { useState } from 'react'

import type { ActiveCatalogItem, ActiveStatusFilter } from '@/types/catalog'
import { countCatalogByStatus, filterCatalog } from '@/utils/filter-catalog'

/**
 * Estado de busca e filtro por situação de um catálogo, com o resultado já filtrado.
 * As contagens usam a lista inteira, para o filtro mostrar quantos há em cada situação.
 *
 * @param getSearchText texto de cada item em que a busca procura (o nome, ou vários campos).
 * @example
 * const { filteredItems, counts, searchTerm, setSearchTerm } = useCatalogFilter(methods, getMethodName)
 */
export const useCatalogFilter = <Item extends ActiveCatalogItem>(
  items: Item[],
  getSearchText: (item: Item) => string,
) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilter>('all')

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
    counts: countCatalogByStatus(items),
    filteredItems: filterCatalog(items, { searchTerm, statusFilter, getSearchText }),
    hasActiveFilter: searchTerm.trim() !== '' || statusFilter !== 'all',
  }
}
