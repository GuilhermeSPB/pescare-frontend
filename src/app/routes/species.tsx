import { SpeciesPage } from '@/features/species/pages/species-page'
import { useTargetGroups } from '@/features/target-groups/api/get-target-groups'

export function SpeciesRoute() {
  // Espécies mostra e escolhe grupos-alvo; uma feature não importa a outra, então a rota compõe.
  const targetGroupsQuery = useTargetGroups()

  return <SpeciesPage targetGroupsQuery={targetGroupsQuery} />
}
