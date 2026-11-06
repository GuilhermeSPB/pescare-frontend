import { useUpdateUserStatus } from '@/features/users/api/update-user-status'
import { confirmDeactivation, type DeactivationCopy } from '@/lib/confirm-deactivation'
import type { User } from '@/types/user'

const USER_DEACTIVATION_COPY: DeactivationCopy = {
  message:
    'O usuário perde o acesso ao app e ao painel na hora. Os registros dele continuam, e você pode reativá-lo quando quiser.',
  acceptLabel: 'Desativar usuário',
}

interface UserActiveToggleCallbacks {
  onToggled: (user: User, isActive: boolean) => void
  onToggleFailed: (error: unknown) => void
}

/**
 * Ativa ou desativa um usuário. Desativar pede confirmação antes, dizendo que o acesso
 * acaba na hora; reativar é imediato (é o caminho de volta).
 * Requer um `<ConfirmDialog />` montado na árvore.
 *
 * @example
 * const { requestActiveToggle, togglingUserId } = useUserActiveToggle({ onToggled, onToggleFailed })
 */
export const useUserActiveToggle = ({ onToggled, onToggleFailed }: UserActiveToggleCallbacks) => {
  const statusMutation = useUpdateUserStatus()

  const setUserActive = (user: User, isActive: boolean) => {
    statusMutation.mutate(
      { id: user.id, data: { is_active: isActive } },
      { onSuccess: () => onToggled(user, isActive), onError: onToggleFailed },
    )
  }

  const requestActiveToggle = (user: User) => {
    if (!user.is_active) {
      setUserActive(user, true)
      return
    }

    confirmDeactivation({
      itemLabel: user.name,
      copy: USER_DEACTIVATION_COPY,
      onAccept: () => setUserActive(user, false),
    })
  }

  return {
    requestActiveToggle,
    togglingUserId: statusMutation.isPending ? statusMutation.variables?.id : undefined,
  }
}
