import { useState } from 'react'

import type { MunicipalitySearchFilters } from '@/features/municipalities/types/municipality-search-filters'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { SERVER_SEARCH_DEBOUNCE_MS } from '@/utils/server-search'

/**
 * Estado da busca (pelo nome ou pelo código IBGE) e do filtro por UF. A filtragem é no servidor:
 * o hook só monta os filtros da consulta, com o termo já estabilizado.
 *
 * @example
 * const { searchFilters, selectedUf, setSelectedUf } = useMunicipalityFilter()
 */
export const useMunicipalityFilter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUf, setSelectedUf] = useState<string | null>(null)
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim(), SERVER_SEARCH_DEBOUNCE_MS)

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedUf(null)
  }

  const searchFilters: MunicipalitySearchFilters = {
    ...(debouncedSearchTerm !== '' && { search: debouncedSearchTerm }),
    ...(selectedUf !== null && { uf: selectedUf }),
  }

  return {
    searchTerm,
    setSearchTerm,
    selectedUf,
    setSelectedUf,
    clearFilters,
    searchFilters,
    hasActiveFilter: searchTerm.trim() !== '' || selectedUf !== null,
  }
}
