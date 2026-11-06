import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

interface CatalogSearchFieldProps {
  searchTerm: string
  // Nome do campo para leitores de tela; o texto visível é sempre o placeholder "Pesquisar".
  searchLabel: string
  isDisabled: boolean
  onSearchTermChange: (searchTerm: string) => void
}

// Busca do topo das listas de catálogo.
export function CatalogSearchField({
  searchTerm,
  searchLabel,
  isDisabled,
  onSearchTermChange,
}: CatalogSearchFieldProps) {
  return (
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
  )
}
