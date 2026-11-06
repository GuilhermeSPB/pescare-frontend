import type { FishingBanPeriodListItem } from '@/features/fishing-bans/types/fishing-ban-period'
import { formatPeriodWindow } from '@/features/fishing-bans/utils/period-window'
import { formatIsoDate } from '@/utils/iso-date'

// Quantos nomes cabem na célula antes do "+N".
const SPECIES_SHOWN = 2
const UFS_SHOWN = 4

const compareNames = (first: string, second: string) => first.localeCompare(second, 'pt-BR')

/**
 * Nome curto de um período, para botões, avisos e confirmações: portaria e primeira janela, com
 * quantas mais houver. Uma portaria tem vários períodos; a janela os diferencia.
 *
 * @example
 * getPeriodLabel(period) // 'Instrução Normativa Nº 34/04 · 01/12 – 31/05'
 * getPeriodLabel(period) // 'Portaria SAP/MAPA nº 325/2020 · 30/12 – 04/01 +4'
 */
export const getPeriodLabel = (
  period: Pick<FishingBanPeriodListItem, 'fishing_ban' | 'windows'>,
): string => {
  const [firstWindow] = period.windows
  if (!firstWindow) return period.fishing_ban.rule

  const extraCount = period.windows.length - 1
  const windowText = formatPeriodWindow(firstWindow.start_date, firstWindow.end_date)

  return `${period.fishing_ban.rule} · ${windowText}${extraCount > 0 ? ` +${extraCount}` : ''}`
}

/**
 * Vigência de uma versão numa linha: início e fim, ou só o início quando não tem data para acabar.
 *
 * @example
 * formatValidityRange({ start_in: '2007-01-01', valid_until: '2026-12-31' }) // '01/01/2007 – 31/12/2026'
 * formatValidityRange({ start_in: '2027-01-01', valid_until: null }) // 'Desde 01/01/2027'
 */
export const formatValidityRange = (
  period: Pick<FishingBanPeriodListItem, 'start_in' | 'valid_until'>,
): string =>
  period.valid_until === null
    ? `Desde ${formatIsoDate(period.start_in)}`
    : `${formatIsoDate(period.start_in)} – ${formatIsoDate(period.valid_until)}`

/**
 * Espécies do período numa linha: "Todas", ou os primeiros nomes e quantos faltam.
 *
 * @example
 * summarizePeriodSpecies(period) // 'Pirarucu, Tambaqui +2'
 */
export const summarizePeriodSpecies = (
  period: Pick<FishingBanPeriodListItem, 'applies_to_all_species' | 'species'>,
): string => {
  if (period.applies_to_all_species) return 'Todas'

  const names = period.species.map((species) => species.main_name).sort(compareNames)
  const hiddenCount = names.length - SPECIES_SHOWN
  const shownNames = names.slice(0, SPECIES_SHOWN).join(', ')

  return hiddenCount > 0 ? `${shownNames} +${hiddenCount}` : shownNames
}

/**
 * Cobertura do período numa linha: total de municípios e as UFs (ou quantas, se forem muitas).
 *
 * @example
 * summarizePeriodCoverage(period) // '157 · AC, AM, AP, PA'
 * summarizePeriodCoverage(period) // '624 · 18 UFs'
 */
export const summarizePeriodCoverage = (
  period: Pick<FishingBanPeriodListItem, 'municipality_count' | 'ufs'>,
): string => {
  const ufsText = period.ufs.length > UFS_SHOWN ? `${period.ufs.length} UFs` : period.ufs.join(', ')

  return `${period.municipality_count} · ${ufsText}`
}
