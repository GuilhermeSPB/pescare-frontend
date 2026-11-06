import { Dropdown } from 'primereact/dropdown'
import { useId, useMemo, useState, type Ref } from 'react'

import { FormField } from '@/components/form-field'
import type { Municipality } from '@/types/municipality'
import {
  buildUfByIbgeCode,
  groupMunicipalitiesByUf,
  listMunicipalityUfs,
} from '@/utils/municipalities-by-uf'

// Altura de cada item na lista virtual (Lara, raiz de 14px), a mesma do seletor de cobertura.
const MUNICIPALITY_ITEM_HEIGHT = 40

interface MunicipalitySelectProps {
  // Todos os municípios do IBGE; o campo de município mostra os da UF escolhida.
  municipalities: Municipality[]
  // Código IBGE escolhido; '' sem escolha.
  value: string
  errorMessage?: string
  // Recebe o foco quando o formulário aponta erro no campo (o `field.ref` do react-hook-form).
  municipalityInputRef?: Ref<HTMLInputElement>
  onChange: (ibgeCode: string) => void
}

// Escolha de um município: a UF e, nela, o município. Para vários, use o MunicipalityCoveragePicker.
export function MunicipalitySelect({
  municipalities,
  value,
  errorMessage,
  municipalityInputRef,
  onChange,
}: MunicipalitySelectProps) {
  const ufInputId = useId()
  const municipalityInputId = useId()
  const ufOptions = useMemo(() => listMunicipalityUfs(municipalities), [municipalities])
  const municipalitiesByUf = useMemo(
    () => groupMunicipalitiesByUf(municipalities),
    [municipalities],
  )
  const ufByIbgeCode = useMemo(() => buildUfByIbgeCode(municipalities), [municipalities])
  // A UF do município escolhido manda; a UF trocada à mão só vale enquanto não há município. Assim
  // o campo acompanha um `reset` do formulário (o "Cancelar" de "Meu perfil") e a lista pode
  // chegar depois do valor.
  const [chosenUf, setChosenUf] = useState<string | null>(null)
  const selectedUf = ufByIbgeCode.get(value) ?? chosenUf

  // Trocar de UF limpa o município, que era da UF anterior.
  const handleUfChange = (uf: string) => {
    setChosenUf(uf)
    onChange('')
  }

  return (
    <div className="grid gap-5 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <FormField id={ufInputId} label="UF">
        {({ id, ...ariaProps }) => (
          <Dropdown
            {...ariaProps}
            inputId={id}
            value={selectedUf}
            options={ufOptions}
            onChange={(event) => handleUfChange(event.value as string)}
            filter
            emptyMessage="Nenhum município cadastrado"
            className="w-full"
          />
        )}
      </FormField>
      <FormField id={municipalityInputId} label="Município" errorMessage={errorMessage}>
        {({ id, ...ariaProps }) => (
          <Dropdown
            {...ariaProps}
            inputId={id}
            focusInputRef={municipalityInputRef}
            value={value || null}
            options={selectedUf ? (municipalitiesByUf.get(selectedUf) ?? []) : []}
            optionLabel="name"
            optionValue="ibge_code"
            onChange={(event) => onChange(event.value as string)}
            filter
            virtualScrollerOptions={{ itemSize: MUNICIPALITY_ITEM_HEIGHT }}
            disabled={!selectedUf}
            invalid={Boolean(errorMessage)}
            emptyMessage="Nenhum município nesta UF"
            className="w-full"
          />
        )}
      </FormField>
    </div>
  )
}
