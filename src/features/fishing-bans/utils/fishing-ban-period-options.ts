import type {
  FishingBanPeriod,
  SelectableSpecies,
} from '@/features/fishing-bans/types/fishing-ban-period'
import type { NamedCatalogItem } from '@/types/named-catalog'
import { buildCatalogOptions, type CatalogOption } from '@/utils/catalog-options'

export interface FishingBanPeriodOptions {
  species: CatalogOption[]
  locationTypes: CatalogOption[]
}

interface FishingBanPeriodCatalogs {
  species: SelectableSpecies[]
  locationTypes: NamedCatalogItem[]
}

/**
 * Opções dos campos de escolha do período: só itens ativos, mais os que o período em edição já
 * usa e foram desativados. Espécies mostram o nome científico, como no PDF do ministério.
 *
 * @param editingPeriod período em edição; ausente no cadastro.
 * @example
 * const options = buildFishingBanPeriodOptions({ species, locationTypes }, editingPeriod)
 */
export const buildFishingBanPeriodOptions = (
  catalogs: FishingBanPeriodCatalogs,
  editingPeriod?: FishingBanPeriod,
): FishingBanPeriodOptions => ({
  species: buildCatalogOptions(catalogs.species, {
    keptIds: editingPeriod?.species.map((species) => species.id) ?? [],
    getLabel: (species) => `${species.main_name} (${species.scientific_name})`,
    inactiveSuffix: '(inativa)',
  }),
  locationTypes: buildCatalogOptions(catalogs.locationTypes, {
    keptIds: editingPeriod?.location_types.map((locationType) => locationType.id) ?? [],
    getLabel: (locationType) => locationType.name,
    inactiveSuffix: '(inativo)',
  }),
})
