import type { StatusTone } from '@/components/status-tag'
import type { AlertListItem, AlertStatus } from '@/features/alerts/types/alert'

export type AlertStatusFilter = 'all' | AlertStatus

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Arquivado',
}

export const ALERT_STATUS_TONES: Record<AlertStatus, StatusTone> = {
  DRAFT: 'pending',
  PUBLISHED: 'positive',
  ARCHIVED: 'neutral',
}

// Segmentos do filtro da lista, nesta ordem.
export const ALERT_STATUS_FILTER_LABELS: Record<AlertStatusFilter, string> = {
  all: 'Todos',
  DRAFT: 'Rascunhos',
  PUBLISHED: 'Publicados',
  ARCHIVED: 'Arquivados',
}

/**
 * Quantos comunicados há em cada segmento do filtro de status.
 *
 * @example
 * countAlertsByStatus(alerts) // { all: 5, DRAFT: 1, PUBLISHED: 3, ARCHIVED: 1 }
 */
export const countAlertsByStatus = (
  alerts: Pick<AlertListItem, 'status'>[],
): Record<AlertStatusFilter, number> => {
  const counts: Record<AlertStatusFilter, number> = {
    all: alerts.length,
    DRAFT: 0,
    PUBLISHED: 0,
    ARCHIVED: 0,
  }

  alerts.forEach(({ status }) => {
    counts[status] += 1
  })

  return counts
}
