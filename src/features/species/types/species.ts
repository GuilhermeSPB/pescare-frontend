import type { ActiveCatalogItem } from '@/types/catalog'

// Tabela `species`. A leitura traz só o id do grupo-alvo (`fk_target_group_id`), sem o nome.
export interface Species extends ActiveCatalogItem {
  scientific_name: string
  main_name: string
  description: string | null
  fk_target_group_id: number
}

// POST e PUT recebem o grupo como `target_group_id`: o backend traduz para `fk_target_group_id`.
export interface CreateSpeciesInput {
  scientific_name: string
  main_name: string
  // Sem descrição, o campo fica de fora e o banco guarda null.
  description?: string
  target_group_id: number
}

// PUT /species/:id aceita só os campos alterados; `description: ''` limpa a descrição.
export interface UpdateSpeciesInput {
  id: number
  data: Partial<CreateSpeciesInput & Pick<Species, 'is_active'>>
}
