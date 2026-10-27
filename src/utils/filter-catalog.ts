import type { ActiveCatalogItem, ActiveStatusCounts, ActiveStatusFilter } from '@/types/catalog'

// Busca sem acento e sem caixa: "puca" encontra "Puçá".
const normalizeForSearch = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

const matchesStatus = (item: ActiveCatalogItem, statusFilter: ActiveStatusFilter): boolean => {
  if (statusFilter === 'all') return true

  return statusFilter === 'active' ? item.is_active : !item.is_active
}

interface CatalogFilterCriteria<Item> {
  searchTerm: string
  statusFilter: ActiveStatusFilter
  // Texto em que a busca procura: o nome, ou mais de um campo juntos.
  getSearchText: (item: Item) => string
}

/**
 * Filtra um catálogo por texto (sem acento) e por situação.
 *
 * @example
 * filterCatalog(methods, { searchTerm: 'rede', statusFilter: 'active', getSearchText: (method) => method.name })
 */
export const filterCatalog = <Item extends ActiveCatalogItem>(
  items: Item[],
  criteria: CatalogFilterCriteria<Item>,
): Item[] => {
  const normalizedTerm = normalizeForSearch(criteria.searchTerm)

  return items.filter(
    (item) =>
      matchesStatus(item, criteria.statusFilter) &&
      normalizeForSearch(criteria.getSearchText(item)).includes(normalizedTerm),
  )
}

/**
 * Conta os itens de um catálogo por situação.
 *
 * @example
 * countCatalogByStatus(methods) // { all: 12, active: 10, inactive: 2 }
 */
export const countCatalogByStatus = (items: ActiveCatalogItem[]): ActiveStatusCounts => {
  const active = items.filter((item) => item.is_active).length

  return { all: items.length, active, inactive: items.length - active }
}
