import type {
  CreateNamedCatalogItemInput,
  NamedCatalogItem,
  UpdateNamedCatalogItemInput,
} from '@/types/named-catalog'

// Tabela `type_location`: só nome e situação; nome é único. Ex.: rio, lago, mar.
export type FishingLocationType = NamedCatalogItem

export type CreateFishingLocationTypeInput = CreateNamedCatalogItemInput

// PUT /fishing-location-types/:id aceita só os campos alterados.
export type UpdateFishingLocationTypeInput = UpdateNamedCatalogItemInput
