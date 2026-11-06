import { useParams } from 'react-router'

import { FishingBanPeriodPage } from '@/features/fishing-bans/pages/fishing-ban-period-page'
import type { FishingBanPeriodFormMode } from '@/features/fishing-bans/utils/fishing-ban-period-form-values'
import { useFishingLocationTypes } from '@/features/fishing-location-types/api/get-fishing-location-types'
import { useMunicipalities } from '@/features/municipalities/api/get-municipalities'
import { useSpecies } from '@/features/species/api/get-species'

interface FishingBanPeriodRouteProps {
  mode: FishingBanPeriodFormMode
}

export function FishingBanPeriodRoute({ mode }: FishingBanPeriodRouteProps) {
  // O período escolhe espécies, tipos de local e municípios; uma feature não importa a outra,
  // então a rota compõe. Serve ao cadastro (sem `periodId`), à correção e à nova versão.
  const { periodId } = useParams()
  const speciesQuery = useSpecies()
  const locationTypesQuery = useFishingLocationTypes()
  const municipalitiesQuery = useMunicipalities()

  return (
    // `key`: trocar de modo ou de período recomeça o formulário do zero.
    <FishingBanPeriodPage
      key={`${mode}-${periodId ?? 'novo'}`}
      mode={mode}
      periodId={periodId === undefined ? undefined : Number(periodId)}
      speciesQuery={speciesQuery}
      locationTypesQuery={locationTypesQuery}
      municipalitiesQuery={municipalitiesQuery}
    />
  )
}
