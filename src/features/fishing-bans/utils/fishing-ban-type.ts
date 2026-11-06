import {
  FISHING_ENVIRONMENT_OPTIONS,
  getFishingEnvironmentLabel,
} from '@/utils/fishing-environment'

// O ambiente da norma é o mesmo vocabulário do tipo de local: os rótulos moram em
// `@/utils/fishing-environment`, e aqui ficam com os nomes que o defeso já usa.

// Opções do campo "Ambiente" no formulário do período.
export const FISHING_BAN_TYPE_OPTIONS = FISHING_ENVIRONMENT_OPTIONS

/**
 * Nome do ambiente de uma norma, como aparece na tela.
 *
 * @example
 * getFishingBanTypeLabel('MARINHO') // 'Marinho'
 */
export const getFishingBanTypeLabel = getFishingEnvironmentLabel
