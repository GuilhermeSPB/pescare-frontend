import type { FishingEnvironment } from '@/types/fishing-environment'

const FISHING_ENVIRONMENT_LABELS: Record<FishingEnvironment, string> = {
  CONTINENTAL: 'Continental',
  MARINHO: 'Marinho',
}

// Opções do campo "Ambiente", no período de defeso e no tipo de local.
export const FISHING_ENVIRONMENT_OPTIONS = Object.entries(FISHING_ENVIRONMENT_LABELS).map(
  ([value, label]) => ({ value: value as FishingEnvironment, label }),
)

/**
 * Nome do ambiente de pesca, como aparece na tela.
 *
 * @example
 * getFishingEnvironmentLabel('MARINHO') // 'Marinho'
 */
export const getFishingEnvironmentLabel = (environment: FishingEnvironment): string =>
  FISHING_ENVIRONMENT_LABELS[environment]
