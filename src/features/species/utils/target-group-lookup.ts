import type { NamedCatalogItem } from '@/types/named-catalog'
import { buildCatalogOptions, type CatalogOption } from '@/utils/catalog-options'

export type TargetGroupOption = CatalogOption

/**
 * Índice id → nome dos grupos-alvo, para a tabela mostrar o grupo de cada espécie
 * (a API de espécies traz só `fk_target_group_id`).
 *
 * @example
 * buildTargetGroupNameById(targetGroups).get(species.fk_target_group_id) // 'Peixes'
 */
export const buildTargetGroupNameById = (
  targetGroups: NamedCatalogItem[],
): ReadonlyMap<number, string> => new Map(targetGroups.map((group) => [group.id, group.name]))

/**
 * Opções do campo de grupo-alvo: só os grupos ativos, mais o grupo atual da espécie
 * quando ele foi desativado — senão a edição abriria com o campo vazio.
 *
 * @param currentGroupId grupo da espécie em edição; ausente no cadastro.
 * @example
 * getTargetGroupOptions(targetGroups, species.fk_target_group_id)
 */
export const getTargetGroupOptions = (
  targetGroups: NamedCatalogItem[],
  currentGroupId?: number,
): TargetGroupOption[] =>
  buildCatalogOptions(targetGroups, {
    keptIds: currentGroupId === undefined ? [] : [currentGroupId],
    getLabel: (group) => group.name,
    inactiveSuffix: '(inativo)',
  })
