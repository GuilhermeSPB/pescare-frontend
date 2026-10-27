import { useUpdateSpecies } from '@/features/species/api/update-species'
import type { Species } from '@/features/species/types/species'
import { confirmDeactivation, type DeactivationCopy } from '@/lib/confirm-deactivation'

const SPECIES_DEACTIVATION_COPY: DeactivationCopy = {
  message:
    'A espécie deixa de aparecer como opção no app dos pescadores. As pescarias já registradas continuam com ela, e você pode reativá-la quando quiser.',
  acceptLabel: 'Desativar espécie',
}

interface SpeciesActiveToggleCallbacks {
  onToggled: (species: Species, isActive: boolean) => void
  onToggleFailed: (error: unknown) => void
}

/**
 * Ativa ou desativa uma espécie. Desativar pede confirmação antes, dizendo o efeito
 * no app dos pescadores; reativar é imediato (é o caminho de volta).
 * Requer um `<ConfirmDialog />` montado na árvore.
 *
 * @example
 * const { requestActiveToggle, togglingSpeciesId } = useSpeciesActiveToggle({ onToggled, onToggleFailed })
 */
export const useSpeciesActiveToggle = ({
  onToggled,
  onToggleFailed,
}: SpeciesActiveToggleCallbacks) => {
  const updateMutation = useUpdateSpecies()

  const setSpeciesActive = (species: Species, isActive: boolean) => {
    updateMutation.mutate(
      { id: species.id, data: { is_active: isActive } },
      { onSuccess: () => onToggled(species, isActive), onError: onToggleFailed },
    )
  }

  const requestActiveToggle = (species: Species) => {
    if (!species.is_active) {
      setSpeciesActive(species, true)
      return
    }

    confirmDeactivation({
      itemLabel: species.main_name,
      copy: SPECIES_DEACTIVATION_COPY,
      onAccept: () => setSpeciesActive(species, false),
    })
  }

  return {
    requestActiveToggle,
    togglingSpeciesId: updateMutation.isPending ? updateMutation.variables?.id : undefined,
  }
}
