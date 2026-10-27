import type {
  CreateNamedCatalogItemInput,
  NamedCatalogItem,
  UpdateNamedCatalogItemInput,
} from '@/types/named-catalog'

// Tabela `fishing_method`: só nome e situação; nome é único.
export type FishingMethod = NamedCatalogItem

export type CreateFishingMethodInput = CreateNamedCatalogItemInput

// PUT /fishing-methods/:id aceita só os campos alterados.
export type UpdateFishingMethodInput = UpdateNamedCatalogItemInput
