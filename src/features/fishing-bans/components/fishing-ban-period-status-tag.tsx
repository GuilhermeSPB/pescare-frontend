import { StatusTag } from '@/components/status-tag'
import {
  getPeriodStatusLabel,
  getPeriodStatusTone,
  type PeriodDisplayStatus,
} from '@/features/fishing-bans/utils/fishing-ban-period-status'

// Vigente (verde), Rascunho (âmbar) ou Encerrado (neutro).
export function FishingBanPeriodStatusTag({ status }: { status: PeriodDisplayStatus }) {
  return <StatusTag tone={getPeriodStatusTone(status)} label={getPeriodStatusLabel(status)} />
}
