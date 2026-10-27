import type {
  CreateNamedCatalogItemInput,
  NamedCatalogItem,
  UpdateNamedCatalogItemInput,
} from '@/types/named-catalog'

// Tabela `buyer_type`: só nome e situação; nome é único. Usado no registro das vendas.
export type BuyerType = NamedCatalogItem

export type CreateBuyerTypeInput = CreateNamedCatalogItemInput

// PUT /buyer-types/:id aceita só os campos alterados.
export type UpdateBuyerTypeInput = UpdateNamedCatalogItemInput
