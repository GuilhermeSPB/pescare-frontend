import type { UseMutationResult } from '@tanstack/react-query'

import type { ActiveCatalogItem } from '@/types/catalog'

// Formato comum dos catálogos simples do backend: métodos de pesca, tipos de local,
// tipos de comprador e grupos-alvo. Nenhum deles é apagado, só desativado.
export interface NamedCatalogItem extends ActiveCatalogItem {
  name: string
}

export interface CreateNamedCatalogItemInput {
  name: string
}

// O PUT desses catálogos aceita só os campos alterados.
export interface UpdateNamedCatalogItemInput {
  id: number
  data: Partial<Pick<NamedCatalogItem, 'name' | 'is_active'>>
}

export type NamedCatalogCreateMutation = UseMutationResult<
  NamedCatalogItem,
  Error,
  CreateNamedCatalogItemInput
>

export type NamedCatalogUpdateMutation = UseMutationResult<
  NamedCatalogItem,
  Error,
  UpdateNamedCatalogItemInput
>
