import type { ActiveCatalogItem } from '@/types/catalog'
import type { FishingEnvironment } from '@/types/fishing-environment'
import type { Municipality } from '@/types/municipality'

// Ambiente da norma (CHECK do banco em `fishing_ban.fishing_ban_type`), o mesmo do tipo de local.
export type FishingBanType = FishingEnvironment

// A norma do período (tabela `fishing_ban`), como a API embute na lista e no detalhe. Não tem
// tela própria: é só a portaria digitada no período; o backend reaproveita a norma com o mesmo
// texto ou cria uma.
export interface FishingBanPeriodBan {
  id: number
  // A portaria ou instrução normativa, ex.: "Portaria IBAMA Nº 48/07".
  rule: string
  fishing_ban_type: FishingBanType
}

export interface FishingBanPeriodSpecies {
  id: number
  main_name: string
  scientific_name: string
}

export interface FishingBanPeriodLocationType {
  id: number
  name: string
}

// CHECK do banco em `fishing_ban_period.status`. Rascunho não vale no app até ser ativado.
export type FishingBanPeriodStatus = 'DRAFT' | 'ACTIVE'

// Janela anual do defeso em "MM-DD": repete todo ano e pode virar o ano (11-01 → 02-28). Um
// período pode ter várias (ex.: as cinco da andada do caranguejo-uçá).
export interface FishingBanPeriodWindow {
  start_date: string
  end_date: string
}

// Tabela `fishing_ban_period` com as ligações achatadas e a posição no histórico de versões.
// Datas chegam como texto: as janelas em "MM-DD" e a vigência em "AAAA-MM-DD".
interface FishingBanPeriodBase {
  id: number
  fk_fishing_ban_id: number
  // A versão que esta substitui; null na primeira.
  fk_previous_period_id: number | null
  status: FishingBanPeriodStatus
  fishing_ban: FishingBanPeriodBan
  // Ordenadas pelo início.
  windows: FishingBanPeriodWindow[]
  start_in: string
  // null: vigente sem data para acabar.
  valid_until: string | null
  observation: string | null
  // Marcado, o período vale para todas as espécies e `species` vem vazio (o mesmo para locais).
  applies_to_all_species: boolean
  applies_to_all_location_types: boolean
  species: FishingBanPeriodSpecies[]
  location_types: FishingBanPeriodLocationType[]
  // 1 é a versão mais antiga.
  version: number
  // A ACTIVE mais nova do período; num período que só tem rascunho, o rascunho.
  is_current_version: boolean
  // Rascunho de nova versão esperando ativação; só vem na versão atual.
  pending_version_id: number | null
}

// GET /fishing-ban-periods (uma linha por período: a versão atual) e GET /:id/versions. A lista
// resume a cobertura (um período chega a 1.500 municípios).
export interface FishingBanPeriodListItem extends FishingBanPeriodBase {
  municipality_count: number
  ufs: string[]
}

// GET /fishing-ban-periods/:id, e a resposta do POST, do PUT, da nova versão e da ativação.
export interface FishingBanPeriod extends FishingBanPeriodBase {
  municipalities: Municipality[]
}

// POST (período novo ou nova versão) e PUT recebem a norma como texto (`rule` +
// `fishing_ban_type`) e os municípios pelos códigos do IBGE.
export interface FishingBanPeriodInput {
  rule: string
  fishing_ban_type: FishingBanType
  windows: FishingBanPeriodWindow[]
  // Só no POST: o PUT corrige no lugar, e ativar tem rota própria.
  status: FishingBanPeriodStatus
  start_in: string
  valid_until: string | null
  observation: string | null
  applies_to_all_species: boolean
  species_ids: number[]
  applies_to_all_location_types: boolean
  location_type_ids: number[]
  municipalities: string[]
}

// PUT /fishing-ban-periods/:id corrige a versão atual ou um rascunho e aceita só os campos
// alterados. Não há DELETE: encerrar a vigência (`valid_until`) é o jeito de tirar um período de
// uso.
export interface UpdateFishingBanPeriodInput {
  id: number
  data: Partial<Omit<FishingBanPeriodInput, 'status'>>
}

// POST /fishing-ban-periods/:id/versions: a nova versão da versão atual `periodId`.
export interface CreateFishingBanPeriodVersionInput {
  periodId: number
  data: FishingBanPeriodInput
}

// O que o formulário do período usa das espécies (vem da feature de espécies, composta na rota).
export interface SelectableSpecies extends ActiveCatalogItem {
  main_name: string
  scientific_name: string
}
