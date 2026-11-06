import { RowActionButton, RowActions, ViewRowActionButton } from '@/components/row-action-button'

interface FishingBanPeriodRowActionsProps {
  // Portaria e janela: "Visualizar Instrução Normativa Nº 34/04 · 01/12 – 31/05".
  periodLabel: string
  // Só período vigente ou agendado pode ser encerrado; um encerrado volta pela edição (limpando o
  // fim).
  canEndValidity: boolean
  onViewClick: () => void
  onEndValidityClick: () => void
}

export function FishingBanPeriodRowActions({
  periodLabel,
  canEndValidity,
  onViewClick,
  onEndValidityClick,
}: FishingBanPeriodRowActionsProps) {
  return (
    <RowActions>
      <ViewRowActionButton itemLabel={periodLabel} onClick={onViewClick} />
      {canEndValidity && (
        <RowActionButton
          icon="pi pi-calendar-minus"
          actionLabel="Encerrar vigência"
          itemLabel={periodLabel}
          isSecondary
          onClick={onEndValidityClick}
        />
      )}
    </RowActions>
  )
}
