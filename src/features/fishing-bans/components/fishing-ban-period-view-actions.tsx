import { Button } from 'primereact/button'

import type { FishingBanPeriod } from '@/features/fishing-bans/types/fishing-ban-period'
import {
  canEndPeriodValidity,
  type PeriodDisplayStatus,
} from '@/features/fishing-bans/utils/fishing-ban-period-status'

interface FishingBanPeriodViewActionsProps {
  period: FishingBanPeriod
  displayStatus: PeriodDisplayStatus
  isActivating: boolean
  onEditClick: () => void
  onNewVersionClick: () => void
  onOpenDraftClick: () => void
  onActivateClick: () => void
  onEndValidityClick: () => void
}

// Ações da versão aberta. Rascunho: corrigir ou ativar. Versão atual: corrigir, encerrar (se
// vigente ou agendada) e criar a próxima versão, ou abrir a que já está em rascunho. Versão
// antiga: nenhuma, é só leitura.
export function FishingBanPeriodViewActions({
  period,
  displayStatus,
  isActivating,
  onEditClick,
  onNewVersionClick,
  onOpenDraftClick,
  onActivateClick,
  onEndValidityClick,
}: FishingBanPeriodViewActionsProps) {
  const editButton = <Button label="Editar" icon="pi pi-pencil" outlined onClick={onEditClick} />

  if (displayStatus === 'draft') {
    return (
      <>
        {editButton}
        <Button
          label="Ativar"
          icon="pi pi-check"
          loading={isActivating}
          onClick={onActivateClick}
        />
      </>
    )
  }

  if (!period.is_current_version) return null

  return (
    <>
      {editButton}
      {canEndPeriodValidity(displayStatus) && (
        <Button
          label="Encerrar vigência"
          icon="pi pi-calendar-minus"
          outlined
          severity="secondary"
          onClick={onEndValidityClick}
        />
      )}
      {period.pending_version_id === null ? (
        <Button label="Nova vigência" icon="pi pi-plus" onClick={onNewVersionClick} />
      ) : (
        <Button label="Abrir rascunho" icon="pi pi-file-edit" onClick={onOpenDraftClick} />
      )}
    </>
  )
}
