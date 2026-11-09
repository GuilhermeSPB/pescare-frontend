import { RowActionButton, RowActions } from '@/components/row-action-button'
import type { AlertStatus } from '@/features/alerts/types/alert'

interface AlertRowActionsProps {
  alertTitle: string
  status: AlertStatus
  // Publicação ou arquivamento em andamento nesta linha.
  isStatusChanging: boolean
  onEditClick: () => void
  onPublishClick: () => void
  onArchiveClick: () => void
}

export function AlertRowActions({
  alertTitle,
  status,
  isStatusChanging,
  onEditClick,
  onPublishClick,
  onArchiveClick,
}: AlertRowActionsProps) {
  return (
    <RowActions>
      <RowActionButton
        icon="pi pi-pencil"
        actionLabel="Editar"
        itemLabel={alertTitle}
        onClick={onEditClick}
      />
      {status === 'PUBLISHED' ? (
        <RowActionButton
          icon="pi pi-inbox"
          actionLabel="Arquivar"
          itemLabel={alertTitle}
          isLoading={isStatusChanging}
          isSecondary
          onClick={onArchiveClick}
        />
      ) : (
        <RowActionButton
          icon="pi pi-send"
          actionLabel="Publicar"
          itemLabel={alertTitle}
          isLoading={isStatusChanging}
          onClick={onPublishClick}
        />
      )}
    </RowActions>
  )
}
