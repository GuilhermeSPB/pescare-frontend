import type { FishingEnvironment } from '@/types/fishing-environment'
import type { NamedCatalogItem } from '@/types/named-catalog'

// Tabela `type_location`: nome único, situação e o ambiente de pesca que o REAP pede. Ex.: rio,
// lago, mar. O ambiente é null num tipo cadastrado antes do campo existir; o formulário pede.
export interface FishingLocationType extends NamedCatalogItem {
  environment: FishingEnvironment | null
}

export interface CreateFishingLocationTypeInput {
  name: string
  environment: FishingEnvironment
}

// PUT /fishing-location-types/:id aceita só os campos alterados.
export interface UpdateFishingLocationTypeInput {
  id: number
  data: Partial<CreateFishingLocationTypeInput & Pick<FishingLocationType, 'is_active'>>
}
