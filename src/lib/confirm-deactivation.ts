import { confirmDialog } from 'primereact/confirmdialog'

export interface DeactivationCopy {
  // Diz onde a mudança chega: o que some do app e o que continua nos registros.
  message: string
  acceptLabel: string
}

interface DeactivationRequest {
  itemLabel: string
  copy: DeactivationCopy
  onAccept: () => void
}

/**
 * Pede confirmação antes de desativar um item de catálogo, com o padrão do painel:
 * o foco começa em "Cancelar", para Enter não desativar por engano.
 * Requer um `<ConfirmDialog />` montado na árvore (fica no layout autenticado).
 *
 * @example
 * confirmDeactivation({ itemLabel: 'Tarrafa', copy: deactivationCopy, onAccept: () => setActive(false) })
 */
export const confirmDeactivation = ({ itemLabel, copy, onAccept }: DeactivationRequest) => {
  confirmDialog({
    header: `Desativar “${itemLabel}”?`,
    message: copy.message,
    icon: 'pi pi-eye-slash',
    acceptLabel: copy.acceptLabel,
    rejectLabel: 'Cancelar',
    defaultFocus: 'reject',
    accept: onAccept,
  })
}
