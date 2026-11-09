import { useUpdateAlert } from '@/features/alerts/api/update-alert'
import type { AlertListItem } from '@/features/alerts/types/alert'
import {
  confirmAlertStatusChange,
  type AlertTargetStatus,
} from '@/features/alerts/utils/confirm-alert-status-change'

interface AlertStatusChangeCallbacks {
  onStatusChanged: (alert: AlertListItem, targetStatus: AlertTargetStatus) => void
  onStatusChangeFailed: (error: unknown) => void
}

/**
 * Publica ou arquiva um comunicado, sempre com confirmação: as duas ações mudam o que o pescador
 * vê no app. Requer um `<ConfirmDialog />` montado na árvore.
 *
 * @example
 * const { requestStatusChange, changingAlertId } = useAlertStatusChange({ onStatusChanged, onStatusChangeFailed })
 */
export const useAlertStatusChange = ({
  onStatusChanged,
  onStatusChangeFailed,
}: AlertStatusChangeCallbacks) => {
  const updateMutation = useUpdateAlert()

  const requestStatusChange = (alert: AlertListItem, targetStatus: AlertTargetStatus) =>
    confirmAlertStatusChange({
      alertTitle: alert.title,
      targetStatus,
      onAccept: () =>
        updateMutation.mutate(
          { id: alert.id, data: { status: targetStatus } },
          {
            onSuccess: () => onStatusChanged(alert, targetStatus),
            onError: onStatusChangeFailed,
          },
        ),
    })

  return {
    requestStatusChange,
    changingAlertId: updateMutation.isPending ? updateMutation.variables?.id : undefined,
  }
}
