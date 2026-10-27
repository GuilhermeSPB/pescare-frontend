import type {
  CreateNamedCatalogItemInput,
  NamedCatalogItem,
  UpdateNamedCatalogItemInput,
} from '@/types/named-catalog'

// Tabela `target_group`: só nome e situação; nome é único. Classifica as espécies.
export type TargetGroup = NamedCatalogItem

export type CreateTargetGroupInput = CreateNamedCatalogItemInput

// PUT /target-groups/:id aceita só os campos alterados.
export type UpdateTargetGroupInput = UpdateNamedCatalogItemInput
