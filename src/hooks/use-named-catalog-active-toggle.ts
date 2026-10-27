import { confirmDeactivation, type DeactivationCopy } from '@/lib/confirm-deactivation'
import type { NamedCatalogItem, NamedCatalogUpdateMutation } from '@/types/named-catalog'

interface NamedCatalogActiveToggleOptions {
  // Instância própria, separada da do formulário: o carregando e o erro de uma não vazam
  // para a outra.
  updateMutation: NamedCatalogUpdateMutation
  deactivationCopy: DeactivationCopy
  onToggled: (item: NamedCatalogItem, isActive: boolean) => void
  onToggleFailed: (error: unknown) => void
}

/**
 * Ativa ou desativa um item de catálogo simples. Desativar pede confirmação antes, dizendo
 * o efeito no app dos pescadores; reativar é imediato (é o caminho de volta).
 * Requer um `<ConfirmDialog />` montado na árvore.
 *
 * @example
 * const { requestActiveToggle, togglingItemId } = useNamedCatalogActiveToggle({ updateMutation, deactivationCopy, onToggled, onToggleFailed })
 */
export const useNamedCatalogActiveToggle = ({
  updateMutation,
  deactivationCopy,
  onToggled,
  onToggleFailed,
}: NamedCatalogActiveToggleOptions) => {
  const setItemActive = (item: NamedCatalogItem, isActive: boolean) => {
    updateMutation.mutate(
      { id: item.id, data: { is_active: isActive } },
      { onSuccess: () => onToggled(item, isActive), onError: onToggleFailed },
    )
  }

  const requestActiveToggle = (item: NamedCatalogItem) => {
    if (!item.is_active) {
      setItemActive(item, true)
      return
    }

    confirmDeactivation({
      itemLabel: item.name,
      copy: deactivationCopy,
      onAccept: () => setItemActive(item, false),
    })
  }

  return {
    requestActiveToggle,
    togglingItemId: updateMutation.isPending ? updateMutation.variables?.id : undefined,
  }
}
