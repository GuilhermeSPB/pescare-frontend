import { Button } from 'primereact/button'

import { EmptyState } from '@/components/empty-state'

interface FishingBanPeriodNoticeProps {
  title: string
  description: string
  actionLabel: string
  onActionClick: () => void
}

// Endereço sem período, ou ação que a versão aberta não aceita, com o caminho de volta.
export function FishingBanPeriodNotice({
  title,
  description,
  actionLabel,
  onActionClick,
}: FishingBanPeriodNoticeProps) {
  return (
    <section className="rounded-md border border-line bg-white">
      <EmptyState
        icon="pi pi-calendar-times"
        title={title}
        description={description}
        action={<Button label={actionLabel} size="small" onClick={onActionClick} />}
      />
    </section>
  )
}
