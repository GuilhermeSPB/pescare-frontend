import { Dropdown } from 'primereact/dropdown'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'
import { useId, useMemo, useState, type Ref } from 'react'

import { FormField } from '@/components/form-field'
import { MunicipalityCoverageSummary } from '@/components/municipality-coverage-summary'
import type { Municipality } from '@/types/municipality'
import {
  buildUfByIbgeCode,
  countIbgeCodesByUf,
  groupMunicipalitiesByUf,
} from '@/utils/municipalities-by-uf'

// Altura de cada item na lista virtual do MultiSelect (Lara, raiz de 14px).
const MUNICIPALITY_ITEM_HEIGHT = 40

interface MunicipalityCoveragePickerProps {
  // Todos os municípios do IBGE; o seletor mostra os de uma UF por vez.
  municipalities: Municipality[]
  // Códigos IBGE escolhidos, de todas as UFs.
  value: string[]
  errorMessage?: string
  // Recebe o foco quando o formulário aponta erro no campo (o `field.ref` do react-hook-form).
  municipalitiesInputRef?: Ref<HTMLSelectElement>
  onChange: (ibgeCodes: string[]) => void
}

// Escolha de muitos municípios: um período de defeso cobre de 2 a 1.500. Escolhe-se a UF e, nela,
// os municípios — o "selecionar todos" do MultiSelect marca a UF inteira de uma vez.
export function MunicipalityCoveragePicker({
  municipalities,
  value,
  errorMessage,
  municipalitiesInputRef,
  onChange,
}: MunicipalityCoveragePickerProps) {
  const ufInputId = useId()
  const municipalitiesInputId = useId()
  const municipalitiesByUf = useMemo(
    () => groupMunicipalitiesByUf(municipalities),
    [municipalities],
  )
  const ufByIbgeCode = useMemo(() => buildUfByIbgeCode(municipalities), [municipalities])
  const ufCounts = countIbgeCodesByUf(value, ufByIbgeCode)
  // Na edição, abre na primeira UF já escolhida.
  const [selectedUf, setSelectedUf] = useState<string | null>(() => ufCounts[0]?.uf ?? null)

  const ufMunicipalities = selectedUf ? (municipalitiesByUf.get(selectedUf) ?? []) : []
  const selectedUfCodes = value.filter((ibgeCode) => ufByIbgeCode.get(ibgeCode) === selectedUf)

  // Troca só a parte de uma UF; as escolhas das outras UFs ficam.
  const replaceUfSelection = (uf: string, ufCodes: string[]) =>
    onChange([...value.filter((ibgeCode) => ufByIbgeCode.get(ibgeCode) !== uf), ...ufCodes])

  const handleMunicipalitiesChange = (event: MultiSelectChangeEvent) => {
    if (selectedUf) replaceUfSelection(selectedUf, event.value as string[])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-5 md:grid-cols-[12rem_minmax(0,1fr)]">
        <FormField id={ufInputId} label="UF">
          {({ id, ...ariaProps }) => (
            <Dropdown
              {...ariaProps}
              inputId={id}
              value={selectedUf}
              options={[...municipalitiesByUf.keys()]}
              onChange={(event) => setSelectedUf(event.value as string)}
              filter
              emptyMessage="Nenhum município cadastrado"
              className="w-full"
            />
          )}
        </FormField>
        <FormField id={municipalitiesInputId} label="Municípios" errorMessage={errorMessage}>
          {({ id, ...ariaProps }) => (
            <MultiSelect
              {...ariaProps}
              inputId={id}
              inputRef={municipalitiesInputRef}
              value={selectedUfCodes}
              options={ufMunicipalities}
              optionLabel="name"
              optionValue="ibge_code"
              onChange={handleMunicipalitiesChange}
              filter
              resetFilterOnHide
              display="comma"
              maxSelectedLabels={3}
              selectedItemsLabel="{0} municípios"
              virtualScrollerOptions={{ itemSize: MUNICIPALITY_ITEM_HEIGHT }}
              disabled={selectedUf === null}
              invalid={Boolean(errorMessage)}
              className="w-full"
            />
          )}
        </FormField>
      </div>
      {ufCounts.length > 0 && (
        <MunicipalityCoverageSummary
          ufCounts={ufCounts}
          selectedUf={selectedUf}
          onUfSelect={setSelectedUf}
          onUfRemove={(uf) => replaceUfSelection(uf, [])}
        />
      )}
    </div>
  )
}
