import { Dropdown } from 'primereact/dropdown'

import { CatalogSearchField } from '@/components/catalog-search-field'

interface MunicipalityToolbarProps {
  searchTerm: string
  // `null`: todas as UFs.
  selectedUf: string | null
  ufOptions: string[]
  // Lista carregando ou com erro: busca e filtro ficam bloqueados.
  isDisabled: boolean
  onSearchTermChange: (searchTerm: string) => void
  onUfChange: (uf: string | null) => void
}

export function MunicipalityToolbar({
  searchTerm,
  selectedUf,
  ufOptions,
  isDisabled,
  onSearchTermChange,
  onUfChange,
}: MunicipalityToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <CatalogSearchField
        searchTerm={searchTerm}
        searchLabel="Buscar município pelo nome ou pelo código IBGE"
        isDisabled={isDisabled}
        onSearchTermChange={onSearchTermChange}
      />
      {/* Limpar o Dropdown manda `undefined`: volta a todas as UFs. O nome acessível vai como
          `aria-label`: o Dropdown só repassa atributos `aria-*` ao input que recebe o foco. */}
      <Dropdown
        value={selectedUf}
        options={ufOptions}
        onChange={(event) => onUfChange((event.value as string | undefined) ?? null)}
        placeholder="Todas as UFs"
        aria-label="Filtrar por UF"
        showClear
        filter
        disabled={isDisabled}
        className="w-full md:w-48"
      />
    </div>
  )
}
