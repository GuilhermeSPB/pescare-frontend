import type { NamedCatalogItem } from '@/types/named-catalog'

export interface TargetGroupOption {
  label: string
  value: number
}

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
  targetGroups
    .filter((group) => group.is_active || group.id === currentGroupId)
    .map((group) => ({
      value: group.id,
      label: group.is_active ? group.name : `${group.name} (inativo)`,
    }))
    .sort((first, second) => first.label.localeCompare(second.label, 'pt-BR'))
