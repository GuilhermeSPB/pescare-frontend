import { z } from 'zod'

import type {
  FishingBanPeriod,
  FishingBanPeriodInput,
  FishingBanType,
  UpdateFishingBanPeriodInput,
} from '@/features/fishing-bans/types/fishing-ban-period'
import {
  dayMonthToMonthDay,
  isValidDayMonth,
  monthDayToDayMonth,
} from '@/features/fishing-bans/utils/period-window'
import { isoDateToLocalDate, localDateToIsoDate } from '@/utils/iso-date'

// create: período novo. edit: corrige a versão atual ou um rascunho no lugar. new-version: parte
// da versão atual e a substitui.
export type FishingBanPeriodFormMode = 'create' | 'edit' | 'new-version'

// Uma janela como se digita: dia e mês ("DD/MM"), sem ano.
export interface FishingBanPeriodWindowFormValues {
  start_day_month: string
  end_day_month: string
}

// Valores do formulário do período. A portaria é só texto; as janelas são digitadas como "DD/MM"
// e a vigência escolhida no calendário. Campos de escolha começam vazios (null).
export interface FishingBanPeriodFormValues {
  name: string
  rule: string
  fishing_ban_type: FishingBanType | null
  windows: FishingBanPeriodWindowFormValues[]
  start_in: Date | null
  valid_until: Date | null
  applies_to_all_species: boolean
  species_ids: number[]
  applies_to_all_location_types: boolean
  location_type_ids: number[]
  municipalities: string[]
  observation: string
  // "Ativar agora", no cadastro e na nova versão. Desligado, salva como rascunho.
  is_active_on_save: boolean
}

// O que sobra depois da validação: ambiente e início da vigência preenchidos.
export type ValidFishingBanPeriodFormValues = FishingBanPeriodFormValues & {
  fishing_ban_type: FishingBanType
  start_in: Date
}

export const EMPTY_PERIOD_WINDOW: FishingBanPeriodWindowFormValues = {
  start_day_month: '',
  end_day_month: '',
}

const dayMonthField = (requiredMessage: string) =>
  z
    .string()
    .min(1, requiredMessage)
    .refine(
      (dayMonth) => dayMonth === '' || isValidDayMonth(dayMonth),
      'Data inválida. Use dia/mês, como 15/11.',
    )

// Campos obrigatórios que começam null são `nullable().refine(...)`, não `z.number()`: um erro
// de tipo interromperia o objeto e as regras do superRefine só apareceriam no segundo envio.
const fishingBanPeriodFormObject = z.object({
  name: z.string().trim().min(1, 'Informe o nome do defeso.'),
  rule: z.string().trim().min(1, 'Informe a portaria ou instrução normativa.'),
  fishing_ban_type: z
    .enum(['CONTINENTAL', 'MARINHO'])
    .nullable()
    .refine((fishingBanType) => fishingBanType !== null, 'Escolha o ambiente.'),
  windows: z
    .array(
      z.object({
        start_day_month: dayMonthField('Informe o início do defeso.'),
        end_day_month: dayMonthField('Informe o fim do defeso.'),
      }),
    )
    .min(1, 'Informe ao menos uma janela.'),
  start_in: z
    .date()
    .nullable()
    .refine((date) => date !== null, 'Informe desde quando o período vale.'),
  valid_until: z.date().nullable(),
  applies_to_all_species: z.boolean(),
  species_ids: z.array(z.number()),
  applies_to_all_location_types: z.boolean(),
  location_type_ids: z.array(z.number()),
  municipalities: z.array(z.string()).min(1, 'Escolha ao menos um município.'),
  observation: z.string().trim(),
  is_active_on_save: z.boolean(),
})

type FishingBanPeriodFormObject = z.infer<typeof fishingBanPeriodFormObject>

const addScopeIssues = (values: FishingBanPeriodFormObject, context: z.RefinementCtx) => {
  if (!values.applies_to_all_species && values.species_ids.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['species_ids'],
      message: 'Escolha ao menos uma espécie ou marque todas.',
    })
  }

  if (!values.applies_to_all_location_types && values.location_type_ids.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['location_type_ids'],
      message: 'Escolha ao menos um corpo d’água ou marque todos.',
    })
  }
}

// Duas janelas com o mesmo início: o banco recusaria (uq_fishing_ban_period_window).
const addDuplicateWindowIssues = (values: FishingBanPeriodFormObject, context: z.RefinementCtx) => {
  const seenStarts = new Set<string>()

  values.windows.forEach((window, index) => {
    if (window.start_day_month === '' || !seenStarts.has(window.start_day_month)) {
      seenStarts.add(window.start_day_month)
      return
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['windows', index, 'start_day_month'],
      message: 'Outra janela já começa neste dia.',
    })
  })
}

