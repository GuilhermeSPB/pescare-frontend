import { NamedCatalogScreen, type NamedCatalogScreenCopy } from '@/components/named-catalog-screen'
import { useCreateBuyerType } from '@/features/buyer-types/api/create-buyer-type'
import { useBuyerTypes } from '@/features/buyer-types/api/get-buyer-types'
import { useUpdateBuyerType } from '@/features/buyer-types/api/update-buyer-type'

const BUYER_TYPES_COPY: NamedCatalogScreenCopy = {
  title: 'Categorias de comprador',
  createLabel: 'Nova categoria',
  listLabel: 'Lista de categorias de comprador',
  searchLabel: 'Buscar categoria pelo nome',
  loadErrorTitle: 'Não foi possível carregar as categorias de comprador.',
  emptyState: {
    noMatchTitle: 'Nenhuma categoria encontrada',
    noMatchDescription: 'Nenhuma categoria corresponde à busca e ao filtro escolhidos.',
    emptyTitle: 'Nenhuma categoria cadastrada',
    emptyDescription:
      'Cadastre as categorias de comprador para o pescador escolher ao registrar uma venda.',
    createLabel: 'Cadastrar categoria',
  },
  form: {
    createTitle: 'Nova categoria de comprador',
    editTitle: 'Editar categoria de comprador',
    fieldLabel: 'Nome da categoria',
    requiredMessage: 'Informe o nome da categoria de comprador.',
    createSubmitLabel: 'Cadastrar categoria',
    duplicateNameMessage: 'Já existe uma categoria de comprador com esse nome.',
    saveErrorFallback: 'Não foi possível salvar a categoria de comprador. Tente novamente.',
    createdToast: (name) => ['Categoria cadastrada', `“${name}” já aparece no app dos pescadores.`],
    renamedSummary: 'Categoria atualizada',
  },
  deactivation: {
    message:
      'A categoria deixa de aparecer como opção no app dos pescadores. As vendas já registradas continuam com ela, e você pode reativá-la quando quiser.',
    acceptLabel: 'Desativar categoria',
  },
  activatedToast: (name) => [
    'Categoria ativada',
    `“${name}” voltou a aparecer no app dos pescadores.`,
  ],
  deactivatedToast: (name) => [
    'Categoria desativada',
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
      <title>Categorias de comprador · Pescare Admin</title>
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
