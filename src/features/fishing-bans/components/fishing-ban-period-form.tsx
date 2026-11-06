import { zodResolver } from '@hookform/resolvers/zod'
import { InputTextarea } from 'primereact/inputtextarea'
import { useId } from 'react'
import { Controller, useForm, type Control } from 'react-hook-form'

import { FormDialogActions } from '@/components/form-dialog'
import { FormField } from '@/components/form-field'
import { FormSection } from '@/components/form-section'
import { InlineAlert } from '@/components/inline-alert'
import { MunicipalityCoveragePicker } from '@/components/municipality-coverage-picker'
import { SwitchField } from '@/components/switch-field'
import { FishingBanPeriodDateFields } from '@/features/fishing-bans/components/fishing-ban-period-date-fields'
import { FishingBanPeriodRuleFields } from '@/features/fishing-bans/components/fishing-ban-period-rule-fields'
import { FishingBanPeriodScopeField } from '@/features/fishing-bans/components/fishing-ban-period-scope-field'
import type {
  FishingBanPeriod,
  FishingBanPeriodInput,
} from '@/features/fishing-bans/types/fishing-ban-period'
import {
  buildFishingBanPeriodFormSchema,
  toFishingBanPeriodFormValues,
  toFishingBanPeriodInput,
  toNewVersionFormValues,
  type FishingBanPeriodFormMode,
  type FishingBanPeriodFormValues,
} from '@/features/fishing-bans/utils/fishing-ban-period-form-values'
import type { FishingBanPeriodOptions } from '@/features/fishing-bans/utils/fishing-ban-period-options'
import type { Municipality } from '@/types/municipality'
import { isoDateToLocalDate } from '@/utils/iso-date'

const SUBMIT_LABELS: Record<FishingBanPeriodFormMode, string> = {
  create: 'Cadastrar período',
  edit: 'Salvar alterações',
  'new-version': 'Criar versão',
}

const getDefaultValues = (mode: FishingBanPeriodFormMode, basePeriod?: FishingBanPeriod) =>
  mode === 'new-version' && basePeriod
    ? toNewVersionFormValues(basePeriod)
    : toFishingBanPeriodFormValues(basePeriod)

// Desligado, salva como rascunho: o período só vale no app depois de ativado.
function ActivationField({ control }: { control: Control<FishingBanPeriodFormValues> }) {
  return (
    <Controller
      name="is_active_on_save"
      control={control}
      render={({ field }) => (
        <SwitchField
          label="Ativar agora"
          isChecked={field.value}
          inputRef={field.ref}
          onChange={field.onChange}
        />
      )}
    />
  )
}

interface FishingBanPeriodFormProps {
  mode: FishingBanPeriodFormMode
  // Na edição, a versão corrigida; na nova versão, a versão atual que ela substitui.
  basePeriod?: FishingBanPeriod
  options: FishingBanPeriodOptions
  municipalities: Municipality[]
  isSubmitting: boolean
  formServerError?: string
  onSubmit: (input: FishingBanPeriodInput) => void
  onCancel: () => void
}

export function FishingBanPeriodForm({
  mode,
  basePeriod,
  options,
  municipalities,
  isSubmitting,
  formServerError,
  onSubmit,
  onCancel,
}: FishingBanPeriodFormProps) {
  const observationId = useId()
  const minStartIn =
    mode === 'new-version' && basePeriod ? isoDateToLocalDate(basePeriod.start_in) : undefined
  const { register, control, handleSubmit, formState } = useForm<FishingBanPeriodFormValues>({
    resolver: zodResolver(buildFishingBanPeriodFormSchema({ minStartIn })),
    defaultValues: getDefaultValues(mode, basePeriod),
  })

  const handleValidSubmit = ({
    fishing_ban_type,
    start_in,
    ...values
  }: FishingBanPeriodFormValues) => {
    // O schema já recusou ambiente e início vazios; a checagem só estreita o tipo.
    if (fishing_ban_type === null || start_in === null) return
    onSubmit(toFishingBanPeriodInput({ ...values, fishing_ban_type, start_in }))
  }

  // Editando sem mudar nada, salvar não faria nada: o botão espera uma alteração.
  const isUnchangedEdit = mode === 'edit' && !formState.isDirty

  return (
    <form noValidate onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-col gap-6">
      <FormSection title="Norma">
        <FishingBanPeriodRuleFields control={control} register={register} />
      </FormSection>
      <FormSection title="Período">
        <FishingBanPeriodDateFields control={control} />
      </FormSection>
      <FormSection title="Abrangência">
        <FishingBanPeriodScopeField
          control={control}
          allFieldName="applies_to_all_species"
          idsFieldName="species_ids"
          allLabel="Todas as espécies"
          listLabel="Espécies"
          options={options.species}
          emptyMessage="Nenhuma espécie ativa"
        />
        <FishingBanPeriodScopeField
          control={control}
          allFieldName="applies_to_all_location_types"
          idsFieldName="location_type_ids"
          allLabel="Todos os tipos de local"
          listLabel="Tipos de local"
          options={options.locationTypes}
          emptyMessage="Nenhum tipo de local ativo"
        />
        <FormField id={observationId} label="Observação (opcional)">
          {(controlProps) => (
            <InputTextarea
              {...controlProps}
              {...register('observation')}
              rows={2}
              autoResize
              className="w-full"
            />
          )}
        </FormField>
      </FormSection>
      <FormSection title="Municípios">
        <Controller
          name="municipalities"
          control={control}
          render={({ field, fieldState }) => (
            <MunicipalityCoveragePicker
              municipalities={municipalities}
              value={field.value}
              errorMessage={fieldState.error?.message}
              municipalitiesInputRef={field.ref}
              onChange={field.onChange}
            />
          )}
        />
      </FormSection>
      {formServerError && <InlineAlert message={formServerError} />}
      {/* A correção não muda o status: ativar um rascunho é pelo botão "Ativar" da visualização. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {mode !== 'edit' && <ActivationField control={control} />}
        <div className="sm:ml-auto">
          <FormDialogActions
            submitLabel={SUBMIT_LABELS[mode]}
            isSubmitting={isSubmitting}
            isSubmitDisabled={isUnchangedEdit}
            onCancel={onCancel}
          />
        </div>
      </div>
    </form>
  )
}
