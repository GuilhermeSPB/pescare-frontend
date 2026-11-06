import type { FishingBanPeriodWindow } from '@/features/fishing-bans/types/fishing-ban-period'

// A janela do defeso repete todo ano: a API guarda só mês e dia ("MM-DD") e a tela mostra e
// recebe dia e mês ("DD/MM"). A janela pode virar o ano (15/11 – 15/03).

// Dias de cada mês num ano bissexto: 29/02 é um fim de janela válido (ex.: 05/11 – 29/02).
const MAX_DAY_BY_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/**
 * Diz se "DD/MM" é um dia que existe no calendário (29/02 vale).
 *
 * @example
 * isValidDayMonth('29/02') // true
 * isValidDayMonth('31/04') // false
 */
export const isValidDayMonth = (dayMonth: string): boolean => {
  const match = /^(\d{2})\/(\d{2})$/.exec(dayMonth)
  if (!match) return false

  const day = Number(match[1])
  const maxDay = MAX_DAY_BY_MONTH[Number(match[2]) - 1]

  return maxDay !== undefined && day >= 1 && day <= maxDay
}

/**
 * Converte "DD/MM" (como se digita) em "MM-DD" (como a API recebe).
 *
 * @example
 * dayMonthToMonthDay('15/11') // '11-15'
 */
export const dayMonthToMonthDay = (dayMonth: string): string =>
  dayMonth.split('/').reverse().join('-')

/**
 * Converte "MM-DD" (como a API devolve) em "DD/MM" (como a tela mostra).
 *
 * @example
 * monthDayToDayMonth('11-15') // '15/11'
 */
export const monthDayToDayMonth = (monthDay: string): string =>
  monthDay.split('-').reverse().join('/')

/**
 * Janela do defeso como aparece na tela.
 *
 * @example
 * formatPeriodWindow('11-15', '03-15') // '15/11 – 15/03'
 */
export const formatPeriodWindow = (startMonthDay: string, endMonthDay: string): string =>
  `${monthDayToDayMonth(startMonthDay)} – ${monthDayToDayMonth(endMonthDay)}`

/**
 * Todas as janelas de um período numa linha, na ordem em que a API manda (pelo início).
 *
 * @example
 * formatPeriodWindows([{ start_date: '10-01', end_date: '11-30' }, { start_date: '12-01', end_date: '12-31' }])
 * // '01/10 – 30/11 · 01/12 – 31/12'
 */
export const formatPeriodWindows = (windows: FishingBanPeriodWindow[]): string =>
  windows.map((window) => formatPeriodWindow(window.start_date, window.end_date)).join(' · ')
