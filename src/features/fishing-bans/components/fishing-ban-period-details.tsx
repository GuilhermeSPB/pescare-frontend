import { FormSection } from '@/components/form-section'
import { MunicipalityCoverageList } from '@/components/municipality-coverage-list'
import { ReadOnlyField } from '@/components/read-only-field'
import type { FishingBanPeriod } from '@/features/fishing-bans/types/fishing-ban-period'
import { getFishingBanTypeLabel } from '@/features/fishing-bans/utils/fishing-ban-type'
import { formatPeriodWindows } from '@/features/fishing-bans/utils/period-window'
import { formatIsoDate } from '@/utils/iso-date'

const describeSpecies = (period: FishingBanPeriod) =>
  period.applies_to_all_species
    ? 'Todas as espécies'
    : period.species
        .map((species) => `${species.main_name} (${species.scientific_name})`)
        .join(', ')

const describeLocationTypes = (period: FishingBanPeriod) =>
  period.applies_to_all_location_types
    ? 'Todos os corpos d’água'
    : period.location_types.map((locationType) => locationType.name).join(', ')

// Uma versão do período só para leitura, nos mesmos cartões do formulário.
export function FishingBanPeriodDetails({ period }: { period: FishingBanPeriod }) {
  return (
    <div className="flex flex-col gap-6">
      <FormSection title="Norma">
        <dl className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_14rem]">
          <ReadOnlyField label="Nome do defeso" value={period.fishing_ban.name} />
          <ReadOnlyField label="Portaria" value={period.fishing_ban.rule} />
          <ReadOnlyField
            label="Ambiente"
            value={getFishingBanTypeLabel(period.fishing_ban.fishing_ban_type)}
          />
        </dl>
      </FormSection>
      <FormSection title="Período">
        <dl className="grid gap-5 md:grid-cols-3">
          <ReadOnlyField
            label={period.windows.length > 1 ? 'Janelas do defeso' : 'Janela do defeso'}
            value={formatPeriodWindows(period.windows)}
          />
          <ReadOnlyField label="Vigente a partir de" value={formatIsoDate(period.start_in)} />
          <ReadOnlyField
            label="Vigente até"
            value={period.valid_until ? formatIsoDate(period.valid_until) : 'Sem data para acabar'}
          />
        </dl>
      </FormSection>
      <FormSection title="Abrangência">
        <dl className="grid gap-5">
          <ReadOnlyField label="Espécies" value={describeSpecies(period)} />
          <ReadOnlyField label="Corpos d’água" value={describeLocationTypes(period)} />
          {period.observation && <ReadOnlyField label="Observação" value={period.observation} />}
        </dl>
      </FormSection>
      <FormSection title="Municípios">
        <MunicipalityCoverageList municipalities={period.municipalities} />
      </FormSection>
    </div>
  )
}
