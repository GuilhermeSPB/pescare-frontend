import type { ActiveCatalogItem } from '@/types/catalog'

export interface CatalogOption {
  label: string
  value: number
}

interface CatalogOptionsRule<Item> {
  // Ids já escolhidos no registro em edição: continuam como opção mesmo se desativados.
  keptIds: readonly number[]
  getLabel: (item: Item) => string
  // Marca dos itens desativados mantidos, no gênero do catálogo: "(inativo)", "(inativa)".
  inactiveSuffix: string
}

/**
 * Opções de um campo de escolha a partir de um catálogo: só os itens ativos, mais os já
 * escolhidos que foram desativados — senão a edição abriria com o campo vazio. Em ordem alfabética.
 *
 * @example
 * buildCatalogOptions(targetGroups, { keptIds: [species.fk_target_group_id], getLabel: (group) => group.name, inactiveSuffix: '(inativo)' })
 */
export const buildCatalogOptions = <Item extends ActiveCatalogItem>(
  items: Item[],
  { keptIds, getLabel, inactiveSuffix }: CatalogOptionsRule<Item>,
): CatalogOption[] =>
  items
    .filter((item) => item.is_active || keptIds.includes(item.id))
    .map((item) => ({
      value: item.id,
      label: item.is_active ? getLabel(item) : `${getLabel(item)} ${inactiveSuffix}`,
    }))
    .sort((first, second) => first.label.localeCompare(second.label, 'pt-BR'))
