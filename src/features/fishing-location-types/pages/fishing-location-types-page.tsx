import { NamedCatalogScreen, type NamedCatalogScreenCopy } from '@/components/named-catalog-screen'
import { useCreateFishingLocationType } from '@/features/fishing-location-types/api/create-fishing-location-type'
import { useFishingLocationTypes } from '@/features/fishing-location-types/api/get-fishing-location-types'
import { useUpdateFishingLocationType } from '@/features/fishing-location-types/api/update-fishing-location-type'

const FISHING_LOCATION_TYPES_COPY: NamedCatalogScreenCopy = {
  title: 'Tipos de local',
  createLabel: 'Novo tipo',
  listLabel: 'Lista de tipos de local',
  searchLabel: 'Buscar tipo pelo nome',
  loadErrorTitle: 'Não foi possível carregar os tipos de local.',
  emptyState: {
    noMatchTitle: 'Nenhum tipo encontrado',
    noMatchDescription: 'Nenhum tipo corresponde à busca e ao filtro escolhidos.',
    emptyTitle: 'Nenhum tipo cadastrado',
    emptyDescription:
      'Cadastre os tipos de local para o pescador escolher ao registrar uma pescaria.',
    createLabel: 'Cadastrar tipo',
  },
  form: {
    createTitle: 'Novo tipo de local',
    editTitle: 'Editar tipo de local',
    fieldLabel: 'Nome do tipo',
    requiredMessage: 'Informe o nome do tipo de local.',
    createSubmitLabel: 'Cadastrar tipo',
    duplicateNameMessage: 'Já existe um tipo de local com esse nome.',
    saveErrorFallback: 'Não foi possível salvar o tipo de local. Tente novamente.',
    createdToast: (name) => ['Tipo cadastrado', `“${name}” já aparece no app dos pescadores.`],
    renamedSummary: 'Tipo atualizado',
  },
  deactivation: {
    message:
      'O tipo deixa de aparecer como opção no app dos pescadores. As pescarias já registradas continuam com ele, e você pode reativá-lo quando quiser.',
    acceptLabel: 'Desativar tipo',
  },
  activatedToast: (name) => ['Tipo ativado', `“${name}” voltou a aparecer no app dos pescadores.`],
  deactivatedToast: (name) => [
    'Tipo desativado',
    `“${name}” não aparece mais no app dos pescadores.`,
  ],
}

export function FishingLocationTypesPage() {
  const fishingLocationTypesQuery = useFishingLocationTypes()
  const createMutation = useCreateFishingLocationType()
  const renameMutation = useUpdateFishingLocationType()
  const activeToggleMutation = useUpdateFishingLocationType()

  return (
    <>
      <title>Tipos de local · Pescare Admin</title>
      <NamedCatalogScreen
        copy={FISHING_LOCATION_TYPES_COPY}
        itemsQuery={fishingLocationTypesQuery}
        createMutation={createMutation}
        renameMutation={renameMutation}
        activeToggleMutation={activeToggleMutation}
      />
    </>
  )
}
