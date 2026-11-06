import type { UfMunicipalityCount } from '@/utils/municipalities-by-uf'

interface MunicipalityCoverageSummaryProps {
  ufCounts: UfMunicipalityCount[]
  // UF aberta no seletor; a pílula dela fica marcada.
  selectedUf: string | null
  onUfSelect: (uf: string) => void
  onUfRemove: (uf: string) => void
}

const PILL_BASE_CLASS = 'inline-flex items-center rounded-full border text-sm'
const SELECTED_PILL_CLASS = 'border-primary bg-primary-soft text-primary-ink'
const IDLE_PILL_CLASS = 'border-line bg-white text-ink'

// Uma pílula por UF com municípios escolhidos: clicar abre a UF no seletor, o X tira a UF
// inteira. Um período chega a cobrir 18 UFs, então a seleção precisa ser visível de relance.
export function MunicipalityCoverageSummary({
  ufCounts,
  selectedUf,
  onUfSelect,
  onUfRemove,
}: MunicipalityCoverageSummaryProps) {
  return (
    <ul aria-label="Municípios escolhidos por UF" className="flex flex-wrap gap-2">
      {ufCounts.map(({ uf, count }) => {
        const isSelected = uf === selectedUf

        return (
          <li
            key={uf}
            className={`${PILL_BASE_CLASS} ${isSelected ? SELECTED_PILL_CLASS : IDLE_PILL_CLASS}`}
          >
            <button
              type="button"
              aria-current={isSelected ? 'true' : undefined}
              onClick={() => onUfSelect(uf)}
              className="rounded-l-full py-1 pr-1.5 pl-3 font-medium tabular-nums"
            >
              {uf} · {count}
              <span className="sr-only"> municípios</span>
            </button>
            <button
              type="button"
              aria-label={`Remover os municípios de ${uf}`}
              onClick={() => onUfRemove(uf)}
              className="mr-1 flex size-6 items-center justify-center rounded-full text-ink-soft hover:bg-gray-100 hover:text-ink"
            >
              <i className="pi pi-times text-xs" aria-hidden="true" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
