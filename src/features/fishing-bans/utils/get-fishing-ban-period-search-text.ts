import type { FishingBanPeriodListItem } from '@/features/fishing-bans/types/fishing-ban-period'
import { getFishingBanTypeLabel } from '@/features/fishing-bans/utils/fishing-ban-type'
import { formatPeriodWindows } from '@/features/fishing-bans/utils/period-window'

/**
 * Texto em que a busca de períodos procura: nome do defeso, portaria, ambiente, janelas ("15/11"),
 * espécies (nome popular e científico), tipos de local, UFs e observação.
 *
 * @example
 * useFishingBanPeriodFilter(periodRows) // usa este texto na busca
 */
export const getFishingBanPeriodSearchText = (period: FishingBanPeriodListItem): string =>
  [
    period.fishing_ban.name,
    period.fishing_ban.rule,
    getFishingBanTypeLabel(period.fishing_ban.fishing_ban_type),
    formatPeriodWindows(period.windows),
    ...period.species.map((species) => `${species.main_name} ${species.scientific_name}`),
    ...period.location_types.map((locationType) => locationType.name),
    ...period.ufs,
    period.observation ?? '',
  ].join(' ')