const addValidityIssues = (values: FishingBanPeriodFormObject, context: z.RefinementCtx) => {
  if (values.start_in && values.valid_until && values.valid_until < values.start_in) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['valid_until'],
      message: 'O fim da vigência não pode ser antes do início.',
    })
  }
}

/**
 * Schema do formulário do período. A nova versão pode começar antes da atual, para registrar uma
 * norma antiga: é o backend que confere se ela cabe no histórico.
 *
 * @example
 * useForm({ resolver: zodResolver(fishingBanPeriodFormSchema) })
 */
export const fishingBanPeriodFormSchema = fishingBanPeriodFormObject.superRefine(
  (values, context) => {
    addScopeIssues(values, context)
    addDuplicateWindowIssues(values, context)
    addValidityIssues(values, context)
  },
)

/**
 * Valores iniciais do formulário: os do período em edição, ou vazios no cadastro.
 * Período novo já vale para todos os tipos de local (o caso comum nos defesos do MPA).
 *
 * @example
 * useForm({ defaultValues: toFishingBanPeriodFormValues(editingPeriod) })
 */
export const toFishingBanPeriodFormValues = (
  period?: FishingBanPeriod,
): FishingBanPeriodFormValues => ({
  name: period?.fishing_ban.name ?? '',
  rule: period?.fishing_ban.rule ?? '',
  fishing_ban_type: period?.fishing_ban.fishing_ban_type ?? null,
  windows: period
    ? period.windows.map((window) => ({
        start_day_month: monthDayToDayMonth(window.start_date),
        end_day_month: monthDayToDayMonth(window.end_date),
      }))
    : [EMPTY_PERIOD_WINDOW],
  start_in: period ? isoDateToLocalDate(period.start_in) : null,
  valid_until: period?.valid_until ? isoDateToLocalDate(period.valid_until) : null,
  applies_to_all_species: period?.applies_to_all_species ?? false,
  species_ids: period?.species.map((species) => species.id) ?? [],
  applies_to_all_location_types: period?.applies_to_all_location_types ?? true,
  location_type_ids: period?.location_types.map((locationType) => locationType.id) ?? [],
  municipalities: period?.municipalities.map((municipality) => municipality.ibge_code) ?? [],
  observation: period?.observation ?? '',
  is_active_on_save: true,
})

/**
 * Valores iniciais da nova versão: tudo da versão atual, menos a vigência. Quem cria a versão
 * escolhe quando ela começa (e, com isso, quando a atual termina).
 *
 * @example
 * useForm({ defaultValues: toNewVersionFormValues(currentPeriod) })
 */
export const toNewVersionFormValues = (period: FishingBanPeriod): FishingBanPeriodFormValues => ({
  ...toFishingBanPeriodFormValues(period),
  start_in: null,
  valid_until: null,
})

/**
 * Converte o formulário validado no corpo do POST/PUT. Com "todas" marcado, a lista vai vazia;
 * observação vazia vai como null; "Ativar agora" desligado vira rascunho.
 *
 * @example
 * createMutation.mutate(toFishingBanPeriodInput(values))
 */
export const toFishingBanPeriodInput = (
  values: ValidFishingBanPeriodFormValues,
): FishingBanPeriodInput => ({
  name: values.name,
  rule: values.rule,
  fishing_ban_type: values.fishing_ban_type,
  windows: values.windows.map((window) => ({
    start_date: dayMonthToMonthDay(window.start_day_month),
    end_date: dayMonthToMonthDay(window.end_day_month),
  })),
  status: values.is_active_on_save ? 'ACTIVE' : 'DRAFT',
  start_in: localDateToIsoDate(values.start_in),
  valid_until: values.valid_until ? localDateToIsoDate(values.valid_until) : null,
  observation: values.observation || null,
  applies_to_all_species: values.applies_to_all_species,
  species_ids: values.applies_to_all_species ? [] : values.species_ids,
  applies_to_all_location_types: values.applies_to_all_location_types,
  location_type_ids: values.applies_to_all_location_types ? [] : values.location_type_ids,
  municipalities: values.municipalities,
})

/**
 * Corpo do PUT de correção: o mesmo do POST, sem o status. A correção não ativa nem desativa;
 * ativar um rascunho tem rota própria, porque encerra a versão anterior. `isCorrection` confirma
 * que mudar uma versão já em vigor é erro de cadastro.
 *
 * @example
 * updateMutation.mutate({ id, data: toCorrectionInput(input, true) })
 */
export const toCorrectionInput = (
  input: FishingBanPeriodInput,
  isCorrection: boolean,
): UpdateFishingBanPeriodInput['data'] => {
  const fields: Partial<FishingBanPeriodInput> = { ...input }
  delete fields.status

  return isCorrection ? { ...fields, correction: true } : fields
}
