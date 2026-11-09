import { confirmDialog } from 'primereact/confirmdialog'

import type { AlertStatus } from '@/features/alerts/types/alert'

export type AlertTargetStatus = Exclude<AlertStatus, 'DRAFT'>

interface AlertStatusChangeCopy {
  verb: string
  message: string
  icon: string
}

const STATUS_CHANGE_COPY: Record<AlertTargetStatus, AlertStatusChangeCopy> = {
  PUBLISHED: {
    verb: 'Publicar',
    message: 'O comunicado aparece no app para os pescadores da área coberta, com a data de hoje.',
    icon: 'pi pi-send',
  },
  ARCHIVED: {
    verb: 'Arquivar',
    message: 'O comunicado sai da aba do app. Você pode publicá-lo de novo quando quiser.',
    icon: 'pi pi-inbox',
  },
}

interface AlertStatusChangeRequest {
  alertTitle: string
  targetStatus: AlertTargetStatus
  onAccept: () => void
}

/**
 * Pede confirmação antes de publicar ou arquivar, no mesmo padrão de `confirmDeactivation`: o foco
 * começa em "Cancelar", para Enter não mudar o que o pescador vê por engano. Requer o
 * `<ConfirmDialog />` do layout autenticado.
 *
 * @example
 * confirmAlertStatusChange({ alertTitle, targetStatus: 'ARCHIVED', onAccept: () => archive(alert) })
 */
export const confirmAlertStatusChange = ({
  alertTitle,
  targetStatus,
  onAccept,
}: AlertStatusChangeRequest) => {
  const { verb, message, icon } = STATUS_CHANGE_COPY[targetStatus]

  confirmDialog({
    header: `${verb} “${alertTitle}”?`,
    message,
    icon,
    acceptLabel: verb,
    rejectLabel: 'Cancelar',
    defaultFocus: 'reject',
    accept: onAccept,
  })
}
