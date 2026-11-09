import { NamedCatalogScreen, type NamedCatalogScreenCopy } from '@/components/named-catalog-screen'
import { useCreateFishingMethod } from '@/features/fishing-methods/api/create-fishing-method'
import { useFishingMethods } from '@/features/fishing-methods/api/get-fishing-methods'
import { useUpdateFishingMethod } from '@/features/fishing-methods/api/update-fishing-method'

const FISHING_METHODS_COPY: NamedCatalogScreenCopy = {
  title: 'Métodos de pesca',
  createLabel: 'Novo método',
  listLabel: 'Lista de métodos de pesca',
  searchLabel: 'Buscar método pelo nome',
  loadErrorTitle: 'Não foi possível carregar os métodos de pesca.',
  emptyState: {
    noMatchTitle: 'Nenhum método encontrado',
    noMatchDescription: 'Nenhum método corresponde à busca e ao filtro escolhidos.',
    emptyTitle: 'Nenhum método cadastrado',
    emptyDescription:
      'Cadastre os métodos de pesca para o pescador escolher ao registrar uma pesca.',
    createLabel: 'Cadastrar método',
  },
  form: {
    createTitle: 'Novo método de pesca',
    editTitle: 'Editar método de pesca',
    fieldLabel: 'Nome do método',
    requiredMessage: 'Informe o nome do método de pesca.',
    createSubmitLabel: 'Cadastrar método',
    duplicateNameMessage: 'Já existe um método de pesca com esse nome.',
    saveErrorFallback: 'Não foi possível salvar o método de pesca. Tente novamente.',
    createdToast: (name) => ['Método cadastrado', `“${name}” já aparece no app dos pescadores.`],
    renamedSummary: 'Método atualizado',
  },
  deactivation: {
    message:
      'O método deixa de aparecer como opção no app dos pescadores. As pescas já registradas continuam com ele, e você pode reativá-lo quando quiser.',
    acceptLabel: 'Desativar método',
  },
  activatedToast: (name) => [
    'Método ativado',
    `“${name}” voltou a aparecer no app dos pescadores.`,
  ],
  deactivatedToast: (name) => [
    'Método desativado',
    `“${name}” não aparece mais no app dos pescadores.`,
  ],
}

export function FishingMethodsPage() {
  const fishingMethodsQuery = useFishingMethods()
  const createMutation = useCreateFishingMethod()
  const renameMutation = useUpdateFishingMethod()
  const activeToggleMutation = useUpdateFishingMethod()

  return (
    <>
      <title>Métodos de pesca · Pescare Admin</title>
      <NamedCatalogScreen
        copy={FISHING_METHODS_COPY}
        itemsQuery={fishingMethodsQuery}
        createMutation={createMutation}
        renameMutation={renameMutation}
        activeToggleMutation={activeToggleMutation}
      />
    </>
  )
}
