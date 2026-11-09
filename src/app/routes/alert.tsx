import { useParams } from 'react-router'

import { AlertPage } from '@/features/alerts/pages/alert-page'
import type { AlertFormMode } from '@/features/alerts/utils/alert-form-values'
import { useMunicipalities } from '@/features/municipalities/api/get-municipalities'

interface AlertRouteProps {
  mode: AlertFormMode
}

export function AlertRoute({ mode }: AlertRouteProps) {
  // O comunicado escolhe municípios; uma feature não importa a outra, então a rota compõe.
  const { alertId } = useParams()
  const municipalitiesQuery = useMunicipalities()

  return (
    // `key`: trocar de comunicado recomeça o formulário do zero.
    <AlertPage
      key={`${mode}-${alertId ?? 'novo'}`}
      mode={mode}
      alertId={alertId === undefined ? undefined : Number(alertId)}
      municipalitiesQuery={municipalitiesQuery}
    />
  )
}
