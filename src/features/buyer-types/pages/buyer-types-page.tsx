import { NamedCatalogScreen, type NamedCatalogScreenCopy } from '@/components/named-catalog-screen'
import { useCreateBuyerType } from '@/features/buyer-types/api/create-buyer-type'
import { useBuyerTypes } from '@/features/buyer-types/api/get-buyer-types'
import { useUpdateBuyerType } from '@/features/buyer-types/api/update-buyer-type'

const BUYER_TYPES_COPY: NamedCatalogScreenCopy = {
  title: 'Tipos de comprador',
  createLabel: 'Novo tipo',
  listLabel: 'Lista de tipos de comprador',
  searchLabel: 'Buscar tipo pelo nome',
  loadErrorTitle: 'Não foi possível carregar os tipos de comprador.',
  emptyState: {
    noMatchTitle: 'Nenhum tipo encontrado',
    noMatchDescription: 'Nenhum tipo corresponde à busca e ao filtro escolhidos.',
    emptyTitle: 'Nenhum tipo cadastrado',
    emptyDescription:
      'Cadastre os tipos de comprador para o pescador escolher ao registrar uma venda.',
    createLabel: 'Cadastrar tipo',
  },
  form: {
    createTitle: 'Novo tipo de comprador',
    editTitle: 'Editar tipo de comprador',
    fieldLabel: 'Nome do tipo',
    requiredMessage: 'Informe o nome do tipo de comprador.',
    createSubmitLabel: 'Cadastrar tipo',
    duplicateNameMessage: 'Já existe um tipo de comprador com esse nome.',
    saveErrorFallback: 'Não foi possível salvar o tipo de comprador. Tente novamente.',
    createdToast: (name) => ['Tipo cadastrado', `“${name}” já aparece no app dos pescadores.`],
    renamedSummary: 'Tipo atualizado',
  },
  deactivation: {
    message:
      'O tipo deixa de aparecer como opção no app dos pescadores. As vendas já registradas continuam com ele, e você pode reativá-lo quando quiser.',
    acceptLabel: 'Desativar tipo',
  },
  activatedToast: (name) => ['Tipo ativado', `“${name}” voltou a aparecer no app dos pescadores.`],
  deactivatedToast: (name) => [
    'Tipo desativado',
    `“${name}” não aparece mais no app dos pescadores.`,
  ],
}

export function BuyerTypesPage() {
  const buyerTypesQuery = useBuyerTypes()
  const createMutation = useCreateBuyerType()
  const renameMutation = useUpdateBuyerType()
  const activeToggleMutation = useUpdateBuyerType()

  return (
    <>
      <title>Tipos de comprador · Pescare Admin</title>
      <NamedCatalogScreen
        copy={BUYER_TYPES_COPY}
        itemsQuery={buyerTypesQuery}
        createMutation={createMutation}
        renameMutation={renameMutation}
        activeToggleMutation={activeToggleMutation}
      />
    </>
  )
}
