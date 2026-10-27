import type { Species } from '@/features/species/types/species'

/**
 * Texto em que a busca de espécies procura: nome popular e nome científico.
 *
 * @example
 * useCatalogFilter(speciesList, getSpeciesSearchText)
 */
export const getSpeciesSearchText = (species: Species): string =>
  `${species.main_name} ${species.scientific_name}`
