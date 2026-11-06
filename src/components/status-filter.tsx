import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'

export interface StatusFilterOption<Status extends string> {
  value: Status
  label: string
  // Sem contagem (lista carregando ou com erro), aparece só o rótulo.
  count?: number
}

interface StatusFilterProps<Status extends string> {
  value: Status
  options: StatusFilterOption<Status>[]
  isDisabled: boolean
  onChange: (value: Status) => void
}

const withCount = (label: string, count?: number) =>
  count === undefined ? label : `${label} (${count})`

// No celular, até três segmentos dividem a largura toda. Com mais (os cinco dos defesos), cada um
// ficaria com ~62px e rótulos como "Encerrados" seriam cortados: a fila rola de lado.
const MOBILE_FULL_WIDTH_CLASS =
  'max-md:w-full max-md:[&>.p-button]:flex-1 max-md:[&>.p-button]:justify-center max-md:[&>.p-button]:px-2'
const MOBILE_SCROLL_CLASS =
  'max-md:max-w-full max-md:overflow-x-auto max-md:[&>.p-button]:shrink-0 max-md:[&>.p-button]:whitespace-nowrap'
const MAX_FULL_WIDTH_SEGMENTS = 3

// Filtro segmentado por situação, com quantos itens há em cada uma: "Ativos (10)".
export function StatusFilter<Status extends string>({
  value,
  options,
  isDisabled,
  onChange,
}: StatusFilterProps<Status>) {
  const handleStatusChange = (event: SelectButtonChangeEvent) => {
    onChange(event.value as Status)
  }

  return (
    <SelectButton
      value={value}
      options={options.map((option) => ({
        value: option.value,
        label: withCount(option.label, option.count),
      }))}
      onChange={handleStatusChange}
      allowEmpty={false}
      disabled={isDisabled}
      aria-label="Filtrar por status"
      className={`flex tabular-nums ${
        options.length > MAX_FULL_WIDTH_SEGMENTS ? MOBILE_SCROLL_CLASS : MOBILE_FULL_WIDTH_CLASS
      }`}
    />
  )
}
