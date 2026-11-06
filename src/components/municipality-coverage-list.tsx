import type { Municipality } from '@/types/municipality'
import { groupMunicipalitiesByUf } from '@/utils/municipalities-by-uf'

interface MunicipalityCoverageListProps {
  municipalities: Municipality[]
}

const describeCount = (count: number) => `${count} ${count === 1 ? 'município' : 'municípios'}`

// Cobertura só para leitura: uma linha por UF, que abre para mostrar os nomes. Uma cobertura
// chega a 1.500 municípios; fechada por padrão, a página não vira uma parede de nomes.
export function MunicipalityCoverageList({ municipalities }: MunicipalityCoverageListProps) {
  const municipalitiesByUf = groupMunicipalitiesByUf(municipalities)

  return (
    <ul className="divide-y divide-line rounded-md border border-line">
      {[...municipalitiesByUf].map(([uf, ufMunicipalities]) => (
        <li key={uf}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-ground [&::-webkit-details-marker]:hidden">
              <i
                className="pi pi-chevron-right text-sm text-ink-muted transition-transform group-open:rotate-90"
                aria-hidden="true"
              />
              <span className="font-medium text-ink">{uf}</span>
              <span className="ml-auto text-ink-muted tabular-nums">
                {describeCount(ufMunicipalities.length)}
              </span>
            </summary>
            <p className="px-4 pb-4 pl-11 text-ink-muted">
              {ufMunicipalities.map((municipality) => municipality.name).join(', ')}
            </p>
          </details>
        </li>
      ))}
    </ul>
  )
}
