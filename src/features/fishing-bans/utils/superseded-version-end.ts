import { isoDateToLocalDate, localDateToIsoDate } from '@/utils/iso-date'

/**
 * Até quando a versão substituída vale: a véspera do início da nova, ou o fim que ela já tinha,
 * se for antes. É a mesma regra que o backend aplica ao ativar a nova versão; aqui só serve para
 * dizer isso na confirmação e no aviso.
 *
 * @example
 * getSupersededEndIsoDate(null, '2027-01-01') // '2026-12-31'
 * getSupersededEndIsoDate('2026-06-30', '2027-01-01') // '2026-06-30'
 */
export const getSupersededEndIsoDate = (
  previousValidUntil: string | null,
  newStartIn: string,
): string => {
  const eve = isoDateToLocalDate(newStartIn)
  eve.setDate(eve.getDate() - 1)
  const eveIsoDate = localDateToIsoDate(eve)

  return previousValidUntil !== null && previousValidUntil < eveIsoDate
    ? previousValidUntil
    : eveIsoDate
}
