// O mínimo que todo catálogo do backend tem: id e situação. Nenhum é apagado, só desativado.
export interface ActiveCatalogItem {
  id: number
  is_active: boolean
}

export type ActiveStatusFilter = 'all' | 'active' | 'inactive'

export interface ActiveStatusCounts {
  all: number
  active: number
  inactive: number
}
