import type { AlertListItem } from '@/features/alerts/types/alert'
import { formatDatabaseDate } from '@/utils/iso-date'

const NO_PUBLICATION_DATE_LABEL = '—'

/**
 * Abrangência do comunicado em uma linha, para a tabela.
 *
 * @example
 * getAlertCoverageLabel({ scope: 'MUNICIPAL', municipality_count: 3 }) // '3 municípios'
 */
export const getAlertCoverageLabel = ({
  scope,
  municipality_count,
}: Pick<AlertListItem, 'scope' | 'municipality_count'>): string => {
  if (scope === 'GLOBAL') return 'Todos os municípios'

  return municipality_count === 1 ? '1 município' : `${municipality_count} municípios`
}

/**
 * Data de publicação para a tabela. O rascunho ainda não foi publicado: a coluna guarda a data
 * do cadastro, que a publicação substitui, então não é mostrada.
 *
 * @example
 * getAlertPublicationLabel({ status: 'DRAFT', publication_date: '2026-11-01T00:00:00.000Z' }) // '—'
 */
export const getAlertPublicationLabel = ({
  status,
  publication_date,
}: Pick<AlertListItem, 'status' | 'publication_date'>): string =>
  status === 'DRAFT' ? NO_PUBLICATION_DATE_LABEL : formatDatabaseDate(publication_date)
