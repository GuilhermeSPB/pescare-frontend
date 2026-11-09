import { StatusTag } from '@/components/status-tag'
import type { AlertStatus } from '@/features/alerts/types/alert'
import { ALERT_STATUS_LABELS, ALERT_STATUS_TONES } from '@/features/alerts/utils/alert-status'

export function AlertStatusTag({ status }: { status: AlertStatus }) {
  return <StatusTag tone={ALERT_STATUS_TONES[status]} label={ALERT_STATUS_LABELS[status]} />
}
