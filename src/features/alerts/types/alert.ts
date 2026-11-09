import type { Municipality } from '@/types/municipality'

// Tabela `alert`: um comunicado da aba "Comunicados" do app do pescador.
// GLOBAL vale para todos os municípios; MUNICIPAL, só para os listados na cobertura.
export type AlertScope = 'GLOBAL' | 'MUNICIPAL'
export type AlertStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

interface AlertFields {
  id: number
  title: string
  description: string
  // Coluna DATE, que a API serializa como meia-noite UTC: mostre com `formatDatabaseDate`.
  publication_date: string
  scope: AlertScope
  status: AlertStatus
}

// A lista traz só a contagem: um comunicado pode cobrir milhares de municípios.
export interface AlertListItem extends AlertFields {
  municipality_count: number
}

export interface AlertDetails extends AlertFields {
  municipalities: Municipality[]
}

export interface AlertContentInput {
  title: string
  description: string
  scope: AlertScope
  // Códigos IBGE. Vazio quando o comunicado vale para todos os municípios.
  municipalities: string[]
}

export interface CreateAlertInput extends AlertContentInput {
  status: AlertStatus
}

export interface UpdateAlertInput {
  id: number
  data: AlertContentInput | { status: AlertStatus }
}
