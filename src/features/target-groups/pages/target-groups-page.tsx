import { NamedCatalogScreen, type NamedCatalogScreenCopy } from '@/components/named-catalog-screen'
import { useCreateTargetGroup } from '@/features/target-groups/api/create-target-group'
import { useTargetGroups } from '@/features/target-groups/api/get-target-groups'
import { useUpdateTargetGroup } from '@/features/target-groups/api/update-target-group'

const TARGET_GROUPS_COPY: NamedCatalogScreenCopy = {
  title: 'Grupos de espécies',
  createLabel: 'Novo grupo',
  listLabel: 'Lista de grupos de espécies',
  searchLabel: 'Buscar grupo pelo nome',
  loadErrorTitle: 'Não foi possível carregar os grupos de espécies.',
  emptyState: {
    noMatchTitle: 'Nenhum grupo encontrado',
    noMatchDescription: 'Nenhum grupo corresponde à busca e ao filtro escolhidos.',
    emptyTitle: 'Nenhum grupo cadastrado',
    emptyDescription: 'Cadastre grupos para classificar as espécies.',
    createLabel: 'Cadastrar grupo',
  },
  form: {
    createTitle: 'Novo grupo de espécies',
    editTitle: 'Editar grupo de espécies',
    fieldLabel: 'Nome do grupo',
    requiredMessage: 'Informe o nome do grupo de espécies.',
    createSubmitLabel: 'Cadastrar grupo',
    duplicateNameMessage: 'Já existe um grupo de espécies com esse nome.',
    saveErrorFallback: 'Não foi possível salvar o grupo de espécies. Tente novamente.',
    createdToast: (name) => ['Grupo cadastrado', `“${name}” já aparece no app dos pescadores.`],
    renamedSummary: 'Grupo atualizado',
  },
  deactivation: {
    message:
      'O grupo deixa de aparecer como opção no app dos pescadores. As espécies já classificadas continuam nele, e você pode reativá-lo quando quiser.',
    acceptLabel: 'Desativar grupo',
  },
  activatedToast: (name) => ['Grupo ativado', `“${name}” voltou a aparecer no app dos pescadores.`],
  deactivatedToast: (name) => [
    'Grupo desativado',
    `“${name}” não aparece mais no app dos pescadores.`,
  ],
}

export function TargetGroupsPage() {
  const targetGroupsQuery = useTargetGroups()
  const createMutation = useCreateTargetGroup()
  const renameMutation = useUpdateTargetGroup()
  const activeToggleMutation = useUpdateTargetGroup()

  return (
    <>
      <title>Grupos de espécies · Pescare Admin</title>
      <NamedCatalogScreen
        copy={TARGET_GROUPS_COPY}
        itemsQuery={targetGroupsQuery}
        createMutation={createMutation}
        renameMutation={renameMutation}
        activeToggleMutation={activeToggleMutation}
      />
    </>
  )
}
