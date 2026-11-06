// A API troca datas como texto "AAAA-MM-DD" (colunas DATE). Aqui elas viram `Date` no fuso
// local e voltam, sem passar por `new Date('AAAA-MM-DD')`: esse construtor lê UTC e, em UTC−3,
// mostraria o dia anterior.

const padTwoDigits = (value: number): string => String(value).padStart(2, '0')

/**
 * Converte "AAAA-MM-DD" num `Date` à meia-noite local, para o Calendar.
 *
 * @example
 * isoDateToLocalDate('2026-03-10') // 10/03/2026 00:00 no fuso do navegador
 */
export const isoDateToLocalDate = (isoDate: string): Date => {
  const [year = 0, month = 1, day = 1] = isoDate.split('-').map(Number)

  return new Date(year, month - 1, day)
}

/**
 * Converte um `Date` (dia local) em "AAAA-MM-DD", para enviar à API ou comparar como texto.
 *
 * @example
 * localDateToIsoDate(new Date()) // '2026-10-26'
 */
export const localDateToIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())}`

/**
 * Mostra "AAAA-MM-DD" como "DD/MM/AAAA".
 *
 * @example
 * formatIsoDate('2026-03-10') // '10/03/2026'
 */
export const formatIsoDate = (isoDate: string): string => isoDate.split('-').reverse().join('/')

/**
 * Mostra uma coluna DATE do banco, que a API serializa como meia-noite UTC
 * ("AAAA-MM-DDT00:00:00.000Z"), como "DD/MM/AAAA". Usa os 10 primeiros caracteres:
 * passar por `new Date` mostraria o dia anterior em UTC−3.
 *
 * @example
 * formatDatabaseDate('2026-10-12T00:00:00.000Z') // '12/10/2026'
 */
export const formatDatabaseDate = (dateTime: string): string => formatIsoDate(dateTime.slice(0, 10))
