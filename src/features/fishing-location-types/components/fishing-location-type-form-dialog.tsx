import { FormDialog } from '@/components/form-dialog'
import { useCreateFishingLocationType } from '@/features/fishing-location-types/api/create-fishing-location-type'
import { useUpdateFishingLocationType } from '@/features/fishing-location-types/api/update-fishing-location-type'
import { FishingLocationTypeForm } from '@/features/fishing-location-types/components/fishing-location-type-form'
import type {
  CreateFishingLocationTypeInput,
  FishingLocationType,
} from '@/features/fishing-location-types/types/fishing-location-type'
import type { ToastText } from '@/hooks/use-toast'
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/api-error'

const SAVE_ERROR_FALLBACK = 'Não foi possível salvar o tipo de local. Tente novamente.'
const DUPLICATE_NAME_MESSAGE = 'Já existe um tipo de local com esse nome.'

interface FishingLocationTypeFormDialogProps {
  isVisible: boolean
  // Sem tipo: cadastro. Com tipo: edição do nome e do ambiente.
  editingItem?: FishingLocationType
  onHide: () => void
  onSaved: (toastText: ToastText) => void
}

export function FishingLocationTypeFormDialog({
  isVisible,
  editingItem,
  onHide,
  onSaved,
}: FishingLocationTypeFormDialogProps) {
  const createMutation = useCreateFishingLocationType()
  const updateMutation = useUpdateFishingLocationType()
  const activeMutation = editingItem ? updateMutation : createMutation
  const isNameConflict = getApiErrorStatus(activeMutation.error) === 409

  const handleDialogHide = () => {
    createMutation.reset()
    updateMutation.reset()
    onHide()
  }

  const handleFormSubmit = (input: CreateFishingLocationTypeInput) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: input },
        {
          onSuccess: (item) =>
            onSaved(['Tipo atualizado', `As alterações em “${item.name}” foram salvas.`]),
        },
      )
      return
    }

    createMutation.mutate(input, {
      onSuccess: (item) =>
        onSaved(['Tipo cadastrado', `“${item.name}” já aparece no app dos pescadores.`]),
    })
  }

  return (
    <FormDialog
      isVisible={isVisible}
      title={editingItem ? 'Editar tipo de local' : 'Novo tipo de local'}
      isSubmitting={activeMutation.isPending}
      onHide={handleDialogHide}
    >
      <FishingLocationTypeForm
        editingItem={editingItem}
        isSubmitting={activeMutation.isPending}
        nameServerError={isNameConflict ? DUPLICATE_NAME_MESSAGE : undefined}
        formServerError={
          activeMutation.isError && !isNameConflict
            ? getApiErrorMessage(activeMutation.error, SAVE_ERROR_FALLBACK)
            : undefined
        }
        onSubmit={handleFormSubmit}
        onCancel={handleDialogHide}
      />
    </FormDialog>
  )
}
