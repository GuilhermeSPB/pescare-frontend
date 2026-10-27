import { FormDialog } from '@/components/form-dialog'
import { useCreateSpecies } from '@/features/species/api/create-species'
import { useUpdateSpecies } from '@/features/species/api/update-species'
import { SpeciesForm, type SpeciesFormSubmission } from '@/features/species/components/species-form'
import type { CreateSpeciesInput, Species } from '@/features/species/types/species'
import { getTargetGroupOptions } from '@/features/species/utils/target-group-lookup'
import type { ToastText } from '@/hooks/use-toast'
import type { NamedCatalogItem } from '@/types/named-catalog'
import { getApiErrorMessage } from '@/utils/api-error'

const SAVE_ERROR_FALLBACK = 'Não foi possível salvar a espécie. Tente novamente.'

// No cadastro, descrição vazia fica de fora para o banco guardar null, não ''.
const toCreateSpeciesInput = ({
  description,
  ...submission
}: SpeciesFormSubmission): CreateSpeciesInput =>
  description ? { ...submission, description } : submission

interface SpeciesFormDialogProps {
  isVisible: boolean
  // Sem espécie: cadastro. Com espécie: edição.
  editingSpecies?: Species
  // Todos os grupos (ativos e inativos): o formulário oferece os ativos e o atual da espécie.
  targetGroups: NamedCatalogItem[]
  onHide: () => void
  onSaved: (toastText: ToastText) => void
}

export function SpeciesFormDialog({
  isVisible,
  editingSpecies,
  targetGroups,
  onHide,
  onSaved,
}: SpeciesFormDialogProps) {
  const createMutation = useCreateSpecies()
  const updateMutation = useUpdateSpecies()
  const activeMutation = editingSpecies ? updateMutation : createMutation

  const handleDialogHide = () => {
    createMutation.reset()
    updateMutation.reset()
    onHide()
  }

  const handleSpeciesSubmit = (submission: SpeciesFormSubmission) => {
    if (editingSpecies) {
      // Na edição a descrição vai sempre, para '' limpar uma descrição antiga.
      updateMutation.mutate(
        { id: editingSpecies.id, data: submission },
        {
          onSuccess: (species) =>
            onSaved([
              'Espécie atualizada',
              `As alterações em “${species.main_name}” foram salvas.`,
            ]),
        },
      )
      return
    }

    createMutation.mutate(toCreateSpeciesInput(submission), {
      onSuccess: (species) =>
        onSaved(['Espécie cadastrada', `“${species.main_name}” já aparece no app dos pescadores.`]),
    })
  }

  return (
    <FormDialog
      isVisible={isVisible}
      title={editingSpecies ? 'Editar espécie' : 'Nova espécie'}
      isSubmitting={activeMutation.isPending}
      onHide={handleDialogHide}
    >
      <SpeciesForm
        editingSpecies={editingSpecies}
        targetGroupOptions={getTargetGroupOptions(targetGroups, editingSpecies?.fk_target_group_id)}
        isSubmitting={activeMutation.isPending}
        formServerError={
          activeMutation.isError
            ? getApiErrorMessage(activeMutation.error, SAVE_ERROR_FALLBACK)
            : undefined
        }
        onSubmit={handleSpeciesSubmit}
        onCancel={handleDialogHide}
      />
    </FormDialog>
  )
}
