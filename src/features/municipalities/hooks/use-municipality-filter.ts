import { useMemo, useState } from 'react'

import type { Municipality } from '@/types/municipality'
import { normalizeForSearch } from '@/utils/filter-catalog'
import { listMunicipalityUfs } from '@/utils/municipalities-by-uf'

// O termo já vem normalizado; o código IBGE só tem dígitos e não precisa de normalização.
const matchesMunicipalitySearch = (municipality: Municipality, normalizedTerm: string) =>
  municipality.ibge_code.includes(normalizedTerm) ||
  normalizeForSearch(municipality.name).includes(normalizedTerm)

const filterMunicipalities = (
  municipalities: Municipality[],
  selectedUf: string | null,
  normalizedTerm: string,
) =>
  municipalities.filter(
    (municipality) =>
      (selectedUf === null || municipality.uf === selectedUf) &&
      matchesMunicipalitySearch(municipality, normalizedTerm),
  )

/**
 * Busca (pelo nome ou pelo código IBGE) e filtro por UF da lista de municípios, com o resultado
 * já filtrado. Memoizado: a lista tem mais de 5.500 municípios.
 *
 * @example
 * const { filteredMunicipalities, selectedUf, setSelectedUf } = useMunicipalityFilter(municipalities)
 */
export const useMunicipalityFilter = (municipalities: Municipality[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUf, setSelectedUf] = useState<string | null>(null)
  const normalizedTerm = normalizeForSearch(searchTerm)

  const ufOptions = useMemo(() => listMunicipalityUfs(municipalities), [municipalities])
  const filteredMunicipalities = useMemo(
    () => filterMunicipalities(municipalities, selectedUf, normalizedTerm),
    [municipalities, selectedUf, normalizedTerm],
  )

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedUf(null)
  }

  return {
    searchTerm,
    setSearchTerm,
    selectedUf,
    setSelectedUf,
    clearFilters,
    ufOptions,
    filteredMunicipalities,
    hasActiveFilter: normalizedTerm !== '' || selectedUf !== null,
  }
}
