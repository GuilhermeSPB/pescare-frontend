import { StatusTag } from '@/components/status-tag'

export interface ActiveStatusLabels {
  active: string
  inactive: string
}

interface ActiveStatusTagProps {
  isActive: boolean
  // Rótulos de outra situação de dois estados, ex.: "Vigente"/"Encerrado" nos defesos.
  labels?: ActiveStatusLabels
}

const DEFAULT_LABELS: ActiveStatusLabels = { active: 'Ativo', inactive: 'Inativo' }

// Situação de dois estados (ativo/inativo) na pílula de contorno do painel.
export function ActiveStatusTag({ isActive, labels = DEFAULT_LABELS }: ActiveStatusTagProps) {
  return (
    <StatusTag
      tone={isActive ? 'positive' : 'neutral'}
      label={isActive ? labels.active : labels.inactive}
    />
  )
}
