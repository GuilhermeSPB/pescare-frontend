import type { StatusTone } from '@/components/status-tag'
import type { FishingBanPeriodListItem } from '@/features/fishing-bans/types/fishing-ban-period'

// Status na tela, derivado: o banco guarda só DRAFT/ACTIVE e as datas de vigência.
export type PeriodDisplayStatus = 'in-force' | 'scheduled' | 'draft' | 'ended'
export type PeriodStatusFilter = 'all' | PeriodDisplayStatus

const PERIOD_STATUS_LABELS: Record<PeriodDisplayStatus, string> = {
  'in-force': 'Vigente',
  scheduled: 'Agendado',
  draft: 'Rascunho',
  ended: 'Encerrado',
}

const PERIOD_STATUS_TONES: Record<PeriodDisplayStatus, StatusTone> = {
  'in-force': 'positive',
  scheduled: 'info',
  draft: 'pending',
  ended: 'neutral',
}

// Segmentos do filtro da lista, nesta ordem.
export const PERIOD_STATUS_FILTER_LABELS: Record<PeriodStatusFilter, string> = {
  all: 'Todos',
  'in-force': 'Vigentes',
  scheduled: 'Agendados',
  draft: 'Rascunhos',
  ended: 'Encerrados',
}

// Linha das tabelas de períodos (lista e histórico), com o status calculado para hoje.
export interface FishingBanPeriodRow extends FishingBanPeriodListItem {
  display_status: PeriodDisplayStatus
}

/**
 * Status do período na tela: rascunho até ser ativado; depois, agendado até o início da
 * vigência, vigente enquanto o fim estiver vazio ou não tiver passado, e encerrado. Uma versão
 * nova que começa no futuro fica agendada enquanto a anterior ainda vale, como o app faz.
 *
 * @param todayIsoDate hoje em "AAAA-MM-DD"; as datas da API comparam como texto.
 * @example
 * getPeriodDisplayStatus(period, localDateToIsoDate(new Date())) // 'in-force'
 */
export const getPeriodDisplayStatus = (
  period: Pick<FishingBanPeriodListItem, 'status' | 'start_in' | 'valid_until'>,
  todayIsoDate: string,
): PeriodDisplayStatus => {
  if (period.status === 'DRAFT') return 'draft'
  if (period.valid_until !== null && period.valid_until < todayIsoDate) return 'ended'

  return period.start_in > todayIsoDate ? 'scheduled' : 'in-force'
}

/**
 * Se a vigência ainda pode ser encerrada: a versão vale hoje ou vai valer.
 *
 * @example
 * canEndPeriodValidity('scheduled') // true
 */
export const canEndPeriodValidity = (status: PeriodDisplayStatus): boolean =>
  status === 'in-force' || status === 'scheduled'

/**
 * Nome do status como aparece na etiqueta.
 *
 * @example
 * getPeriodStatusLabel('draft') // 'Rascunho'
 */
export const getPeriodStatusLabel = (status: PeriodDisplayStatus): string =>
  PERIOD_STATUS_LABELS[status]

/**
 * Tom da etiqueta do status: vigente em verde, agendado em azul, rascunho em âmbar, encerrado
 * neutro.
 *
 * @example
 * getPeriodStatusTone('ended') // 'neutral'
 */
export const getPeriodStatusTone = (status: PeriodDisplayStatus): StatusTone =>
  PERIOD_STATUS_TONES[status]

/**
 * Quantos períodos há em cada segmento do filtro da lista.
 *
 * @example
 * countPeriodsByStatus(rows) // { all: 21, 'in-force': 18, scheduled: 1, draft: 1, ended: 1 }
 */
export const countPeriodsByStatus = (
  rows: FishingBanPeriodRow[],
): Record<PeriodStatusFilter, number> => {
  const countOf = (status: PeriodDisplayStatus) =>
    rows.filter((row) => row.display_status === status).length

  return {
    all: rows.length,
    'in-force': countOf('in-force'),
    scheduled: countOf('scheduled'),
    draft: countOf('draft'),
    ended: countOf('ended'),
  }
}

/**
 * Monta as linhas das tabelas de períodos, com o status calculado para hoje.
 *
 * @param todayIsoDate hoje em "AAAA-MM-DD".
 * @example
 * toFishingBanPeriodRows(periods, localDateToIsoDate(new Date()))
 */
export const toFishingBanPeriodRows = (
  periods: FishingBanPeriodListItem[],
  todayIsoDate: string,
): FishingBanPeriodRow[] =>
  periods.map((period) => ({
    ...period,
    display_status: getPeriodDisplayStatus(period, todayIsoDate),
  }))
