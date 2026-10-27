import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'

import type { ActiveStatusCounts, ActiveStatusFilter } from '@/types/catalog'

interface CatalogToolbarProps {
  searchTerm: string
  // Nome do campo para leitores de tela; o texto visível é sempre o placeholder "Pesquisar".
  searchLabel: string
  statusFilter: ActiveStatusFilter
  // Sem contagens (lista carregando ou com erro), o filtro mostra só os rótulos e fica bloqueado.
  counts?: ActiveStatusCounts
  onSearchTermChange: (searchTerm: string) => void
  onStatusFilterChange: (statusFilter: ActiveStatusFilter) => void
}

const withCount = (label: string, count?: number) =>
  count === undefined ? label : `${label} (${count})`

const buildStatusOptions = (counts?: ActiveStatusCounts) => [
  { label: withCount('Todos', counts?.all), value: 'all' },
  { label: withCount('Ativos', counts?.active), value: 'active' },
  { label: withCount('Inativos', counts?.inactive), value: 'inactive' },
]

export function CatalogToolbar({
  searchTerm,
  searchLabel,
  statusFilter,
  counts,
  onSearchTermChange,
  onStatusFilterChange,
}: CatalogToolbarProps) {
  const isDisabled = counts === undefined

  const handleStatusChange = (event: SelectButtonChangeEvent) => {
    onStatusFilterChange(event.value as ActiveStatusFilter)
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <IconField iconPosition="left" className="w-full md:max-w-80">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Pesquisar"
          aria-label={searchLabel}
          disabled={isDisabled}
          className="w-full"
        />
      </IconField>
      <SelectButton
        value={statusFilter}
        options={buildStatusOptions(counts)}
        onChange={handleStatusChange}
        allowEmpty={false}
        disabled={isDisabled}
        aria-label="Filtrar por status"
        className="flex tabular-nums max-md:w-full max-md:[&>.p-button]:flex-1 max-md:[&>.p-button]:justify-center max-md:[&>.p-button]:px-2"
      />
    </div>
  )
}
