import { confirmDialog } from 'primereact/confirmdialog'

interface PeriodCorrectionRequest {
  periodLabel: string
  onAccept: () => void
}

/**
 * Confirma que mudar uma versão já em vigor é erro de cadastro: a correção reescreve o que valia
 * no passado. O foco começa em "Cancelar", para Enter não reescrever por engano. Requer o
 * `<ConfirmDialog />` do layout autenticado.
 *
 * @example
 * confirmPeriodCorrection({ periodLabel, onAccept: () => onSubmit(input, true) })
 */
export const confirmPeriodCorrection = ({ periodLabel, onAccept }: PeriodCorrectionRequest) => {
  confirmDialog({
    header: `Foi erro de cadastro em “${periodLabel}”?`,
    message:
      'Esta vigência já começou, e a correção muda também o que valia no passado. ' +
      'Se a norma mudou, cancele e use “Nova vigência”.',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Corrigir',
    rejectLabel: 'Cancelar',
    defaultFocus: 'reject',
    accept: onAccept,
  })
}
