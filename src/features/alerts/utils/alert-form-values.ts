import { z } from 'zod'

import type {
  AlertContentInput,
  AlertDetails,
  CreateAlertInput,
} from '@/features/alerts/types/alert'

export type AlertFormMode = 'create' | 'edit'

export interface AlertFormValues {
  title: string
  description: string
  // Marcado, vale para todos os municípios e a lista escolhida não é enviada.
  applies_to_all_municipalities: boolean
  municipalities: string[]
  // "Publicar agora", só no cadastro. Desligado, salva como rascunho.
  is_published_on_save: boolean
}

export const alertFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Informe o título do comunicado.'),
    description: z.string().trim().min(1, 'Informe o texto do comunicado.'),
    applies_to_all_municipalities: z.boolean(),
    municipalities: z.array(z.string()),
    is_published_on_save: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.applies_to_all_municipalities || values.municipalities.length > 0) return

    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['municipalities'],
      message: 'Escolha ao menos um município.',
    })
  })

/**
 * Valores iniciais do formulário. No cadastro, "Todos os municípios" começa desmarcado: alcançar
 * o país inteiro tem de ser uma escolha explícita.
 *
 * @param alert o comunicado em edição; sem ele, formulário vazio.
 * @example
 * useForm({ defaultValues: toAlertFormValues(editingAlert) })
 */
export const toAlertFormValues = (alert?: AlertDetails): AlertFormValues => ({
  title: alert?.title ?? '',
  description: alert?.description ?? '',
  applies_to_all_municipalities: alert?.scope === 'GLOBAL',
  municipalities: alert?.municipalities.map((municipality) => municipality.ibge_code) ?? [],
  is_published_on_save: true,
})

/**
 * Conteúdo e cobertura do comunicado, no formato da API.
 *
 * @example
 * updateMutation.mutate({ id, data: toAlertContentInput(values) })
 */
export const toAlertContentInput = (values: AlertFormValues): AlertContentInput => ({
  title: values.title,
  description: values.description,
  scope: values.applies_to_all_municipalities ? 'GLOBAL' : 'MUNICIPAL',
  municipalities: values.applies_to_all_municipalities ? [] : values.municipalities,
})

/**
 * Corpo do cadastro: o conteúdo mais o status escolhido em "Publicar agora".
 *
 * @example
 * createMutation.mutate(toCreateAlertInput(values))
 */
export const toCreateAlertInput = (values: AlertFormValues): CreateAlertInput => ({
  ...toAlertContentInput(values),
  status: values.is_published_on_save ? 'PUBLISHED' : 'DRAFT',
})
