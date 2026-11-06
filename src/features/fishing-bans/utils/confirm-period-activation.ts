import { confirmDialog } from 'primereact/confirmdialog'

interface PeriodActivationRequest {
  periodLabel: string
  // Diz onde a mudança chega: quando a versão anterior deixa de valer, ou quando esta começa.
  message: string
  onAccept: () => void
}

/**
 * Pede confirmação antes de ativar um rascunho, no mesmo padrão de `confirmDeactivation`: o foco
 * começa em "Cancelar", para Enter não ativar por engano. Requer o `<ConfirmDialog />` do layout
 * autenticado.
 *
 * @example
 * confirmPeriodActivation({ periodLabel, message, onAccept: () => activateMutation.mutate(id) })
 */
export const confirmPeriodActivation = ({
  periodLabel,
  message,
  onAccept,
}: PeriodActivationRequest) => {
  confirmDialog({
    header: `Ativar “${periodLabel}”?`,
    message,
    icon: 'pi pi-check-circle',
    acceptLabel: 'Ativar',
    rejectLabel: 'Cancelar',
    defaultFocus: 'reject',
    accept: onAccept,
  })
}
